# core/serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import (
    CustomUser, PlotListing, JointOwner, Booking,
    EcommerceProduct, Order, OrderItem, RealEstateAgentProfile, UserType, PlotInquiry, ReferralCommission, SQLFTProject, BankDetail,
    KYCDocument, FAQ, SupportTicket, Inquiry, ShortlistCartItem, ShortlistCart, CallRequest, B2BVendorProfile, VerifiedPlot, CommercialProperty,SubPlotUnit,
    Payment

)

# User and Authentication Serializers
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'mobile_number', 'password', 'confirm_password',
            'user_type', 'first_name', 'last_name', 'gender', 'date_of_birth',
            'town', 'city', 'state', 'country'
        )
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False},
            'mobile_number': {'required': False},
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        if not data.get('email') and not data.get('mobile_number'):
            raise serializers.ValidationError("Either email or mobile number is required.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        user = CustomUser.objects.create_user(
            username=validated_data.get('username') or validated_data.get('email') or validated_data.get('mobile_number'),
            email=validated_data.get('email'),
            mobile_number=validated_data.get('mobile_number'),
            user_type=validated_data.get('user_type', UserType.CLIENT),
            password=validated_data['password'],
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            gender=validated_data.get('gender'),
            date_of_birth=validated_data.get('date_of_birth'),
            town=validated_data.get('town'),
            city=validated_data.get('city'),
            state=validated_data.get('state'),
            country=validated_data.get('country')
        )
        return user


class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    mobile_number = serializers.CharField(max_length=15, required=False)

    def validate(self, data):
        if not data.get('email') and not data.get('mobile_number'):
            raise serializers.ValidationError("Either email or mobile number is required to request OTP.")
        return data

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    mobile_number = serializers.CharField(max_length=15, required=False)
    otp_code = serializers.CharField(max_length=6)

    def validate(self, data):
        if not data.get('email') and not data.get('mobile_number'):
            raise serializers.ValidationError("Either email or mobile number is required for OTP verification.")
        return data

class CustomUserSerializer2(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'mobile_number', 'gender', 'date_of_birth',
            'town', 'city', 'state', 'country', 'is_active', 'user_type'
        ]

class KYCDocumentSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer2(read_only=True)  # ✅ Show full user info in response

    class Meta:
        model = KYCDocument
        fields = ['id', 'document_type', 'file', 'status', 'upload_date', 'user']
        read_only_fields = ['upload_date', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return KYCDocument.objects.create(**validated_data)


# class CustomUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ('id', 'username', 'email', 'mobile_number', 'user_type', 'is_staff', 'is_active')
#         read_only_fields = ('user_type', 'is_staff', 'is_active')

class CustomUserSerializer(serializers.ModelSerializer):
    full_mobile_number = serializers.SerializerMethodField()
    kyc_documents = KYCDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'gender', 'date_of_birth',
            'country_code', 'mobile_number', 'full_mobile_number',
            'town', 'city', 'state', 'country',  # 👈 flat fields added here
            'kyc_documents',
            'email', 'user_type', 'user_code', 'referral_code',
            'is_active', 'is_superuser', 'is_staff', 'last_login', 'date_joined'
        ]

    def get_full_mobile_number(self, obj):
        return f"{obj.country_code or ''}{obj.mobile_number or ''}"


    def get_address(self, obj):
        return {
            "town": obj.town,
            "city": obj.city,
            "state": obj.state,
            "country": obj.country,
        }


# Core Models Serializers
class JointOwnerSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    owner_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = JointOwner
        fields = ('id', 'owner', 'owner_username', 'owner_email', 'share_percentage')
        read_only_fields = ('owner_username', 'owner_email')

class PlotListingSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    listed_by_agent_username = serializers.CharField(source='listed_by_agent.username', read_only=True)
    joint_owners = JointOwnerSerializer(many=True, read_only=True)
    
    # Helper method to get all images as a list
    images = serializers.SerializerMethodField()
    
    def get_images(self, obj):
        images = []
        if obj.image_1:
            images.append(obj.image_1.url)
        if obj.image_2:
            images.append(obj.image_2.url)
        if obj.image_3:
            images.append(obj.image_3.url)
        if obj.image_4:
            images.append(obj.image_4.url)
        if obj.image_5:
            images.append(obj.image_5.url)
        return images

    class Meta:
        model = PlotListing
        fields = [
            'id', 'owner', 'owner_name', 'title', 'location', 
            'google_maps_link', 'facing', 'survey_number', 'plot_type',
            'total_area', 'area_unit', 'price_per_unit',
            'total_area_sqft', 'price_per_sqft',  # Legacy fields
            'is_available_full', 'available_sqft_for_investment',
            'is_verified', 'listed_by_agent', 'plot_file',
            'image_1', 'image_2', 'image_3', 'image_4', 'image_5', 'images',
            'created_at', 'updated_at', 'owner_username', 'listed_by_agent_username', 'joint_owners'
        ]
        read_only_fields = (
            'owner', 'available_sqft_for_investment', 'joint_owners',
            'owner_username', 'listed_by_agent_username', 'images'
        )


class BookingSerializer(serializers.ModelSerializer):
    client_username = serializers.CharField(source='client.username', read_only=True)
    plot_title = serializers.CharField(source='plot_listing.title', read_only=True)

    class Meta:
        model = Booking
        fields = (
            'id', 'plot_listing', 'plot_title', 'client', 'client_username',
            'booking_type', 'booked_area_sqft', 'total_price', 'booking_date', 'status'
        )
        read_only_fields = ('client', 'booking_date', 'status', 'plot_title', 'client_username')


class EcommerceProductSerializer(serializers.ModelSerializer):
    vendor_username = serializers.CharField(source='vendor.username', read_only=True)
    status = serializers.SerializerMethodField()  # Map is_active to status

    class Meta:
        model = EcommerceProduct
        fields = (
            'id', 'vendor', 'vendor_username', 'name', 'description', 'price',
            'stock_quantity', 'category', 'moq', 'status', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'vendor', 'vendor_username', 'created_at', 'updated_at')

    def get_status(self, obj):
        return 'Active' if obj.is_active else 'Inactive'

    def validate(self, data):
        # Ensure MOQ is not greater than stock_quantity
        if 'moq' in data and 'stock_quantity' in data:
            if data['moq'] > data['stock_quantity']:
                raise serializers.ValidationError("MOQ cannot be greater than stock quantity.")
        return data


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'quantity', 'price_at_purchase')
        read_only_fields = ('price_at_purchase', 'product_name')


class OrderSerializer(serializers.ModelSerializer):
    client_username = serializers.CharField(source='client.username', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True) # Nested serializer for order items

    class Meta:
        model = Order
        fields = ('id', 'client', 'client_username', 'order_date', 'total_amount', 'status', 'items')
        read_only_fields = ('client', 'order_date', 'total_amount', 'status', 'items', 'client_username')


class RealEstateAgentRegistrationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = RealEstateAgentProfile
        fields = [
            'user', 'first_name', 'last_name', 'gender', 'date_of_birth', 'company_name',
            'phone_number', 'company_number', 'email', 'address', 'city', 'state', 'country',
            'kyc_documents', 'gst_number', 'license_number', 'commission_rate'
        ]

class RealEstateAgentProfileSerializer(serializers.ModelSerializer):
    user_code = serializers.CharField(source='user.user_code', read_only=True)

    class Meta:
        model = RealEstateAgentProfile
        fields = [
            'id', 'user_code', 'first_name', 'last_name', 'gender', 'date_of_birth',
            'company_name', 'phone_number', 'company_number', 'email', 'address',
            'city', 'state', 'country', 'kyc_documents', 'gst_number',
            'license_number', 'commission_rate'
        ]


class PlotInquirySerializer(serializers.ModelSerializer):
    plot_name = serializers.CharField(source='plot.title', read_only=True)

    class Meta:
        model = PlotInquiry
        fields = ['id', 'lead_name', 'contact', 'plot', 'plot_name', 'inquiry', 'status', 'created_at']
        read_only_fields = ('created_at', 'plot_name')


