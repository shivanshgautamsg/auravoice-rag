"""
Hierarchical (Parent-Child) Chunker.
Generates small, pinpoint child chunks for ultra-fast, high-precision vector retrieval,
linked back to rich parent context chunks for grounded LLM answer generation.
"""

from typing import List, Dict, Any, Optional
import uuid
from .base import BaseChunker, Chunk

class HierarchicalChunker(BaseChunker):
    def __init__(self, parent_size: int = 250, child_size: int = 60, child_overlap: int = 15):
        super().__init__(strategy_name="hierarchical_parent_child")
        self.parent_size = parent_size
        self.child_size = child_size
        self.child_overlap = child_overlap

    def chunk(self, text: str, doc_id: str, metadata: Optional[Dict[str, Any]] = None) -> List[Chunk]:
        metadata = metadata or {}
        sentences = self.split_into_sentences(text)
        if not sentences:
            return []

        chunks: List[Chunk] = []

        # 1. Generate Parent Chunks
        parent_sentences: List[str] = []
        current_parent_tokens = 0
        parent_start_char = 0
        parent_id_counter = 1

        parent_chunks: List[Dict[str, Any]] = []

        for sent in sentences:
            sent_tokens = self.count_tokens(sent)
            if current_parent_tokens + sent_tokens > self.parent_size and parent_sentences:
                parent_text = " ".join(parent_sentences)
                pid = f"parent_{doc_id}_{parent_id_counter}"
                parent_chunks.append({
                    "id": pid,
                    "text": parent_text,
                    "tokens": current_parent_tokens,
                    "start_char": parent_start_char,
                    "end_char": parent_start_char + len(parent_text)
                })
                parent_id_counter += 1
                parent_start_char = text.find(sent, parent_start_char + len(parent_text))
                if parent_start_char == -1:
                    parent_start_char = 0
                parent_sentences = [sent]
                current_parent_tokens = sent_tokens
            else:
                parent_sentences.append(sent)
                current_parent_tokens += sent_tokens

        if parent_sentences:
            parent_text = " ".join(parent_sentences)
            pid = f"parent_{doc_id}_{parent_id_counter}"
            parent_chunks.append({
                "id": pid,
                "text": parent_text,
                "tokens": current_parent_tokens,
                "start_char": parent_start_char,
                "end_char": parent_start_char + len(parent_text)
            })

        # 2. For each parent, split into granular child chunks for fast vector indexing
        for p in parent_chunks:
            p_text = p["text"]
            p_sentences = self.split_into_sentences(p_text)
            
            c_sentences: List[str] = []
            c_tokens = 0
            c_idx = 1
            
            for sent in p_sentences:
                s_tokens = self.count_tokens(sent)
                if c_tokens + s_tokens > self.child_size and c_sentences:
                    child_text = " ".join(c_sentences)
                    cid = f"child_{doc_id}_{p['id']}_{c_idx}_{uuid.uuid4().hex[:4]}"
                    
                    c_meta = dict(metadata)
                    c_meta.update({
                        "strategy": self.strategy_name,
                        "is_child": True,
                        "parent_id": p["id"],
                        "parent_text": p["text"],
                        "parent_tokens": p["tokens"]
                    })

                    chunks.append(Chunk(
                        id=cid,
                        doc_id=doc_id,
                        text=child_text,
                        parent_id=p["id"],
                        strategy=self.strategy_name,
                        tokens=self.count_tokens(child_text),
                        start_char=p["start_char"],
                        end_char=p["end_char"],
                        metadata=c_meta
                    ))
                    c_idx += 1
                    c_sentences = [sent]
                    c_tokens = s_tokens
                else:
                    c_sentences.append(sent)
                    c_tokens += s_tokens

            if c_sentences:
                child_text = " ".join(c_sentences)
                cid = f"child_{doc_id}_{p['id']}_{c_idx}_{uuid.uuid4().hex[:4]}"
                c_meta = dict(metadata)
                c_meta.update({
                    "strategy": self.strategy_name,
                    "is_child": True,
                    "parent_id": p["id"],
                    "parent_text": p["text"],
                    "parent_tokens": p["tokens"]
                })
                chunks.append(Chunk(
                    id=cid,
                    doc_id=doc_id,
                    text=child_text,
                    parent_id=p["id"],
                    strategy=self.strategy_name,
                    tokens=self.count_tokens(child_text),
                    start_char=p["start_char"],
                    end_char=p["end_char"],
                    metadata=c_meta
                ))

        return chunks
