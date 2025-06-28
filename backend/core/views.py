# core/views.py
from rest_framework import generics, status, viewsets, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import authenticate
from django.db import IntegrityError, DatabaseError
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    CustomUser, PlotListing, JointOwner, Booking,
    EcommerceProduct, Order, OrderItem, RealEstateAgentProfile, UserType, PlotInquiry, ReferralCommission,
    SQLFTProject, BankDetail, CustomUser
)
from .serializers import (
    UserRegistrationSerializer, OTPRequestSerializer, OTPVerificationSerializer,
    CustomUserSerializer, PlotListingSerializer, JointOwnerSerializer,
    BookingSerializer, EcommerceProductSerializer, OrderSerializer,
    OrderItemSerializer, RealEstateAgentProfileSerializer, RealEstateAgentRegistrationSerializer, PlotInquirySerializer,
    ReferralCommissionSerializer, SQLFTProjectSerializer, BankDetailSerializer
)

# --- Authentication and User Management ---
class UserRegistrationView(APIView):
    authentication_classes = []  # <--- Add this line
    permission_classes = [AllowAny]
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        referral_code = request.data.get('referral_code')
        referred_by = None
        if referral_code:
            referred_by = CustomUser.objects.filter(referral_code=referral_code).first()
        try:
            user = serializer.save(
                user_type=validated_data.get('user_type', UserType.CLIENT),
                referred_by=referred_by
            )
            user.generate_otp()
            headers = self.get_success_headers(serializer.data)
            return Response(
                {"message": "User registered successfully. OTP sent for verification.", "user_id": user.id, "referral_code": user.referral_code},
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except IntegrityError:
            return Response(
                {"detail": "A user with this email or mobile number already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"detail": f"Internal server error: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OTPRequestView(APIView):
    authentication_classes = []  # <--- Add this line
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = OTPRequestSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            email = data.get('email')
            mobile_number = data.get('mobile_number')
            user = None
            if email:
                user = get_object_or_404(CustomUser, email=email)
            elif mobile_number:
                user = get_object_or_404(CustomUser, mobile_number=mobile_number)
            else:
                return Response({"detail": "Provide email or mobile number."}, status=status.HTTP_400_BAD_REQUEST)
            # Generate OTP
            otp = user.generate_otp()
            # Send OTP via email if email is provided
            if email:
                try:
                    send_mail(
                        subject="Your OTP Code",
                        message=f"Your OTP code is: {otp}",
                        from_email=settings.EMAIL_HOST_USER,  # Uses DEFAULT_FROM_EMAIL from settings
                        recipient_list=[email],
                        fail_silently=False,
                    )
                except Exception as e:
                    return Response({"detail": f"Failed to send OTP email: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            print(f"DEBUG: OTP for {user.username}: {otp}") # For development purposes
            return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"Internal server error: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OTPVerificationAndLoginView(APIView):
    authentication_classes = []  # <--- Add this line
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = OTPVerificationSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            email = data.get('email')
            mobile_number = data.get('mobile_number')
            otp_code = data.get('otp_code')
            user = None
            if email:
                user = get_object_or_404(CustomUser, email=email)
            elif mobile_number:
                user = get_object_or_404(CustomUser, mobile_number=mobile_number)
            else:
                return Response({"detail": "Provide email or mobile number."}, status=status.HTTP_400_BAD_REQUEST)

            if user.verify_otp(otp_code):
                user.is_active = True  # activate the user on successful verification
                user.save()
                refresh = RefreshToken.for_user(user)
                return Response({"data":{
                    "message": "OTP verified successfully. Login successful.",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user_id": user.id,
                    "username": user.username,
                    "user_type": user.user_type
                }}, status=status.HTTP_200_OK)
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"Internal server error: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserLoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get('username')  # Could be email or mobile_number too
            password = request.data.get('password')
            user = authenticate(username=username, password=password)

            if user:
                if not user.is_active:
                    return Response(
                        {"detail": "Account not active. Please verify OTP."},
                        status=status.HTTP_403_FORBIDDEN
                    )

                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    "message": "Login successful.",
                    "token": token.key,
                    "user_id": user.id,
                    "username": user.username,
                    "user_type": user.user_type
                }, status=status.HTTP_200_OK)

            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return Response(
                {"detail": f"Internal server error: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserLogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            request.user.auth_token.delete()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"Logout failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- Core Model ViewSets ---
class PlotListingViewSet(viewsets.ModelViewSet):
    queryset = PlotListing.objects.all()
    serializer_class = PlotListingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            serializer.save(owner=self.request.user)
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

    def perform_update(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

class JointOwnerViewSet(viewsets.ModelViewSet):
    queryset = JointOwner.objects.all()
    serializer_class = JointOwnerSerializer
    permission_classes = [IsAuthenticated] # Requires authentication

    def get_queryset(self):
        try:
            # Admin can see all joint owners.
            if self.request.user.user_type == UserType.ADMIN:
                return JointOwner.objects.all()
            # Clients can see joint owners for plots they own.
            return JointOwner.objects.filter(plot_listing__owner=self.request.user) | \
                   JointOwner.objects.filter(owner=self.request.user)
        except Exception as e:
            return JointOwner.objects.none()

    def perform_create(self, serializer):
        try:
            plot_listing = serializer.validated_data['plot_listing']
            # Only the primary owner of the plot or an Admin can add joint owners
            if self.request.user.user_type == UserType.ADMIN or plot_listing.owner == self.request.user:
                serializer.save()
            else:
                raise PermissionDenied("You do not have permission to add joint owners to this plot.")
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            if self.request.user.user_type == UserType.ADMIN:
                return Booking.objects.all()
            return Booking.objects.filter(client=self.request.user)
        except Exception as e:
            return Booking.objects.none()

    def perform_create(self, serializer):
        try:
            plot = serializer.validated_data['plot_listing']
            booking_type = serializer.validated_data['booking_type']
            booked_area_sqft = serializer.validated_data.get('booked_area_sqft', 0)
            if booking_type == 'full_plot':
                if not plot.is_available_full:
                    raise serializers.ValidationError("This plot is not available for full booking.")
                total_price = plot.total_area_sqft * plot.price_per_sqft
                plot.is_available_full = False
                plot.available_sqft_for_investment = 0 # No more sqft for investment if full plot is booked
            elif booking_type == 'square_feet':
                if booked_area_sqft <= 0 or booked_area_sqft > plot.available_sqft_for_investment:
                    raise serializers.ValidationError("Invalid square feet amount or not enough available.")
                total_price = booked_area_sqft * plot.price_per_sqft
                plot.available_sqft_for_investment -= booked_area_sqft
                if plot.available_sqft_for_investment <= 0:
                    plot.is_available_full = False # Mark as not fully available if all sqft are booked
            else:
                raise serializers.ValidationError("Invalid booking type.")
            serializer.save(client=self.request.user, total_price=total_price)
            plot.save() # Update plot availability
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

class EcommerceProductViewSet(viewsets.ModelViewSet):
    queryset = EcommerceProduct.objects.all()
    serializer_class = EcommerceProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            if self.request.user.user_type == UserType.ADMIN:
                return EcommerceProduct.objects.all()
            elif self.request.user.user_type == UserType.B2B_VENDOR:
                return EcommerceProduct.objects.filter(vendor=self.request.user)
            # Clients can view all active products
            return EcommerceProduct.objects.filter(is_active=True)
        except Exception as e:
            return EcommerceProduct.objects.none()

    def perform_create(self, serializer):
        try:
            if self.request.user.user_type == UserType.B2B_VENDOR:
                serializer.save(vendor=self.request.user)
            else:
                raise PermissionDenied("Only B2B Vendors can add products.")
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

    def perform_update(self, serializer):
        try:
            if self.request.user.user_type == UserType.ADMIN or \
               (serializer.instance.vendor == self.request.user and self.request.user.user_type == UserType.B2B_VENDOR):
                serializer.save()
            else:
                raise PermissionDenied("You do not have permission to edit this product.")
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

    def perform_destroy(self, instance):
        try:
            if self.request.user.user_type == UserType.ADMIN or \
               (instance.vendor == self.request.user and self.request.user.user_type == UserType.B2B_VENDOR):
                instance.delete()
            else:
                raise PermissionDenied("You do not have permission to delete this product.")
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            if self.request.user.user_type == UserType.ADMIN:
                return Order.objects.all()
            elif self.request.user.user_type == UserType.B2B_VENDOR:
                # Vendors see orders for their products
                return Order.objects.filter(items__product__vendor=self.request.user).distinct()
            return Order.objects.filter(client=self.request.user)
        except Exception as e:
            return Order.objects.none()

    def perform_create(self, serializer):
        try:
            # Logic to create order items and calculate total amount should be handled here
            # For simplicity, this create method assumes order items are added separately or in a custom way.
            serializer.save(client=self.request.user)
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            if self.request.user.user_type == UserType.ADMIN:
                return OrderItem.objects.all()
            elif self.request.user.user_type == UserType.B2B_VENDOR:
                return OrderItem.objects.filter(product__vendor=self.request.user)
            return OrderItem.objects.filter(order__client=self.request.user)
        except Exception as e:
            return OrderItem.objects.none()

class RealEstateAgentProfileViewSet(viewsets.ModelViewSet):
    queryset = RealEstateAgentProfile.objects.all()
    serializer_class = RealEstateAgentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            user = self.request.user
            if user.user_type == UserType.ADMIN:
                return RealEstateAgentProfile.objects.all()
            elif user.user_type == UserType.REAL_ESTATE_AGENT:
                return RealEstateAgentProfile.objects.filter(user=user)
            return RealEstateAgentProfile.objects.none()
        except Exception as e:
            return RealEstateAgentProfile.objects.none()

    def perform_create(self, serializer):
        try:
            user = self.request.user
            if user.user_type == UserType.REAL_ESTATE_AGENT:
                if RealEstateAgentProfile.objects.filter(user=user).exists():
                    raise serializers.ValidationError("Agent profile already exists for this user.")
                serializer.save(user=user)
            else:
                raise PermissionDenied("Only Real Estate Agents can create their profile.")
        except serializers.ValidationError:
            raise
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

    def perform_update(self, serializer):
        try:
            user = self.request.user
            instance = serializer.instance
            if user.user_type == UserType.ADMIN or (instance.user == user and user.user_type == UserType.REAL_ESTATE_AGENT):
                serializer.save()
            else:
                raise PermissionDenied("You do not have permission to edit this agent profile.")
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

class RealEstateAgentRegistrationView(generics.CreateAPIView):
    serializer_class = RealEstateAgentRegistrationSerializer
    permission_classes = (AllowAny,)

    def perform_create(self, serializer):
        try:
            username = self.request.data.get('username') or self.request.data.get('email') or self.request.data.get('mobile_number')
            email = self.request.data.get('email')
            mobile_number = self.request.data.get('mobile_number')
            password = self.request.data.get('password')

            if not username:
                raise serializers.ValidationError({"username": "Username, email, or mobile number is required."})

            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                mobile_number=mobile_number,
                user_type=UserType.REAL_ESTATE_AGENT,
                password=password,
            )
            serializer.save(user=user)
        except IntegrityError:
            raise serializers.ValidationError({"detail": "A user with this email or mobile number already exists."})
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

class PlotInquiryViewSet(viewsets.ModelViewSet):
    queryset = PlotInquiry.objects.all()
    serializer_class = PlotInquirySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            return PlotInquiry.objects.all()
        except Exception as e:
            return PlotInquiry.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"data": serializer.data})

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            return Response({'detail': 'Database integrity error: {}'.format(str(e))},
                            status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError as e:
            return Response({'detail': 'Database error: {}'.format(str(e))},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'detail': 'Unexpected error: {}'.format(str(e))},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError as e:
            return Response({'detail': 'Database integrity error: {}'.format(str(e))},
                            status=status.HTTP_400_BAD_REQUEST)
        except DatabaseError as e:
            return Response({'detail': 'Database error: {}'.format(str(e))},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'detail': 'Unexpected error: {}'.format(str(e))},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReferralNetworkView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        commissions = ReferralCommission.objects.filter(user=user)
        serializer = ReferralCommissionSerializer(commissions, many=True)
        return Response({
            "referral_code": user.referral_code,
            "network": serializer.data
        })

class SQLFTProjectViewSet(viewsets.ModelViewSet):
    queryset = SQLFTProject.objects.all()
    serializer_class = SQLFTProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == UserType.ADMIN:
            return SQLFTProject.objects.all()
        return SQLFTProject.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"data": serializer.data})

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({"data": serializer.data})

    def perform_create(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

    def perform_update(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

class BankDetailViewSet(viewsets.ModelViewSet):
    queryset = BankDetail.objects.all()
    serializer_class = BankDetailSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.user_type == UserType.ADMIN:
            return BankDetail.objects.all()
        return BankDetail.objects.filter(user=user)

class UserRegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            otp = user.generate_otp()  # Optional
            user.send_otp_email(otp) 
            return Response({
                "message": "User registered successfully. OTP sent.",
                "user_id": user.id,
                "referral_code": user.referral_code
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)