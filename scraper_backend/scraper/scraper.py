# scraper/scraper.py
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_website(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Example: Scrape headlines and links
        results = []
        for item in soup.select('h1, h2, h3'):
            title = item.get_text().strip()
            link = item.find_parent('a')
            if link and link.get('href'):
                absolute_url = urljoin(url, link.get('href'))
                content = f"Scraped from {url}"
                results.append({
                    'title': title,
                    'url': absolute_url,
                    'content': content
                })
        
        return results
        
    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")
        raise