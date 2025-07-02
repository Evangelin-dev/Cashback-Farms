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
from django.core.mail import EmailMessage
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.decorators import action
from django.db import transaction
from rest_framework import generics
from decimal import Decimal
from django.db.models import Q
from django.conf import settings
from rest_framework.permissions import IsAdminUser, IsAuthenticated




from .models import (
    CustomUser, PlotListing, JointOwner, Booking,
    EcommerceProduct, Order, OrderItem, RealEstateAgentProfile, UserType, PlotInquiry, ReferralCommission,
    SQLFTProject, BankDetail, CustomUser, KYCDocument, FAQ, SupportTicket, Inquiry
)
from .serializers import (
    UserRegistrationSerializer, OTPRequestSerializer, OTPVerificationSerializer,
    CustomUserSerializer, PlotListingSerializer, JointOwnerSerializer,
    BookingSerializer, EcommerceProductSerializer, OrderSerializer,
    OrderItemSerializer, RealEstateAgentProfileSerializer, RealEstateAgentRegistrationSerializer, PlotInquirySerializer,
    ReferralCommissionSerializer, SQLFTProjectSerializer, BankDetailSerializer, KYCDocumentSerializer, FAQSerializer,
    SupportTicketSerializer, InquirySerializer, KYCDocumentSerializer, PaymentTransactionSerializer,
)

