import requests
from bs4 import BeautifulSoup
from typing import Optional, Dict, Any
from datetime import datetime
from models.page_data import PageData
from utils.link_extractor import extract_internal_links

class FinanceScraper:
    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def scrape(self, url: str) -> Optional[PageData]:
        """
        Extracts financial info: stock name, price, market change, timestamp.
        """
        try:
            print(f"Scraping finance: {url}")
            # SSL verification disabled for local dev environments
            response = requests.get(url, headers=self.headers, timeout=self.timeout, verify=False)
            response.raise_for_status()
            
            html = response.text
            soup = BeautifulSoup(html, 'lxml')
            
            # Common patterns for financial sites (Yahoo Finance, Google Finance style)
            stock_name = self._extract_name(soup)
            price = self._extract_price(soup)
            change = self._extract_change(soup)
            
            metadata = {
                "stock_name": stock_name,
                "price": price,
                "market_change": change,
                "scraped_at": datetime.utcnow().isoformat()
            }
            
            links = extract_internal_links(url, html)
            
            return PageData(
                url=url,
                title=f"Financial Data: {stock_name}",
                text=f"Stock: {stock_name} | Price: {price} | Change: {change}",
                links=links,
                metadata=metadata
            )
        except Exception as e:
            print(f"Error scraping finance {url}: {str(e)}")
            return None

    def _extract_name(self, soup):
        # Look for h1 or specific financial headers
        h1 = soup.find('h1')
        return h1.get_text().strip() if h1 else "Unknown Asset"

    def _extract_price(self, soup):
        # Very generic - in production, you'd use specific selectors for Yahoo/Google/Bloomberg
        price_tag = soup.select_one('[data-field="regularMarketPrice"], .price, .last-price')
        if not price_tag:
            # Fallback: look for text with currency symbols
            for tag in soup.find_all(['span', 'div']):
                text = tag.get_text().strip()
                if any(c in text for c in ['$', '€', '£']) and len(text) < 20:
                    return text
        return price_tag.get_text().strip() if price_tag else "N/A"

    def _extract_change(self, soup):
        change_tag = soup.select_one('[data-field="regularMarketChangePercent"], .change, .percent-change')
        return change_tag.get_text().strip() if change_tag else "N/A"
