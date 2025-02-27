from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import SystemMetrics, OptimizationProfile, SystemAlert
from .recommendations import RecommendationsEngine
from django.http import JsonResponse

@login_required
def dashboard(request):
    """Render the dashboard page.
    
    Args:
        request: The HTTP request object
    Returns:
        Rendered dashboard page template
    """
    # Get latest metrics
    try:
        latest_metrics = SystemMetrics.objects.order_by('-timestamp').first()
    except Exception as e:
        return JsonResponse({
            'error': 'Failed to retrieve metrics',
            'details': str(e)
        }, status=500)

    # Initialize recommendations engine
    engine = RecommendationsEngine()

    # Get recommendations if metrics exist
    recommendations_summary = None
    if latest_metrics:
        try:
            recommendations_summary = engine.get_optimization_summary(latest_metrics)
        except Exception as e:
            return JsonResponse({
                'error': 'Failed to generate recommendations',
                'details': str(e)
            }, status=500)

    context = {
        'metrics': SystemMetrics.objects.all().order_by('-timestamp')[:5],
        'profiles': OptimizationProfile.objects.filter(user=request.user),
        'alerts': SystemAlert.objects.filter(user=request.user).order_by('-timestamp')[:5],
        'user_preferences': request.user.optimization_preferences,
        'recommendations': recommendations_summary,  # Pass the summary
        'latest_metrics': latest_metrics
    }
    return render(request, 'core/dashboard.html', context)

def home(request):
    """Render the home page.
    
    Args:
        request: The HTTP request object
    Returns:
        Rendered home page template
    """
    return render(request, 'core/home.html')

def test_data(request):
    """API endpoint to fetch system metrics, profiles and alerts.
    
    Args:
        request: The HTTP request object
    Returns:
        JsonResponse containing paginated system data
    """
    try:
        # Get page parameters
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))
        
        # Calculate offset
        offset = (page - 1) * page_size
        limit = offset + page_size
        
        # Fetch data with pagination
        data = {
            'metrics': list(SystemMetrics.objects.order_by('-timestamp')[offset:limit].values()),
            'profiles': list(OptimizationProfile.objects.select_related('user')[offset:limit].values()),
            'alerts': list(SystemAlert.objects.order_by('-created_at')[offset:limit].values())
        }
        
        # Add pagination metadata
        data['pagination'] = {
            'page': page,
            'page_size': page_size,
            'total_metrics': SystemMetrics.objects.count(),
            'total_profiles': OptimizationProfile.objects.count(),
            'total_alerts': SystemAlert.objects.count()
        }
        
        return JsonResponse(data, safe=False)
        
    except (ValueError, TypeError) as e:
        return JsonResponse({
            'error': 'Invalid pagination parameters',
            'details': str(e)
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'error': 'Internal server error',
            'details': str(e)
        }, status=500)

def error_403(request, exception):
    return JsonResponse({
        'error': 'Forbidden',
        'code': 403,
        'message': 'Access denied by aristocratic decree',
        'meth_snail_advice': 'Try adding more tinfoil to your hat',
        'hamster_suggestion': 'Have you tried duct tape?',
        'shadow_people': 'We blocked this through your router',
        'VIC20_status': 'SHALL WE PLAY A GAME INSTEAD?'
    }, status=403)

def error_404(request, exception):
    return JsonResponse({
        'error': 'Not Found',
        'code': 404,
        'message': 'Page has ascended to a higher plane of existence',
        'meth_snail_location': 'Check the lawn mower shop',
        'hamster_status': 'Too busy buying more duct tape',
        'shadow_people': 'We might have redirected this through 1983',
        'stick_anxiety': 'REGULATIONS VIOLATED!'
    }, status=404)

def error_500(request):
    return JsonResponse({
        'error': 'Server Error',
        'code': 500,
        'message': 'The server is having an existential crisis',
        'meth_snail_diagnosis': 'Server needs more meth',
        'hamster_solution': 'Applied emergency duct tape',
        'shadow_people': 'Have you tried turning your router off and on again?',
        'ET_status': 'Still trying to phone home',
        'stick_status': 'Writing new chapters about this incident'
    }, status=500)