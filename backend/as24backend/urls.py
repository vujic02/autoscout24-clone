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

from listings.views import ListingListCreateView, ListingDetailView, RegisterView, LoginView, AdminListingsView, ToggleFeaturedView, CurrentUserView, BrandAveragePriceView, RecordListingViewAPI, UpdateProfileView, RequestDealerView, AdminDealerRequestsView, AdminHandleDealerRequestView, UpdateDealerProfileView, DealerPhoneView, DealerAddressView, RequestMoreListingsView, AdminListingLimitRequestsView, AdminUpdateListingLimitView, FavoriteListView, FavoriteDeleteView, FavoriteIdsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/listings/', ListingListCreateView.as_view(), name='listings'),
    path('api/listings/<int:pk>/', ListingDetailView.as_view(), name='listing-detail'),
    path('api/listings/<int:pk>/view/', RecordListingViewAPI.as_view(), name='listing-view'),

    path('api/auth/register/', RegisterView.as_view(), name='auth-register'),
    path('api/auth/login/', LoginView.as_view(), name='auth-login'),
    path('api/auth/current-user/', CurrentUserView.as_view(), name='current-user'),
    path('api/auth/profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('api/auth/request-dealer/', RequestDealerView.as_view(), name='request-dealer'),
    path('api/auth/dealer-profile/', UpdateDealerProfileView.as_view(), name='dealer-profile'),
    path('api/auth/dealer-phones/', DealerPhoneView.as_view(), name='dealer-phones'),
    path('api/auth/dealer-addresses/', DealerAddressView.as_view(), name='dealer-addresses'),
    path('api/auth/request-more-listings/', RequestMoreListingsView.as_view(), name='request-more-listings'),
    
    # Admin endpoints
    path('api/admin/listings/', AdminListingsView.as_view(), name='admin-listings'),
    path('api/admin/listings/<int:listing_id>/toggle-featured/', ToggleFeaturedView.as_view(), name='toggle-featured'),
    path('api/admin/brand-average-prices/', BrandAveragePriceView.as_view(), name='brand-average-prices'),
    path('api/admin/dealer-requests/', AdminDealerRequestsView.as_view(), name='admin-dealer-requests'),
    path('api/admin/dealer-requests/<int:user_id>/', AdminHandleDealerRequestView.as_view(), name='admin-handle-dealer-request'),
    path('api/admin/listing-limit-requests/', AdminListingLimitRequestsView.as_view(), name='admin-listing-limit-requests'),
    path('api/admin/users/<int:user_id>/listing-limit/', AdminUpdateListingLimitView.as_view(), name='admin-update-listing-limit'),

    # Favorites
    path('api/favorites/', FavoriteListView.as_view(), name='favorites'),
    path('api/favorites/<int:listing_id>/', FavoriteDeleteView.as_view(), name='favorite-delete'),
    path('api/favorites/ids/', FavoriteIdsView.as_view(), name='favorite-ids'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
