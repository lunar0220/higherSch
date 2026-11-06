from django.contrib import admin

from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "tariff", "created_at", "is_processed")
    list_filter = ("is_processed",)
