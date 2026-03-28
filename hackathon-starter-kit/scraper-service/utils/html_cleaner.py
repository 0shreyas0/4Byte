from bs4 import BeautifulSoup

def clean_html(html_content: str) -> str:
    """
    Removes scripts, styles, navigation, and ads from HTML.
    Returns cleaned, readable text content.
    """
    if not html_content:
        return ""
        
    soup = BeautifulSoup(html_content, 'lxml')
    
    # Remove unwanted elements
    for element in soup(['script', 'style', 'nav', 'header', 'footer', 'aside', 'iframe']):
        element.decompose()
        
    # Common ad selectors (can be expanded)
    for ad in soup.select('.ads, .advertisement, [id*="ad-"], [class*="ad-"]'):
        ad.decompose()
        
    # Get text
    text = soup.get_text(separator=' ')
    
    # Clean up whitespace
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    cleaned_text = '\n'.join(chunk for chunk in chunks if chunk)
    
    return cleaned_text
