from rest_framework import status
from ..serializers import BoardSerializer
from ..models import Board
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view

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


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_board(request, board_id):
    # Get the board instance based on the provided board_id
    board = get_object_or_404(Board, id=board_id)

    # Check if the user making the request is the owner of the board
    if request.user != board.owner:
        return Response({"detail": "You do not have permission to edit this board."},
                        status=status.HTTP_403_FORBIDDEN)

    # Deserialize the request data using the BoardSerializer
    serializer = BoardSerializer(board, data=request.data, partial=True)

    # Validate and save the data if valid
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)