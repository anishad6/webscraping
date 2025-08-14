
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token  # Add this import
from google.auth.transport import requests as google_requests  # Add this import
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


User = get_user_model()

import logging
logger = logging.getLogger(__name__)

class GoogleAuthView(APIView):
    def post(self, request):
        print("Received credential:", request.data.get("credential"))  # Console
        logger.debug(f"Auth request data: {request.data}")  # Log file
        credential = request.data.get("credential")
        if not credential:
            return Response({"error": "No credential provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify the Google token
            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),  # Now properly imported
                settings.GOOGLE_CLIENT_ID
            )

            # Validate the token is for our app
            if idinfo['aud'] != settings.GOOGLE_CLIENT_ID:
                raise ValueError("Invalid audience")

            # Get or create user
            email = idinfo['email']
            user, created = User.objects.get_or_create(
                username=email,
                defaults={'email': email}
            )

            # Create or get token
            token, _ = Token.objects.get_or_create(user=user)

            response = Response({
                "token": token.key,
                "user": {
                    "email": user.email,
                    "username": user.username
                }
            })
            
            # Set CORS headers
            response["Access-Control-Allow-Origin"] = "http://localhost:3000"
            response["Access-Control-Allow-Credentials"] = "true"
            return response

        except ValueError as e:
            print(f"Token verification failed: {str(e)}") 
            return Response({"error": "Invalid Google token"}, status=status.HTTP_401_UNAUTHORIZED)
'''# views.py
from contextvars import Token
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny

from scraper.models import User

@method_decorator(csrf_exempt, name='dispatch')
class GoogleAuthView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        credential = request.data.get("credential")
        if not credential:
            return Response({"error": "No credential provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            if idinfo['aud'] != settings.GOOGLE_CLIENT_ID:
                raise ValueError("Invalid audience")

            email = idinfo['email']
            user, created = User.objects.get_or_create(
                username=email,
                defaults={'email': email}
            )

            token, _ = Token.objects.get_or_create(user=user)

            response = Response({
                "token": token.key,
                "user": {
                    "email": user.email,
                    "username": user.username
                }
            })
            
            # Set CORS headers
            response["Access-Control-Allow-Origin"] = "http://localhost:3000"
            response["Access-Control-Allow-Credentials"] = "true"
            return response

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
'''
# # accounts/views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth import get_user_model
# from django.conf import settings
# from google.oauth2 import id_token
# from google.auth.transport import requests
# from rest_framework.authtoken.models import Token
# import logging

# logger = logging.getLogger(__name__)
# User = get_user_model()

# class GoogleLogin(APIView):
#     def post(self, request):
#         token = request.data.get('token')
#         if not token:
#             return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             # Verify Google token
#             CLIENT_ID = settings.GOOGLE_CLIENT_ID
#             idinfo = id_token.verify_oauth2_token(
#                 token,
#                 requests.Request(),
#                 CLIENT_ID
#             )

#             # Check if token was issued for our client
#             if idinfo['aud'] != CLIENT_ID:
#                 raise ValueError('Token audience mismatch')

#             # Extract user info
#             email = idinfo['email']
#             first_name = idinfo.get('given_name', '')
#             last_name = idinfo.get('family_name', '')
#             google_id = idinfo['sub']

#             # Get or create user
#             user, created = User.objects.get_or_create(
#                 email=email,
#                 defaults={
#                     'username': email,
#                     'first_name': first_name,
#                     'last_name': last_name,
#                 }
#             )

#             # Update user info if not created
#             if not created:
#                 user.first_name = first_name
#                 user.last_name = last_name
#                 user.save()

#             # Generate or get auth token
#             token, _ = Token.objects.get_or_create(user=user)

#             return Response({
#                 'token': token.key,
#                 'user': {
#                     'id': user.id,
#                     'email': user.email,
#                     'first_name': user.first_name,
#                     'last_name': user.last_name,
#                 },
#                 'created': created
#             })

#         except ValueError as e:
#             logger.error(f'Google token verification failed: {str(e)}')
#             return Response({'error': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             logger.error(f'Google login error: {str(e)}')
#             return Response({'error': 'Authentication failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import json
# import requests

# @csrf_exempt
# def google_login(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON"}, status=400)

#         token = data.get("access_token")
#         if not token:
#             return JsonResponse({"error": "No credential provided"}, status=400)

#         # Verify token with Google
#         google_response = requests.get(
#             "https://www.googleapis.com/oauth2/v3/tokeninfo",
#             params={"id_token": token}
#         )

#         if google_response.status_code != 200:
#             return JsonResponse({"error": "Invalid token"}, status=400)

#         user_info = google_response.json()
#         return JsonResponse({"user": user_info})

#     return JsonResponse({"error": "POST required"}, status=405)
