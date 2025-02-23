from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from .context_manager import ContextManager
from .pattern_learning import PatternLearner, ResourceOptimizer
import numpy as np
import logging

logger = logging.getLogger(__name__)

class ContextViewSet(viewsets.ViewSet):
    """ViewSet for context synchronization and pattern learning"""
    permission_classes = [IsAuthenticated]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.context_manager = ContextManager()
        self.pattern_learner = PatternLearner()
        self.resource_optimizer = ResourceOptimizer()
    
    @action(detail=False, methods=['POST'])
    def update_context(self, request):
        """Update context for current platform"""
        try:
            user_id = str(request.user.id)
            platform_id = request.data.get('platform_id')
            context_data = request.data.get('context_data', {})
            
            if not platform_id:
                return Response(
                    {'error': 'Platform ID required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update context
            shared_context = self.context_manager.update_context(
                user_id=user_id,
                platform_id=platform_id,
                context_data=context_data
            )
            
            # Learn patterns if context vector available
            if shared_context.context_vector is not None:
                patterns = self.pattern_learner.learn_temporal_patterns(
                    user_id=user_id,
                    context_vector=shared_context.context_vector
                )
                
                # Update learned patterns
                for pattern_name, pattern_value in patterns.items():
                    shared_context.learn_pattern(pattern_name, pattern_value)
                
                # Calculate optimizations
                current_usage = {
                    'cpu': np.mean(context_data.get('cpu_usage', [0])),
                    'memory': np.mean(context_data.get('memory_usage', [0]))
                }
                
                optimization_suggestions = self.resource_optimizer.suggest_optimizations(
                    patterns=patterns,
                    current_usage=current_usage
                )
            else:
                patterns = {}
                optimization_suggestions = []
            
            return Response({
                'status': 'success',
                'patterns': patterns,
                'optimizations': optimization_suggestions
            })
            
        except Exception as e:
            logger.error(f"Error updating context: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['POST'])
    def sync_platforms(self, request):
        """Synchronize context between platforms"""
        try:
            user_id = str(request.user.id)
            other_platform_id = request.data.get('other_platform_id')
            
            if not other_platform_id:
                return Response(
                    {'error': 'Other platform ID required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generate sync token
            sync_token = f"{user_id}_{other_platform_id}"
            
            # Export context for sync
            context_json = self.context_manager.export_context(user_id)
            if context_json:
                # Store in cache for other platform to retrieve
                cache.set(sync_token, context_json, timeout=3600)  # 1 hour timeout
                
                return Response({
                    'status': 'success',
                    'sync_token': sync_token
                })
            else:
                return Response(
                    {'error': 'No context available for sync'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
        except Exception as e:
            logger.error(f"Error syncing platforms: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['POST'])
    def import_context(self, request):
        """Import context from other platform"""
        try:
            user_id = str(request.user.id)
            sync_token = request.data.get('sync_token')
            
            if not sync_token:
                return Response(
                    {'error': 'Sync token required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Retrieve context from cache
            context_json = cache.get(sync_token)
            if context_json:
                # Import context
                shared_context = self.context_manager.import_context(
                    user_id=user_id,
                    context_json=context_json
                )
                
                return Response({
                    'status': 'success',
                    'context_imported': True
                })
            else:
                return Response(
                    {'error': 'Sync token expired or invalid'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
        except Exception as e:
            logger.error(f"Error importing context: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
