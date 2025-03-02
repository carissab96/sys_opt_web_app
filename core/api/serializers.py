from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from ..models import (
    SystemMetrics, 
    OptimizationProfile, 
    OptimizationResult, 
    SystemAlert,
    UserPreferences,
    UserProfile  # Make sure this is imported
)

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            "operating_system",
            "os_version",
            "linux_distro",
            "linux_distro_version",
            "cpu_cores",
            "total_memory",
        )
        extra_kwargs = {
            "operating_system": {"required": True},
            "os_version": {"required": True},
        }

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        exclude = ('User',)
        read_only_fields = ('id',)

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=True)
    preferences = UserPreferencesSerializer(required=False)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'profile', 'preferences', 'system_id')
        read_only_fields = ('id', 'system_id')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    profile = UserProfileSerializer(required=True)
    preferences = UserPreferencesSerializer(required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 
                 'first_name', 'last_name', 'profile', 'preferences')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'error': 'Passwords do not match',
                'meth_snail_advice': 'Your passwords are in different dimensions, man',
                'hamster_suggestion': 'Try typing with duct tape on your fingers'
            })
        return attrs

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        preferences_data = validated_data.pop('preferences', {})
        validated_data.pop('password_confirm')
        
        # Create user
        user = User.objects.create_user(**validated_data)
        user.system_id = uuid.uuid4()
        user.save()

        # Create profile
        UserProfile.objects.create(user=user, **profile_data)
        
        # Create preferences
        UserPreferences.objects.create(user=user, **preferences_data)
        
        return user

# Your existing model serializers stay the same
class SystemMetricsSerializer(serializers.ModelSerializer):
    additional_metrics = serializers.JSONField(required=False, allow_null=True)
    
    class Meta:
        model = SystemMetrics
        fields = '__all__'

    def validate_additional_metrics(self, value):
        if value is None:
            return {}
        return value

class OptimizationProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptimizationProfile
        fields = '__all__'
        
class OptimizationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptimizationResult
        fields = '__all__'
        
class SystemAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemAlert
        fields = '__all__'