from rest_framework import status
from ..serializers import TaskSerializer, SubTaskSerializer
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
    subtasks = request.data['subtasks']

    # Deserialize the request data using the TaskSerializer
    task_serializer = TaskSerializer(data=request.data)

    # Validate and save the data if valid
    if task_serializer.is_valid():
        task_instance = task_serializer.save()

        # Get the ID of the saved task
        task_id = task_instance.id

        # Check if subtasks available, then validate and save
        if (subtasks):
            for subtask in subtasks:
                subtask['created_by'] = request.user.id
                subtask['task'] = task_id

                subtask_serializer = SubTaskSerializer(data=subtask)
                if subtask_serializer.is_valid():
                    subtask_serializer.save()

        return Response(task_serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)