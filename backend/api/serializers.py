from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Location, Property, PropertyImage, Booking, Payment,
    PropertyCategory, ListingType, ResidentialPropertyType, CommercialPropertyType
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image', 'is_primary')

class PropertySerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    images = PropertyImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Property
        fields = '__all__'

    def create(self, validated_data):
        location_data = validated_data.pop('location')
        location = Location.objects.create(**location_data)
        property = Property.objects.create(location=location, **validated_data)
        return property

    def update(self, instance, validated_data):
        if 'location' in validated_data:
            location_data = validated_data.pop('location')
            location = instance.location
            for attr, value in location_data.items():
                setattr(location, attr, value)
            location.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class BookingSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    property_id = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(),
        write_only=True,
        source='property'
    )
    user = UserSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'property', 'property_id', 'user', 'booking_date', 
                 'status', 'amount', 'payment_status')
        read_only_fields = ('id', 'booking_date', 'user')

class PaymentSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    booking_id = serializers.PrimaryKeyRelatedField(
        queryset=Booking.objects.all(),
        write_only=True,
        source='booking'
    )

    class Meta:
        model = Payment
        fields = ('id', 'booking', 'booking_id', 'amount', 'payment_date',
                 'payment_method', 'status', 'transaction_id')
        read_only_fields = ('id', 'payment_date') 