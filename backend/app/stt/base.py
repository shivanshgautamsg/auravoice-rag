"""
Base Speech-to-Text (STT) Engine Interface.
"""

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from pydantic import BaseModel

class STTResult(BaseModel):
    transcript: str
    language_code: str
    confidence: float
    duration_seconds: float
    engine: str
    latency_ms: float
    metadata: Dict[str, Any] = {}

class BaseSTTEngine(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    async def transcribe(
        self,
        audio_bytes: bytes,
        language_code: Optional[str] = "en-IN",
        mime_type: str = "audio/wav"
    ) -> STTResult:
        """Transcribes raw audio bytes into text with telemetry."""
        pass
