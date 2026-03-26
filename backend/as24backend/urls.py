"""
URL configuration for as24backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from listings.views import ListingListCreateView, ListingDetailView, RegisterView, LoginView, AdminListingsView, ToggleFeaturedView, CurrentUserView, BrandAveragePriceView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/listings/', ListingListCreateView.as_view(), name='listings'),
    path('api/listings/<int:pk>/', ListingDetailView.as_view(), name='listing-detail'),

    path('api/auth/register/', RegisterView.as_view(), name='auth-register'),
    path('api/auth/login/', LoginView.as_view(), name='auth-login'),
    path('api/auth/current-user/', CurrentUserView.as_view(), name='current-user'),
    
    # Admin endpoints
    path('api/admin/listings/', AdminListingsView.as_view(), name='admin-listings'),
    path('api/admin/listings/<int:listing_id>/toggle-featured/', ToggleFeaturedView.as_view(), name='toggle-featured'),
    path('api/admin/brand-average-prices/', BrandAveragePriceView.as_view(), name='brand-average-prices'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
