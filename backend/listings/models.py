from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Listing(models.Model):
    FUEL_CHOICES = [
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
    ]

    BODY_TYPE_CHOICES = [
        ('sedan', 'Sedan'),
        ('suv', 'SUV'),
        ('coupe', 'Coupe'),
        ('hatchback', 'Hatchback'),
        ('wagon', 'Wagon'),
        ('convertible', 'Convertible'),
        ('van', 'Van'),
        ('pickup', 'Pickup'),
    ]

    TRANSMISSION_CHOICES = [
        ('manual', 'Manual'),
        ('automatic', 'Automatic'),
        ('semi-automatic', 'Semi-automatic'),
    ]

    DRIVE_TYPE_CHOICES = [
        ('fwd', 'FWD'),
        ('rwd', 'RWD'),
        ('awd', 'AWD'),
        ('4x4', '4x4'),
    ]

    COLOR_CHOICES = [
        ('black', 'Black'),
        ('white', 'White'),
        ('silver', 'Silver'),
        ('gray', 'Gray'),
        ('blue', 'Blue'),
        ('red', 'Red'),
        ('green', 'Green'),
        ('brown', 'Brown'),
        ('beige', 'Beige'),
        ('yellow', 'Yellow'),
        ('orange', 'Orange'),
    ]

    SELLER_TYPE_CHOICES = [
        ('private', 'Private'),
        ('dealer', 'Dealer'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')

    title = models.CharField(max_length=255)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    year = models.IntegerField()              
    registration_year = models.IntegerField() 

    mileage = models.IntegerField()
    price = models.IntegerField()

    fuel_type = models.CharField(max_length=20, choices=FUEL_CHOICES)
    body_type = models.CharField(max_length=20, choices=BODY_TYPE_CHOICES, null=True, blank=True)
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES, null=True, blank=True)
    drive_type = models.CharField(max_length=10, choices=DRIVE_TYPE_CHOICES, null=True, blank=True)
    horsepower = models.IntegerField(null=True, blank=True)
    engine_displacement = models.IntegerField(null=True, blank=True, help_text='In cc')
    exterior_color = models.CharField(max_length=20, choices=COLOR_CHOICES, null=True, blank=True)
    interior_color = models.CharField(max_length=20, choices=COLOR_CHOICES, null=True, blank=True)
    number_of_doors = models.IntegerField(null=True, blank=True)
    number_of_seats = models.IntegerField(null=True, blank=True)
    previous_owners = models.IntegerField(null=True, blank=True)
    seller_type = models.CharField(max_length=20, choices=SELLER_TYPE_CHOICES, null=True, blank=True)

    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    description = models.TextField(blank=True, null=True)
    main_image = models.ImageField(upload_to='listings/', null=True, blank=True)

    status = models.CharField(max_length=20, default='ACTIVE')
    featured = models.BooleanField(default=False)
    view_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.title} - {self.price}€'


class ListingView(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-viewed_at']

    def __str__(self):
        return f'View on {self.listing.title}'


class UserProfile(models.Model):
    SELLER_TYPE_CHOICES = [
        ('private', 'Private'),
        ('dealer', 'Dealer'),
    ]

    DEALER_REQUEST_STATUS_CHOICES = [
        ('none', 'None'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=100, blank=True, default='')
    phone = models.CharField(max_length=30, blank=True, default='')
    location = models.CharField(max_length=200, blank=True, default='')

    # Dealer fields
    seller_type = models.CharField(max_length=20, choices=SELLER_TYPE_CHOICES, default='private')
    dealer_request_status = models.CharField(max_length=20, choices=DEALER_REQUEST_STATUS_CHOICES, default='none')
    company_name = models.CharField(max_length=200, blank=True, default='')
    company_image = models.ImageField(upload_to='dealers/', null=True, blank=True)
    max_listings = models.IntegerField(null=True, blank=True, help_text='Custom listing limit. NULL = use default (1 for private, 10 for dealer).')

    def get_listing_limit(self):
        if self.max_listings is not None:
            return self.max_listings
        return 10 if self.seller_type == 'dealer' else 1

    def __str__(self):
        return f'Profile: {self.user.username}'


class ListingLimitRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='limit_requests')
    message = models.TextField()
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('resolved', 'Resolved')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Limit request by {self.user.username}'


class DealerPhone(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='dealer_phones')
    label = models.CharField(max_length=50, blank=True, default='')  # e.g. "Sales", "Service"
    number = models.CharField(max_length=30)

    def __str__(self):
        return f'{self.label}: {self.number}'


class DealerAddress(models.Model):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='dealer_addresses')
    label = models.CharField(max_length=50, blank=True, default='')  # e.g. "Main Office", "Showroom"
    address = models.CharField(max_length=300)

    def __str__(self):
        return f'{self.label}: {self.address}'


class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='listings/')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Image for {self.listing.title}'
