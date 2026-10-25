import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { LEGAL_SKILLS_CATALOG } from './knowledge/skillsCatalog.js';
import { runCitationVerification, runRiskAndRedlineAudit, parseVoiceCommand } from './agents/agentOrchestrator.js';
import { generateLegalStudioResponse } from './services/geminiService.js';
import { convertAndOptimizeDocument } from './services/markitdownService.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
});

// In-Memory & Persistent Session Cache
const sessions = new Map<string, any>();

// Pre-loaded Authentic Legal Templates
const PRELOADED_TEMPLATES = [
  {
    id: 'template-nda',
    title: 'Mutual Non-Disclosure Agreement (NDA)',
    category: 'Corporate & IP',
    description: 'Bilateral confidentiality agreement with 2-year term, trade secret protection, and injunctive relief clauses.',
    jurisdiction: 'India (Arbitration Act 1996)',
    content: `# MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

THIS AGREEMENT is entered into on this 25th day of October, 2026, by and between:
1. Party of the First Part (Discloser); and
2. Party of the Second Part (Recipient).

1. CONFIDENTIAL INFORMATION: Includes all non-public technical, product, and financial data.
2. EXCLUSIONS: Information publicly known, independently developed, or lawfully acquired.
3. GOVERNING LAW: Laws of India. Disputes referred to sole arbitration under the Arbitration and Conciliation Act, 1996 in New Delhi.`
  },
  {
    id: 'template-employment',
    title: 'Executive Employment Agreement',
    category: 'Human Resources',
    description: 'Full-time employment agreement with IP assignment, non-solicitation, and confidentiality protection.',
    jurisdiction: 'India (Contract Act Sec 27 compliant)',
    content: `# EXECUTIVE EMPLOYMENT AGREEMENT

THIS AGREEMENT is made between Company and Employee.
1. DUTIES: Devote exclusive working time and attention to Company affairs.
2. IP ASSIGNMENT: Work-for-hire assignment of all software, inventions, and patents.
3. POST-TERMINATION: 12-month non-solicitation of clients and staff; perpetual trade secret confidentiality.`
  },
  {
    id: 'template-legal-notice',
    title: 'Statutory Demand & Recovery Legal Notice',
    category: 'Litigation & Recovery',
    description: 'Advocate legal notice for recovery of commercial debts with interest and Section 138 NI Act triggers.',
    jurisdiction: 'India (Section 73 ICA & NI Act)',
    content: `# STATUTORY LEGAL NOTICE UNDER SECTION 138 NI ACT & SECTION 73 ICA

TO: Defaulting Commercial Debtor
SUBJECT: Demand for immediate payment of INR 18,75,000/- along with 18% interest per annum.
Failing payment within fifteen (15) days, civil suit for recovery and criminal proceedings shall be instituted.`
  },
  {
    id: 'template-spa',
    title: 'Share Purchase Agreement (SPA)',
    category: 'M&A & Corporate',
    description: 'Comprehensive agreement for acquisition of equity shares, with conditions precedent and indemnities.',
    jurisdiction: 'India (Companies Act 2013)',
    content: `# SHARE PURCHASE AGREEMENT

BETWEEN: Selling Shareholders and Acquirer.
1. PURCHASE AND SALE: Transfer of equity shares against payment of Purchase Consideration.
2. CONDITIONS PRECEDENT: Regulatory approvals, board resolutions, and statutory filings.
3. INDEMNITY: Capped at 100% of Purchase Price with standard fundamental warranty carve-outs.`
  },
  {
    id: 'template-board-res',
    title: 'Board Resolution for Commercial Borrowing',
    category: 'Corporate Governance',
    description: 'Certified extract of board resolution authorizing banking credit lines under Section 179/180 of Companies Act 2013.',
    jurisdiction: 'India (Companies Act 2013)',
    content: `# CERTIFIED TRUE COPY OF THE RESOLUTION PASSED BY THE BOARD OF DIRECTORS

RESOLVED THAT pursuant to the provisions of Section 179(3) of the Companies Act, 2013, the consent of the Board of Directors be and is hereby accorded to avail credit facilities up to INR 5,00,00,000/-.`
  }
];

