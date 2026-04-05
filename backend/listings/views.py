from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.db import models
from .models import Listing, ListingImage, ListingView, UserProfile, DealerPhone, DealerAddress, ListingLimitRequest, Favorite
from .serializers import ListingSerializer, ListingImageSerializer, UserProfileSerializer, DealerPhoneSerializer, DealerAddressSerializer

MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_IMAGES_PER_LISTING = 20
ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/webp', 'image/avif'}


def validate_uploaded_images(files):
    """Validate image uploads for type, size, and count."""
    if len(files) > MAX_IMAGES_PER_LISTING:
        from rest_framework.exceptions import ValidationError
        raise ValidationError(f'Maximum {MAX_IMAGES_PER_LISTING} images allowed per listing.')
    for f in files:
        if f.content_type not in ALLOWED_IMAGE_TYPES:
            from rest_framework.exceptions import ValidationError
            raise ValidationError(f'Invalid image type: {f.content_type}. Allowed: JPEG, PNG, WebP, AVIF.')
        if f.size > MAX_IMAGE_SIZE:
            from rest_framework.exceptions import ValidationError
            raise ValidationError(f'Image {f.name} exceeds 5MB limit.')


def get_user_response_data(user):
    """Build a consistent user data dict including profile and listing quota."""
    profile, _ = UserProfile.objects.get_or_create(user=user)
    active_count = Listing.objects.filter(user=user, status='ACTIVE').count()
    limit = profile.get_listing_limit()

    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
        'profile': {
            'display_name': profile.display_name,
            'phone': profile.phone,
            'location': profile.location,
            'seller_type': profile.seller_type,
            'dealer_request_status': profile.dealer_request_status,
            'company_name': profile.company_name,
            'company_image': profile.company_image.url if profile.company_image else None,
        },
        'listing_quota': {
            'max': None if user.is_staff else limit,
            'used': active_count,
            'remaining': None if user.is_staff else max(0, limit - active_count),
        },
    }

    # Include dealer details if user is an approved dealer
    if profile.seller_type == 'dealer':
        data['profile']['dealer_phones'] = DealerPhoneSerializer(profile.dealer_phones.all(), many=True).data
        data['profile']['dealer_addresses'] = DealerAddressSerializer(profile.dealer_addresses.all(), many=True).data

    return data


