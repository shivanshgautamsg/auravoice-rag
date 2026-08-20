# AuraVoice RAG: Deep Technical Architecture Document
**HH Goa 2026 Shortlisting Task 2 — Winning Architecture**

---

## 1. System Overview

AuraVoice RAG is a voice-first, sub-200ms Retrieval-Augmented Generation (RAG) system engineered specifically for multilingual Indian and cross-lingual contexts on the `ai4bharat/MSMARCO-XI` dataset.

```
+---------------------------------------------------------------------------------------------+
|                                    AuraVoice RAG Pipeline                                   |
|                                                                                             |
|   [ Voice Input / Mic ]                                                                     |
|            |                                                                                |
|            v                                                                                |
|   [ STT Layer: Sarvam AI (saarika:v2) / ElevenLabs / Neural Sim ]                           |
|            |                                                                                |
|            v                                                                                |
|   [ Inbound Guardrail: Prompt Injection & Scope Classifier ]  --> (Reject if Malicious)      |
|            |                                                                                |
|            v                                                                                |
|   [ Agentic Harness: Query Planner & Schema Validator ]                                     |
|            |                                                                                |
|            v                                                                                |
|   [ 5-Strategy Vector Retrieval Engine: Turbo HNSW + BM25 with Reciprocal Rank Fusion ]     |
|            |                                                                                |
|            v                                                                                |
|   [ Grounding Guardrail: Context Sufficiency Check ] ----------> (Abstain if Insufficient)   |
|            |                                                                                |
|            v                                                                                |
|   [ LLM Structured Generation with Citation Tagging [Doc X] ]                               |
|            |                                                                                |
|            v                                                                                |
|   [ Outbound Guardrail: Claim-by-Claim NLI Faithfulness Verifier ]                          |
|            |                                                                                |
|            v                                                                                |
|   [ Streaming Audio / Grounded Text Response + Microsecond Telemetry Waterfall ]            |
+---------------------------------------------------------------------------------------------+
```

---

## 2. Advanced Multi-Strategy Chunking Pipeline

Rather than relying on naive fixed-size chunking, AuraVoice RAG implements **5 distinct chunking architectures**:

### Strategy 1: Semantic Splitting (`semantic_splitting`)
- **Algorithm**: Splits text into sentences using punctuation boundaries (including Devanagari danda `।`). Computes sentence-level semantic embeddings and adjacent cohesion scores.
- **Boundary Detection**: Identifies percentile distance inflection points ($sim < \theta$). If cosine similarity drops below 0.55 or token length crosses target thresholds, a new semantic cluster is initialized.
- **Advantage**: Preserves natural conceptual units and prevents fragmented sentences.

### Strategy 2: Hierarchical Parent-Child (`hierarchical_parent_child`)
- **Algorithm**: Generates a two-tiered indexing hierarchy:
  - **Child Chunks**: Fine-grained (40–60 tokens) for high-precision, low-latency vector retrieval.
  - **Parent Chunks**: Broader context windows (200–300 tokens) linked to each child chunk.
- **Retrieval Workflow**: Vector search matches the exact child chunk, but the orchestrator pulls the complete parent chunk into LLM generation context.
- **Advantage**: Solves the classic tradeoff between retrieval precision and generative context completeness.

### Strategy 3: Propositional / Atomic Decomposition (`propositional_atomic`)
- **Algorithm**: Deconstructs compound sentences and subordinate clauses into standalone, atomic factual propositions. Automatically prepends the core entity subject to dangling clauses.
- **Advantage**: Eliminates extraneous context noise; ideal for pinpoint factual QA.

### Strategy 4: Metadata-Aware Contextual Chunking (`metadata_aware_contextual`)
- **Algorithm**: Prepends structured contextual headers directly into chunk payloads:
  `[<Title> | Domain: <Domain> | Lang: <Lang> | Part <Index>] <Text>`
- **Advantage**: Enriches vector representations with document semantics, preventing retrieval drift on short snippets.

### Strategy 5: Dynamic Sliding Window (`dynamic_sliding_window`)
- **Algorithm**: Token windowing with sentence-boundary alignment and configurable overlap (e.g. 90-token window, 50-token step).
- **Advantage**: Prevents token-chopping artifacts across window boundaries.

---

## 3. Sub-200ms Hybrid Vector Retrieval Engine

The vector store is optimized for sub-15ms query times using:
1. **Dense Cosine Indexing**: SIMD-accelerated dot-product matrix multiplication on 384-dimensional normalized vectors.
2. **BM25 Lexical Indexing**: Full Okapi BM25 implementation ($k_1=1.5, b=0.75$) with language-aware tokenization.
3. **Reciprocal Rank Fusion (RRF)**:
   $$\text{RRF\_Score}(d) = \sum_{m \in \{\text{dense}, \text{bm25}\}} \frac{1}{60 + \text{rank}_m(d)}$$
4. **LRU SHA-256 Embedding Cache**: Reduces repeat query embedding time to **0.01ms**.

---

## 4. Multi-Layer Guardrail Architecture ("Knows When NOT to Answer")

1. **Inbound Guardrail**: Regular-expression and semantic classifier detecting prompt injection attacks (e.g., `ignore previous instructions`, `DAN mode`, `system prompt`), harmful content, and off-topic queries.
2. **Context Sufficiency & Retrieval Grounding Guardrail**: Evaluates top-chunk similarity scores and query entity density in the context. If relevance is below $\theta = 0.46$, the system abstains:
   *"ℹ️ I do not have sufficient information in the knowledge base to answer this question reliably."*
3. **Outbound Faithfulness & Hallucination Guardrail**: Deconstructs the generated response into discrete claims and performs NLI context overlap verification against retrieved chunks. Rejects ungrounded statements.

---

## 5. Agentic Harness & Resilience Engineering

- **Pydantic Validation**: Strict typing across queries, retrieved chunks, guardrail verdicts, citations, and telemetry.
- **Circuit Breaker**: 3-state state machine (CLOSED $\to$ OPEN $\to$ HALF-OPEN) preventing cascade failures when external services experience downtime.
- **Exponential Backoff with Jitter**: Automatic retries with randomized backoff delay:
  $$\text{Delay} = \text{Base} \times 2^{\text{retry}-1} + \text{Uniform}(0.01, 0.03)$$
- **Tool Calling Harness**: The orchestrator dynamically plans and executes tool calls (`vector_store_retrieval`, `grounding_check`, `citation_builder`).
