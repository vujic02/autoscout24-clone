from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Listing, ListingImage
from .serializers import ListingSerializer, ListingImageSerializer

class CurrentUserView(APIView):
    """Get current authenticated user's info, including verified admin status"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
        })

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

        return queryset

    def perform_create(self, serializer):
        listing = serializer.save(user=self.request.user)
        
        # Handle multiple images
        images = self.request.FILES.getlist('images')
        for image in images:
            ListingImage.objects.create(listing=listing, image=image)

class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsAuthenticated()]

    def perform_update(self, serializer):
        listing = serializer.save()
        
        # Handle multiple images on update
        images = self.request.FILES.getlist('images')
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

        # automatski napravi token za novog user-a
        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'token': token.key,
            },
            status=status.HTTP_201_CREATED,
        )

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

        return Response(
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'token': token.key,
                'is_staff': user.is_staff,
            }
        )


class AdminListingsView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only staff/admin users can view all listings
        if not self.request.user.is_staff:
            return Listing.objects.none()
        return Listing.objects.all().order_by('-created_at')


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
