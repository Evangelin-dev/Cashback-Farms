# core/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
import random
import string
import datetime
from django.utils import timezone
from django.core.mail import EmailMessage
from django.contrib.auth import get_user_model


# User Roles
class UserType(models.TextChoices):
    CLIENT = 'client', 'Client Panel'
    ADMIN = 'admin', 'Admin Panel'
    B2B_VENDOR = 'b2b_vendor', 'B2B Business Panel'
    REAL_ESTATE_AGENT = 'real_estate_agent', 'Real Estate Agent Panel'


# Custom User Model
def generate_referral_code():
    return 'CBF' + ''.join(random.choices(string.digits, k=5))


# class CustomUser(AbstractUser):
#     # Using username as a primary login field if email/mobile is not provided,
#     # or it can be removed if login is strictly by mobile/email.
#     # We will make email and mobile_number unique and allow login by either.
#     email = models.EmailField(unique=True, null=True, blank=True)
#     mobile_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
#     user_type = models.CharField(
#         max_length=20,
#         choices=UserType.choices,
#         default=UserType.CLIENT,
#         help_text="Defines the user's role and panel access."
#     )
#     user_code = models.CharField(max_length=10, unique=True, blank=True, null=True)
#     referral_code = models.CharField(max_length=10, unique=True, default=generate_referral_code)
#     referred_by = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='referrals')

#     is_active = models.BooleanField(default=False)

#     # Add related_name to avoid clashes with auth.User.groups and auth.User.user_permissions
#     groups = models.ManyToManyField(
#         'auth.Group',
#         verbose_name='groups',
#         blank=True,
#         help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
#         related_name="customuser_set",
#         related_query_name="customuser",
#     )
#     user_permissions = models.ManyToManyField(
#         'auth.Permission',
#         verbose_name='user permissions',
#         blank=True,
#         help_text='Specific permissions for this user.',
#         related_name="customuser_set",
#         related_query_name="customuser",
#     )

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, null=True, blank=True)
    mobile_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    country_code = models.CharField(max_length=5, null=True, blank=True)  # e.g. +91, +1

    # Basic Profile
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    # Address
    town = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)

    # KYC
    aadhaar_card = models.CharField(max_length=20, null=True, blank=True)
    pan_card = models.CharField(max_length=20, null=True, blank=True)
    kyc_status = models.CharField(max_length=20, default='pending')

    # Role & Referral
    user_type = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.CLIENT,
        help_text="Defines the user's role and panel access."
    )
    user_code = models.CharField(max_length=10, unique=True, null=True, blank=True)
    referral_code = models.CharField(max_length=10, unique=True, default=generate_referral_code)
    referred_by = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='referrals')

    is_active = models.BooleanField(default=False)

    # Group & Permission fix
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_set",
        related_query_name="customuser",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_set",
        related_query_name="customuser",
    )

    def __str__(self):
        try:
            return self.username or self.email or self.mobile_number or f"User {self.id}"
        except Exception as e:
            return f"User (error: {e})"

    # Custom methods for OTP and SSO would reside here or in managers/views
    def generate_otp(self):
        try:
            otp = str(random.randint(100000, 999999))
            OTPVerification.objects.update_or_create(
                user=self,
                defaults={
                    'otp_code': otp,
                    'created_at': timezone.now(),
                    'expires_at': timezone.now() + datetime.timedelta(minutes=5)
                }
            )
            return otp
        except Exception as e:
            # Log or handle the error as needed
            print(f"Error generating OTP: {e}")
            return None

    def send_otp_email(self, otp):
        try:
            if self.email:
                # smtp_user = "azeema224143@gmail.com"
                # smtp_pass = "buwqswksuljoxjvm"
                smtp_user = settings.EMAIL_HOST_USER
                smtp_pass = settings.EMAIL_HOST_PASSWORD

                email_msg = EmailMessage(
                    subject="Your OTP Code",
                    body=f"Your OTP code is: {otp}",
                    from_email=smtp_user,
                    to=[self.email],
                )
                email_msg.send(fail_silently=False)
        except Exception as e:
            print(f"Error sending OTP email: {e}")

    def verify_otp(self, otp_code):
        try:
            otp_obj = OTPVerification.objects.get(user=self, otp_code=otp_code)
            if otp_obj.expires_at > timezone.now():
                otp_obj.delete()
                return True
            else:
                otp_obj.delete()
                return False
        except OTPVerification.DoesNotExist:
            return False
        except Exception as e:
            print(f"Error verifying OTP: {e}")
            return False

    def save(self, *args, **kwargs):
        try:
            if not self.user_code:
                self.user_code = self.generate_user_code()
            super().save(*args, **kwargs)
        except Exception as e:
            print(f"Error saving user: {e}")
            raise

    @staticmethod
    def generate_user_code():
        try:
            return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        except Exception as e:
            print(f"Error generating user code: {e}")
            return "ERRORCODE"


class OTPVerification(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        try:
            return f"OTP for {self.user.username}"
        except Exception as e:
            return f"OTP (error: {e})"


class PlotListing(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='listed_plots',
                              help_text="Primary owner of the plot.")
    owner_name = models.CharField(max_length=255)  # <-- Add this line
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    total_area_sqft = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_sqft = models.DecimalField(max_digits=10, decimal_places=2)
    is_available_full = models.BooleanField(default=True)
    available_sqft_for_investment = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00,
        help_text="Remaining square feet available for 'Book a Square Feet' investments."
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Set by Admin for 'Greenheap Verified Plots'."
    )
    listed_by_agent = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='plots_listed_as_agent',
        help_text="Real Estate Agent who listed this plot on behalf of the owner."
    )
    plot_file = models.FileField(upload_to='plot_files/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def owner_name(self):
        return self.owner.get_full_name() or self.owner.username or self.owner.email

    def __str__(self):
        try:
            return f"{self.title} - {self.location}"
        except Exception as e:
            return f"PlotListing (error: {e})"


class JointOwner(models.Model):
    plot_listing = models.ForeignKey(PlotListing, on_delete=models.CASCADE, related_name='joint_owners')
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='jointly_owned_plots')
    share_percentage = models.DecimalField(max_digits=5, decimal_places=2,
                                           help_text="Percentage of ownership share (e.g., 50.00)")

    class Meta:
        unique_together = ('plot_listing', 'owner') # A user can only be a joint owner once per plot

    def __str__(self):
        try:
            return f"{self.owner.username} ({self.share_percentage}%) for {self.plot_listing.title}"
        except Exception as e:
            return f"JointOwner (error: {e})"


class Booking(models.Model):
    BOOKING_TYPE_CHOICES = [
        ('full_plot', 'Full Plot'),
        ('square_feet', 'Square Feet'),
    ]
    plot_listing = models.ForeignKey(PlotListing, on_delete=models.CASCADE, related_name='bookings')
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='my_bookings')
    booking_type = models.CharField(max_length=20, choices=BOOKING_TYPE_CHOICES)
    booked_area_sqft = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="Area in sqft if booking type is 'square_feet'."
    )
    total_price = models.DecimalField(max_digits=15, decimal_places=2)
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='pending') # e.g., pending, confirmed, cancelled

    def __str__(self):
        try:
            return f"{self.client.username} - {self.booking_type} for {self.plot_listing.title}"
        except Exception as e:
            return f"Booking (error: {e})"


class EcommerceProduct(models.Model):
    vendor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='products_sold',
                               limit_choices_to={'user_type': UserType.B2B_VENDOR})
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    category = models.CharField(max_length=100, blank=True, null=True) # e.g., 'material', 'tool', 'service', 'architect'
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        try:
            return self.name
        except Exception as e:
            return f"EcommerceProduct (error: {e})"


class Order(models.Model):
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='my_orders')
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(max_length=50, default='pending') # e.g., pending, processing, shipped, delivered, cancelled

    def __str__(self):
        try:
            return f"Order #{self.id} by {self.client.username}"
        except Exception as e:
            return f"Order (error: {e})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(EcommerceProduct, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2) # Price at the time of order

    def __str__(self):
        try:
            return f"{self.quantity} x {self.product.name} in Order #{self.order.id}"
        except Exception as e:
            return f"OrderItem (error: {e})"