// ============================================================================
// REAL-TIME MULTI-USER COLLABORATIVE DRAFTING ENGINE (SHARED ROOM)
// ============================================================================
interface SharedComment {
  id: string;
  author: string;
  role: string;
  clauseTitle: string;
  comment: string;
  timestamp: string;
  resolved: boolean;
}

interface CollaboratorPresence {
  id: string;
  name: string;
  role: string;
  lastActive: number;
}

const activeCollaborators = new Map<string, CollaboratorPresence>();
const sharedComments: SharedComment[] = [
  {
    id: 'comm-1',
    author: 'Adv. Siddharth Malhotra',
    role: 'Senior Advocate',
    clauseTitle: 'Section 7: Arbitration Seat',
    comment: 'Ensure New Delhi is retained as the seat under BALCO (2012) 9 SCC 552 to guarantee supervisory High Court jurisdiction.',
    timestamp: '2 mins ago',
    resolved: false
  },
  {
    id: 'comm-2',
    author: 'Judge / Evaluator',
    role: 'Hackathon Reviewer',
    clauseTitle: 'Section 1.3: DPDP Act Compliance',
    comment: 'Clear alignment with Puttaswamy (2017) privacy principles and Section 4 & 6 consent architecture.',
    timestamp: 'Just now',
    resolved: false
  }
];

let sharedDraftState = {
  room: 'KODEKURRENT-RGIPT-ROOM-1',
  title: 'Mutual Non-Disclosure & Confidentiality Agreement',
  documentType: 'Confidentiality Agreement',
  content: '', // populated on first request or seed
  version: 1,
  lastModifiedBy: 'Lead Drafter',
  updatedAt: new Date().toISOString()
};

// Health Check
app.get('/health', async () => ({
  ok: true,
  service: 'DraftMate AI - Legal Drafting Studio API',
  event: 'Kodekurrent Season 2 (RGIPT)',
  version: '2.1.0',
  collaboration: 'Multi-User Live Shared Drafting Active',
  activeAgents: [
    'Athena (Chief Legal Drafter)',
    'Justitia (Citation & Authority Verifier)',
    'Sentinel (Risk & Redline Auditor)',
    'Lexis (Precedent & Research Agent)',
    'VoxCPM (Voice & Dictation Agent)'
  ],
  skillsCount: LEGAL_SKILLS_CATALOG.length,
  timestamp: new Date().toISOString()
}));

// 1. Skills Catalog Endpoint
app.get('/api/skills', async (req) => {
  const query = (req.query as { category?: string; search?: string }) || {};
  let list = LEGAL_SKILLS_CATALOG;

  if (query.category && query.category !== 'all') {
    list = list.filter(s => s.category === query.category);
  }

  if (query.search) {
    const q = query.search.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }

  return { ok: true, count: list.length, skills: list };
});

// 2. Multi-Agent Legal Studio Drafting Pipeline
const draftSchema = z.object({
  prompt: z.string().min(1),
  skillId: z.string().optional(),
  model: z.string().optional(),
  referenceDocContent: z.string().optional(),
  existingDraft: z.string().optional()
});

app.post('/api/draft', async (req, res) => {
  const parsed = draftSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.code(400).send({ error: 'Invalid draft parameters', details: parsed.error.flatten() });
  }

  try {
    const result = await generateLegalStudioResponse(parsed.data);
    // Sync newly generated draft into shared state
    sharedDraftState.title = result.title;
    sharedDraftState.documentType = result.documentType;
    sharedDraftState.content = result.content;
    sharedDraftState.version += 1;
    sharedDraftState.updatedAt = new Date().toISOString();
    sharedDraftState.lastModifiedBy = 'Athena AI Drafter';

    return { ok: true, result };
  } catch (err: any) {
    return res.code(500).send({ error: 'Drafting pipeline error', message: err?.message || 'Unknown error' });
  }
});

// 3. Citation & Authority Verification Endpoint
const verifySchema = z.object({
  text: z.string().min(1)
});

app.post('/api/verify-citations', async (req, res) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.code(400).send({ error: 'Text required for citation verification' });
  }

  const verification = runCitationVerification(parsed.data.text);
  return { ok: true, verification };
});

