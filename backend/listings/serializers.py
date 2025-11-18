from rest_framework import serializers
from .models import Listing

class ListingSerializer(serializers.ModelSerializer):
    main_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Listing
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
