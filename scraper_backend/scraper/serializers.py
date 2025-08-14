# scraper/serializers.py
from rest_framework import serializers
from .models import ScrapedData, ScrapeJob

class ScrapedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapedData
        fields = ['id', 'title', 'url', 'content', 'created_at']

class ScrapeJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapeJob
        fields = ['id', 'url', 'status', 'created_at', 'completed_at']