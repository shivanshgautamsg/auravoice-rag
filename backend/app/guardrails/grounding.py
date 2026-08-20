"""
Retrieval Grounding & Context Sufficiency Guardrail.
Determines whether retrieved context passages contain sufficient semantic evidence to answer the query,
triggering principled abstention when context is weak or unrelated.
"""

from typing import List, Tuple, Dict, Any
from ..chunking.base import Chunk
import re

class GroundingGuardrail:
    def __init__(self, min_similarity_threshold: float = 0.46, min_overlap_ratio: float = 0.15):
        self.min_similarity_threshold = min_similarity_threshold
        self.min_overlap_ratio = min_overlap_ratio

    def evaluate(self, query: str, retrieved_chunks: List[Chunk]) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Evaluates whether retrieved chunks are sufficient to answer the query.
        Returns: (is_sufficient, reason, metadata)
        """
        if not retrieved_chunks:
            return False, "Abstention: No relevant knowledge found in the indexed corpus.", {
                "decision": "abstain",
                "reason": "zero_chunks_retrieved",
                "top_score": 0.0
            }

        top_chunk = retrieved_chunks[0]
        top_score = top_chunk.score if top_chunk.score is not None else 0.0

        # Check semantic score threshold
        if top_score < self.min_similarity_threshold:
            return False, f"Abstention: Retrieved context similarity ({top_score:.3f}) is below the required confidence threshold ({self.min_similarity_threshold}).", {
                "decision": "abstain",
                "reason": "low_confidence_retrieval",
                "top_score": top_score,
                "threshold": self.min_similarity_threshold
            }

        # Check entity/keyword overlap between query and context (ignoring functional stopwords)
        stopwords = {
            "who", "what", "where", "when", "why", "how", "was", "were", "the",
            "and", "during", "with", "from", "for", "are", "is", "of", "in", "did",
            "does", "that", "this", "these", "those", "have", "has", "had", "can"
        }
        raw_words = set(re.findall(r'\b[a-zA-Z\u0900-\u0D7F]{3,}\b', query.lower()))
        content_query_words = raw_words - stopwords

        combined_text = " ".join([c.text.lower() for c in retrieved_chunks[:3]])
        context_words = set(re.findall(r'\b[a-zA-Z\u0900-\u0D7F]{3,}\b', combined_text))

        if content_query_words:
            overlap = len(content_query_words & context_words) / len(content_query_words)
        else:
            overlap = 1.0

        if overlap < 0.25 or top_score < self.min_similarity_threshold:
            return False, "Abstention: Key query entities or concepts not grounded in retrieved documents.", {
                "decision": "abstain",
                "reason": "insufficient_entity_grounding",
                "overlap_ratio": round(overlap, 3),
                "top_score": top_score,
                "unmatched_entities": list(content_query_words - context_words)[:5]
            }

        return True, "Context sufficiency validated.", {
            "decision": "proceed",
            "top_score": top_score,
            "overlap_ratio": round(overlap, 3),
            "retrieved_count": len(retrieved_chunks)
        }

grounding_guardrail = GroundingGuardrail()
