"""
Tests for Advanced Multi-Strategy Chunking Pipeline.
"""

import pytest
from app.chunking.semantic import SemanticChunker
from app.chunking.hierarchical import HierarchicalChunker
from app.chunking.propositional import PropositionalChunker
from app.chunking.metadata_aware import MetadataAwareChunker
from app.chunking.sliding_window import SlidingWindowChunker
from app.chunking.comparator import chunking_comparator

SAMPLE_TEXT = (
    "Chandrayaan-3 is the third lunar exploration mission developed by the Indian Space Research Organisation (ISRO). "
    "It was launched on 14 July 2023 from Satish Dhawan Space Centre in Sriharikota, Andhra Pradesh. "
    "The mission consisted of a lunar lander named Vikram and a lunar rover named Pragyan. "
    "On 23 August 2023, the Vikram lander successfully executed a soft landing near the lunar south pole region at 18:04 IST. "
    "This historic achievement made India the fourth country to successfully land on the Moon."
)

def test_semantic_chunker():
    chunker = SemanticChunker(target_chunk_size=50)
    chunks = chunker.chunk(SAMPLE_TEXT, doc_id="doc1")
    assert len(chunks) >= 2
    assert all(c.tokens > 0 for c in chunks)
    assert chunks[0].strategy == "semantic_splitting"

def test_hierarchical_chunker():
    chunker = HierarchicalChunker(parent_size=80, child_size=30)
    chunks = chunker.chunk(SAMPLE_TEXT, doc_id="doc1")
    assert len(chunks) >= 2
    assert any(c.parent_id is not None for c in chunks)
    assert all("parent_text" in c.metadata for c in chunks)

def test_propositional_chunker():
    chunker = PropositionalChunker(max_tokens_per_prop=30)
    chunks = chunker.chunk(SAMPLE_TEXT, doc_id="doc1")
    assert len(chunks) >= 4
    assert chunks[0].strategy == "propositional_atomic"

def test_metadata_aware_chunker():
    chunker = MetadataAwareChunker(target_chunk_size=60)
    chunks = chunker.chunk(SAMPLE_TEXT, doc_id="doc1", metadata={"title": "Chandrayaan-3", "language": "en"})
    assert len(chunks) >= 1
    assert "Chandrayaan-3" in chunks[0].text
    assert chunks[0].strategy == "metadata_aware_contextual"

def test_sliding_window_chunker():
    chunker = SlidingWindowChunker(window_size=40, step_size=20)
    chunks = chunker.chunk(SAMPLE_TEXT, doc_id="doc1")
    assert len(chunks) >= 2
    assert chunks[0].strategy == "dynamic_sliding_window"

def test_chunking_comparator():
    results = chunking_comparator.compare(SAMPLE_TEXT, doc_id="doc1")
    assert len(results) == 5
    for strat, res in results.items():
        assert res.total_chunks > 0
        assert res.avg_tokens_per_chunk > 0
        assert res.latency_ms >= 0
