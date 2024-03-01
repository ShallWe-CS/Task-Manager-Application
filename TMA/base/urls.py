from django.urls import path
from . import views
from rest_framework_simplejwt.views import ( TokenRefreshView)
from .views import TaskViewSet, BoardViewSet, ColumnViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('tasks', TaskViewSet, basename='task')
router.register('boards', BoardViewSet, basename='board')
router.register('columns', ColumnViewSet, basename='column')

# urlpatterns = router.urls

urlpatterns = [ 
    path('token/',          views.MyTokenObtainPairView.as_view()),
    path('token/refresh/',  TokenRefreshView.as_view(), name='token_refresh'),

] + router.urls