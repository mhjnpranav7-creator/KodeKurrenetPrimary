# DraftMate AI — Legal Drafting Studio
### An AI-Powered Legal Drafting, Verification, and Voice Agent Workspace
**Event:** Kodekurrent Season 2  
**Venue:** Rajiv Gandhi Institute of Petroleum Technology (RGIPT), Amethi, Uttar Pradesh  
**Category:** Software | LegalTech | AI Agents | Voice AI | NLP  

---

## 🏆 Executive Summary & Problem Addressed

Legal professionals, advocates, law students, and corporate counsels spend thousands of hours drafting repetitive commercial documents, manually redlining counterparty risk, and verifying citations across disparate court gazettes. Traditional LLMs frequently hallucinate legal citations, confuse repealed sections (e.g., IPC vs. Bharatiya Nyaya Sanhita 2023), and lack grounding in statutory frameworks.

**DraftMate AI** solves this by unifying:
1. **ChatGPT-Style Legal Studio Workspace**: Familiar, distraction-free drafting studio with live clause jumping, word & token counting, and instant export (.docx, Markdown, print PDF).
2. **Specialized Multi-Agent Orchestration**:
   - **Athena (Chief Legal Drafter)**: Synthesizes structured agreements, notices, and petitions with formal Recitals, definitions, and execution blocks.
   - **Justitia (Citation & Authority Verifier)**: Real-time verification against Indian Kanoon, Supreme Court of India precedents, and IndiaCode Bare Acts. Distinguishes 🟢 Verified, 🟡 Partially Verified, and 🔴 Hallucinated/Flagged citations.
   - **Sentinel (Risk & Redline Auditor)**: Audits agreements for one-sided indemnities and void non-competes (Section 27 ICA), providing inline diff revisions and senior counsel rationale.
   - **Lexis (Precedent & Case Law Agent)**: Case brief analysis, IRAC issue spotting, and ratio decidendi extraction.
   - **VoxCPM & OpenWhispr (Voice Agent)**: Speech-to-text dictation, spoken task execution, and audio read-aloud TTS with confirmation safeguards before destructive operations.
3. **Dynamic Legal Skills Framework (52 Specialized Workflows)**:
   - Full catalog across 7 categories: Drafting & Writing, Document Review & Analysis, Legal Research, Case & Judgment Tools, Compliance & Advisory, Student Learning & Exam Prep, and General Utilities.
4. **Real-Time Prompt Enhancement & Prompt Meter**:
   - Live 0–100% prompt quality score with one-click "Improve Prompt" injecting jurisdiction, seat of arbitration, and liability caps.
5. **MarkItDown & Headroom Context Optimization**:
   - Converts DOCX/PDF to clean Markdown and strips redundant boilerplate, cutting LLM token usage by up to 65%.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v20+ LTS included in environment)
- Google Chrome or Microsoft Edge (for Speech Recognition & Web Audio)

### 1. Launch the Backend API (Port 8787)
```powershell
cd backend
npm run build
npm start
```

### 2. Launch the Frontend Studio (Port 5173)
```powershell
cd frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🏛️ System Architecture

```
[ User Input (Text / Spoken Voice / Reference Document Upload) ]
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
[ Web Speech / VoxCPM Agent ]      [ MarkItDown & Headroom ]
(Intent Parsing & TTS Feedback)    (Token & Context Optimization)
         │                                 │
         └────────────────┬────────────────┘
                          ▼
            [ Multi-Agent Orchestrator ]
  ┌───────────────────────┼───────────────────────┐
  ▼                       ▼                       ▼
Athena Agent            Justitia Agent          Sentinel Agent
(Chief Drafter)         (Citation Verifier)     (Risk & Redline)
  │                       │                       │
  │ • Recitals            │ • Indian Kanoon check │ • Diff comparison
  │ • Section 10 & 27 ICA │ • Supreme Court ratio │ • Liability caps
  │ • New Delhi Arb. Seat │ • Flags hallucinations│ • Senior counsel note
  └───────────────────────┼───────────────────────┘
                          ▼
       [ Unified Legal Studio Workspace ]
  (Live Editor • Citation Badges • Diff Viewer • Voice Waveform)
```

---

## ⚖️ Indian Law & Statutory Grounding
- **Indian Contract Act, 1872**: Section 10 (essential elements of contract), Section 27 (voidness of post-employment non-competes — *Percept D'Mark v. Zaheer Khan*), Section 73 & 74 (liquidated damages and remoteness of damage — *ONGC v. Saw Pipes*).
- **Arbitration and Conciliation Act, 1996**: Section 7 (written arbitration agreement), Section 9 (interim measures), and the landmark *BALCO v. Kaiser Aluminium* seat vs. venue doctrine.
- **Bharatiya Nyaya Sanhita, 2023 (BNS)** & **BNSS, 2023**: Accurate criminal code cross-referencing replacing legacy IPC/CrPC sections.
- **Digital Personal Data Protection Act, 2023 (DPDP Act)**: Grounded in the 9-Judge Constitution Bench privacy mandate in *Justice K.S. Puttaswamy (Retd.) v. Union of India*.

---

## 📜 Sponsors & Technical References Attributed
- **DraftMate AI**: Primary Hackathon Product & Specification Benchmark (`draftmate.in`)
- **Claude for Legal**: Modular legal-task design and specialized workflows (`github.com/anthropics/claude-for-legal`)
- **Awesome Legal Skills**: Reusable legal agent skills catalog (`github.com/lawve-ai/awesome-legal-skills`)
- **Microsoft MarkItDown**: Document-to-Markdown structured conversion (`github.com/microsoft/markitdown`)
- **Headroom**: Context & token optimization engine (`github.com/headroomlabs-ai/headroom`)
- **OpenWhispr & VoxCPM**: Voice dictation and speech-agent integration

*DraftMate AI is a legaltech assistant prototype for advocates and students. It does not replace professional advocate representation.*
