"""
Chunking Strategy Comparator.
Executes and compares all 5 chunking strategies side-by-side with statistical telemetry.
"""

import time
from typing import Dict, Any, List
from .base import ChunkingResult
from .semantic import SemanticChunker
from .hierarchical import HierarchicalChunker
from .propositional import PropositionalChunker
from .metadata_aware import MetadataAwareChunker
from .sliding_window import SlidingWindowChunker

class ChunkingComparator:
    def __init__(self):
        self.chunkers = {
            "semantic_splitting": SemanticChunker(target_chunk_size=120),
            "hierarchical_parent_child": HierarchicalChunker(parent_size=200, child_size=50),
            "propositional_atomic": PropositionalChunker(max_tokens_per_prop=35),
            "metadata_aware_contextual": MetadataAwareChunker(target_chunk_size=110),
            "dynamic_sliding_window": SlidingWindowChunker(window_size=90, step_size=50)
        }

    def compare(self, text: str, doc_id: str = "demo_doc", metadata: Dict[str, Any] = None) -> Dict[str, ChunkingResult]:
        metadata = metadata or {
            "title": "Benchmark Sample",
            "language": "en",
            "domain": "Cross-Lingual Knowledge"
        }
        
        results: Dict[str, ChunkingResult] = {}

        for strategy_name, chunker in self.chunkers.items():
            t_start = time.perf_counter()
            chunks = chunker.chunk(text, doc_id=doc_id, metadata=metadata)
            t_end = time.perf_counter()

            token_counts = [c.tokens for c in chunks] if chunks else [0]
            avg_tokens = sum(token_counts) / len(token_counts) if token_counts else 0.0

            results[strategy_name] = ChunkingResult(
                strategy=strategy_name,
                total_chunks=len(chunks),
                avg_tokens_per_chunk=round(avg_tokens, 1),
                min_tokens=min(token_counts) if token_counts else 0,
                max_tokens=max(token_counts) if token_counts else 0,
                chunks=chunks,
                latency_ms=round((t_end - t_start) * 1000, 3)
            )

        return results

    def get_chunker(self, strategy_name: str):
        return self.chunkers.get(strategy_name, self.chunkers["semantic_splitting"])

# Global singleton
chunking_comparator = ChunkingComparator()
