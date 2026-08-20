"""
Agentic Pipeline Orchestrator & Tool Harness.
Coordinates STT -> Inbound Guardrails -> Tool Selection -> Hybrid Retrieval -> Context Grounding -> Synthesis -> Hallucination Checks.
"""

import time
import uuid
from typing import Optional, List, Dict, Any
from ..stt.sarvam import sarvam_stt_engine
from ..stt.elevenlabs import elevenlabs_stt_engine
from ..stt.mock_stt import mock_stt_engine
from ..guardrails.manager import guardrail_manager, GuardrailVerdict
from ..vector_store.engine import vector_store
from ..vector_store.embeddings import embedding_engine
from ..llm.generator import answer_generator
from ..analytics.tracker import LatencyTracker
from .schemas import RAGPipelineResponse, Citation, ToolInvocation
from .retry import resilient_execute, global_circuit_breaker
from ..config import settings
import logging

logger = logging.getLogger(__name__)

class AgenticOrchestrator:
    def __init__(self):
        self.stt_engines = {
            "sarvam": sarvam_stt_engine,
            "elevenlabs": elevenlabs_stt_engine,
            "mock": mock_stt_engine
        }

    async def process_voice(
        self,
        audio_bytes: bytes,
        engine_name: str = "sarvam",
        language_code: str = "hi-IN",
        strategy: str = "semantic_splitting",
        top_k: int = 5,
        mime_type: str = "audio/wav"
    ) -> RAGPipelineResponse:
        """Processes raw audio input end-to-end."""
        tracker = LatencyTracker()
        query_id = f"qry_voice_{uuid.uuid4().hex[:8]}"

        # Stage 1: Speech-to-Text
        tracker.start_stage("stt")
        stt_engine = self.stt_engines.get(engine_name, sarvam_stt_engine)
        
        stt_result = await resilient_execute(
            stt_engine.transcribe,
            audio_bytes=audio_bytes,
            language_code=language_code,
            mime_type=mime_type,
            circuit_breaker=global_circuit_breaker
        )
        tracker.end_stage("stt")

        transcript = stt_result.transcript
        return await self._execute_rag_pipeline(
            query_id=query_id,
            query_text=transcript,
            input_type="voice",
            stt_engine_name=engine_name,
            language_detected=stt_result.language_code,
            strategy=strategy,
            top_k=top_k,
            tracker=tracker
        )

    async def process_query(
        self,
        query_text: str,
        strategy: str = "semantic_splitting",
        top_k: int = 5,
        language: str = "en",
        input_type: str = "text"
    ) -> RAGPipelineResponse:
        """Processes text query directly."""
        tracker = LatencyTracker()
        query_id = f"qry_txt_{uuid.uuid4().hex[:8]}"
        tracker.record_stage("stt", 0.0)

        return await self._execute_rag_pipeline(
            query_id=query_id,
            query_text=query_text,
            input_type=input_type,
            stt_engine_name="none",
            language_detected=language,
            strategy=strategy,
            top_k=top_k,
            tracker=tracker
        )

    async def _execute_rag_pipeline(
        self,
        query_id: str,
        query_text: str,
        input_type: str,
        stt_engine_name: str,
        language_detected: str,
        strategy: str,
        top_k: int,
        tracker: LatencyTracker
    ) -> RAGPipelineResponse:
        verdicts: List[GuardrailVerdict] = []
        tool_calls: List[ToolInvocation] = []

        # Stage 2: Inbound Guardrail
        tracker.start_stage("inbound_guardrail")
        inbound_verdict = guardrail_manager.evaluate_inbound(query_text)
        verdicts.append(inbound_verdict)
        tracker.end_stage("inbound_guardrail")

        if not inbound_verdict.passed:
            return RAGPipelineResponse(
                query_id=query_id,
                input_type=input_type,
                stt_transcript=query_text,
                stt_engine=stt_engine_name,
                language_detected=language_detected,
                answer=f"🛡️ {inbound_verdict.reason}",
                abstained=True,
                abstention_reason=inbound_verdict.reason,
                guardrail_verdicts=verdicts,
                circuit_breaker_status=global_circuit_breaker.state,
                latency_breakdown=tracker.get_breakdown()
            )

        # Stage 3: Query Planning & Tool Selection
        tracker.start_stage("query_planning")
        # Agent decides whether vector store retrieval tool is needed
        t_tool_start = time.perf_counter()
        tool_calls.append(ToolInvocation(
            tool_name="vector_store_retrieval",
            parameters={"query": query_text, "top_k": top_k, "strategy": strategy},
            result={"status": "dispatched"},
            latency_ms=round((time.perf_counter() - t_tool_start) * 1000, 3)
        ))
        tracker.end_stage("query_planning")

        # Stage 4: Embedding & Vector DB Retrieval
        tracker.start_stage("embedding")
        _ = embedding_engine.get_embedding(query_text)
        tracker.end_stage("embedding")

        tracker.start_stage("vector_retrieval")
        retrieved_chunks = vector_store.search(
            query=query_text,
            top_k=top_k,
            strategy_filter=strategy if strategy != "all" else None
        )
        tracker.end_stage("vector_retrieval")

        # Stage 5: Context Grounding & Sufficiency Guardrail
        tracker.start_stage("grounding_guardrail")
        grounding_verdict = guardrail_manager.evaluate_grounding(query_text, retrieved_chunks)
        verdicts.append(grounding_verdict)
        tracker.end_stage("grounding_guardrail")

        if not grounding_verdict.passed:
            return RAGPipelineResponse(
                query_id=query_id,
                input_type=input_type,
                stt_transcript=query_text,
                stt_engine=stt_engine_name,
                language_detected=language_detected,
                answer="ℹ️ I do not have sufficient information in the knowledge base to answer this question reliably. (Grounding threshold not met)",
                abstained=True,
                abstention_reason=grounding_verdict.reason,
                retrieved_chunks=retrieved_chunks,
                guardrail_verdicts=verdicts,
                tool_calls=tool_calls,
                circuit_breaker_status=global_circuit_breaker.state,
                latency_breakdown=tracker.get_breakdown()
            )

        # Stage 6: LLM Generation & Structured Synthesis
        tracker.start_stage("llm_generation")
        answer_text, raw_citations, ttft_ms, gen_ms = await answer_generator.generate_response(
            query=query_text,
            retrieved_chunks=retrieved_chunks,
            language=language_detected
        )
        tracker.record_stage("llm_ttft", ttft_ms)
        tracker.record_stage("llm_generation", gen_ms)
        tracker.end_stage("llm_generation")

        # Stage 7: Outbound Faithfulness & Hallucination Guardrail
        tracker.start_stage("outbound_guardrail")
        outbound_verdict = guardrail_manager.evaluate_outbound(answer_text, retrieved_chunks)
        verdicts.append(outbound_verdict)
        tracker.end_stage("outbound_guardrail")

        citations = [Citation(**c) for c in raw_citations]

        return RAGPipelineResponse(
            query_id=query_id,
            input_type=input_type,
            stt_transcript=query_text,
            stt_engine=stt_engine_name,
            language_detected=language_detected,
            answer=answer_text,
            abstained=False,
            citations=citations,
            retrieved_chunks=retrieved_chunks,
            guardrail_verdicts=verdicts,
            tool_calls=tool_calls,
            circuit_breaker_status=global_circuit_breaker.state,
            latency_breakdown=tracker.get_breakdown()
        )

# Global singleton
orchestrator = AgenticOrchestrator()
