"""
Base Chunker abstractions and Chunk data models.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import re

class Chunk(BaseModel):
    id: str
    doc_id: str
    text: str
    parent_id: Optional[str] = None
    strategy: str
    tokens: int
    start_char: int
    end_char: int
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    # Vector store index score (set during retrieval)
    score: Optional[float] = None
    rank: Optional[int] = None

class ChunkingResult(BaseModel):
    strategy: str
    total_chunks: int
    avg_tokens_per_chunk: float
    min_tokens: int
    max_tokens: int
    chunks: List[Chunk]
    latency_ms: float

class BaseChunker(ABC):
    def __init__(self, strategy_name: str):
        self.strategy_name = strategy_name

    def count_tokens(self, text: str) -> int:
        """Approximates token count (word tokens + punctuation handling)."""
        words = re.findall(r'\w+|[^\w\s]', text, re.UNICODE)
        return max(1, len(words))

    def split_into_sentences(self, text: str) -> List[str]:
        """Splits text into sentences supporting English and Indic punctuation (।)."""
        # Split on ., !, ?, or Devanagari danda ।
        sentence_endings = re.compile(r'(?<=[.!?।])\s+')
        sentences = sentence_endings.split(text.strip())
        return [s.strip() for s in sentences if s.strip()]

    @abstractmethod
    def chunk(self, text: str, doc_id: str, metadata: Optional[Dict[str, Any]] = None) -> List[Chunk]:
        """Chunks a document passage into a list of Chunk objects."""
        pass
