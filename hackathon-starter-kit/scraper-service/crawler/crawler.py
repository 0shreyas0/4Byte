from typing import List, Set, Dict, Any
from urllib.parse import urlparse
from models.page_data import PageData, ScrapeResponse
from scrapers.generic_scraper import GenericScraper
from scrapers.news_scraper import NewsScraper
from scrapers.finance_scraper import FinanceScraper

class WebsiteCrawler:
    def __init__(self):
        self.scrapers = {
            "generic": GenericScraper(),
            "news": NewsScraper(),
            "finance": FinanceScraper()
        }
        self.visited_urls: Set[str] = set()

    def crawl(self, start_url: str, depth_limit: int = 1, scraper_type: str = "generic") -> ScrapeResponse:
        """
        Starts crawling from a URL up to a certain depth.
        """
        self.visited_urls = set()
        to_visit = [(start_url, 0)]
        results: List[PageData] = []
        
        scraper = self.scrapers.get(scraper_type, self.scrapers["generic"])
        
        while to_visit:
            current_url, current_depth = to_visit.pop(0)
            
            if current_url in self.visited_urls or current_depth > depth_limit:
                continue
                
            self.visited_urls.add(current_url)
            
            page_data = scraper.scrape(current_url)
            if page_data:
                results.append(page_data)
                
                # If we haven't reached depth limit and we found links, add them to queue
                if current_depth < depth_limit:
                    for link in page_data.links:
                        if link not in self.visited_urls:
                            to_visit.append((link, current_depth + 1))
                            
        return ScrapeResponse(
            pages_scraped=len(results),
            data=results
        )
