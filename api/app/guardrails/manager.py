"""
Comprehensive Guardrail Manager.
Integrates Inbound Input Filtering, Context Sufficiency Checks, and Outbound Faithfulness Verification.
"""

import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from .input_filter import input_guardrail
from .grounding import grounding_guardrail
from .hallucination import hallucination_guardrail
from ..chunking.base import Chunk

class GuardrailVerdict(BaseModel):
    passed: bool
    stage: str  # 'inbound', 'retrieval_grounding', 'outbound_faithfulness'
    action: str  # 'proceed', 'abstain', 'block'
    reason: str
    telemetry: Dict[str, Any]
    latency_ms: float

class GuardrailManager:
    def evaluate_inbound(self, query: str) -> GuardrailVerdict:
        t_start = time.perf_counter()
        is_safe, reason, meta = input_guardrail.evaluate(query)
        t_elapsed = (time.perf_counter() - t_start) * 1000

        return GuardrailVerdict(
            passed=is_safe,
            stage="inbound",
            action="proceed" if is_safe else "block",
            reason=reason,
            telemetry=meta,
            latency_ms=round(t_elapsed, 3)
        )

    def evaluate_grounding(self, query: str, chunks: List[Chunk]) -> GuardrailVerdict:
        t_start = time.perf_counter()
        is_sufficient, reason, meta = grounding_guardrail.evaluate(query, chunks)
        t_elapsed = (time.perf_counter() - t_start) * 1000

        return GuardrailVerdict(
            passed=is_sufficient,
            stage="retrieval_grounding",
            action="proceed" if is_sufficient else "abstain",
            reason=reason,
            telemetry=meta,
            latency_ms=round(t_elapsed, 3)
        )

    def evaluate_outbound(self, answer: str, context_chunks: List[Chunk]) -> GuardrailVerdict:
        t_start = time.perf_counter()
        is_faithful, score, meta = hallucination_guardrail.evaluate(answer, context_chunks)
        t_elapsed = (time.perf_counter() - t_start) * 1000

        return GuardrailVerdict(
            passed=is_faithful,
            stage="outbound_faithfulness",
            action="proceed" if is_faithful else "abstain",
            reason=f"Faithfulness score: {score:.2f} (Verdict: {meta['verdict']})",
            telemetry=meta,
            latency_ms=round(t_elapsed, 3)
        )

guardrail_manager = GuardrailManager()
