"""
FastAPI Server for Voice-Enabled RAG System (HH Goa 2026).
"""

import os
import json
import logging
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from .config import settings
from .harness.orchestrator import orchestrator
from .chunking.comparator import chunking_comparator
from .analytics.benchmark import benchmark_runner, BenchmarkReport
from .dataset.loader import dataset_loader
from .vector_store.engine import vector_store

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("aura_voice_rag")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Voice-Enabled RAG with Multi-Strategy Chunking, Guardrails, and Sub-200ms Latency."
)

# CORS middleware for local and web access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class TextQueryRequest(BaseModel):
    query: str
    strategy: str = "semantic_splitting"
    top_k: int = 5
    language: str = "en"

class ChunkingCompareRequest(BaseModel):
    text: str
    doc_id: Optional[str] = "custom_doc"
    title: Optional[str] = "Interactive Sample"
    language: Optional[str] = "en"
    domain: Optional[str] = "General Knowledge"

class ConfigUpdateRequest(BaseModel):
    sarvam_api_key: Optional[str] = None
    elevenlabs_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    default_stt_engine: Optional[str] = None

# In-memory cached benchmark result
cached_benchmark_report: Optional[BenchmarkReport] = None

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "target_latency_ms": settings.TARGET_LATENCY_MS,
        "indexed_chunks": len(vector_store.chunks),
        "supported_strategies": list(chunking_comparator.chunkers.keys()),
        "sarvam_configured": bool(settings.SARVAM_API_KEY),
        "elevenlabs_configured": bool(settings.ELEVENLABS_API_KEY)
    }

@app.post("/api/voice/query")
async def process_voice_query(
    file: UploadFile = File(...),
    engine: str = Form("sarvam"),
    language_code: str = Form("hi-IN"),
    strategy: str = Form("semantic_splitting"),
    top_k: int = Form(5)
):
    try:
        audio_bytes = await file.read()
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Empty audio file provided.")

        response = await orchestrator.process_voice(
            audio_bytes=audio_bytes,
            engine_name=engine,
            language_code=language_code,
            strategy=strategy,
            top_k=int(top_k),
            mime_type=file.content_type or "audio/wav"
        )
        return response
    except Exception as e:
        logger.exception("Error processing voice query")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/text/query")
async def process_text_query(req: TextQueryRequest):
    try:
        response = await orchestrator.process_query(
            query_text=req.query,
            strategy=req.strategy,
            top_k=req.top_k,
            language=req.language,
            input_type="text"
        )
        return response
    except Exception as e:
        logger.exception("Error processing text query")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chunking/compare")
async def compare_chunking(req: ChunkingCompareRequest):
    try:
        metadata = {
            "title": req.title or "Sample Doc",
            "language": req.language or "en",
            "domain": req.domain or "General Knowledge"
        }
        results = chunking_comparator.compare(
            text=req.text,
            doc_id=req.doc_id or "demo_doc",
            metadata=metadata
        )
        return results
    except Exception as e:
        logger.exception("Error comparing chunking strategies")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dataset/documents")
async def get_dataset_docs():
    return {
        "dataset_name": settings.DATASET_NAME,
        "total_documents": len(dataset_loader.get_all_documents()),
        "documents": dataset_loader.get_all_documents(),
        "total_indexed_chunks": len(vector_store.chunks)
    }

@app.get("/api/benchmark/run")
async def run_benchmark(count: int = 50, strategy: str = "semantic_splitting"):
    global cached_benchmark_report
    try:
        report = await benchmark_runner.run_benchmark(
            orchestrator=orchestrator,
            query_count=count,
            strategy=strategy
        )
        cached_benchmark_report = report
        return report
    except Exception as e:
        logger.exception("Error running benchmark")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/benchmark/latest")
async def get_latest_benchmark():
    global cached_benchmark_report
    if cached_benchmark_report is None:
        cached_benchmark_report = await benchmark_runner.run_benchmark(
            orchestrator=orchestrator,
            query_count=30,
            strategy="semantic_splitting"
        )
    return cached_benchmark_report

@app.post("/api/config/update")
async def update_configuration(req: ConfigUpdateRequest):
    if req.sarvam_api_key is not None:
        settings.SARVAM_API_KEY = req.sarvam_api_key
        from .stt.sarvam import sarvam_stt_engine
        sarvam_stt_engine.api_key = req.sarvam_api_key

    if req.elevenlabs_api_key is not None:
        settings.ELEVENLABS_API_KEY = req.elevenlabs_api_key
        from .stt.elevenlabs import elevenlabs_stt_engine
        elevenlabs_stt_engine.api_key = req.elevenlabs_api_key

    if req.openai_api_key is not None:
        settings.OPENAI_API_KEY = req.openai_api_key

    if req.default_stt_engine is not None:
        settings.DEFAULT_STT_ENGINE = req.default_stt_engine

    return {
        "status": "updated",
        "sarvam_configured": bool(settings.SARVAM_API_KEY),
        "elevenlabs_configured": bool(settings.ELEVENLABS_API_KEY)
    }

# Mount frontend build if directory exists
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