class RealEstateAgentProfile(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name='agent_profile',
        limit_choices_to={'user_type': UserType.REAL_ESTATE_AGENT}
    )
    first_name = models.CharField(max_length=100)  # Required
    last_name = models.CharField(max_length=100, blank=True, null=True)  # Optional
    gender = models.CharField(max_length=20, blank=True, null=True)      # Optional
    date_of_birth = models.DateField(blank=True, null=True)              # Optional
    company_name = models.CharField(max_length=255)  # Required
    phone_number = models.CharField(max_length=20)   # Required
    company_number = models.CharField(max_length=20, blank=True, null=True)  # Optional
    email = models.EmailField()  # Required
    address = models.TextField(blank=True, null=True)  # Optional
    city = models.CharField(max_length=100, blank=True, null=True)  # Optional
    state = models.CharField(max_length=100, blank=True, null=True)  # Optional
    country = models.CharField(max_length=100, blank=True, null=True)  # Optional
    kyc_documents = models.FileField(upload_to='kyc_documents/', blank=True, null=True)  # Optional
    gst_number = models.CharField(max_length=50, blank=True, null=True)  # Optional
    license_number = models.CharField(max_length=100, unique=True, blank=True, null=True)  # Optional
    commission_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=0.00,
        help_text="Commission rate for listings (e.g., 2.50 for 2.5%)"
    )

    def __str__(self):
        try:
            return f"Agent Profile: {self.user.username}"
        except Exception as e:
            return f"Agent Profile (error: {e})"


class PlotInquiry(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('closed', 'Closed'),
    ]
    lead_name = models.CharField(max_length=100)
    contact = models.CharField(max_length=20)
    plot = models.ForeignKey('PlotListing', on_delete=models.CASCADE, related_name='inquiries')
    inquiry = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lead_name} - {self.plot}"


class ReferralCommission(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='earned_commissions')
    referred_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='given_commissions')
    level = models.PositiveSmallIntegerField()  # 1, 2, or 3
    commission_percent = models.DecimalField(max_digits=4, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Pending', 'Pending'), ('Inactive', 'Inactive')])
    created_at = models.DateTimeField(auto_now_add=True)


class SQLFTProject(models.Model):
    UNIT_CHOICES = [
        ('sqft', 'Square Feet'),
        ('sqyd', 'Square Yards'),
    ]
    project_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    google_map_link = models.URLField(blank=True, null=True)
    description = models.TextField()
    plot_type = models.CharField(max_length=100)
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    project_layout = models.FileField(upload_to='project_layouts/', blank=True, null=True)
    project_image = models.ImageField(upload_to='project_images/', blank=True, null=True)
    project_video = models.FileField(upload_to='project_videos/', blank=True, null=True)
    land_document = models.FileField(upload_to='land_documents/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.project_name


class BankDetail(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bank_details')
    account_holder_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=20)
    ifsc = models.CharField(max_length=20)
    bank_name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_approval_required = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.account_holder_name} - {self.bank_name}"

class KYCDocument(models.Model):
    DOCUMENT_TYPES = [
        ('national_id', 'National ID'),
        ('address_proof', 'Address Proof'),
        ('passport', 'Passport'),
        ('aadhaar_card', 'Aadhaar'),
        ('pan_card','Pan Card'),
        # add more if needed
    ]

    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='kyc_documents')
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='kyc_documents/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.document_type}"

class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return self.question[:50]

User = get_user_model()

class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_tickets')
    subject = models.CharField(max_length=255)
    message = models.TextField()
    reply_message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Ticket #{self.id} - {self.subject}"

class Inquiry(models.Model):
    INQUIRY_TYPES = [
        ('plot', 'Plot'),
        ('micro_plot', 'Micro Plot'),
        ('material', 'Material'),
        ('service', 'Service'),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=20, choices=INQUIRY_TYPES)
    plot = models.ForeignKey(PlotListing, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(EcommerceProduct, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
