"""
Tests for Agentic Orchestration Harness, Tool Calls, and Circuit Breakers.
"""

import pytest
from app.harness.orchestrator import orchestrator
from app.harness.retry import CircuitBreaker, resilient_execute

@pytest.mark.asyncio
async def test_end_to_end_query_pipeline():
    query = "Who developed the Unified Payments Interface (UPI)?"
    response = await orchestrator.process_query(query, strategy="semantic_splitting")
    
    assert response.stt_transcript == query
    assert len(response.retrieved_chunks) > 0
    assert not response.abstained
    assert len(response.citations) > 0
    assert response.latency_breakdown.total_pipeline_ms > 0
    assert response.circuit_breaker_status == "CLOSED"

@pytest.mark.asyncio
async def test_abstention_on_unanswerable_query():
    unanswerable = "Who was the emperor of Pluto during the Bronze Age?"
    response = await orchestrator.process_query(unanswerable, strategy="semantic_splitting")
    assert response.abstained
    reason_str = (response.abstention_reason or "").lower()
    assert "abstain" in reason_str or "abstention" in reason_str or "insufficient" in response.answer.lower()

def test_circuit_breaker_state_transitions():
    cb = CircuitBreaker(failure_threshold=2, recovery_timeout_sec=0.1)
    assert cb.state == "CLOSED"
    assert cb.allow_execution()
    
    cb.record_failure()
    assert cb.state == "CLOSED"
    
    cb.record_failure()
    assert cb.state == "OPEN"
    assert not cb.allow_execution()
