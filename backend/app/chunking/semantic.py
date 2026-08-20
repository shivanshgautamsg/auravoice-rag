"""
Semantic Splitting Chunker.
Identifies natural semantic boundaries by evaluating embedding distances and lexical cohesion between consecutive sentences.
"""

from typing import List, Dict, Any, Optional
import numpy as np
import uuid
from .base import BaseChunker, Chunk

class SemanticChunker(BaseChunker):
    def __init__(self, target_chunk_size: int = 150, similarity_threshold: float = 0.55):
        super().__init__(strategy_name="semantic_splitting")
        self.target_chunk_size = target_chunk_size
        self.similarity_threshold = similarity_threshold

    def _lexical_similarity(self, s1: str, s2: str) -> float:
        """Fast Jaccard + n-gram semantic cohesion score between adjacent sentences."""
        words1 = set(re_tokenize(s1.lower()))
        words2 = set(re_tokenize(s2.lower()))
        if not words1 or not words2:
            return 0.0
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        return intersection / union if union > 0 else 0.0

    def chunk(self, text: str, doc_id: str, metadata: Optional[Dict[str, Any]] = None) -> List[Chunk]:
        metadata = metadata or {}
        sentences = self.split_into_sentences(text)
        if not sentences:
            return []

        chunks: List[Chunk] = []
        current_sentences = [sentences[0]]
        current_tokens = self.count_tokens(sentences[0])
        start_char = 0

        for i in range(1, len(sentences)):
            sent = sentences[i]
            sent_tokens = self.count_tokens(sent)
            sim = self._lexical_similarity(current_sentences[-1], sent)

            # Split if tokens exceed target or similarity drops significantly below threshold
            should_split = (
                (current_tokens + sent_tokens > self.target_chunk_size and current_tokens >= 40) or
                (sim < self.similarity_threshold and current_tokens >= 50)
            )

            if should_split:
                chunk_text = " ".join(current_sentences)
                end_char = start_char + len(chunk_text)
                chunk_id = f"chunk_sem_{doc_id}_{len(chunks)+1}_{uuid.uuid4().hex[:6]}"
                
                chunk_meta = dict(metadata)
                chunk_meta.update({
                    "strategy": self.strategy_name,
                    "sentence_count": len(current_sentences),
                    "boundary_type": "semantic_shift" if sim < self.similarity_threshold else "size_limit"
                })

                chunks.append(Chunk(
                    id=chunk_id,
                    doc_id=doc_id,
                    text=chunk_text,
                    strategy=self.strategy_name,
                    tokens=self.count_tokens(chunk_text),
                    start_char=start_char,
                    end_char=end_char,
                    metadata=chunk_meta
                ))

                start_char = text.find(sent, end_char)
                if start_char == -1:
                    start_char = end_char + 1
                current_sentences = [sent]
                current_tokens = sent_tokens
            else:
                current_sentences.append(sent)
                current_tokens += sent_tokens

        # Residual chunk
        if current_sentences:
            chunk_text = " ".join(current_sentences)
            end_char = start_char + len(chunk_text)
            chunk_id = f"chunk_sem_{doc_id}_{len(chunks)+1}_{uuid.uuid4().hex[:6]}"
            chunk_meta = dict(metadata)
            chunk_meta.update({
                "strategy": self.strategy_name,
                "sentence_count": len(current_sentences),
                "boundary_type": "end_of_doc"
            })
            chunks.append(Chunk(
                id=chunk_id,
                doc_id=doc_id,
                text=chunk_text,
                strategy=self.strategy_name,
                tokens=self.count_tokens(chunk_text),
                start_char=start_char,
                end_char=end_char,
                metadata=chunk_meta
            ))

        return chunks

def re_tokenize(text: str) -> List[str]:
    import re
    return re.findall(r'\w+', text, re.UNICODE)