class CurrentUserView(APIView):
    """Get current authenticated user's info, including verified admin status"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(get_user_response_data(request.user))

class ListingListCreateView(generics.ListCreateAPIView):
    serializer_class = ListingSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        queryset = Listing.objects.all().order_by('-created_at')

        params = self.request.query_params

        make = params.get('make', '')
        model = params.get('model', '')
        price = params.get('price', '')          # max cena
        registration = params.get('registration', '')
        country = params.get('country', '')
        featured = params.get('featured', '')
        fuel_type = params.get('fuel_type', '')
        body_type = params.get('body_type', '')

        if make:
            queryset = queryset.filter(make__icontains=make)

        if model:
            queryset = queryset.filter(model__icontains=model)

        if price:
            queryset = queryset.filter(price__lte=price)

        if registration:
            queryset = queryset.filter(registration_year=registration)

        if country:
            queryset = queryset.filter(country__icontains=country)

        if featured:
            queryset = queryset.filter(featured=True)

        seller = params.get('seller', '')
        if seller:
            queryset = queryset.filter(user__username=seller)

        if fuel_type:
            queryset = queryset.filter(fuel_type__iexact=fuel_type)

        if body_type:
            queryset = queryset.filter(body_type__iexact=body_type)

        transmission = params.get('transmission', '')
        if transmission:
            queryset = queryset.filter(transmission__iexact=transmission)

        drive_type = params.get('drive_type', '')
        if drive_type:
            queryset = queryset.filter(drive_type__iexact=drive_type)

        exterior_color = params.get('exterior_color', '')
        if exterior_color:
            queryset = queryset.filter(exterior_color__iexact=exterior_color)

        mileage_from = params.get('mileage_from', '')
        if mileage_from:
            queryset = queryset.filter(mileage__gte=int(mileage_from))

        mileage_to = params.get('mileage_to', '')
        if mileage_to:
            queryset = queryset.filter(mileage__lte=int(mileage_to))

        hp_from = params.get('hp_from', '')
        if hp_from:
            queryset = queryset.filter(horsepower__gte=int(hp_from))

        hp_to = params.get('hp_to', '')
        if hp_to:
            queryset = queryset.filter(horsepower__lte=int(hp_to))

        min_doors = params.get('min_doors', '')
        if min_doors:
            queryset = queryset.filter(number_of_doors__gte=int(min_doors))

        # Sorting
        sort = params.get('sort', '')
        sort_map = {
            'price_asc': 'price',
            'price_desc': '-price',
            'newest': '-created_at',
            'mileage_asc': 'mileage',
            'year_desc': '-registration_year',
        }
        if sort and sort in sort_map:
            queryset = queryset.order_by(sort_map[sort])

        return queryset

    def create(self, request, *args, **kwargs):
        user = request.user
        if not user.is_staff:
            profile, _ = UserProfile.objects.get_or_create(user=user)
            limit = profile.get_listing_limit()
            active_count = Listing.objects.filter(user=user, status='ACTIVE').count()
            if active_count >= limit:
                return Response(
                    {'detail': f'You can only have {limit} active listing(s). Please remove or deactivate a listing before adding another.'},
                    status=status.HTTP_403_FORBIDDEN,
                )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        images = self.request.FILES.getlist('images')
        validate_uploaded_images(images)
        listing = serializer.save(user=self.request.user, seller_type=profile.seller_type)
        
        # Handle multiple images
        for image in images:
            ListingImage.objects.create(listing=listing, image=image)

class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsAuthenticated()]

    def get_object(self):
        obj = super().get_object()
        if self.request.method in ('PUT', 'PATCH', 'DELETE'):
            if obj.user != self.request.user and not self.request.user.is_staff:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied('You can only modify your own listings.')
        return obj

    def perform_update(self, serializer):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        images = self.request.FILES.getlist('images')
        if images:
            validate_uploaded_images(images)
        listing = serializer.save(seller_type=profile.seller_type)
        
        # Handle multiple images on update
        if images:
            for image in images:
                ListingImage.objects.create(listing=listing, image=image)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'detail': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'detail': 'Username already taken.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        # Create profile with optional contact fields
        display_name = request.data.get('display_name', '')
        phone = request.data.get('phone', '')
        location = request.data.get('location', '')
        UserProfile.objects.create(
            user=user,
            display_name=display_name,
            phone=phone,
            location=location,
        )

        token, _ = Token.objects.get_or_create(user=user)
        data = get_user_response_data(user)
        data['token'] = token.key
        return Response(data, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Accept either username or email
        login_field = username or email

        if not login_field or not password:
            return Response(
                {'detail': 'Username/email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Try to authenticate with username first, then email
        user = authenticate(username=login_field, password=password)
        
        if not user:
            # Try to find user by email and authenticate
            try:
                user_by_email = User.objects.get(email=login_field)
                user = authenticate(username=user_by_email.username, password=password)
            except User.DoesNotExist:
                pass

        if not user:
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token, _ = Token.objects.get_or_create(user=user)

        data = get_user_response_data(user)
        data['token'] = token.key
        return Response(data)


class AdminListingsView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        # Only staff/admin users can view all listings
        if not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You do not have permission to view this.')

        queryset = Listing.objects.all().order_by('-created_at')
        params = self.request.query_params

        listing_id = params.get('id', '')
        make = params.get('make', '')
        model = params.get('model', '')

        if listing_id:
            try:
                queryset = queryset.filter(id=int(listing_id))
            except (ValueError, TypeError):
                queryset = queryset.none()

        if make:
            queryset = queryset.filter(make__icontains=make)

        if model:
            queryset = queryset.filter(model__icontains=model)

        return queryset


class ToggleFeaturedView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, listing_id):
        # Only staff/admin users can toggle featured
        if not request.user.is_staff:
            return Response(
                {'detail': 'You do not have permission to perform this action.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            listing = Listing.objects.get(id=listing_id)
            listing.featured = not listing.featured
            listing.save()
            serializer = ListingSerializer(listing)
            return Response(serializer.data)
        except Listing.DoesNotExist:
            return Response(
                {'detail': 'Listing not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )


class UpdateProfileView(APIView):
    """Update the current user's profile (display_name, phone, location)"""
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(get_user_response_data(request.user))


class BrandAveragePriceView(APIView):
    """Get average price for each brand across all listings"""
    permission_classes = [AllowAny]

    def get(self, request):
        from django.db.models import Avg, Count
        
        # Get all brands with their average price and count
        brand_stats = Listing.objects.values('make').annotate(
            average_price=Avg('price'),
            count=Count('id')
        ).order_by('-count')
        
        # Format the response
        data = [
            {
                'make': item['make'],
                'average_price': int(item['average_price']) if item['average_price'] else 0,
                'count': item['count']
            }
            for item in brand_stats
        ]
        
        return Response(data)


