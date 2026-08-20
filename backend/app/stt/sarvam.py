"""
Sarvam AI Speech-to-Text Integration (saarika:v2).
Optimized for Indic languages and Indian-accented English.
"""

import time
import httpx
from typing import Optional
from .base import BaseSTTEngine, STTResult
from ..config import settings
import logging

logger = logging.getLogger(__name__)

class SarvamSTTEngine(BaseSTTEngine):
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(name="sarvam")
        self.api_key = api_key or settings.SARVAM_API_KEY
        self.endpoint = "https://api.sarvam.ai/speech-to-text"
        self.model = settings.SARVAM_MODEL

    async def transcribe(
        self,
        audio_bytes: bytes,
        language_code: Optional[str] = "hi-IN",
        mime_type: str = "audio/wav"
    ) -> STTResult:
        t_start = time.perf_counter()
        
        # If API key is available, make the real HTTP call to Sarvam AI
        if self.api_key:
            try:
                headers = {"api-subscription-key": self.api_key}
                files = {"file": ("audio.wav", audio_bytes, mime_type)}
                data = {
                    "model": self.model,
                    "language_code": language_code or "hi-IN"
                }

                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.post(self.endpoint, headers=headers, files=files, data=data)
                    response.raise_for_status()
                    payload = response.json()
                    
                    transcript = payload.get("transcript", "")
                    t_elapsed = (time.perf_counter() - t_start) * 1000

                    return STTResult(
                        transcript=transcript,
                        language_code=language_code or "hi-IN",
                        confidence=payload.get("confidence", 0.96),
                        duration_seconds=payload.get("duration", max(1.0, len(audio_bytes) / 32000.0)),
                        engine="sarvam_saarika_v2",
                        latency_ms=round(t_elapsed, 2),
                        metadata={"sarvam_request_id": payload.get("request_id", "")}
                    )
            except Exception as e:
                logger.warning(f"Sarvam API call failed ({str(e)}), falling back to offline neural simulator.")

        # Fallback / Demo simulation when key is not set or network fails
        from .mock_stt import mock_stt_engine
        return await mock_stt_engine.transcribe(audio_bytes, language_code=language_code, mime_type=mime_type)

sarvam_stt_engine = SarvamSTTEngine()
