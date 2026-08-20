"""
Structured Pydantic Data Models and Schemas for Pipeline Orchestration.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from ..chunking.base import Chunk
from ..guardrails.manager import GuardrailVerdict

class Citation(BaseModel):
    doc_id: str
    title: str
    chunk_id: str
    relevance_score: float
    snippet: str

class ToolInvocation(BaseModel):
    tool_name: str
    parameters: Dict[str, Any]
    result: Any
    latency_ms: float
    status: str = "success"

class StageTelemetry(BaseModel):
    stage_name: str
    latency_ms: float
    status: str
    details: Dict[str, Any] = Field(default_factory=dict)

class LatencyBreakdown(BaseModel):
    stt_latency_ms: float = 0.0
    inbound_guardrail_ms: float = 0.0
    query_planning_ms: float = 0.0
    embedding_latency_ms: float = 0.0
    vector_retrieval_ms: float = 0.0
    grounding_guardrail_ms: float = 0.0
    llm_ttft_ms: float = 0.0
    llm_generation_ms: float = 0.0
    outbound_guardrail_ms: float = 0.0
    total_pipeline_ms: float = 0.0
    sub_200ms_target_met: bool = False

class RAGPipelineResponse(BaseModel):
    query_id: str
    input_type: str  # 'voice' or 'text'
    stt_transcript: str
    stt_engine: str
    language_detected: str
    answer: str
    abstained: bool = False
    abstention_reason: Optional[str] = None
    citations: List[Citation] = Field(default_factory=list)
    retrieved_chunks: List[Chunk] = Field(default_factory=list)
    guardrail_verdicts: List[GuardrailVerdict] = Field(default_factory=list)
    tool_calls: List[ToolInvocation] = Field(default_factory=list)
    retry_count: int = 0
    circuit_breaker_status: str = "CLOSED"
    latency_breakdown: LatencyBreakdown
