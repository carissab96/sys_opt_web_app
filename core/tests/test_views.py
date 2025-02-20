# core/views.py
from django.http import JsonResponse
from .models import SystemMetrics, OptimizationProfile, SystemAlert

def test_data(request):
    data = {
        'metrics': list(SystemMetrics.objects.values()),
        'profiles': list(OptimizationProfile.objects.values()),
        'alerts': list(SystemAlert.objects.values())
    }
    return JsonResponse(data, safe=False)

