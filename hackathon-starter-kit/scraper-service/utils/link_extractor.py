from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from typing import List

def extract_internal_links(base_url: str, html_content: str) -> List[str]:
    """
    Extracts all internal links from the HTML content and normalizes them.
    """
    if not html_content:
        return []
        
    soup = BeautifulSoup(html_content, 'lxml')
    base_domain = urlparse(base_url).netloc
    internal_links = set()
    
    for a in soup.find_all('a', href=True):
        href = a['href']
        # Normalize URL
        full_url = urljoin(base_url, href)
        parsed_url = urlparse(full_url)
        
        # Check if internal
        if parsed_url.netloc == base_domain:
            # Remove fragments to avoid duplicates
            clean_url = f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}"
            if clean_url.endswith('/') and len(parsed_url.path) > 1:
                clean_url = clean_url.rstrip('/')
            if parsed_url.query:
                clean_url += f"?{parsed_url.query}"
            internal_links.add(clean_url)
            
    return list(internal_links)
