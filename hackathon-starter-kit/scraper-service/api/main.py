from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import time
import logging
import os
import sys

# Ensure the parent directory is in the path for modular imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.page_data import ScrapeRequest, ScrapeResponse
from crawler.crawler import WebsiteCrawler
from scrapers.news_scraper import NewsScraper
from scrapers.finance_scraper import FinanceScraper

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("scraper-service")

app = FastAPI(
    title="Modular Scraper Service",
    description="Scalable backend ingestion system for documentation, news, and financial data.",
    version="1.0.0"
)

# Add CORS for Next.js frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your Next.js domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Crawler Instance
crawler = WebsiteCrawler()

@app.get("/health")
async def health_check():
    """Returns service status."""
    return {"status": "operational", "timestamp": time.time()}

@app.post("/scrape", response_model=ScrapeResponse)
async def trigger_scrape(request: ScrapeRequest):
    """
    Triggers crawling and scraping based on URL, depth and type.
    """
    logger.info(f"Starting {request.type} crawl for {request.url} with depth {request.depth}")
    try:
        result = crawler.crawl(request.url, request.depth, request.type)
        return result
    except Exception as e:
        logger.error(f"Scrape failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scrape/news")
async def scrape_news(request: ScrapeRequest):
    """Runs the news scraper for a single URL (depth 0)."""
    scraper = NewsScraper()
    data = scraper.scrape(request.url)
    if not data:
        raise HTTPException(status_code=400, detail="Could not extract news data from URL")
    return {"pages_scraped": 1, "data": [data]}

@app.post("/scrape/finance")
async def scrape_finance(request: ScrapeRequest):
    """Runs the financial scraper for a single URL (depth 0)."""
    scraper = FinanceScraper()
    data = scraper.scrape(request.url)
    if not data:
        raise HTTPException(status_code=400, detail="Could not extract financial data from URL")
    return {"pages_scraped": 1, "data": [data]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