class RecordListingViewAPI(APIView):
    """Record a unique view on a listing (1 per user/IP per 24h)"""
    permission_classes = [AllowAny]

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')

    def post(self, request, pk):
        from django.utils import timezone
        from datetime import timedelta

        try:
            listing = Listing.objects.get(pk=pk)
        except Listing.DoesNotExist:
            return Response(
                {'detail': 'Listing not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        cutoff = timezone.now() - timedelta(hours=24)
        user = request.user if request.user.is_authenticated else None
        ip = self.get_client_ip(request)

        # Check for existing view within 24h
        if user:
            already_viewed = ListingView.objects.filter(
                listing=listing, user=user, viewed_at__gte=cutoff
            ).exists()
        else:
            already_viewed = ListingView.objects.filter(
                listing=listing, user__isnull=True, ip_address=ip, viewed_at__gte=cutoff
            ).exists()

        if not already_viewed:
            ListingView.objects.create(listing=listing, user=user, ip_address=ip)
            Listing.objects.filter(pk=pk).update(view_count=models.F('view_count') + 1)
            listing.refresh_from_db(fields=['view_count'])

        return Response({'view_count': listing.view_count})


class RequestDealerView(APIView):
    """Request dealer account status"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.seller_type == 'dealer':
            return Response({'detail': 'You are already a dealer.'}, status=status.HTTP_400_BAD_REQUEST)
        if profile.dealer_request_status == 'pending':
            return Response({'detail': 'You already have a pending dealer request.'}, status=status.HTTP_400_BAD_REQUEST)
        profile.dealer_request_status = 'pending'
        profile.save(update_fields=['dealer_request_status'])
        return Response(get_user_response_data(request.user))


class AdminDealerRequestsView(APIView):
    """List all pending dealer requests (admin only)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        pending = UserProfile.objects.filter(dealer_request_status='pending').select_related('user')
        data = [
            {
                'user_id': p.user.id,
                'username': p.user.username,
                'email': p.user.email,
                'display_name': p.display_name,
                'phone': p.phone,
                'location': p.location,
            }
            for p in pending
        ]
        return Response(data)


class AdminHandleDealerRequestView(APIView):
    """Approve or reject a dealer request (admin only)"""
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        if not request.user.is_staff:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        action = request.data.get('action')  # 'approve' or 'reject'
        if action not in ('approve', 'reject'):
            return Response({'detail': 'Invalid action. Use "approve" or "reject".'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile = UserProfile.objects.select_related('user').get(user_id=user_id)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if profile.dealer_request_status != 'pending':
            return Response({'detail': 'No pending request for this user.'}, status=status.HTTP_400_BAD_REQUEST)

        if action == 'approve':
            profile.seller_type = 'dealer'
            profile.dealer_request_status = 'approved'
        else:
            profile.dealer_request_status = 'rejected'

        profile.save(update_fields=['seller_type', 'dealer_request_status'])
        return Response({'detail': f'Dealer request {action}d.', 'seller_type': profile.seller_type, 'dealer_request_status': profile.dealer_request_status})


class UpdateDealerProfileView(APIView):
    """Update dealer-specific profile fields (company name, image, phones, addresses)"""
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.seller_type != 'dealer':
            return Response({'detail': 'Only dealers can update dealer profile.'}, status=status.HTTP_403_FORBIDDEN)

        # Update company name
        if 'company_name' in request.data:
            profile.company_name = request.data['company_name']

        # Update company image
        if 'company_image' in request.FILES:
            profile.company_image = request.FILES['company_image']

        profile.save()
        return Response(get_user_response_data(request.user))


class DealerPhoneView(APIView):
    """Manage dealer phone numbers"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.seller_type != 'dealer':
            return Response({'detail': 'Only dealers can manage dealer phones.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = DealerPhoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(profile=profile)
        return Response(get_user_response_data(request.user), status=status.HTTP_201_CREATED)

    def delete(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.seller_type != 'dealer':
            return Response({'detail': 'Only dealers can manage dealer phones.'}, status=status.HTTP_403_FORBIDDEN)
        phone_id = request.data.get('id')
        try:
            phone = DealerPhone.objects.get(id=phone_id, profile=profile)
            phone.delete()
            return Response(get_user_response_data(request.user))
        except DealerPhone.DoesNotExist:
            return Response({'detail': 'Phone not found.'}, status=status.HTTP_404_NOT_FOUND)


class DealerAddressView(APIView):
    """Manage dealer addresses"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.seller_type != 'dealer':
            return Response({'detail': 'Only dealers can manage dealer addresses.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = DealerAddressSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(profile=profile)
        return Response(get_user_response_data(request.user), status=status.HTTP_201_CREATED)

    def delete(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.seller_type != 'dealer':
            return Response({'detail': 'Only dealers can manage dealer addresses.'}, status=status.HTTP_403_FORBIDDEN)
        address_id = request.data.get('id')
        try:
            address = DealerAddress.objects.get(id=address_id, profile=profile)
            address.delete()
            return Response(get_user_response_data(request.user))
        except DealerAddress.DoesNotExist:
            return Response({'detail': 'Address not found.'}, status=status.HTTP_404_NOT_FOUND)


class RequestMoreListingsView(APIView):
    """Dealer requests more listing slots with a message"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if profile.seller_type != 'dealer':
            return Response({'detail': 'Only dealers can request more listings.'}, status=status.HTTP_403_FORBIDDEN)

        message = request.data.get('message', '').strip()
        if not message:
            return Response({'detail': 'Please provide a message explaining why you need more listings.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check for existing pending request
        if ListingLimitRequest.objects.filter(user=request.user, status='pending').exists():
            return Response({'detail': 'You already have a pending request.'}, status=status.HTTP_400_BAD_REQUEST)

        ListingLimitRequest.objects.create(user=request.user, message=message)
        return Response({'detail': 'Your request has been submitted.'}, status=status.HTTP_201_CREATED)


class AdminListingLimitRequestsView(APIView):
    """List pending listing limit requests (admin only)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        pending = ListingLimitRequest.objects.filter(status='pending').select_related('user', 'user__profile')
        data = []
        for req in pending:
            profile, _ = UserProfile.objects.get_or_create(user=req.user)
            data.append({
                'id': req.id,
                'user_id': req.user.id,
                'username': req.user.username,
                'email': req.user.email,
                'display_name': profile.display_name,
                'company_name': profile.company_name,
                'current_limit': profile.get_listing_limit(),
                'message': req.message,
                'created_at': req.created_at.isoformat(),
            })
        return Response(data)


class AdminUpdateListingLimitView(APIView):
    """Admin sets a user's listing limit and resolves the request"""
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        if not request.user.is_staff:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        new_limit = request.data.get('max_listings')
        if new_limit is None:
            return Response({'detail': 'max_listings is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            new_limit = int(new_limit)
            if new_limit < 0:
                raise ValueError
        except (ValueError, TypeError):
            return Response({'detail': 'max_listings must be a non-negative integer.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile = UserProfile.objects.get(user_id=user_id)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        profile.max_listings = new_limit
        profile.save(update_fields=['max_listings'])

        # Resolve any pending requests for this user
        ListingLimitRequest.objects.filter(user_id=user_id, status='pending').update(status='resolved')

        return Response({
            'detail': f'Listing limit updated to {new_limit}.',
            'user_id': user_id,
            'max_listings': new_limit,
        })


class FavoriteListView(APIView):
    """List user's favorites and add a favorite"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user).select_related('listing')
        listing_ids = list(favorites.values_list('listing_id', flat=True))
        listings = Listing.objects.filter(id__in=listing_ids).order_by('-favorited_by__created_at')
        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)

    def post(self, request):
        listing_id = request.data.get('listing_id')
        if not listing_id:
            return Response(
                {'detail': 'listing_id is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return Response(
                {'detail': 'Listing not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        _, created = Favorite.objects.get_or_create(user=request.user, listing=listing)
        if not created:
            return Response({'detail': 'Already in favorites.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Added to favorites.'}, status=status.HTTP_201_CREATED)


class FavoriteDeleteView(APIView):
    """Remove a listing from favorites"""
    permission_classes = [IsAuthenticated]

    def delete(self, request, listing_id):
        deleted, _ = Favorite.objects.filter(user=request.user, listing_id=listing_id).delete()
        if not deleted:
            return Response(
                {'detail': 'Favorite not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class FavoriteIdsView(APIView):
    """Get list of favorited listing IDs for the current user"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ids = list(Favorite.objects.filter(user=request.user).values_list('listing_id', flat=True))
        return Response(ids)
