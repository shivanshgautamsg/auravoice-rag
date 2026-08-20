"""
Dynamic Sliding Window Chunker with Sentence Boundary Alignment.
Splits text into overlapping windows while strictly preserving sentence boundaries.
"""

from typing import List, Dict, Any, Optional
import uuid
from .base import BaseChunker, Chunk

class SlidingWindowChunker(BaseChunker):
    def __init__(self, window_size: int = 100, step_size: int = 60):
        super().__init__(strategy_name="dynamic_sliding_window")
        self.window_size = window_size
        self.step_size = step_size

    def chunk(self, text: str, doc_id: str, metadata: Optional[Dict[str, Any]] = None) -> List[Chunk]:
        metadata = metadata or {}
        sentences = self.split_into_sentences(text)
        if not sentences:
            return []

        chunks: List[Chunk] = []
        sent_start_idx = 0
        total_sents = len(sentences)
        window_idx = 1

        while sent_start_idx < total_sents:
            current_sents = []
            current_tokens = 0
            idx = sent_start_idx

            while idx < total_sents:
                s = sentences[idx]
                s_toks = self.count_tokens(s)
                if current_tokens + s_toks > self.window_size and current_sents:
                    break
                current_sents.append(s)
                current_tokens += s_toks
                idx += 1

            chunk_text = " ".join(current_sents)
            chunk_id = f"chunk_slide_{doc_id}_{window_idx}_{uuid.uuid4().hex[:4]}"
            chunk_meta = dict(metadata)
            chunk_meta.update({
                "strategy": self.strategy_name,
                "window_idx": window_idx,
                "overlap_mode": "sentence_aligned",
                "sentence_count": len(current_sents)
            })

            chunks.append(Chunk(
                id=chunk_id,
                doc_id=doc_id,
                text=chunk_text,
                strategy=self.strategy_name,
                tokens=self.count_tokens(chunk_text),
                start_char=text.find(current_sents[0]) if current_sents else 0,
                end_char=text.find(current_sents[-1]) + len(current_sents[-1]) if current_sents else 0,
                metadata=chunk_meta
            ))

            if idx >= total_sents:
                break

            # Calculate advance based on step size
            acc_tokens = 0
            advance_sents = 0
            for s in current_sents:
                acc_tokens += self.count_tokens(s)
                advance_sents += 1
                if acc_tokens >= self.step_size:
                    break

            sent_start_idx += max(1, advance_sents)
            window_idx += 1

        return chunks
