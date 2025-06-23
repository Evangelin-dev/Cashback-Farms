# core/serializers.py
from rest_framework import serializers
from .models import (
    CustomUser, PlotListing, JointOwner, Booking,
    EcommerceProduct, Order, OrderItem, RealEstateAgentProfile, UserType, PlotInquiry, ReferralCommission, SQLFTProject
)

# User and Authentication Serializers
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'mobile_number', 'password', 'confirm_password', 'user_type')
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
            user_type=validated_data.get('user_type', UserType.CLIENT), # Default to client if not specified
            password=validated_data['password']
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


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'mobile_number', 'user_type', 'is_staff', 'is_active')
        read_only_fields = ('user_type', 'is_staff', 'is_active')


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

    class Meta:
        model = PlotListing
        fields = [
            'id', 'owner', 'owner_name', 'title', 'location', 'total_area_sqft',
            'price_per_sqft', 'is_available_full', 'available_sqft_for_investment',
            'is_verified', 'listed_by_agent', 'plot_file', 'created_at', 'updated_at',
            'owner_username', 'listed_by_agent_username', 'joint_owners'
        ]
        read_only_fields = (
            'owner',  # <--- add this
            'is_verified', 'available_sqft_for_investment', 'joint_owners',
            'owner_username', 'listed_by_agent_username'
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

    class Meta:
        model = EcommerceProduct
        fields = (
            'id', 'vendor', 'vendor_username', 'name', 'description', 'price',
            'stock_quantity', 'category', 'is_active', 'created_at', 'updated_at'
        )
        read_only_fields = ('vendor', 'vendor_username')


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
    plot_title = serializers.CharField(source='plot.title', read_only=True)

    class Meta:
        model = PlotInquiry
        fields = [
            'id', 'lead_name', 'contact', 'plot', 'plot_title', 'inquiry', 'status', 'created_at'
        ]
        read_only_fields = ('created_at', 'plot_title')


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

