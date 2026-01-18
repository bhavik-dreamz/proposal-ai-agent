"""
Configuration management for the proposal generator.
"""
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """Configuration settings for the proposal generator."""
    
    def __init__(self):
        self.openai_api_key: Optional[str] = os.getenv('OPENAI_API_KEY')
        self.default_model: str = os.getenv('DEFAULT_MODEL', 'gpt-4')
        self.hourly_rate: float = float(os.getenv('HOURLY_RATE', '100'))
        self.overhead_percentage: float = float(os.getenv('OVERHEAD_PERCENTAGE', '20'))
    
    def validate(self) -> bool:
        """Validate that required configuration is present."""
        if not self.openai_api_key:
            return False
        return True


# Global config instance
config = Config()
