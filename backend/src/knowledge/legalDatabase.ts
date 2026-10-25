export interface LegalCitation {
  id: string;
  citation: string;
  caseOrStatute: string;
  year?: number;
  courtOrAuthority: string;
  jurisdiction: 'India' | 'International' | 'UK' | 'US';
  status: 'verified' | 'partially_verified' | 'unverified';
  summaryRatio: string;
  sourceUrl?: string;
  keyPrinciples: string[];
  riskNotes?: string;
}

export interface StatutoryAuthority {
  act: string;
  shortName: string;
  section: string;
  title: string;
  summary: string;
  verified: boolean;
  sourceUrl: string;
}

// Authoritative Precedents Database (Supreme Court of India, High Courts & Common Law)
export const LANDMARK_PRECEDENTS: LegalCitation[] = [
  {
    id: 'kb-1973',
    citation: 'AIR 1973 SC 1461',
    caseOrStatute: 'Kesavananda Bharati v. State of Kerala',
    year: 1973,
    courtOrAuthority: 'Supreme Court of India (13-Judge Bench)',
    jurisdiction: 'India',
    status: 'verified',
    summaryRatio: 'Established the Basic Structure Doctrine; Parliament cannot alter the basic structure or framework of the Constitution under Article 368.',
    sourceUrl: 'https://indiankanoon.org/doc/257876/',
    keyPrinciples: ['Basic Structure Doctrine', 'Judicial Review', 'Constitutional Supremacy']
  },
  {
    id: 'puttaswamy-2017',
    citation: '(2017) 10 SCC 1',
    caseOrStatute: 'Justice K.S. Puttaswamy (Retd.) v. Union of India',
    year: 2017,
    courtOrAuthority: 'Supreme Court of India (9-Judge Constitution Bench)',
    jurisdiction: 'India',
    status: 'verified',
    summaryRatio: 'Right to Privacy declared a fundamental right guaranteed under Article 21 (Right to Life and Personal Liberty) and Part III of the Constitution.',
    sourceUrl: 'https://indiankanoon.org/doc/91938676/',
    keyPrinciples: ['Right to Privacy', 'Informational Privacy', 'Article 21 Fundamental Right', 'Proportionality Standard']
  },
  {
    id: 'maneka-1978',
    citation: 'AIR 1978 SC 597',
    caseOrStatute: 'Maneka Gandhi v. Union of India',
    year: 1978,
    courtOrAuthority: 'Supreme Court of India (7-Judge Bench)',
    jurisdiction: 'India',
    status: 'verified',
    summaryRatio: 'Expanded Article 21 procedure established by law to mean "just, fair and reasonable" procedure; Golden Triangle of Articles 14, 19, and 21.',
    sourceUrl: 'https://indiankanoon.org/doc/1766147/',
    keyPrinciples: ['Due Process of Law', 'Substantive Fairness', 'Golden Triangle Doctrine']
  },
  {
    id: 'satyabrata-1954',
    citation: 'AIR 1954 SC 44',
    caseOrStatute: 'Satyabrata Ghose v. Mugneeram Bangur & Co.',
    year: 1954,
    courtOrAuthority: 'Supreme Court of India',
    jurisdiction: 'India',
    status: 'verified',
    summaryRatio: 'Doctrine of frustration of contract governed exhaustively by Section 56 of the Indian Contract Act 1872; positive supervening impossibility discharges obligations.',
    sourceUrl: 'https://indiankanoon.org/doc/1199345/',
    keyPrinciples: ['Frustration of Contract', 'Force Majeure', 'Section 56 Indian Contract Act']
  },
  {
    id: 'ongc-2003',
    citation: '(2003) 5 SCC 705',
    caseOrStatute: 'Oil & Natural Gas Corporation Ltd. v. Saw Pipes Ltd.',
    year: 2003,
    courtOrAuthority: 'Supreme Court of India',
    jurisdiction: 'India',
    status: 'verified',
    summaryRatio: 'Liquidated damages under Section 74 of Indian Contract Act need not require proof of actual loss if genuine pre-estimate; expanded public policy ground in arbitration.',
    sourceUrl: 'https://indiankanoon.org/doc/1825633/',
    keyPrinciples: ['Liquidated Damages', 'Section 74 ICA', 'Arbitral Award Public Policy']
  },
  {
    id: 'hadley-1854',
    citation: '(1854) 9 Exch 341',
    caseOrStatute: 'Hadley v. Baxendale',
    year: 1854,
    courtOrAuthority: 'Court of Exchequer (UK/Common Law Benchmark)',
    jurisdiction: 'UK',
    status: 'verified',
    summaryRatio: 'Foundational rule on contractual damages: damages must arise naturally or be in reasonable contemplation of both parties at time of contract (incorporated into Section 73 ICA).',
    sourceUrl: 'https://www.bailii.org/ew/cases/EWHC/Exch/1854/J70.html',
    keyPrinciples: ['Remoteness of Damage', 'Foreseeability', 'Direct vs Consequential Loss']
  },
  {
    id: 'cheran-2018',
    citation: '(2018) 16 SCC 413',
    caseOrStatute: 'Cheran Properties Ltd. v. Kasturi & Sons Ltd.',
    year: 2018,
    courtOrAuthority: 'Supreme Court of India',
    jurisdiction: 'India',
    status: 'verified',
    summaryRatio: 'Affirmed Group of Companies doctrine; non-signatory affiliates can be bound by arbitration agreement based on mutual intent and composite transaction.',
    sourceUrl: 'https://indiankanoon.org/doc/141014589/',
    keyPrinciples: ['Group of Companies Doctrine', 'Arbitration Section 7', 'Composite Commercial Transactions']
  },
  {
    id: 'balco-2012',
    citation: '(2012) 9 SCC 552',
    caseOrStatute: 'Bharat Aluminium Co. (BALCO) v. Kaiser Aluminium Technical Services',
    year: 2012,
    courtOrAuthority: 'Supreme Court of India (5-Judge Constitution Bench)',
    jurisdiction: 'India',
    status: 'verified',
    summaryRatio: 'Part I of the Arbitration & Conciliation Act 1996 does not apply to foreign-seated arbitrations; seat of arbitration is the judicial center.',
    sourceUrl: 'https://indiankanoon.org/doc/135246755/',
    keyPrinciples: ['Seat vs Venue', 'Territoriality Principle', 'Foreign-Seated Arbitration']
  },
  {
    id: 'percept-2006',
    citation: '(2006) 4 SCC 227',
    caseOrStatute: 'Percept D\'Mark (India) Pvt. Ltd. v. Zaheer Khan',
    year: 2006,
    courtOrAuthority: 'Supreme Court of India',
    jurisdiction: 'India',
    status: 'verified',
    summaryRatio: 'Post-termination non-compete covenants are void under Section 27 of the Indian Contract Act 1872 as restraint of trade, unlike reasonable restrictions during employment.',
    sourceUrl: 'https://indiankanoon.org/doc/1149488/',
    keyPrinciples: ['Section 27 Restraint of Trade', 'Post-termination Covenants', 'Employment Non-Compete Voidness']
  },
  {
    id: 'niranjan-1967',
    citation: 'AIR 1967 SC 1098',
    caseOrStatute: 'Niranjan Shankar Golikari v. Century Spg. & Mfg. Co. Ltd.',
    year: 1967,
    courtOrAuthority: 'Supreme Court of India',
    jurisdiction: 'India',
    status: 'verified',
    summaryRatio: 'Negative covenants during the subsistence of an employment contract preventing an employee from serving elsewhere do not violate Section 27 of ICA.',
    sourceUrl: 'https://indiankanoon.org/doc/733184/',
    keyPrinciples: ['During-Term Non-Compete', 'Confidentiality Protection', 'Section 27 Validity']
  }
];

