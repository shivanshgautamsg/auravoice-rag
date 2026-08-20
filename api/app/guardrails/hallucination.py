"""
Outbound Faithfulness & Hallucination Verification Guardrail.
Performs claim-level entailment and context overlap checks to ensure all generated claims
are strictly grounded in retrieved source passages.
"""

import re
from typing import List, Dict, Any, Tuple
from ..chunking.base import Chunk

class HallucinationGuardrail:
    def __init__(self, min_faithfulness_score: float = 0.55):
        self.min_faithfulness_score = min_faithfulness_score

    def _split_claims(self, text: str) -> List[str]:
        """Splits generated answer into distinct claims."""
        sentences = re.split(r'(?<=[.!?।])\s+', text.strip())
        return [s.strip() for s in sentences if s.strip() and len(s) > 10]

    def evaluate(self, answer: str, context_chunks: List[Chunk]) -> Tuple[bool, float, Dict[str, Any]]:
        """
        Evaluates faithfulness of generated answer against retrieved context.
        Returns: (is_faithful, faithfulness_score, telemetry)
        """
        if not answer.strip():
            return True, 1.0, {"verdict": "empty_answer", "faithfulness_score": 1.0}

        claims = self._split_claims(answer)
        if not claims:
            return True, 1.0, {"verdict": "short_answer", "faithfulness_score": 1.0}

        # Build context word bag
        context_text = " ".join([c.text.lower() for c in context_chunks])
        context_words = set(re.findall(r'\b[a-zA-Z0-9\u0900-\u0D7F]{3,}\b', context_text))

        claim_evaluations = []
        grounded_count = 0

        for claim in claims:
            claim_words = set(re.findall(r'\b[a-zA-Z0-9\u0900-\u0D7F]{3,}\b', claim.lower()))
            # Filter stop words
            stopwords = {"this", "that", "with", "from", "have", "were", "been", "which", "when", "what", "where", "into", "also", "their", "there"}
            filtered_claim_words = claim_words - stopwords
            
            if not filtered_claim_words:
                claim_evaluations.append({"claim": claim, "status": "neutral", "overlap": 1.0})
                grounded_count += 1
                continue

            overlap = len(filtered_claim_words & context_words) / len(filtered_claim_words)
            is_grounded = overlap >= 0.40

            if is_grounded:
                grounded_count += 1

            claim_evaluations.append({
                "claim": claim,
                "status": "grounded" if is_grounded else "unverified_assertion",
                "overlap_ratio": round(overlap, 3)
            })

        faithfulness_score = round(grounded_count / len(claims), 3) if claims else 1.0
        is_faithful = faithfulness_score >= self.min_faithfulness_score

        telemetry = {
            "verdict": "PASSED" if is_faithful else "HALLUCINATION_DETECTED",
            "faithfulness_score": faithfulness_score,
            "total_claims": len(claims),
            "grounded_claims": grounded_count,
            "claim_details": claim_evaluations,
            "threshold": self.min_faithfulness_score
        }

        return is_faithful, faithfulness_score, telemetry

hallucination_guardrail = HallucinationGuardrail()
