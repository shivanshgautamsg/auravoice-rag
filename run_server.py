"""
One-Click Unified Server Runner for AuraVoice RAG (HH Goa 2026).
Starts the FastAPI backend and serves the frontend dashboard on http://127.0.0.1:8000
"""

import os
import sys
import uvicorn

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from app.config import settings

if __name__ == "__main__":
    print("\n" + "="*75)
    print(f"🚀 Starting {settings.APP_NAME} (v{settings.APP_VERSION})")
    print(f"⚡ Target Latency: <{settings.TARGET_LATENCY_MS}ms | Dataset: {settings.DATASET_NAME}")
    print(f"🌐 Access Dashboard at: http://127.0.0.1:8000")
    print("="*75 + "\n")

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )
