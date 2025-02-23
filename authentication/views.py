from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token

User = get_user_model()

@method_decorator(csrf_protect, name='dispatch')
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return Response({
                'status': 'success',
                'message': 'User created successfully! Sir Hawkington tips his hat to you! 🎩',
                'data': response.data
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({
                'status': 'error',
                'message': 'Registration failed! Sir Hawkington adjusts his monocle in concern 🧐',
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except DjangoValidationError as e:
            return Response({
                'status': 'error',
                'message': 'Invalid data provided! Sir Hawkington suggests a review! 📝',
                'errors': e.messages
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': 'An unexpected error occurred! Even Sir Hawkington is puzzled! 😮',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            return Response({
                'status': 'success',
                'message': 'Login successful! Sir Hawkington welcomes you back! 🦅',
                'data': response.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': 'Invalid credentials! Sir Hawkington cannot verify your papers! 📜',
                'error': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@csrf_protect
def logout(request):
    try:
        # In a JWT setup, we don't need to do anything server-side
        # The client should remove the token
        return Response({
            'status': 'success',
            'message': 'Logout successful! Sir Hawkington bids you farewell! 👋'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': 'Logout failed! Sir Hawkington dropped his monocle in surprise! 😱',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




"""
Copyright © 2024 [Your Name/Company]
All rights reserved.

This source code is proprietary and confidential.
Unauthorized copying, transfer, or reproduction of this file,
via any medium, is strictly prohibited.

Created: 2024-02-22 12:22:22
"""