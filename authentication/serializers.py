from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserProfile

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('operating_system', 'os_version', 'linux_distro', 'linux_distro_version',
                'cpu_cores', 'total_memory')
        extra_kwargs = {
            'operating_system': {'required': True},
            'os_version': {'required': True}
        }

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    profile = UserProfileSerializer(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'profile')
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match. Sir Hawkington disapproves! 🧐"}
            )
        return attrs

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        validated_data.pop('password2')
        
        # Create the user first
        user = User.objects.create_user(**validated_data)
        
        # Update the automatically created profile with the provided data
        profile = user.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()
        
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['email'] = self.user.email
        return data