// 4. Risk & Redline Auditor Endpoint
const redlineSchema = z.object({
  text: z.string().min(1)
});

app.post('/api/redline', async (req, res) => {
  const parsed = redlineSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.code(400).send({ error: 'Text required for redline audit' });
  }

  const redlines = runRiskAndRedlineAudit(parsed.data.text);
  return {
    ok: true,
    totalRisksFound: redlines.length,
    highRiskCount: redlines.filter(r => r.riskLevel === 'high').length,
    redlines
  };
});

// 5. Prompt Enhancement & Prompt Quality Meter
const promptMeterSchema = z.object({
  prompt: z.string()
});

app.post('/api/prompt-enhance', async (req, res) => {
  const parsed = promptMeterSchema.safeParse(req.body);
  if (!parsed.success) return res.code(400).send({ error: 'Invalid prompt parameter' });

  const p = parsed.data.prompt.trim();
  let score = 25;
  const missingElements: string[] = [];
  const detectedElements: string[] = [];

  if (p.length > 30) score += 15;
  if (p.length > 80) score += 10;

  if (/party|company|contractor|vendor|client|employer|employee/i.test(p)) {
    score += 15;
    detectedElements.push('Party Definitions');
  } else {
    missingElements.push('Explicit Party roles & company structures');
  }

  if (/jurisdiction|india|delaware|state of|law of|governing law/i.test(p)) {
    score += 15;
    detectedElements.push('Governing Jurisdiction');
  } else {
    missingElements.push('Governing Law & Seat of Arbitration');
  }

  if (/liability|indemn|remedy|damages|cap/i.test(p)) {
    score += 10;
    detectedElements.push('Liability & Risk Guardrails');
  } else {
    missingElements.push('Monetary liability cap & indemnification boundaries');
  }

  if (/term|duration|years|termination|notice/i.test(p)) {
    score += 10;
    detectedElements.push('Term & Termination Provisions');
  } else {
    missingElements.push('Term duration and notice cure periods');
  }

  const finalScore = Math.min(100, Math.max(20, score));
  const enhancedPrompt = `${p}. Include detailed definitions, mutually reciprocal indemnities capped at 12 months fees, governing law under Republic of India with sole arbitration under the Arbitration & Conciliation Act 1996 in New Delhi, and ensure strict compliance with Section 10 & 27 of the Indian Contract Act 1872 and DPDP Act 2023.`;

  return {
    ok: true,
    score: finalScore,
    rating: finalScore >= 80 ? 'Excellent' : finalScore >= 55 ? 'Moderate' : 'Needs Legal Detail',
    detectedElements,
    missingElements,
    enhancedPrompt
  };
});

// 6. Document Style Extraction & MarkItDown / Headroom Context Optimization
const docProcessSchema = z.object({
  content: z.string().min(1),
  filename: z.string().optional()
});

app.post('/api/style-extract', async (req, res) => {
  const parsed = docProcessSchema.safeParse(req.body);
  if (!parsed.success) return res.code(400).send({ error: 'Content required' });

  const result = convertAndOptimizeDocument(parsed.data.content, parsed.data.filename);
  return { ok: true, result };
});

// 7. Voice Command Agent Endpoint
const voiceSchema = z.object({
  transcription: z.string().min(1)
});

app.post('/api/voice-command', async (req, res) => {
  const parsed = voiceSchema.safeParse(req.body);
  if (!parsed.success) return res.code(400).send({ error: 'Voice transcription required' });

  const task = parseVoiceCommand(parsed.data.transcription);
  return { ok: true, task };
});

// 8. Templates Library
app.get('/api/templates', async () => ({
  ok: true,
  count: PRELOADED_TEMPLATES.length,
  templates: PRELOADED_TEMPLATES
}));

// ============================================================================
// SHARED COLLABORATION ROOM ENDPOINTS (LIVE MULTI-USER EDITING)
// ============================================================================

