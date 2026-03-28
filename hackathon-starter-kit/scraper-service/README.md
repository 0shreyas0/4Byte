# Modular Scraper Service

A scalable Python-based web scraping service designed for high-performance data ingestion. This service follows a modular architecture, making it easy to add specialized scrapers for different domains (News, Finance, etc.).

## 🚀 Features

- **Generic Scraper**: Title, content, and link extraction.
- **News Scraper**: Structured article metadata (Headline, Author, Date, Images).
- **Financial Scraper**: Asset-specific data (Price, Market Change).
- **Website Crawler**: Depth-limited crawling with duplicate prevention.
- **Knowledge Engine Ready**: Clean JSON output optimized for vector ingestion.

## 🛠️ Stack

- **Python 3.9+**
- **FastAPI**: Modern, high-performance web framework.
- **BeautifulSoup4**: HTML parsing and cleaning.
- **Requests**: Network fetching.

## 📁 Project Structure

```text
scraper-service/
├── api/
│   └── main.py              # FastAPI entry point
├── crawler/
│   └── crawler.py           # Depth-limited crawling logic
├── scrapers/
│   ├── generic_scraper.py   # General website extraction
│   ├── news_scraper.py      # Article-specific extraction
│   └── finance_scraper.py   # Market-specific extraction
├── utils/
│   ├── link_extractor.py    # URL normalization & filtering
│   └── html_cleaner.py      # Noise removal (ads, scripts)
├── models/
│   └── page_data.py         # Pydantic data schemas
└── requirements.txt         # Dependencies
```

## 🏃 Running the Service

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the API**:
   ```bash
   cd scraper-service
   python api/main.py
   ```
   The service will be available at `http://localhost:8000`.

## 📡 API Usage

### Generic Scrape & Crawl
```bash
POST /scrape
{
  "url": "https://example.com",
  "depth": 2,
  "type": "generic"
}
```

### News Article Extraction
```bash
POST /scrape/news
{
  "url": "https://techcrunch.com/article-url"
}
```

### Financial Data Extraction
```bash
POST /scrape/finance
{
  "url": "https://finance.yahoo.com/quote/AAPL"
}
```

## 🔒 Error Handling
The system includes built-in retry logic (via requests) and comprehensive error logging. It respects rate limits and skips duplicate URLs automatically.
