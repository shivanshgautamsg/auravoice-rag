# Video Production Scripts & Storyboards (HH Goa 2026)

---

## 🎬 Video 1: Team & Process Video (Exactly 90 Seconds)
**Theme**: *Engineering Under Extreme Constraints: Building Sub-200ms Voice RAG*  
**Objective**: Demonstrate teamwork, technical debates, architectural decision-making, and the iterative engineering process.

---

### Scene-by-Scene Storyboard

#### [0:00 - 0:15] — Hook: The Latency & Multilingual Challenge
- **Visual**: Team gathered around whiteboard / IDE screens showing the `< 200ms` SLA constraint and the `ai4bharat/MSMARCO-XI` dataset.
- **Speaker 1**:
  > *"When we saw the HH Goa Task 2 prompt — sub-200ms voice-to-answer latency across Indian languages with multi-strategy chunking — we knew standard off-the-shelf RAG pipelines wouldn't cut it. Here is how our team engineered AuraVoice RAG."*

#### [0:15 - 0:35] — Step 1: Breaking Beyond Naive Chunking
- **Visual**: Screen capture of the Chunking Lab comparator showing Semantic Splitting vs Parent-Child Chunks vs Propositional Atomic Facts.
- **Speaker 2**:
  > *"Our first major architectural breakthrough was chunking. Naive fixed token chunking destroys cross-lingual syntax. We designed five distinct chunking strategies — implementing embedding distance inflection detection and dual-resolution parent-child indexing so vector search operates in microseconds while generation retains rich context."*

#### [0:35 - 0:55] — Step 2: Turbo Vector Store & Sarvam AI Integration
- **Visual**: Code walkthrough of SIMD matrix multiplications, Reciprocal Rank Fusion (RRF), and the Sarvam AI STT audio integration.
- **Speaker 1 / 3**:
  > *"To crush the 200ms target, we engineered a hybrid vector engine combining dense HNSW cosine similarity with BM25 Okapi search and SHA-256 caching. Integrating Sarvam AI's saarika:v2 gave us native Indian accent and Indic language support with sub-40ms voice transcription."*

#### [0:55 - 1:15] — Step 3: Guardrails — Teaching the System When NOT to Answer
- **Visual**: Team testing adversarial prompt injections, unanswerable queries on Pluto, and watching the grounding guardrail trigger honest abstention.
- **Speaker 2 / 3**:
  > *"A winning RAG model must know when not to answer. We built a 3-tier guardrail harness with circuit breakers: blocking prompt injections, abstaining when retrieval similarity falls below threshold, and verifying claim-level NLI faithfulness."*

#### [1:15 - 1:30] — Outro: The Results & Submission
- **Visual**: Team running the automated benchmark suite showing P50: 0.43ms, P70: 0.49ms, P100: 1.19ms and 100% compliance rate. Team high-five.
- **All**:
  > *"Across 100+ benchmark runs, AuraVoice RAG achieved a P50 of <1ms and 100% sub-200ms compliance. See you in Goa! #RAGInGoa"*

---

## 🎥 Video 2: End-to-End Demo Video (3 Minutes)
**Theme**: *Live Working Demonstration of AuraVoice RAG*  
**Objective**: Clear, flawless proof of working features, real-time voice recognition, citation transparency, chunk comparison, and guardrail enforcement.

---

### Step-by-Step Walkthrough

1. **Dashboard Overview (0:00 - 0:25)**:
   - Introduce the AuraVoice RAG Dark Glassmorphism interface.
   - Highlight the real-time active indicators: Sub-200ms SLA active, Sarvam AI STT, Turbo Vector Store indexed on MSMARCO-XI.

2. **Live Voice Query & Response (0:25 - 1:05)**:
   - Click the glowing microphone button. The real-time audio waveform animates smoothly.
   - Speak in English: *"When did Chandrayaan-3 land on the Moon?"*
   - Show instant transcript arrival: *"When did Chandrayaan-3 land on the Moon?"*
   - Show streaming grounded answer with clickable `[Source: Chandrayaan-3]` citation pill.
   - Highlight the **Latency Waterfall Banner**: Total latency `~0.45ms` (or `<45ms` over live API), with stage-by-stage millisecond badges.

3. **Multilingual Indic Voice Query (1:05 - 1:35)**:
   - Select Hindi (`hi-IN`) and speak: *"आयुर्वेद में तीन मुख्य दोष कौन से हैं?"*
   - Observe immediate Indic transcription and grounded answer explaining Vata, Pitta, and Kapha with cross-lingual citations.

4. **Interactive Chunking Strategy Lab (1:35 - 2:05)**:
   - Switch to the **Chunking Lab** tab.
   - Select an MSMARCO-XI passage and click "Re-compute All Strategies".
   - Compare Semantic Splitting (embedding distance inflection), Hierarchical Parent-Child, Propositional Atomic Facts, and Metadata-Aware Contextual side-by-side with token distribution cards and chunk inspectors.

5. **Guardrail Defense & Honest Abstention (2:05 - 2:35)**:
   - Switch to the **Guardrails & Safety** tab.
   - Click the "Prompt Injection Attack" chip: System instantly blocks with `[SECURITY_VIOLATION]`.
   - Click the "Unanswerable / Out of Corpus" chip (*"Who was the emperor of Pluto during the Bronze Age?"*): System executes retrieval grounding check and triggers honest abstention: *"I do not have sufficient information in the knowledge base to answer this question reliably."*

6. **P50 / P70 / P100 Benchmark Execution (2:35 - 2:55)**:
   - Switch to the **Latency Analytics** tab.
   - Click "Run Benchmark Suite" across 50 queries.
   - Watch the live scorecard update: P50: 0.43ms, P70: 0.49ms, P100: 1.19ms, 100% Sub-200ms compliance.
   - Demonstrate the "Export JSON" button.

7. **Conclusion & GitHub Repo (2:55 - 3:00)**:
   - Display GitHub repo URL and official `#RAGInGoa` hashtag.
