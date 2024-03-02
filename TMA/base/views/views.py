from ..models import Task, Board, Column,CustomUser
from ..serializers import TaskSerializer, BoardSerializer, ColumnSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, permission_classes, api_view
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions

# Create your views here.
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow read-only access for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if the user making the request is the owner of the board
        return obj.owner == request.user

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    
class ColumnViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def boards_by_owner(request):
    routes = [
        'api/token',
        'api/token/refresh'
    ]
    return Response(routes)