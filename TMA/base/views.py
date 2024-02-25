from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Task
from .serializers import TaskSerializer
from rest_framework import status

# Create your views here.
@api_view(['GET'])
def get_all_tasks(request):
    # Retrieve all products from the database
    tasks = Task.objects.all()

    # Serialize the products data
    serializer = TaskSerializer(tasks, many=True)

    # Return the serialized data in the response
    return Response(serializer.data)

@api_view(['POST', 'PUT'])
def add_edit_task(request):
    try:
        # Check if task already added
        task_id = request.data.get('id')
        user_id = request.data.get('user_id')
        task = Task.objects.filter(id=task_id).first()

        if task_id:
            # If task exist, update it
            serializer = TaskSerializer(task, data=request.data)
        else:
            # If the user does not have an address, create a new address
            serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user_id=user_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    