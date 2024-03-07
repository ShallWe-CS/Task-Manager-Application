from rest_framework import status
from ..serializers import TaskSerializer
from ..models import Board, Column
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_task(request):
    # Set the owner of the board to the currently authenticated user
    request.data['created_by'] = request.user.id

    # Deserialize the request data using the TaskSerializer
    serializer = TaskSerializer(data=request.data)

    # Validate and save the data if valid
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)