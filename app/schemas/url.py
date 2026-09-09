from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class URLCreateRequest(BaseModel):
    target_url: str = Field(..., description="The original URL to shorten", max_length=2048)
    custom_alias: Optional[str] = Field(None, description="Optional custom alias for the short code", min_length=3, max_length=30)
    expires_at: Optional[datetime] = Field(None, description="Optional expiration timestamp")

class URLResponse(BaseModel):
    id: int
    short_code: str
    target_url: str
    created_at: datetime
    expires_at: Optional[datetime]
    clicks: int
    is_active: bool
    short_url: str

    model_config = {"from_attributes": True}
