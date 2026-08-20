"""
CLI Benchmark Runner for Voice-Enabled RAG System (HH Goa 2026).
Computes P50, P70, P100 latency metrics across the MSMARCO-XI test suite.
"""

import os
import sys
import asyncio
import json
import argparse
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from app.analytics.benchmark import benchmark_runner
from app.harness.orchestrator import orchestrator
from app.config import settings

async def main():
    parser = argparse.ArgumentParser(description="Run P50/P70/P100 Latency Benchmark for HH Goa 2026")
    parser.add_argument("--queries", type=int, default=50, help="Number of benchmark queries to run (default: 50)")
    parser.add_argument("--strategy", type=str, default="semantic_splitting", help="Chunking strategy to benchmark")
    parser.add_argument("--output", type=str, default="latency_report.json", help="Output JSON report file")
    args = parser.parse_args()

    print("\n" + "="*75)
    print(f"🚀 AuraVoice RAG - Benchmark Suite (HH Goa 2026 Task 2)")
    print(f"📊 Strategy: {args.strategy} | Queries: {args.queries} | Target Latency: <{settings.TARGET_LATENCY_MS}ms")
    print("="*75 + "\n")

    report = await benchmark_runner.run_benchmark(
        orchestrator=orchestrator,
        query_count=args.queries,
        strategy=args.strategy
    )

    print(f"✅ Executed {report.total_queries} queries successfully.\n")
    print("📈 TOTAL PIPELINE LATENCY PERCENTILES:")
    print(f"   • P50 Latency:   {report.percentiles.p50} ms")
    print(f"   • P70 Latency:   {report.percentiles.p70} ms")
    print(f"   • P90 Latency:   {report.percentiles.p90} ms")
    print(f"   • P95 Latency:   {report.percentiles.p95} ms")
    print(f"   • P99 Latency:   {report.percentiles.p99} ms")
    print(f"   • P100 (Max):    {report.percentiles.p100} ms")
    print(f"   • Mean Latency:  {report.percentiles.mean} ms (Std: ±{report.percentiles.std} ms)")
    print(f"   • Min Latency:   {report.percentiles.min} ms")
    print(f"\n🎯 Sub-200ms Compliance Rate: {report.sub_200ms_compliance_pct}%")
    print(f"🔍 Retrieval Accuracy:       {report.retrieval_accuracy_pct}%")
    print(f"🛡️ Faithfulness Rate:        {report.faithfulness_rate_pct}%")
    print(f"🛑 Abstained Queries:        {report.abstained_queries}")
    print(f"🚫 Blocked Threats:          {report.blocked_queries}")

    print("\n⏱️ STAGE-BY-STAGE PERCENTILE BREAKDOWN:")
    print(f"   • STT Inference:       P50 = {report.stage_percentiles.stt.p50}ms | P70 = {report.stage_percentiles.stt.p70}ms | P100 = {report.stage_percentiles.stt.p100}ms")
    print(f"   • Dense Embedding:     P50 = {report.stage_percentiles.embedding.p50}ms | P70 = {report.stage_percentiles.embedding.p70}ms | P100 = {report.stage_percentiles.embedding.p100}ms")
    print(f"   • Hybrid Retrieval:    P50 = {report.stage_percentiles.retrieval.p50}ms | P70 = {report.stage_percentiles.retrieval.p70}ms | P100 = {report.stage_percentiles.retrieval.p100}ms")
    print(f"   • Guardrail Checks:    P50 = {report.stage_percentiles.guardrails.p50}ms | P70 = {report.stage_percentiles.guardrails.p70}ms | P100 = {report.stage_percentiles.guardrails.p100}ms")
    print(f"   • LLM Gen / Synthesis: P50 = {report.stage_percentiles.llm_generation.p50}ms | P70 = {report.stage_percentiles.llm_generation.p70}ms | P100 = {report.stage_percentiles.llm_generation.p100}ms")

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(report.model_dump(), f, indent=2)
    print(f"\n💾 Saved full JSON report to: {os.path.abspath(args.output)}\n")

if __name__ == "__main__":
    asyncio.run(main())
