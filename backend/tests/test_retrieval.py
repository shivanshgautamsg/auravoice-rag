"""
Tests for Hybrid Vector Store and Sub-200ms Retrieval.
"""

import time
import pytest
from app.vector_store.engine import vector_store
from app.vector_store.embeddings import embedding_engine

def test_embedding_generation():
    text = "Unified Payments Interface developed by NPCI"
    emb = embedding_engine.get_embedding(text)
    assert emb.shape == (384,)
    # Test caching speed
    t0 = time.perf_counter()
    emb_cached = embedding_engine.get_embedding(text)
    t_cached = (time.perf_counter() - t0) * 1000
    assert t_cached < 1.0  # <1ms cache hit

def test_vector_store_indexing():
    assert len(vector_store.chunks) > 0
    assert vector_store.matrix is not None
    assert vector_store.matrix.shape[0] == len(vector_store.chunks)

def test_hybrid_search_accuracy():
    query = "When did Chandrayaan-3 land on the Moon?"
    t0 = time.perf_counter()
    results = vector_store.search(query, top_k=3)
    t_retrieval = (time.perf_counter() - t0) * 1000

    assert len(results) > 0
    assert t_retrieval < 50.0  # Retrieval well under 50ms
    assert any("Chandrayaan" in r.text for r in results)

def test_cross_lingual_retrieval():
    hindi_query = "चंद्रयान-3 का लैंडर कौन सा था?"
    results = vector_store.search(hindi_query, top_k=3)
    assert len(results) > 0
