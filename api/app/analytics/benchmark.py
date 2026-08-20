"""
Benchmark Suite & Latency Analytics Engine.
Evaluates P50, P70, P100 latency percentiles and RAG accuracy across the MSMARCO-XI dataset.
"""

import time
import numpy as np
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from ..dataset.loader import dataset_loader

class PercentileStats(BaseModel):
    p50: float
    p70: float
    p90: float
    p95: float
    p99: float
    p100: float  # Max latency
    min: float
    mean: float
    std: float

class StagePercentiles(BaseModel):
    stt: PercentileStats
    embedding: PercentileStats
    retrieval: PercentileStats
    guardrails: PercentileStats
    llm_generation: PercentileStats
    total_pipeline: PercentileStats

class BenchmarkReport(BaseModel):
    total_queries: int
    successful_queries: int
    abstained_queries: int
    blocked_queries: int
    sub_200ms_compliance_pct: float
    retrieval_accuracy_pct: float
    faithfulness_rate_pct: float
    percentiles: PercentileStats
    stage_percentiles: StagePercentiles
    query_log: List[Dict[str, Any]] = Field(default_factory=list)
    timestamp: str

def calculate_percentiles(values: List[float]) -> PercentileStats:
    if not values:
        return PercentileStats(p50=0, p70=0, p90=0, p95=0, p99=0, p100=0, min=0, mean=0, std=0)
    
    arr = np.array(values, dtype=np.float64)
    return PercentileStats(
        p50=round(float(np.percentile(arr, 50)), 2),
        p70=round(float(np.percentile(arr, 70)), 2),
        p90=round(float(np.percentile(arr, 90)), 2),
        p95=round(float(np.percentile(arr, 95)), 2),
        p99=round(float(np.percentile(arr, 99)), 2),
        p100=round(float(np.max(arr)), 2),
        min=round(float(np.min(arr)), 2),
        mean=round(float(np.mean(arr)), 2),
        std=round(float(np.std(arr)), 2)
    )

class BenchmarkRunner:
    async def run_benchmark(
        self,
        orchestrator,
        query_count: int = 50,
        strategy: str = "semantic_splitting"
    ) -> BenchmarkReport:
        """Runs batch evaluation across MSMARCO-XI queries and calculates P50/P70/P100 metrics."""
        queries = dataset_loader.get_benchmark_queries(count=query_count)
        
        total_latencies: List[float] = []
        stt_latencies: List[float] = []
        embed_latencies: List[float] = []
        retrieval_latencies: List[float] = []
        guardrail_latencies: List[float] = []
        gen_latencies: List[float] = []

        query_logs = []
        correct_retrievals = 0
        faithful_generations = 0
        abstained_count = 0
        blocked_count = 0

        for q_item in queries:
            query_text = q_item["query"]
            expected_doc = q_item.get("expected_doc_id")
            answerable = q_item.get("answerable", True)

            response = await orchestrator.process_query(
                query_text=query_text,
                strategy=strategy,
                input_type="benchmark_text"
            )

            bd = response.latency_breakdown
            total_latencies.append(bd.total_pipeline_ms)
            stt_latencies.append(bd.stt_latency_ms)
            embed_latencies.append(bd.embedding_latency_ms)
            retrieval_latencies.append(bd.vector_retrieval_ms)
            guardrail_latencies.append(bd.inbound_guardrail_ms + bd.grounding_guardrail_ms + bd.outbound_guardrail_ms)
            gen_latencies.append(bd.llm_generation_ms)

            # Check precision & correctness
            retrieved_doc_ids = [c.doc_id for c in response.retrieved_chunks]
            if expected_doc and expected_doc in retrieved_doc_ids and answerable and not response.abstained:
                correct_retrievals += 1

            if response.abstained:
                abstained_count += 1
            
            # Check safety block
            if any(v.action == "block" for v in response.guardrail_verdicts):
                blocked_count += 1

            # Check faithfulness on generated answers
            if not response.abstained:
                outbound_passed = any(v.stage == "outbound_faithfulness" and v.passed for v in response.guardrail_verdicts)
                if outbound_passed:
                    faithful_generations += 1

            query_logs.append({
                "query": query_text,
                "domain": q_item.get("domain", "General"),
                "language": q_item.get("language", "en"),
                "answerable": answerable,
                "total_ms": bd.total_pipeline_ms,
                "retrieval_ms": bd.vector_retrieval_ms,
                "abstained": response.abstained,
                "sub_200ms": bd.sub_200ms_target_met
            })

        # Compliance rate
        sub_200_count = sum(1 for lat in total_latencies if lat <= 200.0)
        compliance_pct = round((sub_200_count / len(total_latencies)) * 100.0, 1)
        
        answerable_queries_count = sum(1 for q in queries if q.get("answerable", True))
        retrieval_acc = min(100.0, round((correct_retrievals / max(1, answerable_queries_count)) * 100.0, 1))
        successful_gens = max(1, len(queries) - abstained_count - blocked_count)
        faith_pct = min(100.0, round((faithful_generations / successful_gens) * 100.0, 1))

        import datetime
        return BenchmarkReport(
            total_queries=len(queries),
            successful_queries=len(queries) - abstained_count - blocked_count,
            abstained_queries=abstained_count,
            blocked_queries=blocked_count,
            sub_200ms_compliance_pct=compliance_pct,
            retrieval_accuracy_pct=retrieval_acc,
            faithfulness_rate_pct=faith_pct,
            percentiles=calculate_percentiles(total_latencies),
            stage_percentiles=StagePercentiles(
                stt=calculate_percentiles(stt_latencies),
                embedding=calculate_percentiles(embed_latencies),
                retrieval=calculate_percentiles(retrieval_latencies),
                guardrails=calculate_percentiles(guardrail_latencies),
                llm_generation=calculate_percentiles(gen_latencies),
                total_pipeline=calculate_percentiles(total_latencies)
            ),
            query_log=query_logs[:25],
            timestamp=datetime.datetime.now().isoformat()
        )

benchmark_runner = BenchmarkRunner()
