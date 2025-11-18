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

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')

    title = models.CharField(max_length=255)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    year = models.IntegerField()              
    registration_year = models.IntegerField() 

    mileage = models.IntegerField()
    price = models.IntegerField()

    fuel_type = models.CharField(max_length=20, choices=FUEL_CHOICES)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    description = models.TextField(blank=True, null=True)
    main_image = models.ImageField(upload_to='listings/', null=True, blank=True)

    status = models.CharField(max_length=20, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.title} - {self.price}€'
