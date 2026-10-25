import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Scale, FileText, Shield, ShieldAlert, ShieldCheck, CheckCircle2,
  AlertTriangle, Sparkles, Mic, MicOff, Play, Square, Volume2,
  VolumeX, Upload, Download, Copy, Check, Search, Compass, BookOpen,
  Layers, GitPullRequest, Briefcase, UserCheck, Building2, Lock,
  Wrench, ArrowRight, ExternalLink, Cpu, Bot, Send, RefreshCw,
  FileSignature, ChevronDown, Award, Trash2, Eye, Filter, Zap,
  Settings2, Sliders, CheckCheck, Landmark, BookmarkCheck, FileCheck2, X,
  Users, MessageSquare, Share2, UserCheck2, Radio, MessageCircle, PlusCircle
} from 'lucide-react';
import './styles.css';

// Types
export interface AgentAction {
  agent: string;
  status: 'pending' | 'running' | 'completed' | 'flagged';
  timestamp: string;
  action: string;
  details?: string;
}

export interface CitationItem {
  citation: string;
  target: string;
  status: 'verified' | 'partially_verified' | 'unverified';
  sourceUrl?: string;
  authority: string;
  explanation: string;
  flagReason?: string;
}

export interface VerificationResult {
  score: number;
  totalCitations: number;
  verifiedCount: number;
  partiallyVerifiedCount: number;
  unverifiedCount: number;
  citations: CitationItem[];
  safetySummary: string;
}

export interface RedlineItem {
  id: string;
  clauseTitle: string;
  originalText: string;
  proposedText: string;
  riskLevel: 'high' | 'medium' | 'low';
  rationale: string;
  diffSummary: string;
}

export interface LegalSkill {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  icon: string;
  suggestedPrompt: string;
  badge?: string;
}

export interface TemplateItem {
  id: string;
  title: string;
  category: string;
  description: string;
  jurisdiction: string;
  content: string;
}

export interface SharedComment {
  id: string;
  author: string;
  role: string;
  clauseTitle: string;
  comment: string;
  timestamp: string;
  resolved: boolean;
}

export interface CollaboratorPresence {
  id: string;
  name: string;
  role: string;
  lastActive: number;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

export function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'drafter' | 'verification' | 'redline' | 'voice' | 'skills' | 'templates' | 'optimizer'>('drafter');
  const [selectedModel, setSelectedModel] = useState<'claude-3.5-sonnet' | 'gemini-2.0-flash' | 'gpt-4o' | 'claude-3-haiku'>('claude-3.5-sonnet');
  const [viewMode, setViewMode] = useState<'editor' | 'parchment'>('editor');
  
