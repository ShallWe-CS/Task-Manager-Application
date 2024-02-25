from django.urls import path
from . import views

urlpatterns = [ 
    path('task/get_all/',   views.get_all_tasks),
    path('task/add_edit/',  views.add_edit_task)
]