"""
High-Resolution Microsecond Latency Tracker & Telemetry Collector.
"""

import time
from typing import Dict, List, Any
from ..harness.schemas import LatencyBreakdown

class LatencyTracker:
    def __init__(self):
        self.reset()

    def reset(self):
        self.timers: Dict[str, float] = {}
        self.durations: Dict[str, float] = {}

    def start_stage(self, stage_name: str):
        self.timers[stage_name] = time.perf_counter()

    def end_stage(self, stage_name: str) -> float:
        if stage_name in self.timers:
            elapsed = (time.perf_counter() - self.timers[stage_name]) * 1000.0
            self.durations[stage_name] = round(elapsed, 3)
            return self.durations[stage_name]
        return 0.0

    def record_stage(self, stage_name: str, duration_ms: float):
        self.durations[stage_name] = round(duration_ms, 3)

    def get_breakdown(self) -> LatencyBreakdown:
        stt = self.durations.get("stt", 0.0)
        inbound = self.durations.get("inbound_guardrail", 0.0)
        plan = self.durations.get("query_planning", 0.0)
        embed = self.durations.get("embedding", 0.0)
        retrieval = self.durations.get("vector_retrieval", 0.0)
        grounding = self.durations.get("grounding_guardrail", 0.0)
        ttft = self.durations.get("llm_ttft", 0.0)
        gen = self.durations.get("llm_generation", 0.0)
        outbound = self.durations.get("outbound_guardrail", 0.0)

        total = round(stt + inbound + plan + embed + retrieval + grounding + gen + outbound, 2)
        
        return LatencyBreakdown(
            stt_latency_ms=stt,
            inbound_guardrail_ms=inbound,
            query_planning_ms=plan,
            embedding_latency_ms=embed,
            vector_retrieval_ms=retrieval,
            grounding_guardrail_ms=grounding,
            llm_ttft_ms=ttft,
            llm_generation_ms=gen,
            outbound_guardrail_ms=outbound,
            total_pipeline_ms=total,
            sub_200ms_target_met=(total <= 200.0)
        )
