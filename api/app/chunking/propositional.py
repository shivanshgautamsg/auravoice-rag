"""
Propositional (Atomic Fact) Chunker.
Decomposes complex paragraphs and compound clauses into standalone, atomic factual propositions.
Ideal for precise question answering without contextual noise.
"""

from typing import List, Dict, Any, Optional
import re
import uuid
from .base import BaseChunker, Chunk

class PropositionalChunker(BaseChunker):
    def __init__(self, max_tokens_per_prop: int = 40):
        super().__init__(strategy_name="propositional_atomic")
        self.max_tokens_per_prop = max_tokens_per_prop

    def _extract_propositions(self, sentence: str, subject_hint: str = "") -> List[str]:
        """Deconstructs compound sentences into independent atomic assertions."""
        # Split on coordinating clauses while preserving core entity context
        delimiters = re.compile(r'(?:;\s*|,\s*(?:and|while|which|who|where|featuring|with|including)\s+|\.\s*)', re.IGNORECASE)
        parts = [p.strip() for p in delimiters.split(sentence) if p.strip()]
        
        propositions = []
        for i, part in enumerate(parts):
            prop = part
            # If sub-clause lacks subject but has verb, prepend subject hint
            if i > 0 and subject_hint and not re.match(r'^(It|This|They|He|She|The)\b', prop, re.IGNORECASE):
                prop = f"{subject_hint} {prop}"
            # Ensure proper capitalization and period
            prop = prop[0].upper() + prop[1:] if prop else prop
            if not prop.endswith('.'):
                prop += '.'
            propositions.append(prop)
        return propositions if propositions else [sentence]

    def chunk(self, text: str, doc_id: str, metadata: Optional[Dict[str, Any]] = None) -> List[Chunk]:
        metadata = metadata or {}
        sentences = self.split_into_sentences(text)
        if not sentences:
            return []

        # Extract subject from first sentence
        first_words = re.findall(r'\b[A-Z][a-z0-9\-]+\b', sentences[0])
        subject_hint = " ".join(first_words[:3]) if first_words else "The topic"

        chunks: List[Chunk] = []
        char_offset = 0

        for s_idx, sent in enumerate(sentences):
            props = self._extract_propositions(sent, subject_hint)
            for p_idx, prop in enumerate(props):
                chunk_id = f"chunk_prop_{doc_id}_{s_idx+1}_{p_idx+1}_{uuid.uuid4().hex[:4]}"
                
                chunk_meta = dict(metadata)
                chunk_meta.update({
                    "strategy": self.strategy_name,
                    "atomic_type": "factual_proposition",
                    "origin_sentence": sent,
                    "subject_entity": subject_hint
                })

                c_tokens = self.count_tokens(prop)
                chunks.append(Chunk(
                    id=chunk_id,
                    doc_id=doc_id,
                    text=prop,
                    strategy=self.strategy_name,
                    tokens=c_tokens,
                    start_char=char_offset,
                    end_char=char_offset + len(prop),
                    metadata=chunk_meta
                ))
            char_offset += len(sent) + 1

        return chunks
