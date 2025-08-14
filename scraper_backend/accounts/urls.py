from django.urls import path
from .views import  GoogleAuthView

app_name = 'accounts'

urlpatterns = [
    path('api/auth/google/',  GoogleAuthView.as_view(), name='google_auth'),
]