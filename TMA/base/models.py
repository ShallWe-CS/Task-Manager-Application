from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('leader', 'Leader'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return self.username
    
class Board(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1, related_name='owned_boards')
    boards = models.ManyToManyField(CustomUser, related_name='users_joined')

class Column(models.Model):
    name = models.CharField(max_length=255)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, default=1)

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=255)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, default=1)
    column = models.ForeignKey(Column, on_delete=models.CASCADE, default=1)