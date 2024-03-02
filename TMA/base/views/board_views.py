from rest_framework import viewsets
from ..serializers import BoardSerializer
from ..models import Board
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, permission_classes, api_view

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def boards_by_owner(request):
    # Get the currently authenticated user
    owner = request.user

    # Retrieve all boards owned by the user
    owned_boards = Board.objects.filter(owner=owner)

    # Serialize the boards
    serializer = BoardSerializer(owned_boards, many=True)

    # Return the serialized data as a response
    return Response(serializer.data)