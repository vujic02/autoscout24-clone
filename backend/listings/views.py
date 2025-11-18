from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Listing
from .serializers import ListingSerializer

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

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

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
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'detail': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)

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
            }
        )
