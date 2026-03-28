from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

def get_now_iso():
    return datetime.utcnow().isoformat()

class PageData(BaseModel):
    url: str
    title: str
    text: str
    links: List[str] = []
    timestamp: str = Field(default_factory=get_now_iso)
    metadata: Optional[Dict[str, Any]] = None

class ScrapeRequest(BaseModel):
    url: str
    depth: int = 1
    type: str = "generic"

class ScrapeResponse(BaseModel):
    pages_scraped: int
    data: List[PageData]
    status: str = "success"
