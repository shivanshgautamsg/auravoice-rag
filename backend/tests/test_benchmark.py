"""
Tests for P50 / P70 / P100 Latency Benchmark Suite.
"""

import pytest
from app.analytics.benchmark import calculate_percentiles, benchmark_runner
from app.harness.orchestrator import orchestrator

def test_percentile_calculation():
    sample_latencies = [10.0, 20.0, 30.0, 40.0, 50.0, 60.0, 70.0, 80.0, 90.0, 100.0]
    stats = calculate_percentiles(sample_latencies)
    
    assert stats.min == 10.0
    assert stats.p100 == 100.0
    assert stats.p50 == 55.0
    assert stats.p70 == 73.0
    assert stats.mean == 55.0

@pytest.mark.asyncio
async def test_benchmark_runner_execution():
    report = await benchmark_runner.run_benchmark(orchestrator=orchestrator, query_count=15)
    
    assert report.total_queries == 15
    assert report.percentiles.p50 > 0
    assert report.percentiles.p70 >= report.percentiles.p50
    assert report.percentiles.p100 >= report.percentiles.p70
    assert report.sub_200ms_compliance_pct >= 80.0
    assert len(report.query_log) > 0
