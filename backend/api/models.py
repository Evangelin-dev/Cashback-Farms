from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class PropertyCategory(models.TextChoices):
    RESIDENTIAL = 'RESIDENTIAL', 'Residential'
    COMMERCIAL = 'COMMERCIAL', 'Commercial'
    PLOT = 'PLOT', 'Plot'

class ListingType(models.TextChoices):
    BUY = 'BUY', 'Buy'
    RENT = 'RENT', 'Rent'

class ResidentialPropertyType(models.TextChoices):
    APARTMENT = 'APARTMENT', 'Apartment'
    VILLA = 'VILLA', 'Villa'
    HOUSE = 'HOUSE', 'House'
    PLOT = 'PLOT', 'Plot'

class CommercialPropertyType(models.TextChoices):
    OFFICE = 'OFFICE', 'Office'
    SHOP = 'SHOP', 'Shop'
    WAREHOUSE = 'WAREHOUSE', 'Warehouse'
    INDUSTRIAL = 'INDUSTRIAL', 'Industrial'

class Location(models.Model):
    city = models.CharField(max_length=100)
    locality = models.CharField(max_length=100)
    landmark = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.locality}, {self.city}"

class Property(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    area = models.DecimalField(max_digits=10, decimal_places=2)
    property_category = models.CharField(
        max_length=20,
        choices=PropertyCategory.choices
    )
    listing_type = models.CharField(
        max_length=10,
        choices=ListingType.choices
    )
    residential_type = models.CharField(
        max_length=20,
        choices=ResidentialPropertyType.choices,
        null=True,
        blank=True
    )
    commercial_type = models.CharField(
        max_length=20,
        choices=CommercialPropertyType.choices,
        null=True,
        blank=True
    )
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    bedrooms = models.IntegerField(null=True, blank=True)
    bathrooms = models.IntegerField(null=True, blank=True)
    parking_spots = models.IntegerField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='properties/')
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.property.title}"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        ('COMPLETED', 'Completed'),
    ]

    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_status = models.BooleanField(default=False)

    def __str__(self):
        return f"Booking {self.id} - {self.property.title}"

class Payment(models.Model):
    PAYMENT_STATUS = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]

    PAYMENT_METHOD = [
        ('ONLINE', 'Online'),
        ('CASH', 'Cash'),
        ('CHEQUE', 'Cheque'),
    ]

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='PENDING')
    transaction_id = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Payment {self.id} - {self.booking.property.title}"
