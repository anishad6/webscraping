# scraper/urls.py
from django.urls import path
from .views import GoogleLogin

urlpatterns = [
    # ...
    path('auth/social/google/', GoogleLogin.as_view(), name='google_login'),
]