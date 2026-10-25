export interface LegalSkill {
  id: string;
  name: string;
  category: 'drafting' | 'review' | 'research' | 'case_tools' | 'compliance' | 'student' | 'utilities';
  categoryLabel: string;
  description: string;
  icon: string;
  suggestedPrompt: string;
  badge?: string;
}

export const LEGAL_SKILLS_CATALOG: LegalSkill[] = [
  // 1. Drafting & Writing
  {
    id: 'legal-notice-drafting',
    name: 'Legal Notice Drafting',
    category: 'drafting',
    categoryLabel: 'Drafting & Writing',
    description: 'Draft statutory legal notices for debt recovery, breach of contract, defamation, or eviction with formal statutory references.',
    icon: 'FileText',
    suggestedPrompt: 'Draft a formal Legal Notice for recovery of unpaid invoice of INR 8,50,000 against TechSolutions Pvt Ltd under Section 138 of NI Act and Section 73 of Indian Contract Act.',
    badge: 'Popular'
  },
  {
    id: 'agreement-drafting',
    name: 'Agreement Drafting',
    category: 'drafting',
    categoryLabel: 'Drafting & Writing',
    description: 'Draft commercial agreements including Master Services Agreements, Vendor Contracts, and Consulting Agreements.',
    icon: 'FileSignature',
    suggestedPrompt: 'Draft a comprehensive Master Services Agreement for software development with clear IP assignment, warranties, and liability cap at 12 months fees.',
    badge: 'Core'
  },
  {
    id: 'contract-drafting',
    name: 'Contract Drafting',
    category: 'drafting',
    categoryLabel: 'Drafting & Writing',
    description: 'Formulate bespoke contracts with custom definitions, representations, indemnities, and termination triggers.',
    icon: 'Briefcase',
    suggestedPrompt: 'Draft a commercial supply contract with liquidated damages clause aligned with Section 74 of Indian Contract Act.',
    badge: 'Core'
  },
  {
    id: 'petition-drafting',
    name: 'Petition Drafting',
    category: 'drafting',
    categoryLabel: 'Drafting & Writing',
    description: 'Draft writ petitions under Article 226/32 or civil revision petitions with grounds of law, synopsis, and prayers.',
    icon: 'Scale',
    suggestedPrompt: 'Draft a Writ Petition under Article 226 challenging arbitrary administrative order violating natural justice.'
  },
  {
    id: 'reply-drafting',
    name: 'Reply Drafting',
    category: 'drafting',
    categoryLabel: 'Drafting & Writing',
    description: 'Draft formal replies to show-cause notices, legal notices, or written statements in commercial disputes.',
    icon: 'MailCheck',
    suggestedPrompt: 'Draft a structured reply to a legal notice denying liability and raising preliminary objections on limitation and lack of privity.'
  },
  {
    id: 'legal-opinion',
    name: 'Legal Opinion',
    category: 'drafting',
    categoryLabel: 'Drafting & Writing',
    description: 'Structure formal legal opinions evaluating legal risk, regulatory standing, and recommended courses of action.',
    icon: 'Award',
    suggestedPrompt: 'Draft a legal opinion on enforceability of unilateral non-compete clauses under Section 27 of Indian Contract Act.'
  },
  {
    id: 'nda-drafting',
    name: 'NDA Drafting',
    category: 'drafting',
    categoryLabel: 'Drafting & Writing',
    description: 'Draft mutual or unilateral Non-Disclosure Agreements with robust definition of proprietary data, exclusions, and remedies.',
    icon: 'Shield',
    suggestedPrompt: 'Draft a mutual Non-Disclosure Agreement for cross-border tech M&A discussions with 3-year term and injunctive relief.',
    badge: 'Popular'
  },
  {
    id: 'employment-agreement',
    name: 'Employment Agreement',
    category: 'drafting',
    categoryLabel: 'Drafting & Writing',
    description: 'Draft employment letters and executive contracts with IP assignment, confidentiality, during-term non-compete, and garden leave.',
    icon: 'UserCheck',
    suggestedPrompt: 'Draft a Senior Software Engineer Employment Contract with IP assignment, confidentiality, and statutory benefits compliance.',
    badge: 'Popular'
  },
  {
    id: 'academic-writing',
    name: 'Academic Legal Writing',
    category: 'drafting',
    categoryLabel: 'Drafting & Writing',
    description: 'Structure law review articles, case notes, and scholarly legal dissertations with Bluebook / OSCOLA style citations.',
    icon: 'BookOpen',
    suggestedPrompt: 'Draft an academic analysis on the evolving jurisprudence of digital data privacy post-Puttaswamy and the DPDP Act 2023.'
  },
  {
    id: 'legal-writing-coach',
    name: 'Legal Writing Coach',
    category: 'drafting',
    categoryLabel: 'Drafting & Writing',
    description: 'Refine syntax, eliminate legalese redundancies, and enhance clarity and persuasive force of legal writing.',
    icon: 'Edit3',
    suggestedPrompt: 'Review this paragraph and eliminate passive voice, double negatives, and archaic legalese while preserving legal precision.'
  },

  // 2. Document Review & Analysis
  {
    id: 'contract-review',
    name: 'Contract Review',
    category: 'review',
    categoryLabel: 'Document Review & Analysis',
    description: 'Analyze contracts for high-risk clauses, one-sided terms, missing boilerplate, and regulatory exposure.',
    icon: 'CheckSquare',
    suggestedPrompt: 'Conduct an in-depth contract review of this agreement, identifying high-risk indemnities and termination ambiguities.',
    badge: 'Core'
  },
  {
    id: 'redlining',
    name: 'Redlining & Diff Analysis',
    category: 'review',
    categoryLabel: 'Document Review & Analysis',
    description: 'Generate markups and redline revisions with inline additions, deletions, and commentary explaining each change.',
    icon: 'GitPullRequest',
    suggestedPrompt: 'Redline this indemnity clause to make it mutual and insert an aggregate liability cap of 1x annual contract value.',
    badge: 'Popular'
  },
  {
    id: 'clause-analysis',
    name: 'Clause Analysis',
    category: 'review',
    categoryLabel: 'Document Review & Analysis',
    description: 'Break down complex multi-clause provisions into rights, obligations, conditions precedent, and default triggers.',
    icon: 'Layers',
    suggestedPrompt: 'Analyze the force majeure clause to check if cyberattacks and supply chain disruptions qualify as excused events.'
  },
  {
    id: 'risk-analysis',
    name: 'Risk Analysis',
    category: 'review',
    categoryLabel: 'Document Review & Analysis',
    description: 'Quantify operational, legal, and financial exposures in agreements with traffic-light risk ratings (Red/Amber/Green).',
    icon: 'AlertTriangle',
    suggestedPrompt: 'Generate a risk matrix evaluating liability caps, unlimited indemnities, and jurisdiction risks in this vendor contract.'
  },
  {
    id: 'document-comparison',
    name: 'Document Comparison',
    category: 'review',
    categoryLabel: 'Document Review & Analysis',
    description: 'Compare two versions of an agreement to track substantive alterations, deletions, and subtle phrasing shifts.',
    icon: 'Columns',
    suggestedPrompt: 'Compare this draft against standard market standard terms and highlight all deviations.'
  },
  {
    id: 'document-summarisation',
    name: 'Document Summarisation',
    category: 'review',
    categoryLabel: 'Document Review & Analysis',
    description: 'Synthesize 40+ page legal agreements into executive summaries with deal commercials, obligations, and deadlines.',
    icon: 'FileSearch',
    suggestedPrompt: 'Summarise this 30-page Share Purchase Agreement into key commercial terms, representations, conditions precedent, and closing dates.'
  },
  {
    id: 'due-diligence',
    name: 'Due Diligence Audit',
    category: 'review',
    categoryLabel: 'Document Review & Analysis',
    description: 'Perform M&A and vendor due diligence audits across contracts, intellectual property, and litigation history.',
    icon: 'SearchCheck',
    suggestedPrompt: 'Review contract list for change of control triggers, assignment restrictions, and exclusivity covenants.'
  },
  {
    id: 'compliance-review',
    name: 'Compliance Review',
    category: 'review',
    categoryLabel: 'Document Review & Analysis',
    description: 'Verify document adherence to applicable statutes, regulations, RBI circulars, SEBI guidelines, and DPDP rules.',
    icon: 'ShieldCheck',
    suggestedPrompt: 'Review this data processing addendum for compliance with Digital Personal Data Protection Act 2023 obligations.'
  },
  {
    id: 'regulatory-analysis',
    name: 'Regulatory Analysis',
    category: 'review',
    categoryLabel: 'Document Review & Analysis',
    description: 'Analyze regulatory updates and statutory shifts impacting corporate obligations and contracts.',
    icon: 'Book',
    suggestedPrompt: 'Analyze impact of Bharatiya Nyaya Sanhita (BNS) 2023 provisions on commercial fraud and corporate compliance.'
  },
  {
    id: 'fact-issue-extraction',
    name: 'Fact & Issue Extraction',
    category: 'review',
    categoryLabel: 'Document Review & Analysis',
    description: 'Extract chronological facts, disputed issues, and evidentiary exhibits from legal briefs and affidavits.',
    icon: 'ListFilter',
    suggestedPrompt: 'Extract chronological timeline of events and key legal issues from this petition affidavit.'
  },

  // 3. Legal Research
  {
    id: 'case-law-research',
    name: 'Case Law Research',
    category: 'research',
    categoryLabel: 'Legal Research',
    description: 'Retrieve authoritative Supreme Court and High Court case precedents with official citations, bench, and ratio.',
    icon: 'Compass',
    suggestedPrompt: 'Find landmark Supreme Court precedents on unilateral arbitration appointment clauses post-Perkins and TRF Ltd.',
    badge: 'Popular'
  },
  {
    id: 'statutory-research',
    name: 'Statutory Research',
    category: 'research',
    categoryLabel: 'Legal Research',
    description: 'Search Bare Acts, legislative amendments, and statutory provisions across Indian and international jurisdictions.',
    icon: 'Database',
    suggestedPrompt: 'Retrieve statutory provisions under Section 73 & 74 of Indian Contract Act 1872 regarding liquidated damages.'
  },
  {
    id: 'citation-checking',
    name: 'Citation Checking & Verification',
    category: 'research',
    categoryLabel: 'Legal Research',
    description: 'Verify case citations against official databases, classify verified vs unverified, and flag hallucinations.',
    icon: 'BadgeCheck',
    suggestedPrompt: 'Check all legal citations in this brief, verifying case reporters, year, court, and current good law status.',
    badge: 'Prize Winner'
  },
  {
    id: 'authority-identification',
    name: 'Authority Identification',
    category: 'research',
    categoryLabel: 'Legal Research',
    description: 'Determine controlling appellate authority and hierarchical precedent weights for competing interpretations.',
    icon: 'CheckCircle',
    suggestedPrompt: 'Identify whether 5-Judge Constitution Bench in BALCO overrides conflicting earlier division bench rulings.'
  },
  {
    id: 'case-comparison',
    name: 'Case Comparison',
    category: 'research',
    categoryLabel: 'Legal Research',
    description: 'Compare facts and judicial reasoning across two or more cases to find distinguishing features or analogies.',
    icon: 'GitCompare',
    suggestedPrompt: 'Compare Hadley v. Baxendale with ONGC v. Saw Pipes regarding foreseeability and remote damages.'
  },
  {
    id: 'research-memorandum',
    name: 'Research Memorandum',
    category: 'research',
    categoryLabel: 'Legal Research',
    description: 'Draft formal legal research memos with Question Presented, Short Answer, Statement of Facts, Discussion, and Conclusion.',
    icon: 'FileSpreadsheet',
    suggestedPrompt: 'Draft an IRAC legal research memorandum on the validity of click-wrap and browse-wrap digital agreements in India.'
  },
  {
    id: 'issue-spotting',
    name: 'Issue Spotting',
    category: 'research',
    categoryLabel: 'Legal Research',
    description: 'Identify latent legal claims, jurisdictional defects, statutory limitation deadlines, and exposure areas.',
    icon: 'Target',
    suggestedPrompt: 'Spot all potential causes of action, limitation hurdles, and statutory remedies in this scenario.'
  },
  {
    id: 'ratio-holding-analysis',
    name: 'Ratio & Holding Analysis',
    category: 'research',
    categoryLabel: 'Legal Research',
    description: 'Disentangle the binding Ratio Decidendi from non-binding Obiter Dicta in landmark judicial pronouncements.',
    icon: 'Crosshair',
    suggestedPrompt: 'Extract the binding ratio decidendi versus obiter dicta in the Puttaswamy privacy judgment.'
  },
  {
    id: 'irac-practice',
    name: 'IRAC Practice & Formulation',
    category: 'research',
    categoryLabel: 'Legal Research',
    description: 'Structure legal arguments rigorously using Issue, Rule, Application, and Conclusion framework.',
    icon: 'FileCode',
    suggestedPrompt: 'Formulate an IRAC argument addressing whether an oral agreement for transfer of immovable property is enforceable.'
  },

  // 4. Case & Judgment Tools
  {
    id: 'case-brief',
    name: 'Case Brief (Structured)',
    category: 'case_tools',
    categoryLabel: 'Case & Judgment Tools',
    description: 'Generate standardized case briefs detailing Court, Bench, Citation, Facts, Procedural History, Issues, Holding, and Ratio.',
    icon: 'BookMarked',
    suggestedPrompt: 'Generate a structured Case Brief for Kesavananda Bharati v. State of Kerala AIR 1973 SC 1461.',
    badge: 'Popular'
  },
  {
    id: 'case-analysis',
    name: 'Case Analysis & Critique',
    category: 'case_tools',
    categoryLabel: 'Case & Judgment Tools',
    description: 'Critically analyze judgments, identifying doctrinal shifts, concurring/dissenting opinions, and societal impacts.',
    icon: 'Eye',
    suggestedPrompt: 'Provide an in-depth judicial analysis of Justice Chandrachud\'s concurring opinion in the Right to Privacy judgment.'
  },
  {
    id: 'case-timeline',
    name: 'Case Timeline Builder',
    category: 'case_tools',
    categoryLabel: 'Case & Judgment Tools',
    description: 'Construct interactive chronological timelines of procedural filings, orders, appeals, and key events.',
    icon: 'Clock',
    suggestedPrompt: 'Generate an interactive chronological timeline of procedural events from trial court to Supreme Court for this litigation.'
  },
  {
    id: 'precedent-analysis',
    name: 'Precedent Analysis',
    category: 'case_tools',
    categoryLabel: 'Case & Judgment Tools',
    description: 'Trace how a judicial precedent has been followed, distinguished, doubted, or overruled in subsequent cases.',
    icon: 'TrendingUp',
    suggestedPrompt: 'Trace the subsequent judicial treatment of Maneka Gandhi v. UOI across Article 21 jurisprudence.'
  },
  {
    id: 'judgment-summarisation',
    name: 'Judgment Summarisation',
    category: 'case_tools',
    categoryLabel: 'Case & Judgment Tools',
    description: 'Compress lengthy 200+ page court judgments into digestible 2-page executive summaries without loss of legal nuances.',
    icon: 'FileText',
    suggestedPrompt: 'Summarise this 150-page Supreme Court Constitution Bench judgment into a clear 3-page brief for senior counsel.'
  },

  // 5. Compliance & Advisory
  {
    id: 'data-privacy-review',
    name: 'Data Privacy Review (DPDP)',
    category: 'compliance',
    categoryLabel: 'Compliance & Advisory',
    description: 'Evaluate consent mechanisms, Data Principal rights, and cross-border transfer compliance under DPDP Act 2023.',
    icon: 'Lock',
    suggestedPrompt: 'Audit our Privacy Policy and User Consent flow for compliance with Section 6 of the DPDP Act 2023.',
    badge: 'Trending'
  },
  {
    id: 'compliance-checklist',
    name: 'Compliance Checklist Generator',
    category: 'compliance',
    categoryLabel: 'Compliance & Advisory',
    description: 'Generate actionable statutory compliance matrices for startups, M&A deals, fintech, or cross-border operations.',
    icon: 'CheckCircle2',
    suggestedPrompt: 'Generate a statutory compliance checklist for launching an AI healthcare product in India.'
  },
  {
    id: 'corporate-governance',
    name: 'Corporate Governance & Board Resolutions',
    category: 'compliance',
    categoryLabel: 'Compliance & Advisory',
    description: 'Draft board resolutions, secretarial audit notes, and shareholder voting motions under Companies Act 2013.',
    icon: 'Building2',
    suggestedPrompt: 'Draft a Board Resolution authorizing the issuance of equity shares on preferential allotment basis under Section 62(1)(c).'
  },
  {
    id: 'esg-review',
    name: 'ESG & Sustainability Review',
    category: 'compliance',
    categoryLabel: 'Compliance & Advisory',
    description: 'Review contracts for environmental, social, and corporate governance clauses and BRSR reporting requirements.',
    icon: 'Globe',
    suggestedPrompt: 'Draft an ESG compliance covenant for insertion into supply chain and vendor procurement contracts.'
  },

  // 6. Student Learning & Exam Prep
  {
    id: 'socratic-drill',
    name: 'Socratic Legal Drill',
    category: 'student',
    categoryLabel: 'Student Learning & Exam Prep',
    description: 'Interactive questioning drill testing understanding of complex constitutional and contractual doctrines.',
    icon: 'MessageSquare',
    suggestedPrompt: 'Run a Socratic drill questioning me on the limits of Article 19(1)(a) freedom of speech and Article 19(2) restrictions.'
  },
  {
    id: 'concept-explainer',
    name: 'Legal Concept Explainer',
    category: 'student',
    categoryLabel: 'Student Learning & Exam Prep',
    description: 'Demystify intricate legal maxims, jurisprudence concepts, and procedural hurdles with real-world analogies.',
    icon: 'HelpCircle',
    suggestedPrompt: 'Explain Promissory Estoppel, Quid Pro Quo, and Caveat Emptor with modern practical commercial examples.'
  },
  {
    id: 'flashcards-generator',
    name: 'Bar Exam Flashcards Generator',
    category: 'student',
    categoryLabel: 'Student Learning & Exam Prep',
    description: 'Create high-yield active-recall flashcards covering case holdings, statutory sections, and legal definitions.',
    icon: 'Sparkles',
    suggestedPrompt: 'Generate 10 high-yield flashcards on the Indian Evidence Act covering burden of proof and dying declarations.'
  },

  // 7. General Utilities
  {
    id: 'simplify-legal-language',
    name: 'Simplify Legal Language (Plain English)',
    category: 'utilities',
    categoryLabel: 'General Utilities',
    description: 'Translate convoluted legalese and Latin boilerplate into plain, accessible English for clients.',
    icon: 'Smile',
    suggestedPrompt: 'Rewrite this complex indemnification and limitation of liability clause into clear, simple plain English for the client.',
    badge: 'Popular'
  },
  {
    id: 'clause-rewriting',
    name: 'Clause Rewriting & Optimization',
    category: 'utilities',
    categoryLabel: 'General Utilities',
    description: 'Rewrite specific clauses to favor either Discloser/Client, Recipient/Counterparty, or neutral compromise.',
    icon: 'Wrench',
    suggestedPrompt: 'Rewrite this termination clause to give both parties equal 30-day notice rights with cure periods.'
  },
  {
    id: 'extract-key-information',
    name: 'Extract Key Information & Term Sheet',
    category: 'utilities',
    categoryLabel: 'General Utilities',
    description: 'Parse agreement to extract parties, contract value, effective date, renewal conditions, and notice addresses.',
    icon: 'Table',
    suggestedPrompt: 'Extract a structured markdown table of all parties, dates, financial commitments, and governing law from this draft.'
  }
];
