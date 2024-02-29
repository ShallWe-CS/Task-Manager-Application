from rest_framework import serializers
from .models import Task, Board, Column

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'status', 'user']

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['name', 'owner']

class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = ['name', 'board']
