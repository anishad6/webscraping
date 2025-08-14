# scraper/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ScrapedData, ScrapeJob
from .serializers import ScrapedDataSerializer, ScrapeJobSerializer
from .scraper import scrape_website
import requests
from bs4 import BeautifulSoup

class ScrapedDataViewSet(viewsets.ModelViewSet):
    serializer_class = ScrapedDataSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ScrapedData.objects.filter(user=self.request.user)

class ScrapeJobViewSet(viewsets.ModelViewSet):
    serializer_class = ScrapeJobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ScrapeJob.objects.filter(user=self.request.user)

    def create(self, request):
        url = request.data.get('url')
        if not url:
            return Response({'error': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        job = ScrapeJob.objects.create(user=request.user, url=url)
        
        # In production, you'd use Celery for background tasks
        try:
            scraped_data = scrape_website(url)
            for data in scraped_data:
                ScrapedData.objects.create(
                    user=request.user,
                    title=data['title'],
                    url=data['url'],
                    content=data['content']
                )
            job.status = 'completed'
        except Exception as e:
            job.status = 'failed'
        finally:
            job.save()
        
        return Response(self.serializer_class(job).data, status=status.HTTP_201_CREATED)


# scraper/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.conf import settings

class GoogleAuthView(APIView):
    def post(self, request):
        token = request.data.get("credential")
        if not token:
            return Response({"error": "No credential provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify the token with Google
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)

            email = idinfo["email"]
            name = idinfo.get("name", email.split("@")[0])

            user, created = User.objects.get_or_create(username=email, defaults={"first_name": name})
            token_obj, _ = Token.objects.get_or_create(user=user)

            return Response({"token": token_obj.key, "user": user.username})
        except ValueError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000"  # Your frontend URL
    client_class = OAuth2Client