from django.urls import path
from . import views
from .views import TaskViewSet, BoardViewSet, ColumnViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('tasks', TaskViewSet, basename='task')
router.register('boards', BoardViewSet, basename='board')
router.register('columns', ColumnViewSet, basename='column')

urlpatterns = router.urls

# urlpatterns = [ 
# ] + router.urls