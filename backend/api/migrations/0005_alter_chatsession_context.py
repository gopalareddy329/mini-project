# Generated by Django 5.0.2 on 2024-10-21 08:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_delete_botcontext'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatsession',
            name='context',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
    ]