from django.contrib import admin

# Register your models here.

from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Дополнительно", {"fields": ("role", "phone")}),
    )
    list_display = ("username", "email", "role", "is_staff")