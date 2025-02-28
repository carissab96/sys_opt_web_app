from rest_framework import viewsets, permissions, status
from ..models import SystemMetrics, OptimizationProfile, OptimizationResult, SystemAlert
from .serializers import SystemMetricsSerializer, OptimizationProfileSerializer, OptimizationResultSerializer, SystemAlertSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from core.optimization.auto_tuner import AutoTuner
from core.optimization.web_auto_tuner import WebAutoTuner
from asgiref.sync import async_to_sync
from functools import wraps

class SystemMetricsViewSet(viewsets.ModelViewSet):
    queryset = SystemMetrics.objects.all()
    serializer_class = SystemMetricsSerializer
    permission_classes = [permissions.IsAuthenticated]  # Sir Hawkington maintains proper security decorum

class OptimizationProfileViewSet(viewsets.ModelViewSet):
    queryset = OptimizationProfile.objects.all()
    serializer_class = OptimizationProfileSerializer
    permission_classes = [permissions.IsAuthenticated]  # Sir Hawkington maintains proper security decorum

class OptimizationResultViewSet(viewsets.ModelViewSet):
    queryset = OptimizationResult.objects.all()
    serializer_class = OptimizationResultSerializer
    permission_classes = [permissions.IsAuthenticated]  # Sir Hawkington maintains proper security decorum

class SystemAlertViewSet(viewsets.ModelViewSet):
    queryset = SystemAlert.objects.all()
    serializer_class = SystemAlertSerializer
    permission_classes = [permissions.IsAuthenticated]  # Sir Hawkington maintains proper security decorum

def async_view(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        return async_to_sync(func)(*args, **kwargs)
    return wrapped

# core/api/views.py

class AutoTuningViewSet(viewsets.ViewSet):
    """ViewSet for system auto-tuning operations.
    
    Provides endpoints for monitoring system state, getting optimization
    recommendations, and applying tuning actions. Uses WebAutoTuner for
    web-specific optimizations.
    """
    
    permission_classes = [permissions.IsAuthenticated]  # Sir Hawkington maintains proper security decorum

    def get_tuner(self):
        """Get a new instance of WebAutoTuner.
        
        Returns:
            WebAutoTuner: A new tuner instance for this request
        """
        return WebAutoTuner()

    @action(detail=False, methods=['get'])
    @async_view
    async def current_state(self, request):
        """Get current system metrics and state.
        
        Returns:
            Response: Current system metrics including CPU, memory, and disk usage
        """
        try:
            tuner = self.get_tuner()
            state = await tuner._get_system_state()
            if not state:
                return Response(
                    {'error': 'No metrics available'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response(state)
        except Exception as e:
            return Response(
                {'error': f'Failed to get system state: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    @async_view
    async def recommendations(self, request):
        """Get system optimization recommendations.
        
        Returns:
            Response: List of tuning recommendations with confidence scores
        """
        try:
            tuner = self.get_tuner()
            # Get page parameters
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 5))
            
            recs = await tuner._get_recommendations()
            
            # Calculate pagination
            start_idx = (page - 1) * page_size
            end_idx = start_idx + page_size
            paginated_recs = recs[start_idx:end_idx]
            
            response_data = {
                'recommendations': [tuner._tuning_to_dict(r) for r in paginated_recs],
                'pagination': {
                    'page': page,
                    'page_size': page_size,
                    'total_recommendations': len(recs)
                }
            }
            return Response(response_data)
        except ValueError as e:
            return Response(
                {'error': f'Invalid pagination parameters: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to get recommendations: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    @async_view
    async def apply_tuning(self, request):
        """Apply a tuning recommendation.
        
        Args:
            request: Request object containing tuning parameters
            
        Returns:
            Response: Result of applying the tuning action
        """
        try:
            tuner = self.get_tuner()
            if not request.data:
                return Response(
                    {'error': 'No tuning data provided'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Add user context to the tuning data
            tuning_data = request.data.copy()
            tuning_data['user_id'] = request.user.id
                
            # Apply the tuning
            result = await tuner._apply_tuning(tuning_data)
            if not result:
                return Response(
                    {'error': 'Failed to apply tuning'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Convert result to dict for response
            response_data = {
                'id': str(result.id),
                'timestamp': result.timestamp.isoformat(),
                'actions_taken': result.actions_taken,
                'metrics': {
                    'before': result.metrics_before,
                    'after': result.metrics_after
                },
                'success': result.success,
                'error_message': result.error_message
            }
            
            return Response(response_data)
        except Exception as e:
            return Response(
                {'error': f'Error applying tuning: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def list(self, request):
        """List available auto-tuning endpoints.
        
        Returns:
            Response: Dictionary of available endpoints and their URLs
        """
        return Response({
            'endpoints': {
                'current_state': '/api/auto-tuning/current_state/',
                'recommendations': '/api/auto-tuning/recommendations/',
                'apply_tuning': '/api/auto-tuning/apply_tuning/'
            },
            'documentation': {
                'current_state': 'Get current system metrics and state',
                'recommendations': 'Get system optimization recommendations with pagination',
                'apply_tuning': 'Apply a specific tuning recommendation'
            },
            'version': 'web-auto-tuner-1.0'
        })

'''
# core/api/views.py

from rest_framework.decorators import action
from rest_framework.response import Response
from core.optimization.web_auto_tuner import WebAutoTuner
from asgiref.sync import async_to_sync
from functools import wraps

class AutoTuningViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    @async_view
    async def current_state(self, request):
        tuner = WebAutoTuner()
        state = await tuner._get_system_state()
        return Response(state)

    @action(detail=False, methods=['get'])
    @async_view
    async def recommendations(self, request):
        tuner = WebAutoTuner()
        recs = await tuner.get_tuning_recommendations()
        return Response([tuner._tuning_to_dict(r) for r in recs])

    @action(detail=False, methods=['post'])
    @async_view
    async def apply_tuning  (self, request):
        tuner = WebAutoTuner()
        result = await tuner.apply_tuning(request.data)
        return Response({'success': result})
        '''