# --- Authentication and User Management ---
class UserRegistrationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        referral_code = request.data.get('referral_code')
        referred_by = None

        if referral_code:
            referred_by = CustomUser.objects.filter(referral_code=referral_code).first()

        try:
            # Create user
            user = serializer.save(
                user_type=validated_data.get('user_type', UserType.CLIENT),
                referred_by=referred_by,
                is_active=False  # ✅ Deactivate until OTP is verified
            )

            # Generate OTP
            otp = user.generate_otp()

            # Send OTP via email
            email = validated_data.get('email')
            if email:
                smtp_user = settings.EMAIL_HOST_USER
                email_msg = EmailMessage(
                    subject="Your OTP Code",
                    body=f"Dear {user.username},\n\nYour OTP code is: {otp}\n\nThanks,\nTeam",
                    from_email=smtp_user,
                    to=[email],
                )
                email_msg.send(fail_silently=False)

            return Response(
                {
                    "message": "User registered successfully. OTP sent for verification.",
                    "user_id": user.id,
                    "referral_code": user.referral_code
                },
                status=status.HTTP_201_CREATED
            )

        except IntegrityError:
            return Response(
                {"detail": "A user with this email or mobile number already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": f"Internal server error: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# class OTPRequestView(APIView):
#     authentication_classes = []  # <--- Add this line
#     permission_classes = [AllowAny]

#     def post(self, request, *args, **kwargs):
#         try:
#             serializer = OTPRequestSerializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             data = serializer.validated_data
#             email = data.get('email')
#             mobile_number = data.get('mobile_number')
#             user = None
#             if email:
#                 user = get_object_or_404(CustomUser, email=email)
#             elif mobile_number:
#                 user = get_object_or_404(CustomUser, mobile_number=mobile_number)
#             else:
#                 return Response({"detail": "Provide email or mobile number."}, status=status.HTTP_400_BAD_REQUEST)
#             # Generate OTP
#             otp = user.generate_otp()
#             # Send OTP via email if email is provided
#             if email:
#                 try:
#                     send_mail(
#                         subject="Your OTP Code",
#                         message=f"Your OTP code is: {otp}",
#                         from_email=settings.EMAIL_HOST_USER,  # Uses DEFAULT_FROM_EMAIL from settings
#                         recipient_list=[email],
#                         fail_silently=False,
#                     )
#                 except Exception as e:
#                     return Response({"detail": f"Failed to send OTP email: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#             print(f"DEBUG: OTP for {user.username}: {otp}") # For development purposes
#             return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({"detail": f"Internal server error: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OTPRequestView(APIView):
    authentication_classes = []
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

            # ✅ Block inactive users
            if not user.is_active:
                return Response({"detail": "Account is deactivated."}, status=status.HTTP_403_FORBIDDEN)

            # Generate OTP
            otp = user.generate_otp()

            # Send OTP via email if email is provided
            if email:
                try:
                    from django.core.mail import EmailMessage
                    from django.conf import settings

                    smtp_user = settings.EMAIL_HOST_USER
                    email_msg = EmailMessage(
                        subject="Your OTP Code",
                        body=f"Your OTP code is: {otp}",
                        from_email=smtp_user,
                        to=[email],
                    )
                    email_msg.send(fail_silently=False)
                except Exception as e:
                    return Response({"detail": f"Failed to send OTP email: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            print(f"DEBUG: OTP for {user.username}: {otp}")  # For dev only
            return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": f"Internal server error: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class OTPVerificationAndLoginView(APIView):
#     authentication_classes = []  # <--- Add this line
#     permission_classes = [AllowAny]

#     def post(self, request, *args, **kwargs):
#         try:
#             serializer = OTPVerificationSerializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             data = serializer.validated_data
#             email = data.get('email')
#             mobile_number = data.get('mobile_number')
#             otp_code = data.get('otp_code')
#             user = None
#             if email:
#                 user = get_object_or_404(CustomUser, email=email)
#             elif mobile_number:
#                 user = get_object_or_404(CustomUser, mobile_number=mobile_number)
#             else:
#                 return Response({"detail": "Provide email or mobile number."}, status=status.HTTP_400_BAD_REQUEST)

#             if user.verify_otp(otp_code):
#                 user.is_active = True  # activate the user on successful verification
#                 user.save()
#                 refresh = RefreshToken.for_user(user)
#                 return Response({"data":{
#                     "message": "OTP verified successfully. Login successful.",
#                     "refresh": str(refresh),
#                     "access": str(refresh.access_token),
#                     "user_id": user.id,
#                     "username": user.username,
#                     "user_type": user.user_type
#                 }}, status=status.HTTP_200_OK)
#             return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({"detail": f"Internal server error: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class OTPVerificationAndLoginView(APIView):
    authentication_classes = []
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
                user.is_active = True
                user.save()

                refresh = RefreshToken.for_user(user)
                # Build user dict for response
                user_data = {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "mobile_number": user.mobile_number,
                    "user_type": user.user_type.lower() if hasattr(user.user_type, "lower") else user.user_type,
                }
                return Response({
                    "message": "OTP verified successfully. Login successful.",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": user_data
                }, status=status.HTTP_200_OK)

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
    serializer_class = PlotListingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['location', 'price_per_sqft', 'is_available_full', 'is_verified']
    search_fields = ['title', 'location']
    ordering_fields = ['price_per_sqft', 'created_at']

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'real_estate_agent':
            # Show plots listed or owned by this agent
            return PlotListing.objects.filter(Q(listed_by_agent=user) | Q(owner=user))
        return PlotListing.objects.all()

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

# class EcommerceProductViewSet(viewsets.ModelViewSet):
#     queryset = EcommerceProduct.objects.all()
#     serializer_class = EcommerceProductSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         try:
#             if self.request.user.user_type == UserType.ADMIN:
#                 return EcommerceProduct.objects.all()
#             elif self.request.user.user_type == UserType.B2B_VENDOR:
#                 return EcommerceProduct.objects.filter(vendor=self.request.user)
#             # Clients can view all active products
#             return EcommerceProduct.objects.filter(is_active=True)
#         except Exception as e:
#             return EcommerceProduct.objects.none()

#     def perform_create(self, serializer):
#         try:
#             if self.request.user.user_type == UserType.B2B_VENDOR:
#                 serializer.save(vendor=self.request.user)
#             else:
#                 raise PermissionDenied("Only B2B Vendors can add products.")
#         except Exception as e:
#             raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

#     def perform_update(self, serializer):
#         try:
#             if self.request.user.user_type == UserType.ADMIN or \
#                (serializer.instance.vendor == self.request.user and self.request.user.user_type == UserType.B2B_VENDOR):
#                 serializer.save()
#             else:
#                 raise PermissionDenied("You do not have permission to edit this product.")
#         except Exception as e:
#             raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

#     def perform_destroy(self, instance):
#         try:
#             if self.request.user.user_type == UserType.ADMIN or \
#                (instance.vendor == self.request.user and self.request.user.user_type == UserType.B2B_VENDOR):
#                 instance.delete()
#             else:
#                 raise PermissionDenied("You do not have permission to delete this product.")
#         except Exception as e:
#             raise serializers.ValidationError({"detail": f"Internal server error: {e}"})

class EcommerceProductViewSet(viewsets.ModelViewSet):
    queryset = EcommerceProduct.objects.all()
    serializer_class = EcommerceProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        user = self.request.user
        category = self.request.query_params.get('category')

        try:
            if user.user_type == UserType.ADMIN:
                queryset = EcommerceProduct.objects.all()
            elif user.user_type == UserType.B2B_VENDOR:
                queryset = EcommerceProduct.objects.filter(vendor=user)
            else:
                # CLIENT or ANONYMOUS can only view active products
                queryset = EcommerceProduct.objects.filter(is_active=True)

            if category:
                queryset = queryset.filter(category=category)

            return queryset

        except Exception as e:
            return EcommerceProduct.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.user_type != UserType.B2B_VENDOR:
            raise PermissionDenied("Only B2B Vendors can add products.")
        try:
            serializer.save(vendor=user)
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Error saving product: {e}"})

    def perform_update(self, serializer):
        user = self.request.user
        instance = serializer.instance

        if user.user_type == UserType.ADMIN or (user == instance.vendor and user.user_type == UserType.B2B_VENDOR):
            try:
                serializer.save()
            except Exception as e:
                raise serializers.ValidationError({"detail": f"Error updating product: {e}"})
        else:
            raise PermissionDenied("You do not have permission to edit this product.")

    def perform_destroy(self, instance):
        user = self.request.user

        if user.user_type == UserType.ADMIN or (user == instance.vendor and user.user_type == UserType.B2B_VENDOR):
            try:
                instance.delete()
            except Exception as e:
                raise serializers.ValidationError({"detail": f"Error deleting product: {e}"})
        else:
            raise PermissionDenied("You do not have permission to delete this product.")


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
            data = self.request.data

            username = self.request.data.get('username') or self.request.data.get('email') or self.request.data.get('mobile_number')
            email = self.request.data.get('email')
            mobile_number = self.request.data.get('mobile_number')
            password = self.request.data.get('password')
            user_type = data.get('user_type')


            if not username:
                raise serializers.ValidationError({"username": "Username, email, or mobile number is required."})

            # Step 1: Create user
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                mobile_number=mobile_number,
                user_type=user_type,
                password=password,
                is_active=False  # ✅ Mark inactive until OTP verified
            )

            # Step 2: Generate OTP
            otp = user.generate_otp()

            # Step 3: Send OTP via Email
            if email:
                try:
                    from django.core.mail import EmailMessage
                    from django.conf import settings

                    smtp_user = settings.EMAIL_HOST_USER
                    smtp_pass = settings.EMAIL_HOST_PASSWORD
                    email_msg = EmailMessage(
                        subject="Your OTP Code",
                        body=f"Dear {username},\n\nYour OTP code is: {otp}\n\nThanks,\nTeam",
                        from_email=smtp_user,
                        to=[email],
                    )
                    email_msg.send(fail_silently=False)
                except Exception as e:
                    raise serializers.ValidationError({"detail": f"Failed to send OTP email: {e}"})

            # Step 4: Save profile
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


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = CustomUserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        request.user.delete()
        return Response({"message": "User account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class KYCSubmitView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = KYCDocumentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'message': 'KYC submitted successfully'}, status=201)
        return Response(serializer.errors, status=400)


class KYCStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        documents = request.user.kyc_documents.all()
        serializer = KYCDocumentSerializer(documents, many=True)
        return Response({
            "status": "pending",  # You can customize this logic based on document statuses
            "documents": serializer.data
        }, status=200)


class KYCUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        kyc_id = request.data.get('id')
        try:
            kyc_doc = KYCDocument.objects.get(id=kyc_id)
            if request.user.is_staff or request.user == kyc_doc.user:
                serializer = KYCDocumentSerializer(kyc_doc, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=200)
                return Response(serializer.errors, status=400)
            else:
                return Response({"detail": "Permission denied."}, status=403)
        except KYCDocument.DoesNotExist:
            return Response({"detail": "KYC document not found."}, status=404)

class MicroPlotListView(generics.ListAPIView):
    queryset = SQLFTProject.objects.all()
    serializer_class = SQLFTProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class MicroPlotDetailView(generics.RetrieveAPIView):
    queryset = SQLFTProject.objects.all()
    serializer_class = SQLFTProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.vendor == request.user

class MaterialProductViewSet(viewsets.ModelViewSet):
    queryset = EcommerceProduct.objects.filter(category='material')
    serializer_class = EcommerceProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'price']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

    def get_queryset(self):
        if self.request.user.is_staff:
            return EcommerceProduct.objects.filter(category='material')
        return EcommerceProduct.objects.filter(category='material')

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class SupportTicketViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return SupportTicket.objects.all()
        return SupportTicket.objects.filter(user=user)

    @action(detail=False, methods=['post'], url_path='inquiry')
    def submit_ticket(self, request):
        serializer = SupportTicketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='my-tickets')
    def my_tickets(self, request):
        tickets = SupportTicket.objects.filter(user=request.user)
        serializer = SupportTicketSerializer(tickets, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            ticket = SupportTicket.objects.get(pk=pk)
            if ticket.user != request.user and not request.user.is_staff:
                return Response({"detail": "Not allowed"}, status=403)
            serializer = SupportTicketSerializer(ticket)
            return Response(serializer.data)
        except SupportTicket.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)

    def update(self, request, pk=None):
        try:
            ticket = SupportTicket.objects.get(pk=pk)
            if ticket.user != request.user and not request.user.is_staff:
                return Response({"detail": "Not allowed"}, status=403)

            if request.user.is_staff:
                allowed_fields = ['status', 'reply_message']
            else:
                allowed_fields = ['message']

            data = {field: request.data[field] for field in allowed_fields if field in request.data}
            serializer = SupportTicketSerializer(ticket, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except SupportTicket.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)

class PlotPurchaseListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(client=self.request.user, booking_type='full_plot')


class PlotPurchaseCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        user = request.user
        plot_id = request.data.get("plot_listing")
        booking_type = request.data.get("booking_type")

        if booking_type != 'full_plot':
            return Response({"error": "Invalid booking_type, must be 'full_plot'"}, status=400)

        try:
            plot = PlotListing.objects.get(id=plot_id, is_available_full=True)
        except PlotListing.DoesNotExist:
            return Response({"error": "Plot not available for full purchase."}, status=404)

        total_price = float(plot.total_area_sqft) * float(plot.price_per_sqft)

        booking = Booking.objects.create(
            plot_listing=plot,
            client=user,
            booking_type='full_plot',
            total_price=total_price
        )

        # Mark the plot as unavailable for further full booking
        plot.is_available_full = False
        plot.save()

        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

class MicroPlotPurchaseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(client=request.user, booking_type='square_feet')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MicroPlotPurchaseCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['client'] = request.user.id
        data['booking_type'] = 'square_feet'
        serializer = BookingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MaterialPurchaseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(client=request.user, items__product__category='material').distinct()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MaterialPurchaseCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        items_data = request.data.get('items', [])
        if not items_data:
            return Response({"detail": "No items provided"}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = Decimal(0)
        order_items = []

        for item in items_data:
            try:
                product = EcommerceProduct.objects.get(id=item['product'], category='material')
                quantity = int(item['quantity'])
                price = product.price * quantity
                total_amount += price
                order_items.append((product, quantity, product.price))
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(client=user, total_amount=total_amount)

        for product, quantity, price in order_items:
            OrderItem.objects.create(order=order, product=product, quantity=quantity, price_at_purchase=price)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ServicePurchaseListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user,
            items__product__category='service'
        ).distinct()


class ServicePurchaseCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        items_data = request.data.get('items', [])
        if not items_data:
            return Response({"detail": "No items provided."}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(user=request.user)
        for item in items_data:
            product_id = item.get('product')
            quantity = item.get('quantity', 1)
            try:
                product = EcommerceProduct.objects.get(id=product_id, category='service')
                OrderItem.objects.create(order=order, product=product, quantity=quantity)
            except EcommerceProduct.DoesNotExist:
                order.delete()
                return Response({"detail": f"Service with id {product_id} not found."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class ServiceOrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(client=request.user, items__product__category='service').distinct()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class ServiceOrderCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        items_data = request.data.get('items', [])
        if not items_data:
            return Response({'error': 'No items provided'}, status=400)

        total_amount = 0
        for item in items_data:
            try:
                product = EcommerceProduct.objects.get(id=item['product'], category='service')
                total_amount += product.price * item.get('quantity', 1)
            except EcommerceProduct.DoesNotExist:
                return Response({'error': f"Product ID {item['product']} not found or not a service."}, status=400)

        # ✅ create the order with total_amount set
        order = Order.objects.create(
            client=request.user,
            total_amount=total_amount,
            status='pending'
        )

        # Create order items
        for item in items_data:
            OrderItem.objects.create(
                order=order,
                product_id=item['product'],
                quantity=item['quantity']
            )

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=201)

class SubmitPlotInquiry(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InquirySerializer(data={
            'user': request.user.id if request.user.is_authenticated else None,
            'type': 'plot',
            'plot': request.data.get('plot'),
            'message': request.data.get('message')
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

class SubmitMicroPlotInquiry(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InquirySerializer(data={
            'user': request.user.id if request.user.is_authenticated else None,
            'type': 'micro_plot',
            'plot': request.data.get('plot'),
            'message': request.data.get('message')
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

class SubmitMaterialInquiry(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InquirySerializer(data={
            'user': request.user.id if request.user.is_authenticated else None,
            'type': 'material',
            'product': request.data.get('product'),
            'message': request.data.get('message')
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

class SubmitServiceInquiry(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InquirySerializer(data={
            'user': request.user.id if request.user.is_authenticated else None,
            'type': 'service',
            'product': request.data.get('product'),
            'message': request.data.get('message')
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

class AllBookingListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        bookings = Booking.objects.all().order_by('-booking_date')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=200)

class MyBookingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(client=request.user).order_by('-booking_date')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=200)

class BookingByClientIDView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, client_id):
        bookings = Booking.objects.filter(client_id=client_id).order_by('-booking_date')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=200)

class PublicPlotListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        plots = PlotListing.objects.all()
        serializer = PlotListingSerializer(plots, many=True)
        return Response(serializer.data, status=200)

class PublicPlotDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        plot = get_object_or_404(PlotListing, pk=pk)
        serializer = PlotListingSerializer(plot)
        return Response(serializer.data, status=200)

class PublicMicroPlotListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        micro_plots = PlotListing.objects.filter(is_available_full=False, is_verified=True)
        serializer = PlotListingSerializer(micro_plots, many=True)
        return Response(serializer.data)

class PublicMicroPlotDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            micro_plot = PlotListing.objects.get(pk=pk, is_available_full=False, is_verified=True)
        except PlotListing.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        serializer = PlotListingSerializer(micro_plot)
        return Response(serializer.data)

class PublicMaterialListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        materials = EcommerceProduct.objects.filter(category='material', is_active=True)
        serializer = EcommerceProductSerializer(materials, many=True)
        return Response(serializer.data)

class PublicMaterialDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        material = get_object_or_404(EcommerceProduct, pk=pk, category='material', is_active=True)
        serializer = EcommerceProductSerializer(material)
        return Response(serializer.data)

class PublicMaterialDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        material = get_object_or_404(EcommerceProduct, pk=pk, category='material', is_active=True)
        serializer = EcommerceProductSerializer(material)
        return Response(serializer.data, status=200)

class PublicServiceListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        services = EcommerceProduct.objects.filter(category='service')
        serializer = EcommerceProductSerializer(services, many=True)
        return Response(serializer.data)

class PublicServiceDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            service = EcommerceProduct.objects.get(pk=pk, category='service')
        except EcommerceProduct.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        serializer = EcommerceProductSerializer(service)
        return Response(serializer.data)

class MyBookingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        bookings = Booking.objects.filter(client=user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=200)

class MyPaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        transactions = []

        # Add plot & micro-plot bookings
        bookings = Booking.objects.filter(client=user)
        for booking in bookings:
            if booking.booking_type == 'full_plot':
                trans_type = "plot_purchase"
                description = f"Full Plot Booking: {booking.plot_listing.title}"
            else:
                trans_type = "micro_plot_purchase"
                description = f"Micro Plot Investment: {booking.plot_listing.title} ({booking.booked_area_sqft} sqft)"

            transactions.append({
                "transaction_id": f"BOOKING-{booking.id}",
                "type": trans_type,
                "description": description,
                "amount": booking.total_price,
                "date": booking.booking_date,
                "status": booking.status
            })

        # Add material/service orders
        orders = Order.objects.filter(client=user)
        for order in orders:
            product_names = ", ".join([item.product.title for item in order.items.all()])
            order_type = 'material_purchase' if order.category == 'material' else 'service_purchase'
            transactions.append({
                "transaction_id": f"ORDER-{order.id}",
                "type": order_type,
                "description": f"Order for {product_names}",
                "amount": order.total_price,
                "date": order.created_at,
                "status": order.status
            })

        serializer = PaymentTransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=200)