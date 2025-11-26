from rest_framework import serializers
from .models import Listing, ListingImage

class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']


class ListingSerializer(serializers.ModelSerializer):
    images = ListingImageSerializer(many=True, read_only=True)
    main_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Listing
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'user', 'images']
