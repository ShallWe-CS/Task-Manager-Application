from rest_framework import status
from ..serializers import SubTaskSerializer
from ..models import Board, Column, SubTask
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_subtask(request):
    # Set the owner of the board to the currently authenticated user
    request.data['created_by'] = request.user.id

    # Deserialize the request data using the TaskSerializer
    serializer = SubTaskSerializer(data=request.data)

    # Validate and save the data if valid
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_subtask(request):
    subtasks_data  = request.data['subtasks']

    for subtask_data in subtasks_data:
            subtask_id = subtask_data.get('id')
            subtask_object = get_object_or_404(SubTask, id=subtask_id)

            # Deserialize the request data using the SubTaskSerializer
            serializer = SubTaskSerializer(subtask_object, data=subtask_data, partial=True)

            # Validate and save the data if valid
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({'message': 'Subtasks updated successfully'}, status=status.HTTP_200_OK)