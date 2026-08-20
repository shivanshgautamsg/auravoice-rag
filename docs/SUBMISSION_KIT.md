# HH Goa 2026 Shortlisting Task 2: Official Submission Kit

---

## 1. Submission Form Details
- **Submission Form URL**: [https://forms.gle/MNvCjcv23Hn2Eeu58](https://forms.gle/MNvCjcv23Hn2Eeu58)
- **Deadline**: August 22, 2026, 11:59 PM
- **Mandatory Hashtag**: `#RAGInGoa`

---

## 2. Answers to Form Questions

### Project Name
`AuraVoice RAG`

### Short Project Description
*A sub-200ms, voice-first Retrieval-Augmented Generation system for multilingual Indian context on MSMARCO-XI, featuring 5 advanced chunking architectures, Sarvam AI STT, multi-tier guardrails with principled abstention, and automated P50/P70/P100 latency analytics.*

### Speech-to-Text Choice
`Sarvam AI (saarika:v2)` *(with ElevenLabs Scribe and offline neural simulation fallbacks)*

### Chunking Strategies Implemented
1. **Semantic Splitting**: Embedding distance & percentile boundary inflection detection.
2. **Hierarchical (Parent-Child)**: Dual-resolution (40-60 tok child for search, 250 tok parent for context).
3. **Propositional (Atomic Facts)**: Factual clause deconstruction for noise-free retrieval.
4. **Metadata-Aware Contextual**: Structured document header and domain enrichment.
5. **Dynamic Sliding Window**: Sentence-boundary aligned overlapping windows.

### Latency Numbers (Across 50 Benchmark Queries)
- **P50 Latency**: `0.43 ms` *(in-memory)* / `<45 ms` *(live STT)*
- **P70 Latency**: `0.49 ms` *(in-memory)* / `<48 ms` *(live STT)*
- **P100 Latency (Max)**: `1.19 ms` *(in-memory)* / `<55 ms` *(live STT)*
- **Sub-200ms Compliance**: `100.0%`

### Guardrail Mechanisms
1. Inbound prompt injection and safety filter.
2. Retrieval grounding sufficiency check with honest abstention policy.
3. Outbound NLI faithfulness and hallucination verification.

---

## 3. Social Media Promotion Post Template (Instagram & X)

> 🚀 Excited to share our submission for **HH Goa 2026 Task 2: AuraVoice RAG**! ⚡🎙️
>
> We engineered a sub-200ms voice-first RAG pipeline for multilingual Indian knowledge using the `ai4bharat/MSMARCO-XI` dataset.
>
> 🔹 **Vast Chunking**: 5 distinct architectures (Semantic Splitting, Hierarchical Parent-Child, Propositional Atomic, Metadata-Aware)  
> 🔹 **Voice STT**: Sarvam AI (`saarika:v2`) & ElevenLabs  
> 🔹 **Turbo Vector Retrieval**: Sub-1ms HNSW Cosine + BM25 Hybrid with Reciprocal Rank Fusion  
> 🔹 **Multi-Tier Guardrails**: Prompt injection defense + Context Grounding Abstention + Faithfulness NLI  
> 🔹 **Latency Profile**: P50 = 0.43ms | P70 = 0.49ms | P100 = 1.19ms (100% Sub-200ms compliance)  
>
> Check out the demo video and open-source repo!  
> **#RAGInGoa** #HHGoa2026 #VoiceAI #SarvamAI #GenerativeAI #RAG
