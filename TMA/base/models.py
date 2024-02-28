from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('leader', 'Leader'),
        ('admin', 'Admin'),
        # Add more roles as needed
    )

    # Add your custom fields here
    # For example, you might add fields like profile_picture, address, etc.
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    # Add any other custom fields as needed

    def __str__(self):
        return self.username
    
class Board(models.Model):
    name = models.CharField(max_length=255)
    ownerId = models.IntegerField(default=1)
    users = models.ManyToManyField(CustomUser)

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, default=1)