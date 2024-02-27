from django.urls import path
from . import views
from .views import TaskViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('tasks', TaskViewSet, basename='task')
urlpatterns = router.urls

# urlpatterns = [ 
#     path('task/get_all/',   views.get_all_tasks),
#     path('task/add_edit/',  views.add_edit_task)
# ] + router.urls