import requests
from bs4 import BeautifulSoup
from typing import Optional, Dict, Any
from models.page_data import PageData
from utils.html_cleaner import clean_html
from utils.link_extractor import extract_internal_links
from urllib.parse import urljoin

class NewsScraper:
    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def scrape(self, url: str) -> Optional[PageData]:
        """
        Extracts structured news article data: headline, author, date, content, images.
        """
        try:
            print(f"Scraping news: {url}")
            # SSL verification disabled for local dev environments
            response = requests.get(url, headers=self.headers, timeout=self.timeout, verify=False)
            response.raise_for_status()
            
            html = response.text
            soup = BeautifulSoup(html, 'lxml')
            
            # Extract structured news data
            headline = self._get_headline(soup)
            author = self._get_author(soup)
            pub_date = self._get_date(soup)
            
            # Use cleaner for content but could targeting article tags
            article_body = soup.find('article')
            if article_body:
                text_content = clean_html(str(article_body))
            else:
                text_content = clean_html(html)
                
            image_urls = [urljoin(url, img['src']) for img in soup.find_all('img', src=True) if self._is_article_image(img)]
            word_count = len(text_content.split())
            reading_time = max(1, round(word_count / 225))
            
            links = extract_internal_links(url, html)
            
            metadata = {
                "headline": headline,
                "author": author,
                "publication_date": pub_date,
                "word_count": word_count,
                "reading_time_min": reading_time,
                "image_urls": image_urls[:5],
                "images": image_urls[:5], # Alias for UI consistency
                "language": soup.html.get('lang', 'en') if soup.html else 'en'
            }
            
            return PageData(
                url=url,
                title=headline,
                text=text_content,
                links=links,
                metadata=metadata
            )
        except Exception as e:
            print(f"Error scraping news {url}: {str(e)}")
            return None

    def _get_headline(self, soup):
        h1 = soup.find('h1')
        if h1: return h1.get_text().strip()
        og_title = soup.find('meta', property='og:title')
        if og_title: return og_title['content']
        return soup.title.string if soup.title else "Untitled Article"

    def _get_author(self, soup):
        author_meta = soup.find('meta', attrs={'name': 'author'})
        if author_meta: return author_meta['content']
        # Try finding common author classes
        author_tag = soup.select_one('.author, .byline, [rel="author"]')
        return author_tag.get_text().strip() if author_tag else "Unknown Author"

    def _get_date(self, soup):
        date_meta = soup.find('meta', property='article:published_time')
        if date_meta: return date_meta['content']
        time_tag = soup.find('time')
        return time_tag['datetime'] if time_tag and time_tag.has_attr('datetime') else "Unknown Date"

    def _is_article_image(self, img):
        # Basic filter for "real" images over icons/placeholders
        src = img['src'].lower()
        return any(ext in src for ext in ['.jpg', '.jpeg', '.png', '.webp']) and 'logo' not in src
