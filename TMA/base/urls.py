from django.urls import path
from .views.auth_views import MyTokenObtainPairView, UserRegistrationView
from .views.board_views import get_all, edit_board, delete_board, add_board
from .views.task_views import add_task, edit_task, delete_task
from .views.subtask_views import add_subtask, edit_subtask
from rest_framework_simplejwt.views import ( TokenRefreshView)
from .views.views import TaskViewSet, ColumnViewSet, BoardViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('tasks', TaskViewSet, basename='task')
router.register('boards', BoardViewSet, basename='board')
router.register('columns', ColumnViewSet, basename='column')

# urlpatterns = router.urls

urlpatterns = [ 
    path('token/',  MyTokenObtainPairView.as_view()),
    path('token/refresh/',  TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',   UserRegistrationView.as_view()),

    path('boards/boards_by_owner/',  get_all, name='get_all'),
    path('boards/add/', add_board, name='add_board'),
    path('boards/<int:board_id>/edit/', edit_board, name='edit_board'),
    path('boards/<int:board_id>/delete/', delete_board, name='delete_board'),

    path('tasks/add/', add_task, name='add_task'),
    path('tasks/<int:task_id>/edit/', edit_task, name='edit_task'),
    path('tasks/<int:task_id>/delete/', delete_task, name='delete_task'),

    path('subtasks/add/', add_subtask, name='add_subtask'),
    path('subtasks/edit/', edit_subtask, name='edit_subtask'),
] + router.urls