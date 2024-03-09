from rest_framework import status
from ..serializers import TaskSerializer, SubTaskSerializer
from ..models import Task, SubTask
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_task(request):
    # Set the owner of the board to the currently authenticated user
    request.data['created_by'] = request.user.id
    subtasks = request.data['newSubtasks']

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
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_task(request, task_id):
    # Get the task instance based on the provided task_id
    task = get_object_or_404(Task, id=task_id)

    # Check if the user making the request is the owner of the board
    # if request.user != board.owner:
    #     return Response({"detail": "You do not have permission to edit this board."},
    #                     status=status.HTTP_403_FORBIDDEN)

    # Deserialize the request data using the TaskSerializer
    serializer = TaskSerializer(task, data=request.data, partial=True)

    # Validate and save the data if valid
    if serializer.is_valid():
        serializer.save()

        # Handle subtasks data separately
        subtasks = request.data['subtasks']
        new_subtasks = request.data['newSubtasks']
        subtasks_to_delete = request.data['deleteSubtasks']

        # Add new subtasks
        for new_subtask in new_subtasks:
            new_subtask.pop('id', None)  # Remove the 'id' key if it exists
            new_subtask['created_by'] = request.user.id
            subtask_serializer = SubTaskSerializer(data=new_subtask)
            if subtask_serializer.is_valid():
                subtask_serializer.save()
            else:
                return Response(subtask_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Delete columns based on the provided column IDs
        for subtask_to_delete in subtasks_to_delete:
            subtask_id = subtask_to_delete.get('id', None)
            subtask = get_object_or_404(SubTask, id=subtask_id)
            subtask.delete()

        # Update or create subtasks
        for subtask in subtasks:
            subtask_id = subtask.get('id', None)
            if subtask_id:
                # Get the subtask instance based on the provided subtask_id
                subtask_object = get_object_or_404(SubTask, id=subtask_id)

                # Update the subtask data using SubTaskSerializer
                subtask_serializer = SubTaskSerializer(subtask_object, data=subtask, partial=True)
            else:
                # If subtask_id is None, it's a new subtask, create a new subtask
                subtask_serializer = SubTaskSerializer(data=subtask)

            if subtask_serializer.is_valid():
                subtask_serializer.save()
            else:
                return Response(subtask_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task(request, task_id):
    # Get the board instance based on the provided board_id
    task = get_object_or_404(Task, id=task_id)

    # Check if the user making the request is the owner of the board
    # if request.user != task.owner:
    #     return Response({"detail": "You do not have permission to delete this board."},
    #                     status=status.HTTP_403_FORBIDDEN)

    # Delete the board
    task.delete()

    return Response({"detail": "Task deleted successfully."}, status=status.HTTP_204_NO_CONTENT)