from django.forms import ValidationError
from rest_framework import status
from ..serializers import BoardSerializer, ColumnSerializer
from ..models import Board, Column
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all(request):
    # Get the currently authenticated user
    owner = request.user

    # Retrieve all boards owned by the user
    owned_boards = Board.objects.filter(owner=owner)

    # Serialize the boards
    serializer = BoardSerializer(owned_boards, many=True)

    # Return the serialized data as a response
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_board(request):
    # Set the owner of the board to the currently authenticated user
    request.data['owner'] = request.user.id

    # Deserialize the request data using the BoardSerializer
    serializer = BoardSerializer(data=request.data)

    # Validate and save the data if valid
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

        # Handle column data separately
        columns_data = request.data.get('columns', [])
        new_columns = request.data['newColumns']
        columns_to_delete = request.data.get('deleteColumns', [])

        # Delete columns based on the provided column IDs
        delete_columns(columns_to_delete)
        update_or_create_columns(columns_data)
        create_new_columns(new_columns, request.user)

        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

def create_new_columns(new_columns, user):
    for new_column in new_columns:
        new_column.pop('id', None)  # Remove the 'id' key if it exists
        new_column['created_by'] = user.id
        column_serializer = ColumnSerializer(data=new_column)
        if column_serializer.is_valid():
            column_serializer.save()
        else:
            raise ValidationError(column_serializer.errors)


def delete_columns(columns_to_delete):
    if columns_to_delete:
        column_ids = [column['id'] for column in columns_to_delete]
        Column.objects.filter(id__in=column_ids).delete()


def update_or_create_columns(columns_data):
    columns_to_update = []
    for column_data in columns_data:
        column_id = column_data.get('id')
        if column_id:
            # Get the column instance based on the provided column_id
            column = get_object_or_404(Column, id=column_id)
            column_serializer = ColumnSerializer(column, data=column_data, partial=True)
        else:
            # If column_id is None, it's a new column, create a new instance
            column_serializer = ColumnSerializer(data=column_data)

        if column_serializer.is_valid():
            column_serializer.save()
        else:
            raise ValidationError(column_serializer.errors)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_board(request, board_id):
    # Get the board instance based on the provided board_id
    board = get_object_or_404(Board, id=board_id)

    # Check if the user making the request is the owner of the board
    if request.user != board.owner:
        return Response({"detail": "You do not have permission to delete this board."},
                        status=status.HTTP_403_FORBIDDEN)

    # Delete the board
    board.delete()

    return Response({"detail": "Board deleted successfully."}, status=status.HTTP_204_NO_CONTENT)