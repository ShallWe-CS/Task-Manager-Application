from rest_framework import serializers
from .models import Task, Board, Column

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'status', 'user']

class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True, source='task_set')  # Use source to access related name

    class Meta:
        model = Column
        fields = ['name', 'board', 'tasks']

class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True, source='column_set')  # Use source to access related name

    class Meta:
        model = Board
        fields = ['name', 'owner', 'columns']