class ReferralCommissionSerializer(serializers.ModelSerializer):
    referred_user_name = serializers.CharField(source='referred_user.get_full_name', read_only=True)
    referred_user_code = serializers.CharField(source='referred_user.referral_code', read_only=True)

    class Meta:
        model = ReferralCommission
        fields = ['id', 'referred_user_name', 'level', 'referred_user_code', 'commission_percent', 'status', 'created_at']


class SQLFTProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = SQLFTProject
        fields = [
            'id', 'project_name', 'location', 'google_map_link', 'description',
            'plot_type', 'unit', 'price', 'project_layout', 'project_image',
            'project_video', 'land_document', 'created_at'
        ]


class SubPlotUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubPlotUnit
        fields = [
            'id', 'project', 'plot_number', 'dimensions', 'area', 'total_price',
            'status', 'facing', 'remarks', 'created_at', 'project_id',
        ]

class BankDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankDetail
        fields = '__all__'
        read_only_fields = ['status', 'admin_approval_required', 'user', 'created_at']


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'

class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class PaymentTransactionSerializer(serializers.Serializer):
    transaction_id = serializers.CharField()
    type = serializers.CharField()
    description = serializers.CharField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    date = serializers.DateTimeField()
    status = serializers.CharField()

class ShortlistCartItemSerializer(serializers.ModelSerializer):
    item_type = serializers.SerializerMethodField()
    item_id = serializers.IntegerField(source='object_id')
    item_title = serializers.SerializerMethodField()
    price_per_unit = serializers.SerializerMethodField()
    total_item_value = serializers.SerializerMethodField()

    class Meta:
        model = ShortlistCartItem
        fields = [
            'id', 'item_type', 'item_id', 'item_title',
            'quantity', 'price_per_unit', 'total_item_value'
        ]

    def get_item_type(self, obj):
        return obj.content_type.model

    def get_item_title(self, obj):
        return getattr(
            obj.content_object, 
            'title', 
            getattr(
                obj.content_object, 
                'name', 
                getattr(obj.content_object, 'project_name', '')
            )
        )

    def get_price_per_unit(self, obj):
        return getattr(obj.content_object, 'price_per_sqft', getattr(obj.content_object, 'price', None))

    def get_total_item_value(self, obj):
        price = self.get_price_per_unit(obj)
        qty = obj.quantity if obj.quantity else 1
        return str(float(price or 0) * qty)

class WebOrderSerializer(serializers.ModelSerializer):
    client_username = serializers.CharField(source='client.username', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('client', 'order_date', 'client_username')

class CallRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallRequest
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class B2BProfileSerializer(serializers.ModelSerializer):
    address = serializers.SerializerMethodField()
    town = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'last_name', 'email', 'mobile_number', 'gst_number', 'company_name',
            'town', 'city', 'state', 'country', 'address'
        ]
        read_only_fields = ['email', 'address']

    def get_address(self, obj):
        parts = filter(None, [obj.town, obj.city, obj.state, obj.country])
        return ', '.join(parts) or "Not Provided"

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Must include 'email' and 'password'.")

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        data = super().validate(attrs)
        data['user_id'] = user.id
        data['email'] = user.email
        return data

class UsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # if self.user.user_type != 'admin':
        #     raise serializers.ValidationError("Only admin users are allowed to login here.")

        data['user'] = {
            "id": self.user.id,
            "email": self.user.email,
            "username": self.user.username,
            "user_type": self.user.user_type
        }
        return data

class VerifiedPlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerifiedPlot
        fields = '__all__'

class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'mobile_number', 'first_name', 'last_name',
            'gender', 'date_of_birth', 'town', 'city', 'state', 'country',
            'aadhaar_card', 'pan_card', 'kyc_status', 'user_type', 'user_code',
            'referral_code', 'referred_by', 'gst_number', 'company_name',
            'is_active', 'date_joined'
        ]
        read_only_fields = ['user_code', 'referral_code', 'date_joined']

class CommercialPropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = CommercialProperty
        fields = '__all__'
        read_only_fields = ['id', 'user', 'added_date']

class PaymentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'plot_id', 'razorpay_order_id', 'razorpay_payment_id',
            'amount', 'status', 'created_at', 'user', 'user_name', 'user_email'
        ]
