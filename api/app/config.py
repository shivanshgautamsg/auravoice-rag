"""
Configuration management for Voice-Enabled RAG System (HH Goa 2026).
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Application Info
    APP_NAME: str = "AuraVoice RAG - HH Goa 2026"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Target Latency (ms)
    TARGET_LATENCY_MS: float = 200.0
    
    # API Keys (Optional with mock fallbacks for zero-friction evaluation)
    SARVAM_API_KEY: Optional[str] = os.getenv("SARVAM_API_KEY", "")
    ELEVENLABS_API_KEY: Optional[str] = os.getenv("ELEVENLABS_API_KEY", "")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", "")
    
    # STT Settings
    DEFAULT_STT_ENGINE: str = "sarvam"  # 'sarvam' or 'elevenlabs'
    SARVAM_MODEL: str = "saarika:v2"
    SARVAM_LANGUAGE_CODE: str = "hi-IN"  # Hindi, Tamil, Bengali, English (en-IN)
    
    # Vector Search & Retrieval Settings
    DEFAULT_TOP_K: int = 5
    SIMILARITY_THRESHOLD: float = 0.52
    HYBRID_ALPHA: float = 0.65  # 0.65 dense + 0.35 BM25
    EMBEDDING_DIMENSION: int = 384
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    
    # Guardrail Thresholds
    OFF_TOPIC_THRESHOLD: float = 0.40
    INSUFFICIENT_CONTEXT_THRESHOLD: float = 0.48
    HALLUCINATION_OVERLAP_THRESHOLD: float = 0.60
    
    # Harness Resilience Settings
    MAX_RETRIES: int = 3
    RETRY_BASE_DELAY: float = 0.05  # 50ms base
    CIRCUIT_BREAKER_FAILURE_THRESHOLD: int = 5
    CIRCUIT_BREAKER_RECOVERY_TIMEOUT: float = 10.0
    
    # Dataset Settings
    DATASET_NAME: str = "ai4bharat/MSMARCO-XI"
    DATASET_CACHE_DIR: str = os.path.join(os.path.dirname(__file__), "dataset", "cache")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