// Verified Statutory Provisions
export const STATUTORY_PROVISIONS: Record<string, StatutoryAuthority> = {
  'ICA-10': {
    act: 'Indian Contract Act, 1872',
    shortName: 'ICA 1872',
    section: 'Section 10',
    title: 'What agreements are contracts',
    summary: 'Agreements made by free consent of parties competent to contract, for lawful consideration and lawful object.',
    verified: true,
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2187?view_type=browse&sam_handle=123456789/1362'
  },
  'ICA-27': {
    act: 'Indian Contract Act, 1872',
    shortName: 'ICA 1872',
    section: 'Section 27',
    title: 'Agreement in restraint of trade, void',
    summary: 'Every agreement by which anyone is restrained from exercising a lawful profession, trade or business is to that extent void.',
    verified: true,
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2187'
  },
  'ICA-73': {
    act: 'Indian Contract Act, 1872',
    shortName: 'ICA 1872',
    section: 'Section 73',
    title: 'Compensation for loss or damage caused by breach of contract',
    summary: 'Injured party entitled to compensation for loss which naturally arose in usual course of things or which parties knew to be likely.',
    verified: true,
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2187'
  },
  'ICA-74': {
    act: 'Indian Contract Act, 1872',
    shortName: 'ICA 1872',
    section: 'Section 74',
    title: 'Compensation for breach of contract where penalty stipulated for',
    summary: 'Reasonable compensation not exceeding the amount so named or penalty stipulated, whether actual damage proved or not.',
    verified: true,
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2187'
  },
  'DPDPA-4': {
    act: 'Digital Personal Data Protection Act, 2023',
    shortName: 'DPDPA 2023',
    section: 'Section 4 & 6',
    title: 'Grounds for processing digital personal data & Consent architecture',
    summary: 'Personal data may be processed only for a lawful purpose with unconditional, freely given, specific, informed consent.',
    verified: true,
    sourceUrl: 'https://www.meity.gov.in/content/digital-personal-data-protection-act-2023'
  },
  'ARB-7': {
    act: 'Arbitration and Conciliation Act, 1996',
    shortName: 'Arbitration Act 1996',
    section: 'Section 7',
    title: 'Arbitration agreement',
    summary: 'An agreement by the parties to submit to arbitration all or certain disputes; must be in writing.',
    verified: true,
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/1978'
  },
  'ARB-9': {
    act: 'Arbitration and Conciliation Act, 1996',
    shortName: 'Arbitration Act 1996',
    section: 'Section 9',
    title: 'Interim measures by Court',
    summary: 'A party may apply to a Court before, during, or after arbitral proceedings for interim protection of subject matter.',
    verified: true,
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/1978'
  },
  'BNS-103': {
    act: 'Bharatiya Nyaya Sanhita, 2023',
    shortName: 'BNS 2023',
    section: 'Section 103',
    title: 'Punishment for murder',
    summary: 'Replaces IPC Section 302; provides death or imprisonment for life and fine for murder.',
    verified: true,
    sourceUrl: 'https://mha.gov.in/en/commoncontent/new-criminal-laws'
  },
  'BNS-316': {
    act: 'Bharatiya Nyaya Sanhita, 2023',
    shortName: 'BNS 2023',
    section: 'Section 316',
    title: 'Criminal breach of trust',
    summary: 'Replaces IPC Section 405/406; deals with dishonest misappropriation of property entrusted.',
    verified: true,
    sourceUrl: 'https://mha.gov.in/en/commoncontent/new-criminal-laws'
  },
  'BNSS-173': {
    act: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    shortName: 'BNSS 2023',
    section: 'Section 173',
    title: 'Information in cognizable cases (e-FIR)',
    summary: 'Replaces CrPC Section 154; provides for zero FIR, electronic communication of FIR, and mandatory preliminary inquiry.',
    verified: true,
    sourceUrl: 'https://mha.gov.in/en/commoncontent/new-criminal-laws'
  },
  'CONST-21': {
    act: 'Constitution of India, 1950',
    shortName: 'Constitution',
    section: 'Article 21',
    title: 'Protection of life and personal liberty',
    summary: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
    verified: true,
    sourceUrl: 'https://www.india.gov.in/my-government/constitution-india'
  },
  'CONST-14': {
    act: 'Constitution of India, 1950',
    shortName: 'Constitution',
    section: 'Article 14',
    title: 'Equality before law',
    summary: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
    verified: true,
    sourceUrl: 'https://www.india.gov.in/my-government/constitution-india'
  }
};

// Hallucination / Unsupported Citations Pattern Registry
export const KNOWN_HALLUCINATIONS = [
  {
    citationPattern: /Section 999 of Indian Contract Act/i,
    reason: 'Non-existent section in the Indian Contract Act 1872 (The Act ends at Section 266; Chapter VII was repealed by Sale of Goods Act 1930).'
  },
  {
    citationPattern: /Section 420 of Bharatiya Nyaya Sanhita/i,
    reason: 'In BNS 2023, cheating is covered under Section 318; Section 420 is an obsolete reference from the repealed Indian Penal Code 1860.'
  },
  {
    citationPattern: /AIR 2024 SC 99999/i,
    reason: 'Fictitious page number in All India Reporter.'
  },
  {
    citationPattern: /Vishaka v\. State of Rajasthan.*contract breach/i,
    reason: 'Misattributed precedent: Vishaka (AIR 1997 SC 3011) laid down guidelines against workplace sexual harassment, not commercial breach.'
  }
];
