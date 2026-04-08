from rest_framework import serializers
from django.utils import timezone
from .models import Listing, ListingImage, UserProfile, DealerPhone, DealerAddress


class DealerPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = DealerPhone
        fields = ['id', 'label', 'number']
        read_only_fields = ['id']


class DealerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = DealerAddress
        fields = ['id', 'label', 'address']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['display_name', 'phone', 'location']


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']


class ListingSerializer(serializers.ModelSerializer):
    images = ListingImageSerializer(many=True, read_only=True)
    main_image = serializers.ImageField(required=False, allow_null=True)
    seller = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'user', 'images', 'seller_type']

    def validate_price(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError('Price must be a positive number.')
        return value

    def validate_mileage(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError('Mileage cannot be negative.')
        return value

    def validate_year(self, value):
        current_year = timezone.now().year
        if value < 1900 or value > current_year + 1:
            raise serializers.ValidationError(f'Year must be between 1900 and {current_year + 1}.')
        return value

    def validate_registration_year(self, value):
        current_year = timezone.now().year
        if value < 1900 or value > current_year + 1:
            raise serializers.ValidationError(f'Registration year must be between 1900 and {current_year + 1}.')
        return value

    def validate_horsepower(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError('Horsepower cannot be negative.')
        return value

    def validate_engine_displacement(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError('Engine displacement cannot be negative.')
        return value

    def validate_number_of_doors(self, value):
        if value is not None and (value < 2 or value > 5):
            raise serializers.ValidationError('Number of doors must be between 2 and 5.')
        return value

    def validate_number_of_seats(self, value):
        if value is not None and (value < 1 or value > 9):
            raise serializers.ValidationError('Number of seats must be between 1 and 9.')
        return value

    def validate_previous_owners(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError('Previous owners cannot be negative.')
        return value

    def get_seller(self, obj):
        user = obj.user
        profile = getattr(user, 'profile', None)
        if not profile:
            profile, _ = UserProfile.objects.get_or_create(user=user)
        data = {
            'username': user.username,
            'display_name': profile.display_name,
            'phone': profile.phone,
            'location': profile.location,
            'seller_type': profile.seller_type,
            'company_name': profile.company_name,
            'company_image': profile.company_image.url if profile.company_image else None,
        }
        if profile.seller_type == 'dealer':
            data['dealer_phones'] = DealerPhoneSerializer(profile.dealer_phones.all(), many=True).data
            data['dealer_addresses'] = DealerAddressSerializer(profile.dealer_addresses.all(), many=True).data
        return data