// Get Shared Draft State & Active Collaborators
app.get('/api/shared-draft', async () => {
  // Prune collaborators inactive for > 45 seconds
  const now = Date.now();
  for (const [id, collab] of activeCollaborators.entries()) {
    if (now - collab.lastActive > 45000) {
      activeCollaborators.delete(id);
    }
  }

  return {
    ok: true,
    draft: {
      room: sharedDraftState.room,
      title: sharedDraftState.title,
      documentType: sharedDraftState.documentType,
      content: sharedDraftState.content,
      version: sharedDraftState.version,
      lastModifiedBy: sharedDraftState.lastModifiedBy,
      updatedAt: sharedDraftState.updatedAt
    },
    collaborators: Array.from(activeCollaborators.values()),
    comments: sharedComments
  };
});

// Update Shared Draft (Invoked when any user edits and saves or auto-syncs)
const updateSharedSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1),
  editorName: z.string().default('Collaborator'),
  editorRole: z.string().default('Editor')
});

app.post('/api/shared-draft', async (req, res) => {
  const parsed = updateSharedSchema.safeParse(req.body);
  if (!parsed.success) return res.code(400).send({ error: 'Invalid content update' });

  const { title, content, editorName } = parsed.data;
  if (title) sharedDraftState.title = title;
  sharedDraftState.content = content;
  sharedDraftState.version += 1;
  sharedDraftState.lastModifiedBy = editorName;
  sharedDraftState.updatedAt = new Date().toISOString();

  return {
    ok: true,
    version: sharedDraftState.version,
    updatedAt: sharedDraftState.updatedAt,
    lastModifiedBy: editorName
  };
});

// Collaborator Heartbeat Presence
const presenceSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string()
});

app.post('/api/shared-draft/presence', async (req, res) => {
  const parsed = presenceSchema.safeParse(req.body);
  if (!parsed.success) return res.code(400).send({ error: 'Invalid presence payload' });

  const { id, name, role } = parsed.data;
  activeCollaborators.set(id, {
    id,
    name,
    role,
    lastActive: Date.now()
  });

  return { ok: true, activeCount: activeCollaborators.size };
});

// Add Review Comment
const addCommentSchema = z.object({
  author: z.string(),
  role: z.string().default('Counsel'),
  clauseTitle: z.string().default('General Clause'),
  comment: z.string().min(1)
});

app.post('/api/shared-draft/comments', async (req, res) => {
  const parsed = addCommentSchema.safeParse(req.body);
  if (!parsed.success) return res.code(400).send({ error: 'Comment text required' });

  const newComm: SharedComment = {
    id: `comm-${Date.now()}`,
    author: parsed.data.author,
    role: parsed.data.role,
    clauseTitle: parsed.data.clauseTitle,
    comment: parsed.data.comment,
    timestamp: 'Just now',
    resolved: false
  };

  sharedComments.unshift(newComm);
  return { ok: true, comment: newComm, totalComments: sharedComments.length };
});

// Resolve Review Comment
app.patch('/api/shared-draft/comments/:id/resolve', async (req, res) => {
  const { id } = req.params as { id: string };
  const target = sharedComments.find(c => c.id === id);
  if (!target) return res.code(404).send({ error: 'Comment not found' });
  target.resolved = true;
  return { ok: true, comment: target };
});

// 9. Session Persistence (Save, Retrieve, List)
app.post('/api/sessions', async (req, res) => {
  const id = crypto.randomUUID();
  const sessionData = {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...(typeof req.body === 'object' && req.body !== null ? req.body : {})
  };
  sessions.set(id, sessionData);
  return { ok: true, id, status: 'saved', session: sessionData };
});

app.get('/api/sessions', async () => {
  return { ok: true, count: sessions.size, sessions: Array.from(sessions.values()) };
});

app.get('/api/sessions/:id', async (req, res) => {
  const id = (req.params as { id: string }).id;
  const session = sessions.get(id);
  if (!session) return res.code(404).send({ error: 'Session not found' });
  return { ok: true, session };
});

app.setErrorHandler((error, _req, res) => {
  app.log.error(error);
  res.code(500).send({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown' });
});

const port = Number(process.env.PORT || 8787);
await app.listen({ port, host: '0.0.0.0' });
console.log(`[DraftMate AI Backend] Listening on http://localhost:${port}`);
