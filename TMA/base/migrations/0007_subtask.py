# Generated by Django 5.0.2 on 2024-03-07 18:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0006_remove_task_user_task_assigned_to_task_created_by'),
    ]

    operations = [
        migrations.CreateModel(
            name='SubTask',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('is_completed', models.BooleanField()),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subtask_created', to='base.task')),
            ],
        ),
    ]
