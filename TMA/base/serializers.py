from rest_framework import serializers
from .models import Task, Board, Column, CustomUser, SubTask

class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = ['id', 'title', 'is_completed', 'task', 'created_by']

class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubTaskSerializer(many=True, read_only=True, source='subtask_set')  # Use source to access related name

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'created_by', 'assigned_to', 'board', 'column', 'subtasks']

class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True, source='task_set')  # Use source to access related name

    class Meta:
        model = Column
        fields = ['id', 'name', 'board', 'tasks']

class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True, source='column_set')  # Use source to access related name

    class Meta:
        model = Board
        fields = ['id', 'name', 'owner', 'columns']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']