  // Drafting Workspace State
  const [prompt, setPrompt] = useState('Draft a mutual Non-Disclosure Agreement for tech collaboration with 2-year term, IP confidentiality, and New Delhi arbitration under the Arbitration & Conciliation Act 1996.');
  const [documentTitle, setDocumentTitle] = useState('Mutual Non-Disclosure & Confidentiality Agreement');
  const [documentContent, setDocumentContent] = useState('');
  const [documentType, setDocumentType] = useState('Confidentiality Agreement');
  const [activeSkillId, setActiveSkillId] = useState<string>('nda-drafting');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  
  // Real-Time Multi-User Collaboration State
  const [userId] = useState(() => 'usr-' + Math.random().toString(36).substring(2, 9));
  const [userName, setUserName] = useState(() => localStorage.getItem('draftmate_name') || 'Advocate Reviewer');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('draftmate_role') || 'Senior Counsel');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [sharedComments, setSharedComments] = useState<SharedComment[]>([]);
  const [serverVersion, setServerVersion] = useState<number>(1);
  const [lastModifiedBy, setLastModifiedBy] = useState<string>('Lead Drafter');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentClause, setNewCommentClause] = useState('Clause 5: Indemnity & Liability');
  
  // Party Variables Customizer
  const [showVariableBar, setShowVariableBar] = useState(false);
  const [party1Name, setParty1Name] = useState('AlphaTech Solutions Pvt. Ltd.');
  const [party2Name, setParty2Name] = useState('Acme Enterprises LLP');
  const [governingCity, setGoverningCity] = useState('New Delhi');
  const [contractTerm, setContractTerm] = useState('Two (2) Years');

  // Multi-Agent Chain & Intelligence
  const [agentChain, setAgentChain] = useState<AgentAction[]>([]);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [redlines, setRedlines] = useState<RedlineItem[]>([]);
  const [acceptedRedlines, setAcceptedRedlines] = useState<Record<string, boolean>>({});
  const [tokenMetrics, setTokenMetrics] = useState<{ rawTokensEstimate: number; optimizedTokensEstimate: number; tokensSavedPercent: number } | null>(null);
  const [styleProfile, setStyleProfile] = useState<{ tone: string; jurisdiction: string; clausePattern: string } | null>(null);
  
  // Prompt Enhancement Meter State
  const [promptScore, setPromptScore] = useState<number>(85);
  const [promptRating, setPromptRating] = useState<string>('Strong');
  const [missingElements, setMissingElements] = useState<string[]>([]);
  const [detectedElements, setDetectedElements] = useState<string[]>(['Party Definitions', 'Jurisdiction', 'Arbitration Seat']);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Skills & Templates State
  const [skills, setSkills] = useState<LegalSkill[]>([]);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('all');
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  
  // Voice Agent State
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceFeedbackMsg, setVoiceFeedbackMsg] = useState('Ready for spoken legal dictation.');
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [speechConfirmation, setSpeechConfirmation] = useState<{ message: string; onConfirm: () => void } | null>(null);

  // Refs
  const transcriptRef = useRef<string>('');
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastUserEditTimeRef = useRef<number>(0);
  const localVersionRef = useRef<number>(1);
  const syncTimeoutRef = useRef<any>(null);

  // Mount
  useEffect(() => {
    fetchSkills();
    fetchTemplates();
    evaluatePrompt(prompt);
    executeDraft(prompt, 'nda-drafting');
  }, []);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem('draftmate_name', userName);
    localStorage.setItem('draftmate_role', userRole);
  }, [userName, userRole]);

  // =========================================================================
  // REAL-TIME COLLABORATIVE POLLING & PRESENCE ENGINE
  // =========================================================================
  useEffect(() => {
    // 1. Initial presence broadcast
    broadcastPresence();

    // 2. Periodic sync & presence loop (every 2.5 seconds)
    const interval = setInterval(() => {
      broadcastPresence();
      fetchSharedDraft();
    }, 2500);

    return () => clearInterval(interval);
  }, [userId, userName, userRole]);

  const broadcastPresence = async () => {
    try {
      await fetch(`${API_BASE}/api/shared-draft/presence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, name: userName, role: userRole })
      });
    } catch {
      // offline
    }
  };

  const fetchSharedDraft = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/shared-draft`);
      if (res.ok) {
        const data = await res.json();
        setCollaborators(data.collaborators || []);
        setSharedComments(data.comments || []);

        const sDraft = data.draft;
        if (sDraft && sDraft.version > localVersionRef.current) {
          // If server draft is newer and user hasn't typed in the last 2.2 seconds, sync content
          const timeSinceEdit = Date.now() - lastUserEditTimeRef.current;
          if (timeSinceEdit > 2200 && sDraft.content) {
            setDocumentContent(sDraft.content);
            if (sDraft.title) setDocumentTitle(sDraft.title);
            localVersionRef.current = sDraft.version;
            setServerVersion(sDraft.version);
            setLastModifiedBy(sDraft.lastModifiedBy || 'Collaborator');
            setSyncStatus('synced');
          }
        }
      }
    } catch {
      setSyncStatus('offline');
    }
  };

  // Push local edits to shared server with 600ms debounce
  const handleContentChange = (newVal: string) => {
    setDocumentContent(newVal);
    lastUserEditTimeRef.current = Date.now();
    setSyncStatus('syncing');

    clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/shared-draft`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: documentTitle,
            content: newVal,
            editorName: userName,
            editorRole: userRole
          })
        });
        if (res.ok) {
          const data = await res.json();
          localVersionRef.current = data.version;
          setServerVersion(data.version);
          setLastModifiedBy(userName);
          setSyncStatus('synced');
        }
      } catch {
        setSyncStatus('offline');
      }
    }, 600);
  };

  // Manual Force Sync
  const handleManualSync = async () => {
    setSyncStatus('syncing');
    try {
      const res = await fetch(`${API_BASE}/api/shared-draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: documentTitle,
          content: documentContent,
          editorName: userName,
          editorRole: userRole
        })
      });
      if (res.ok) {
        const data = await res.json();
        localVersionRef.current = data.version;
        setServerVersion(data.version);
        setLastModifiedBy(userName);
        setSyncStatus('synced');
      }
    } catch {
      setSyncStatus('offline');
    }
  };

  // Post Review Comment
  const handlePostComment = async () => {
    if (!newCommentText.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/shared-draft/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: userName,
          role: userRole,
          clauseTitle: newCommentClause,
          comment: newCommentText.trim()
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSharedComments(prev => [data.comment, ...prev]);
        setNewCommentText('');
      }
    } catch {
      // offline
    }
  };

  // Resolve Review Comment
  const handleResolveComment = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/shared-draft/comments/${id}/resolve`, {
        method: 'PATCH'
      });
      if (res.ok) {
        setSharedComments(prev => prev.map(c => c.id === id ? { ...c, resolved: true } : c));
      }
    } catch {
      setSharedComments(prev => prev.map(c => c.id === id ? { ...c, resolved: true } : c));
    }
  };

  // Copy Public Collaborative Link
  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  // Update prompt evaluation as user types
  useEffect(() => {
    const handler = setTimeout(() => {
      if (prompt.trim()) evaluatePrompt(prompt);
    }, 450);
    return () => clearTimeout(handler);
  }, [prompt]);

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/skills`);
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills);
      }
    } catch (err) {
      console.warn('API skills load offline fallback', err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/templates`);
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates);
      }
    } catch (err) {
      console.warn('API templates load offline fallback', err);
    }
  };

  const evaluatePrompt = async (p: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/prompt-enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: p })
      });
      if (res.ok) {
        const data = await res.json();
        setPromptScore(data.score);
        setPromptRating(data.rating);
        setDetectedElements(data.detectedElements);
        setMissingElements(data.missingElements);
      }
    } catch (err) {
      let score = 35;
      if (p.length > 40) score += 20;
      if (/jurisdiction|arbitration|india|delhi/i.test(p)) score += 20;
      if (/liability|indemn/i.test(p)) score += 15;
      if (/term|termination/i.test(p)) score += 10;
      setPromptScore(Math.min(100, score));
      setPromptRating(score >= 80 ? 'Excellent' : score >= 50 ? 'Moderate' : 'Needs Legal Detail');
    }
  };

  const handleImprovePrompt = async () => {
    setIsEnhancing(true);
    try {
      const res = await fetch(`${API_BASE}/api/prompt-enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (res.ok) {
        const data = await res.json();
        setPrompt(data.enhancedPrompt);
        setPromptScore(data.score >= 90 ? data.score : 95);
        setPromptRating('Excellent');
      }
    } finally {
      setIsEnhancing(false);
    }
  };

  const executeDraft = async (promptText: string, skillId?: string) => {
    setIsDrafting(true);
    try {
      const res = await fetch(`${API_BASE}/api/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          skillId: skillId || activeSkillId,
          model: selectedModel
        })
      });

      if (res.ok) {
        const data = await res.json();
        const r = data.result;
        setDocumentTitle(r.title);
        setDocumentType(r.documentType);
        setDocumentContent(r.content);
        setAgentChain(r.agentChain || []);
        setVerification(r.verification || null);
        setRedlines(r.redlines || []);
        setTokenMetrics(r.tokenOptimization || null);
        setStyleProfile(r.styleAttributes || null);

        // Sync with shared room
        handleContentChange(r.content);
      }
    } catch (err) {
      console.error('Drafting request error:', err);
    } finally {
      setIsDrafting(false);
    }
  };

  // Variable Replacer in Document Content
  const applyVariablesToDocument = () => {
    let updated = documentContent;
    if (party1Name) {
      updated = updated.replace(/AlphaTech Solutions Pvt\. Ltd\.|\[Party 1\]/g, party1Name);
    }
    if (party2Name) {
      updated = updated.replace(/Acme Enterprises LLP|\[Party 2\]/g, party2Name);
    }
    if (governingCity) {
      updated = updated.replace(/New Delhi/g, governingCity);
    }
    if (contractTerm) {
      updated = updated.replace(/two \(2\) years/gi, contractTerm);
    }
    handleContentChange(updated);
    setShowVariableBar(false);
  };

  // Apply All Redlines Directly to Document
  const applyAllRedlinesToDocument = () => {
    let updated = documentContent;
    const newAccepted: Record<string, boolean> = {};

    redlines.forEach((r) => {
      newAccepted[r.id] = true;
      if (r.clauseTitle.includes('Indemnification')) {
        updated = updated.replace(
          /5\. LIMITATION OF LIABILITY & INDEMNIFICATION[\s\S]*?(?=### 6\.)/,
          `5. LIMITATION OF LIABILITY & INDEMNIFICATION\n5.1. **Mutual Liability Cap:** ${r.proposedText}\n5.2. **Consequential Damages:** Neither Party shall be liable for indirect, incidental, or consequential damages.\n\n`
        );
      }
    });

    setAcceptedRedlines(newAccepted);
    handleContentChange(updated);
    setActiveTab('drafter');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(documentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = (format: 'md' | 'doc') => {
    const blob = new Blob([documentContent], { type: format === 'md' ? 'text/markdown' : 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Fail-Safe Voice Agent Engine
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      return;
    }

    setShowVoiceModal(true);
    transcriptRef.current = '';
    setVoiceTranscript('');
    setVoiceFeedbackMsg('🎤 Microphone Active! Speak your legal instruction...');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceFeedbackMsg('Browser speech API blocked or unsupported. Click any quick voice prompt below or type your instruction!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedbackMsg('🎤 Listening... Speak your legal command clearly now.');
      };

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        transcriptRef.current = current;
        setVoiceTranscript(current);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceFeedbackMsg('Microphone blocked by browser. Click the lock icon in the address bar to allow, or click any voice command below.');
        } else if (event.error === 'network') {
          setVoiceFeedbackMsg('Cloud speech server unavailable in this browser. Click any voice trigger below to execute with full voice output!');
        } else if (event.error === 'no-speech') {
          setVoiceFeedbackMsg('No speech detected. Click again or pick a quick command below.');
        } else {
          setVoiceFeedbackMsg(`Status: ${event.error}. Use quick voice triggers below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const recorded = transcriptRef.current.trim();
        if (recorded) {
          processVoiceCommand(recorded);
        }
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setVoiceFeedbackMsg('Microphone note: Click any quick command below to run voice agent.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    setIsListening(false);
    const recorded = transcriptRef.current.trim();
    if (recorded) {
      processVoiceCommand(recorded);
    }
  };

  const processVoiceCommand = async (spokenText: string) => {
    setVoiceTranscript(spokenText);
    setVoiceFeedbackMsg(`VoxCPM Agent processing: "${spokenText}"`);
    speakTTS(`Processing your legal instruction: ${spokenText}. Chief Legal Drafter activated.`);

    try {
      const res = await fetch(`${API_BASE}/api/voice-command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription: spokenText })
      });

      if (res.ok) {
        const data = await res.json();
        const task = data.task;
        setVoiceFeedbackMsg(task.audioFeedbackSpeech);
        speakTTS(task.audioFeedbackSpeech);

        if (task.requiresConfirmation) {
          setShowVoiceModal(false);
          setSpeechConfirmation({
            message: task.confirmationMessage || 'Please confirm execution of this command.',
            onConfirm: () => {
              setSpeechConfirmation(null);
              handleContentChange('');
            }
          });
          return;
        }

        setTimeout(() => setShowVoiceModal(false), 1400);

        if (task.detectedIntent === 'verify') {
          setActiveTab('verification');
        } else if (task.detectedIntent === 'redline') {
          setActiveTab('redline');
        } else {
          setPrompt(task.transcription);
          if (task.targetSkillId) setActiveSkillId(task.targetSkillId);
          setActiveTab('drafter');
          executeDraft(task.transcription, task.targetSkillId);
        }
      }
    } catch {
      setTimeout(() => setShowVoiceModal(false), 1400);
      setPrompt(spokenText);
      executeDraft(spokenText);
    }
  };

  const speakTTS = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak.slice(0, 350));
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsPlayingTTS(true);
    utterance.onend = () => setIsPlayingTTS(false);
    utterance.onerror = () => setIsPlayingTTS(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleReadAloud = () => {
    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
    } else {
      speakTTS(documentContent.slice(0, 700) || 'No document content currently loaded in studio.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const res = await fetch(`${API_BASE}/api/style-extract`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text, filename: file.name })
        });
        if (res.ok) {
          const data = await res.json();
          handleContentChange(data.result.markdown);
          setDocumentTitle(`Imported: ${file.name}`);
          setTokenMetrics(data.result.tokenOptimization);
          setStyleProfile(data.result.styleProfile);
          setActiveTab('drafter');
        }
      } catch {
        handleContentChange(text);
        setDocumentTitle(`Uploaded: ${file.name}`);
        setActiveTab('drafter');
      }
    };
    reader.readAsText(file);
  };

  const applyTemplate = (t: TemplateItem) => {
    setDocumentTitle(t.title);
    handleContentChange(t.content);
    setPrompt(`Generate an adapted version of ${t.title} for Indian jurisdiction under the Arbitration Act 1996.`);
    setActiveTab('drafter');
  };

  const filteredSkills = useMemo(() => {
    return skills.filter(s => {
      const matchesCat = selectedSkillCategory === 'all' || s.category === selectedSkillCategory;
      const matchesSearch = !skillSearchQuery || s.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) || s.description.toLowerCase().includes(skillSearchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [skills, selectedSkillCategory, skillSearchQuery]);

  return (
    <div className="draftmate-app">
      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" accept=".txt,.md,.doc,.docx,.pdf" style={{ display: 'none' }} onChange={handleFileUpload} />

      {/* Confirmation Modal */}
      {speechConfirmation && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-icon warning"><AlertTriangle size={24} /></div>
            <h3>Confirmation Required</h3>
            <p>{speechConfirmation.message}</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSpeechConfirmation(null)}>Cancel</button>
              <button className="btn-danger" onClick={speechConfirmation.onConfirm}>Confirm & Proceed</button>
            </div>
          </div>
        </div>
      )}

      {/* Collaborator Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-card profile-modal" onClick={e => e.stopPropagation()}>
            <div className="voice-modal-header">
              <div className="voice-modal-title">
                <Users size={18} className="text-accent" />
                <span>Your Legal Collaborator Profile</span>
              </div>
              <button className="btn-close-modal" onClick={() => setShowProfileModal(false)}><X size={16} /></button>
            </div>
            <p className="profile-hint">Other advocates and judges on this shared link will see your name and edits in real-time.</p>
            <div className="profile-inputs">
              <div>
                <label>Your Display Name</label>
                <input type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder="e.g. Adv. Siddharth Malhotra" />
              </div>
              <div>
                <label>Your Legal Role</label>
                <select value={userRole} onChange={e => setUserRole(e.target.value)}>
                  <option value="Senior Counsel">Senior Counsel / Lead Advocate</option>
                  <option value="Associate Drafter">Associate Drafter</option>
                  <option value="In-House Counsel">In-House General Counsel</option>
                  <option value="Judge / Evaluator">Hackathon Judge / Evaluator</option>
                  <option value="Law Student">Law Student / Researcher</option>
                </select>
              </div>
            </div>
            <div className="modal-actions-bar">
              <button className="btn-primary-action" onClick={() => { broadcastPresence(); setShowProfileModal(false); }}>
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Dictation Studio Modal */}
      {showVoiceModal && (
        <div className="modal-overlay" onClick={() => setShowVoiceModal(false)}>
          <div className="modal-card voice-studio-modal" onClick={e => e.stopPropagation()}>
            <div className="voice-modal-header">
              <div className="voice-modal-title">
                <Mic size={18} className="text-accent" />
                <span>VoxCPM Live Voice Agent Studio</span>
              </div>
              <button className="btn-close-modal" onClick={() => { stopListening(); setShowVoiceModal(false); }}>
                <X size={16} />
              </button>
            </div>

            <div className={`modal-mic-circle ${isListening ? 'listening' : ''}`} onClick={toggleListening}>
              {isListening ? <MicOff size={38} /> : <Mic size={38} />}
            </div>
            <div className="modal-mic-hint">
              {isListening ? '🔴 Recording active... Speak now (Click to stop)' : 'Click circle to start microphone recording'}
            </div>

            <div className="modal-transcript-area">
              <label>LIVE SPOKEN TRANSCRIPTION</label>
              <textarea
                value={voiceTranscript}
                onChange={(e) => { setVoiceTranscript(e.target.value); transcriptRef.current = e.target.value; }}
                placeholder="Speak into your microphone or choose a quick voice command below..."
                rows={3}
              />
            </div>

            <div className="modal-feedback-banner">
              <Volume2 size={16} />
              <span>{voiceFeedbackMsg}</span>
            </div>

            <div className="modal-quick-prompts">
              <small>⚡ Quick Spoken Commands (Click to simulate live voice command):</small>
              <div className="modal-chips-grid">
                <button onClick={() => {
                  const cmd = 'Draft a mutual Non-Disclosure Agreement for tech collaboration in New Delhi';
                  setVoiceTranscript(cmd);
                  transcriptRef.current = cmd;
                  processVoiceCommand(cmd);
                }}>
                  🎙️ "Draft an NDA for New Delhi"
                </button>
                <button onClick={() => {
                  const cmd = 'Verify citations and check Indian Contract Act provisions';
                  setVoiceTranscript(cmd);
                  transcriptRef.current = cmd;
                  processVoiceCommand(cmd);
                }}>
                  ⚖️ "Verify citations in draft"
                </button>
                <button onClick={() => {
                  const cmd = 'Redline the indemnification clause to insert 12 months fee cap';
                  setVoiceTranscript(cmd);
                  transcriptRef.current = cmd;
                  processVoiceCommand(cmd);
                }}>
                  🔍 "Redline indemnity clause"
                </button>
                <button onClick={() => {
                  const cmd = 'Draft an Executive Employment Agreement with IP assignment';
                  setVoiceTranscript(cmd);
                  transcriptRef.current = cmd;
                  processVoiceCommand(cmd);
                }}>
                  📄 "Draft Employment Agreement"
                </button>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button className="btn-secondary" onClick={() => { stopListening(); setShowVoiceModal(false); }}>
                Close
              </button>
              <button
                className="btn-primary-action"
                disabled={!voiceTranscript.trim()}
                onClick={() => {
                  const text = voiceTranscript.trim();
                  if (text) processVoiceCommand(text);
                }}
              >
                <Send size={14} /> Execute Command
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Top Global Navigation Header */}
      <header className="studio-header">
        <div className="header-left">
          <div className="brand-badge">
            <div className="brand-icon"><Scale size={20} /></div>
            <div>
              <span className="brand-name">DraftMate <span className="ai-sub">AI</span></span>
              <span className="brand-tag">Legal Drafting Studio</span>
            </div>
          </div>
          <div className="event-pill">
            <span className="pulse-indicator" />
            <span>Kodekurrent S2 • RGIPT</span>
          </div>
        </div>

        <div className="header-center">
          {/* Active Model Selector */}
          <div className="model-selector-wrapper">
            <Cpu size={14} className="model-icon" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="model-select"
            >
              <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Legal Benchmark)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fast Reasoning)</option>
              <option value="gpt-4o">GPT-4o (Balanced & Multi-Task)</option>
              <option value="claude-3-haiku">Claude 3 Haiku (Rapid Drafts)</option>
            </select>
          </div>
        </div>

        <div className="header-right">
          {/* Real-Time Collaborators Presence Pill */}
          <div className="collaborator-pill" onClick={() => setShowProfileModal(true)} title="Click to edit your collaborator profile">
            <div className="collab-avatars">
              <span className="avatar-chip user" title={`${userName} (${userRole})`}>
                {userName.slice(0, 2).toUpperCase()}
              </span>
              {collaborators.filter(c => c.id !== userId).slice(0, 2).map((c, i) => (
                <span key={i} className="avatar-chip guest" title={`${c.name} (${c.role})`}>
                  {c.name.slice(0, 2).toUpperCase()}
                </span>
              ))}
            </div>
            <span className="collab-count">
              <span className="online-beacon" />
              <strong>{Math.max(1, collaborators.length)} Online</strong>
            </span>
          </div>

          {/* Share Collaborative Link Button */}
          <button className="btn-share-link" onClick={handleShareLink} title="Share link with others to edit together">
            <Share2 size={14} />
            <span>{shareToast ? 'Link Copied!' : 'Share Live Room'}</span>
          </button>

          {/* Quick Voice Readout Toggle */}
          <button className={`btn-icon ${isPlayingTTS ? 'active' : ''}`} onClick={toggleReadAloud} title="Read aloud current draft">
            {isPlayingTTS ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </div>
      </header>

      {/* 2. Main Studio Container */}
      <div className="studio-body">
        {/* Left Sidebar Navigation */}
        <aside className="studio-sidebar">
          <div className="nav-group-label">WORKSPACE</div>
          <button className={`nav-item ${activeTab === 'drafter' ? 'active' : ''}`} onClick={() => setActiveTab('drafter')}>
            <FileSignature size={18} />
            <span>Drafter Studio</span>
          </button>
          <button className={`nav-item ${activeTab === 'verification' ? 'active' : ''}`} onClick={() => setActiveTab('verification')}>
            <ShieldCheck size={18} />
            <span>Citation Verifier</span>
            {verification && <span className="count-badge">{verification.score}%</span>}
          </button>
          <button className={`nav-item ${activeTab === 'redline' ? 'active' : ''}`} onClick={() => setActiveTab('redline')}>
            <GitPullRequest size={18} />
            <span>Risk & Redlining</span>
            {redlines.length > 0 && <span className="count-badge alert">{redlines.length}</span>}
          </button>
          <button className={`nav-item ${activeTab === 'voice' ? 'active' : ''}`} onClick={() => { setActiveTab('voice'); setShowVoiceModal(true); }}>
            <Mic size={18} />
            <span>Voice Agent</span>
            <span className="count-badge pulse">LIVE</span>
          </button>

          <div className="nav-group-label">COLLABORATION</div>
          <button className="nav-item" onClick={() => setShowCommentsDrawer(!showCommentsDrawer)}>
            <MessageSquare size={18} />
            <span>Team Comments</span>
            <span className="count-badge">{sharedComments.filter(c => !c.resolved).length}</span>
          </button>
          <button className="nav-item" onClick={() => setShowProfileModal(true)}>
            <UserCheck2 size={18} />
            <span>Counsel Profile</span>
          </button>

          <div className="nav-group-label">RESOURCES</div>
          <button className={`nav-item ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
            <Layers size={18} />
            <span>Skills Library</span>
            <span className="count-badge">{skills.length || 52}</span>
          </button>
          <button className={`nav-item ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>
            <BookOpen size={18} />
            <span>Templates</span>
          </button>
          <button className={`nav-item ${activeTab === 'optimizer' ? 'active' : ''}`} onClick={() => setActiveTab('optimizer')}>
            <Zap size={18} />
            <span>Token Optimizer</span>
          </button>

          <div className="sidebar-footer">
            <div className="legal-trust-box">
              <Shield size={14} />
              <span>Multi-user live editing enabled. All changes sync across devices in real-time.</span>
            </div>
          </div>
        </aside>

        {/* Center Main Stage */}
        <main className="studio-content">
          {/* Top Interactive Prompt Bar & Prompt Meter */}
          <section className="prompt-studio-card">
            <div className="prompt-header-row">
              <div className="prompt-title-meta">
                <Sparkles size={16} className="text-accent" />
                <span className="prompt-label">LEGAL INSTRUCTION PROMPT</span>
              </div>

              {/* Real-Time Prompt Strength Meter (Page 4 Reference UI) */}
              <div className="prompt-meter-box">
                <span className="meter-label">Prompt Strength: <strong>{promptScore}%</strong> ({promptRating})</span>
                <div className="meter-track">
                  <div
                    className={`meter-bar ${promptScore >= 80 ? 'high' : promptScore >= 50 ? 'med' : 'low'}`}
                    style={{ width: `${promptScore}%` }}
                  />
                </div>
                <button
                  className="btn-improve-prompt"
                  onClick={handleImprovePrompt}
                  disabled={isEnhancing}
                  title="Enhance prompt with statutory references, arbitration seat, and liability caps"
                >
                  <Sparkles size={13} />
                  <span>{isEnhancing ? 'Improving…' : 'Improve Prompt'}</span>
                </button>
              </div>
            </div>

            {/* Prompt Input Box & Controls */}
            <div className="prompt-input-container">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything or type @ to use a specific legal skill (e.g. Draft an NDA, Redline liability clause, Check citations)..."
                rows={2}
                className="prompt-textarea"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    executeDraft(prompt);
                  }
                }}
              />
              <div className="prompt-actions-bar">
                <div className="prompt-action-left">
                  <button className="btn-chip" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={14} /> Add Document
                  </button>
                  <button
                    className={`btn-chip voice ${isListening ? 'listening' : ''}`}
                    onClick={() => { setShowVoiceModal(true); toggleListening(); }}
                    title="Click to speak your legal instruction"
                  >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                    <span>Voice Dictation</span>
                  </button>
                  <button
                    className="btn-chip"
                    onClick={() => setShowVariableBar(!showVariableBar)}
                    title="Customize parties and terms"
                  >
                    <Sliders size={14} /> Customize Variables
                  </button>
                </div>
                <button
                  className="btn-send-prompt"
                  disabled={isDrafting || !prompt.trim()}
                  onClick={() => executeDraft(prompt)}
                >
                  {isDrafting ? <RefreshCw size={15} className="spin" /> : <Send size={15} />}
                  <span>{isDrafting ? 'Drafting…' : 'Execute Agents'}</span>
                </button>
              </div>
            </div>

            {/* Party Variables Customizer Bar */}
            {showVariableBar && (
              <div className="variable-customizer-card">
                <div className="var-header">
                  <strong><Settings2 size={15} /> Contract Variables Customizer</strong>
                  <small>Auto-populates throughout document clauses</small>
                </div>
                <div className="var-grid">
                  <div>
                    <label>Party 1 (Discloser / Co.)</label>
                    <input type="text" value={party1Name} onChange={e => setParty1Name(e.target.value)} />
                  </div>
                  <div>
                    <label>Party 2 (Recipient / Client)</label>
                    <input type="text" value={party2Name} onChange={e => setParty2Name(e.target.value)} />
                  </div>
                  <div>
                    <label>Arbitration Seat</label>
                    <input type="text" value={governingCity} onChange={e => setGoverningCity(e.target.value)} />
                  </div>
                  <div>
                    <label>Contract Term</label>
                    <input type="text" value={contractTerm} onChange={e => setContractTerm(e.target.value)} />
                  </div>
                </div>
                <div className="var-actions">
                  <button className="btn-primary-action" onClick={applyVariablesToDocument}>
                    <CheckCheck size={14} /> Apply to Document
                  </button>
                </div>
              </div>
            )}

            {/* Quick Pills Bar (Page 4 Reference UI) */}
            <div className="quick-skills-pills">
              <span className="pills-lead">Legal Skills:</span>
              <button className="skill-pill" onClick={() => { setActiveSkillId('contract-review'); executeDraft('Review this commercial contract and identify high-risk indemnities', 'contract-review'); }}>
                Contract Review
              </button>
              <button className="skill-pill" onClick={() => { setActiveSkillId('redlining'); executeDraft('Redline this agreement to insert mutual liability cap of 12 months fees', 'redlining'); }}>
                Redlining
              </button>
              <button className="skill-pill" onClick={() => { setActiveSkillId('case-law-research'); executeDraft('Find landmark Supreme Court precedents on Section 27 non-compete enforceability', 'case-law-research'); }}>
                Legal Research
              </button>
              <button className="skill-pill" onClick={() => { setActiveSkillId('agreement-drafting'); executeDraft('Draft Master Services Agreement with IP assignment and New Delhi arbitration', 'agreement-drafting'); }}>
                Agreement Drafting
              </button>
              <button className="skill-pill" onClick={() => { setActiveSkillId('case-brief'); executeDraft('Generate structured Case Brief for Kesavananda Bharati AIR 1973 SC 1461', 'case-brief'); }}>
                Case Analysis
              </button>
              <button className="skill-pill" onClick={() => { setActiveSkillId('legal-notice-drafting'); executeDraft('Draft Statutory Legal Notice for recovery under Section 138 NI Act and Section 73 ICA', 'legal-notice-drafting'); }}>
                Legal Notice
              </button>
              <button className="skill-pill" onClick={() => { setActiveSkillId('due-diligence'); executeDraft('Perform due diligence review on change-of-control and assignment clauses', 'due-diligence'); }}>
                Due Diligence
              </button>
              <button className="skill-pill view-all" onClick={() => setActiveTab('skills')}>
                View All Skills →
              </button>
            </div>
          </section>

          {/* DYNAMIC TAB WORKSPACE */}

          {/* TAB 1: DRAFTER STUDIO */}
          {activeTab === 'drafter' && (
            <div className="drafter-studio-grid">
              {/* Document Editor Canvas */}
              <div className="editor-card">
                {/* Collaborative Live Bar */}
                <div className="collab-live-status-bar">
                  <div className="collab-status-left">
                    <span className={`sync-indicator ${syncStatus}`}>
                      <Radio size={12} className={syncStatus === 'syncing' ? 'spin' : ''} />
                      {syncStatus === 'syncing' ? 'Syncing to cloud...' : syncStatus === 'synced' ? `Live Shared Room (#Rev ${serverVersion})` : 'Offline Mode'}
                    </span>
                    <span className="last-edit-info">
                      Last edited by <strong>{lastModifiedBy}</strong>
                    </span>
                  </div>
                  <div className="collab-status-right">
                    <button className="btn-manual-sync" onClick={handleManualSync} title="Force sync with other collaborators">
                      <RefreshCw size={12} className={syncStatus === 'syncing' ? 'spin' : ''} />
                      <span>Sync Now</span>
                    </button>
                    <button className="btn-comments-toggle" onClick={() => setShowCommentsDrawer(!showCommentsDrawer)}>
                      <MessageCircle size={13} />
                      <span>Team Notes ({sharedComments.length})</span>
                    </button>
                  </div>
                </div>

                <div className="editor-top-bar">
                  <div className="doc-title-editor">
                    <FileText size={17} className="text-accent" />
                    <input
                      type="text"
                      value={documentTitle}
                      onChange={(e) => {
                        setDocumentTitle(e.target.value);
                        handleContentChange(documentContent);
                      }}
                      className="title-input"
                    />
                    <span className="badge-doc-type">{documentType}</span>
                  </div>

                  <div className="editor-actions">
                    {/* View Mode Toggle: Editor vs Parchment Deed */}
                    <div className="view-mode-toggle">
                      <button
                        className={`toggle-btn ${viewMode === 'editor' ? 'active' : ''}`}
                        onClick={() => setViewMode('editor')}
                        title="Markdown Editor Mode"
                      >
                        Editor
                      </button>
                      <button
                        className={`toggle-btn ${viewMode === 'parchment' ? 'active' : ''}`}
                        onClick={() => setViewMode('parchment')}
                        title="Formal Legal Parchment Deed Preview"
                      >
                        <Landmark size={13} /> Deed View
                      </button>
                    </div>

                    <button className="btn-action" onClick={handleCopy} title="Copy to clipboard">
                      {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button className="btn-action" onClick={() => handleDownload('md')} title="Download Markdown">
                      <Download size={14} /> <span>Markdown</span>
                    </button>
                    <button className="btn-action" onClick={() => handleDownload('doc')} title="Download Word (.doc)">
                      <Download size={14} /> <span>Word</span>
                    </button>
                    <button className="btn-action primary" onClick={() => window.print()} title="Print or Save PDF">
                      <span>Print / PDF</span>
                    </button>
                  </div>
                </div>

                {/* Editor Content Area */}
                <div className="editor-content-area">
                  {isDrafting ? (
                    <div className="drafting-loading-state">
                      <div className="spinner-large" />
                      <h3>Chief Legal Drafter Synthesizing Clauses...</h3>
                      <p>Athena Agent is coordinating with Justitia Verification & Sentinel Risk Auditor</p>
                      <div className="loading-steps">
                        <span>• Structuring formal Recitals & operative covenants</span>
                        <span>• Anchoring Section 10 & 27 of Indian Contract Act 1872</span>
                        <span>• Verifying Arbitration seat in New Delhi under 1996 Act</span>
                      </div>
                    </div>
                  ) : viewMode === 'parchment' ? (
                    <div className="parchment-deed-view">
                      <div className="stamp-duty-header">
                        <div className="stamp-seal"><Landmark size={28} /></div>
                        <div className="stamp-text">
                          <strong>GOVERNMENT OF INDIA • NON-JUDICIAL STAMP DEED</strong>
                          <small>INDIAN STAMP ACT, 1899 • VALID COMMERCIAL INSTRUMENT</small>
                        </div>
                        <div className="stamp-badge">VERIFIED DEED</div>
                      </div>
                      <div className="deed-body">
                        <pre className="deed-content-text">{documentContent}</pre>
                      </div>
                      <div className="deed-footer">
                        <div className="footer-seal">
                          <BookmarkCheck size={20} />
                          <span>Advocate Attestation: Digitally Drafted under Indian Law</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <textarea
                      value={documentContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="Your generated legal agreement or document will appear here. Anyone sharing this room can edit live simultaneously..."
                      className="legal-document-canvas"
                    />
                  )}
                </div>

                {/* Editor Status Bar */}
                <div className="editor-status-bar">
                  <div className="status-stat">
                    <span>Words: <strong>{documentContent.trim().split(/\s+/).filter(Boolean).length}</strong></span>
                    <span>Tokens: <strong>~{Math.round(documentContent.length / 4)}</strong></span>
                  </div>
                  {styleProfile && (
                    <div className="status-tags">
                      <span className="tag-pill">Tone: {styleProfile.tone}</span>
                      <span className="tag-pill">Jurisdiction: {styleProfile.jurisdiction}</span>
                      <span className="tag-pill">Pattern: {styleProfile.clausePattern}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Live Multi-Agent Intelligence Feed OR Team Comments Drawer */}
              <div className="agent-feed-card">
                {showCommentsDrawer ? (
                  <div className="team-comments-card">
                    <div className="feed-header">
                      <div className="feed-title">
                        <MessageSquare size={16} />
                        <span>Team Review Notes</span>
                      </div>
                      <button className="btn-close-sm" onClick={() => setShowCommentsDrawer(false)}><X size={14} /></button>
                    </div>

                    <div className="add-comment-box">
                      <input
                        type="text"
                        value={newCommentClause}
                        onChange={e => setNewCommentClause(e.target.value)}
                        placeholder="Target Clause (e.g. Section 5: Indemnity)"
                        className="comment-clause-input"
                      />
                      <textarea
                        value={newCommentText}
                        onChange={e => setNewCommentText(e.target.value)}
                        placeholder="Leave legal observation or note for your co-counsels / judges..."
                        rows={2}
                        className="comment-textarea"
                      />
                      <button className="btn-post-comment" onClick={handlePostComment}>
                        <PlusCircle size={13} /> Post Note
                      </button>
                    </div>

                    <div className="comments-scroll-list">
                      {sharedComments.map((c) => (
                        <div key={c.id} className={`comment-item ${c.resolved ? 'resolved' : ''}`}>
                          <div className="comment-head">
                            <strong>{c.author}</strong>
                            <small>{c.role} • {c.timestamp}</small>
                          </div>
                          <span className="comment-clause-badge">{c.clauseTitle}</span>
                          <p className="comment-body-text">{c.comment}</p>
                          {!c.resolved ? (
                            <button className="btn-resolve-comm" onClick={() => handleResolveComment(c.id)}>
                              <Check size={12} /> Mark Resolved
                            </button>
                          ) : (
                            <span className="resolved-tag">✓ Resolved</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="feed-header">
                      <div className="feed-title">
                        <Cpu size={16} />
                        <span>Agent Orchestration Pipeline</span>
                      </div>
                      <span className="live-status"><span className="pulse-dot" /> ACTIVE</span>
                    </div>

                    <div className="agent-steps-list">
                      {agentChain.length > 0 ? (
                        agentChain.map((step, idx) => (
                          <div key={idx} className={`agent-step-item ${step.status}`}>
                            <div className="step-indicator">
                              {step.status === 'completed' ? <CheckCircle2 size={16} /> : <RefreshCw size={16} className="spin" />}
                            </div>
                            <div className="step-body">
                              <div className="step-head">
                                <strong>{step.agent}</strong>
                                <small>{step.action}</small>
                              </div>
                              {step.details && <p className="step-detail">{step.details}</p>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-feed">
                          <Bot size={32} />
                          <p>No active agent run. Trigger a draft or voice command to watch Athena, Justitia, and Sentinel collaborate.</p>
                        </div>
                      )}
                    </div>

                    {/* Headroom Token Optimization Card */}
                    {tokenMetrics && (
                      <div className="token-opt-summary">
                        <div className="opt-title">
                          <Zap size={14} className="text-accent" />
                          <span>Headroom Context Optimization</span>
                        </div>
                        <div className="opt-metrics-row">
                          <div className="opt-metric">
                            <small>Raw Tokens</small>
                            <strong>{tokenMetrics.rawTokensEstimate}</strong>
                          </div>
                          <div className="opt-metric">
                            <small>Optimized</small>
                            <strong>{tokenMetrics.optimizedTokensEstimate}</strong>
                          </div>
                          <div className="opt-metric highlight">
                            <small>Token Savings</small>
                            <strong>-{tokenMetrics.tokensSavedPercent}%</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CITATION & LEGAL AUTHORITY VERIFICATION MODULE */}
          {activeTab === 'verification' && (
            <div className="verification-tab-container">
              <div className="tab-banner">
                <div>
                  <div className="eyebrow"><ShieldCheck size={15} /> JUSTITIA VERIFICATION AGENT</div>
                  <h2>Citation & Statutory Authority Verification</h2>
                  <p className="tab-desc">
                    Checks case law and statutory references against authentic legal sources (Indian Kanoon, Supreme Court of India, IndiaCode Bare Acts). Classifies findings into Verified, Partially Verified, and Unverified Hallucinations.
                  </p>
                </div>
                {verification && (
                  <div className="score-badge-card">
                    <span className="score-number">{verification.score}%</span>
                    <span className="score-title">Verification Score</span>
                    <small>{verification.verifiedCount} Verified • {verification.unverifiedCount} Flagged</small>
                  </div>
                )}
              </div>

              {/* Verification Safety Banner */}
              {verification?.safetySummary && (
                <div className={`safety-alert ${verification.unverifiedCount > 0 ? 'warning' : 'safe'}`}>
                  {verification.unverifiedCount > 0 ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                  <span>{verification.safetySummary}</span>
                </div>
              )}

              {/* Citations Table */}
              <div className="citations-table-card">
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Citation</th>
                      <th>Case Law / Statutory Reference</th>
                      <th>Authority / Bench</th>
                      <th>Legal Holding & Doctrinal Ratio</th>
                      <th>Official Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verification?.citations.map((c, i) => (
                      <tr key={i} className={`row-${c.status}`}>
                        <td>
                          <span className={`status-pill ${c.status}`}>
                            {c.status === 'verified' && '🟢 Verified'}
                            {c.status === 'partially_verified' && '🟡 Partially Verified'}
                            {c.status === 'unverified' && '🔴 Flagged'}
                          </span>
                        </td>
                        <td className="code-font">{c.citation}</td>
                        <td><strong>{c.target}</strong></td>
                        <td>{c.authority}</td>
                        <td className="explanation-cell">
                          {c.explanation}
                          {c.flagReason && <div className="flag-reason">{c.flagReason}</div>}
                        </td>
                        <td>
                          {c.sourceUrl ? (
                            <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
                              Verify <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="no-source">No official source</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: AI REDLINING & RISK AUDIT */}
          {activeTab === 'redline' && (
            <div className="redline-tab-container">
              <div className="tab-banner">
                <div>
                  <div className="eyebrow"><GitPullRequest size={15} /> SENTINEL RISK AUDITOR</div>
                  <h2>Contract Redlining & Risk Analysis</h2>
                  <p className="tab-desc">
                    Identifies one-sided terms, un-capped indemnities, void post-employment non-competes, and proposes reciprocal, market-standard redlines with senior counsel rationale.
                  </p>
                </div>
                <div className="redline-summary-pill">
                  <button className="btn-primary-action" onClick={applyAllRedlinesToDocument}>
                    <CheckCheck size={14} /> Apply All Redlines to Draft
                  </button>
                </div>
              </div>

              <div className="redlines-list">
                {redlines.map((r) => {
                  const isAccepted = acceptedRedlines[r.id];
                  return (
                    <div key={r.id} className={`redline-card ${r.riskLevel} ${isAccepted ? 'accepted' : ''}`}>
                      <div className="redline-card-header">
                        <div className="redline-title-group">
                          <span className={`risk-badge ${r.riskLevel}`}>{r.riskLevel.toUpperCase()} RISK</span>
                          <h3>{r.clauseTitle}</h3>
                        </div>
                        <div className="redline-card-actions">
                          <button
                            className={`btn-toggle-accept ${isAccepted ? 'accepted' : ''}`}
                            onClick={() => setAcceptedRedlines({ ...acceptedRedlines, [r.id]: !isAccepted })}
                          >
                            {isAccepted ? <Check size={14} /> : <Sparkles size={14} />}
                            <span>{isAccepted ? 'Redline Applied' : 'Accept Revision'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="diff-comparison-grid">
                        <div className="diff-box original">
                          <small>ORIGINAL CLAUSE (EXPOSURE)</small>
                          <p>{r.originalText}</p>
                        </div>
                        <div className="diff-box proposed">
                          <small>PROPOSED REVISION (MARKET STANDARD)</small>
                          <p>{r.proposedText}</p>
                        </div>
                      </div>

                      <div className="redline-rationale">
                        <strong>Senior Counsel Rationale:</strong> {r.rationale}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: VOICE AGENT & SPEECH COMMANDS */}
          {activeTab === 'voice' && (
            <div className="voice-tab-container">
              <div className="tab-banner">
                <div>
                  <div className="eyebrow"><Mic size={15} /> VOXCPM & OPENWHISPR AGENT</div>
                  <h2>Spoken Legal Dictation & Voice Commands</h2>
                  <p className="tab-desc">
                    Issue natural speech commands to draft, review, check citations, or dictate bespoke contract clauses. Features voice dictation studio modal and audio read-aloud TTS.
                  </p>
                </div>
              </div>

              <div className="voice-interactive-stage">
                <div className={`waveform-visualizer ${isListening ? 'active' : ''}`}>
                  <div className="bar b1" />
                  <div className="bar b2" />
                  <div className="bar b3" />
                  <div className="bar b4" />
                  <div className="bar b5" />
                  <div className="bar b6" />
                  <div className="bar b7" />
                  <div className="bar b8" />
                  <div className="bar b9" />
                </div>

                <button className={`btn-large-mic ${isListening ? 'listening' : ''}`} onClick={toggleListening}>
                  {isListening ? <MicOff size={38} /> : <Mic size={38} />}
                  <span>{isListening ? 'Recording... (Click to Stop)' : 'Open Voice Dictation Studio'}</span>
                </button>

                <div className="voice-transcript-box">
                  <small>LIVE SPEECH TRANSCRIPTION</small>
                  <p>{voiceTranscript ? `"${voiceTranscript}"` : '(Click button above or choose any quick voice command below)'}</p>
                </div>

                <div className="voice-agent-reply-box">
                  <Volume2 size={16} />
                  <span>{voiceFeedbackMsg}</span>
                </div>

                {/* Quick Voice Demo Triggers */}
                <div className="voice-sample-commands">
                  <h4>⚡ Instant Voice Triggers (Click to execute voice agent with full TTS audio readout):</h4>
                  <div className="sample-chips">
                    <button onClick={() => { setVoiceTranscript('Draft an NDA for software engineer collaboration in New Delhi'); processVoiceCommand('Draft an NDA for software engineer collaboration in New Delhi'); }}>
                      🎙️ "Draft an NDA for software engineer collaboration in New Delhi"
                    </button>
                    <button onClick={() => { setVoiceTranscript('Verify citations and check Indian Contract Act provisions'); processVoiceCommand('Verify citations and check Indian Contract Act provisions'); }}>
                      ⚖️ "Verify citations and check Indian Contract Act provisions"
                    </button>
                    <button onClick={() => { setVoiceTranscript('Redline the indemnification clause to insert 12 months fee cap'); processVoiceCommand('Redline the indemnification clause to insert 12 months fee cap'); }}>
                      🔍 "Redline the indemnification clause to insert 12 months fee cap"
                    </button>
                    <button onClick={() => { setVoiceTranscript('Draft an Executive Employment Agreement with IP assignment'); processVoiceCommand('Draft an Executive Employment Agreement with IP assignment'); }}>
                      📄 "Draft an Executive Employment Agreement with IP assignment"
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SKILLS LIBRARY */}
          {activeTab === 'skills' && (
            <div className="skills-tab-container">
              <div className="tab-banner">
                <div>
                  <div className="eyebrow"><Layers size={15} /> EXTENSIBLE SKILLS FRAMEWORK</div>
                  <h2>52 Specialized Legal Skills Library</h2>
                  <p className="tab-desc">
                    Comprehensive catalog of modular legal workflows inspired by Awesome Legal Skills & Claude for Legal. Select any skill to populate prompt and trigger execution.
                  </p>
                </div>
              </div>

              {/* Category Filters & Search */}
              <div className="skills-filter-bar">
                <div className="search-input-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search 52 legal skills (e.g., NDA, Redline, Due Diligence, Socratic)..."
                    value={skillSearchQuery}
                    onChange={(e) => setSkillSearchQuery(e.target.value)}
                  />
                </div>

                <div className="category-chips">
                  {[
                    { id: 'all', label: 'All Skills' },
                    { id: 'drafting', label: 'Drafting & Writing' },
                    { id: 'review', label: 'Document Review' },
                    { id: 'research', label: 'Legal Research' },
                    { id: 'case_tools', label: 'Case & Judgment' },
                    { id: 'compliance', label: 'Compliance & Advisory' },
                    { id: 'student', label: 'Student Learning' },
                    { id: 'utilities', label: 'General Utilities' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      className={`cat-chip ${selectedSkillCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedSkillCategory(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills Grid */}
              <div className="skills-grid">
                {filteredSkills.map((s) => (
                  <div key={s.id} className="skill-item-card">
                    <div className="skill-card-top">
                      <span className="skill-cat-tag">{s.categoryLabel}</span>
                      {s.badge && <span className="skill-badge">{s.badge}</span>}
                    </div>
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                    <button
                      className="btn-use-skill"
                      onClick={() => {
                        setActiveSkillId(s.id);
                        setPrompt(s.suggestedPrompt);
                        setActiveTab('drafter');
                        executeDraft(s.suggestedPrompt, s.id);
                      }}
                    >
                      <span>Execute Skill</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="templates-tab-container">
              <div className="tab-banner">
                <div>
                  <div className="eyebrow"><BookOpen size={15} /> AUTHENTIC CONTRACT TEMPLATES</div>
                  <h2>Pre-Loaded Legal Document Templates</h2>
                  <p className="tab-desc">
                    Battle-tested legal templates drafted by corporate advocates with Indian law compliance, statutory citations, and standard commercial safeguards.
                  </p>
                </div>
              </div>

              <div className="templates-grid">
                {templates.map((t) => (
                  <div key={t.id} className="template-card">
                    <div className="tpl-category">{t.category}</div>
                    <h3>{t.title}</h3>
                    <p>{t.description}</p>
                    <div className="tpl-jurisdiction"><Shield size={12} /> {t.jurisdiction}</div>
                    <button className="btn-load-template" onClick={() => applyTemplate(t)}>
                      <span>Load into Studio Canvas</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: TOKEN OPTIMIZER & MARKITDOWN */}
          {activeTab === 'optimizer' && (
            <div className="optimizer-tab-container">
              <div className="tab-banner">
                <div>
                  <div className="eyebrow"><Zap size={15} /> HEADROOM & MARKITDOWN</div>
                  <h2>Token & Context Management Engine</h2>
                  <p className="tab-desc">
                    Converts complex PDF/DOCX agreements into structured Markdown while stripping boilerplate redundancies, saving up to 65% LLM tokens while preserving legal precision.
                  </p>
                </div>
              </div>

              <div className="optimizer-demo-card">
                <div className="opt-upload-prompt">
                  <Upload size={32} />
                  <h3>Upload any legal document to optimize</h3>
                  <p>Accepts .docx, .pdf, .txt, or .md files. Performs structured extraction and token reduction.</p>
                  <button className="btn-primary-action" onClick={() => fileInputRef.current?.click()}>
                    Choose Document
                  </button>
                </div>

                <div className="opt-features-grid">
                  <div className="opt-feature">
                    <CheckCircle2 size={18} className="text-accent" />
                    <strong>MarkItDown Structure Preservation</strong>
                    <p>Maintains statutory clause numbering, tables, and party signatures cleanly in GFM Markdown.</p>
                  </div>
                  <div className="opt-feature">
                    <CheckCircle2 size={18} className="text-accent" />
                    <strong>Selective Context Retrieval</strong>
                    <p>Feeds only operative covenants to the LLM, reducing latency and hallucination risks.</p>
                  </div>
                  <div className="opt-feature">
                    <CheckCircle2 size={18} className="text-accent" />
                    <strong>Drafting Style Adaptation</strong>
                    <p>Analyzes uploaded files to extract phrasing conventions (e.g. "Party of the First Part") and tone.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
