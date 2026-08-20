"""
Metadata-Aware and Contextual Chunker.
Injects structured contextual headers (Document title, domain, language, section markers)
directly into chunk payloads to prevent context drift and enrich vector embeddings.
"""

from typing import List, Dict, Any, Optional
import uuid
from .base import BaseChunker, Chunk

class MetadataAwareChunker(BaseChunker):
    def __init__(self, target_chunk_size: int = 120, overlap_sentences: int = 1):
        super().__init__(strategy_name="metadata_aware_contextual")
        self.target_chunk_size = target_chunk_size
        self.overlap_sentences = overlap_sentences

    def chunk(self, text: str, doc_id: str, metadata: Optional[Dict[str, Any]] = None) -> List[Chunk]:
        metadata = metadata or {}
        title = metadata.get("title", "Document")
        domain = metadata.get("domain", "General Knowledge")
        language = metadata.get("language", "en")

        sentences = self.split_into_sentences(text)
        if not sentences:
            return []

        chunks: List[Chunk] = []
        start_idx = 0
        total_sents = len(sentences)
        section_idx = 1

        while start_idx < total_sents:
            current_sents = []
            current_tokens = 0
            idx = start_idx

            while idx < total_sents:
                s = sentences[idx]
                s_toks = self.count_tokens(s)
                if current_tokens + s_toks > self.target_chunk_size and current_sents:
                    break
                current_sents.append(s)
                current_tokens += s_toks
                idx += 1

            # Build contextual header
            header = f"[{title} | Domain: {domain} | Lang: {language} | Part {section_idx}] "
            body_text = " ".join(current_sents)
            enriched_text = header + body_text

            chunk_id = f"chunk_meta_{doc_id}_{section_idx}_{uuid.uuid4().hex[:4]}"
            chunk_meta = dict(metadata)
            chunk_meta.update({
                "strategy": self.strategy_name,
                "header_prefix": header,
                "raw_text": body_text,
                "section_part": section_idx,
                "language": language,
                "domain": domain
            })

            chunks.append(Chunk(
                id=chunk_id,
                doc_id=doc_id,
                text=enriched_text,
                strategy=self.strategy_name,
                tokens=self.count_tokens(enriched_text),
                start_char=text.find(current_sents[0]) if current_sents else 0,
                end_char=text.find(current_sents[-1]) + len(current_sents[-1]) if current_sents else 0,
                metadata=chunk_meta
            ))

            # Step with overlap
            advance = max(1, len(current_sents) - self.overlap_sentences)
            start_idx += advance
            section_idx += 1

        return chunks
