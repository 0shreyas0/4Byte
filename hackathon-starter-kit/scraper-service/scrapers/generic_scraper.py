import requests
from bs4 import BeautifulSoup
from typing import Optional
from models.page_data import PageData
from utils.html_cleaner import clean_html
from utils.link_extractor import extract_internal_links
from urllib.parse import urljoin

class GenericScraper:
    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def scrape(self, url: str) -> Optional[PageData]:
        """
        Scrapes a general website for title, content, and links.
        """
        try:
            print(f"Scraping generic: {url}")
            # SSL verification disabled for local dev environments where certs might be missing (macOS)
            response = requests.get(url, headers=self.headers, timeout=self.timeout, verify=False)
            response.raise_for_status()
            
            html = response.text
            soup = BeautifulSoup(html, 'lxml')
            
            title = soup.title.string.strip() if soup.title else "No Title"
            cleaned_text = clean_html(html)
            links = extract_internal_links(url, html)
            
            # Extract Advanced Intelligence
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            description = meta_desc['content'] if meta_desc else ""
            
            word_count = len(cleaned_text.split())
            reading_time = max(1, round(word_count / 225)) # Avg reading speed
            
            top_images = [urljoin(url, img['src']) for img in soup.find_all('img', src=True) if '.jpg' in img['src'] or '.png' in img['src']][:4]
            
            metadata = {
                "description": description,
                "word_count": word_count,
                "reading_time_min": reading_time,
                "images": top_images,
                "content_type": response.headers.get('Content-Type', 'unknown'),
                "server": response.headers.get('Server', 'unknown'),
                "language": soup.html.get('lang', 'en') if soup.html else 'en'
            }
            
            return PageData(
                url=url,
                title=title,
                text=cleaned_text,
                links=links,
                metadata=metadata
            )
        except Exception as e:
            print(f"Error scraping {url}: {str(e)}")
            return None
