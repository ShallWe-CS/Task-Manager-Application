from django.urls import path
from .views.auth_views import MyTokenObtainPairView, UserRegistrationView
from .views.board_views import boards_by_owner
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

    path('boards/boards_by_owner/',  boards_by_owner, name='boards_by_owner'),

] + router.urls