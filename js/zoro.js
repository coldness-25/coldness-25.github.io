/* ══════════════════════════════════════════
   ZORO.JS — AI Assistant Engine v2
   Conversational · General Knowledge · Claude API ready
══════════════════════════════════════════ */

/* ── Phaneendra's profile ─────────────────── */
const PROFILE = {
  name: 'Phaneendra Yeminedi',
  role: 'Business Analyst & Consultant',
  location: 'India (studied in Glasgow, UK)',
  education: 'MSc Strategic Management — University of Strathclyde, Glasgow',
  experience: 'QA Analyst at Accenture (2022–2024) + VFX consulting engagement',
  skills: 'Business Analysis, Requirements Engineering, Agile (JIRA/Confluence/Scrum/Kanban), Power BI, Excel (Advanced), SQL, Change Management, QA, Stakeholder Management',
  projects: 'Amazon Strategic Matrix, Phantom Frame VFX Scheduler, Accenture Quality Guardian, MSc Dissertation',
  contact: { linkedin: 'linkedin.com/in/yeminedi-phaneendra', github: 'github.com/coldness-25', email: 'phaneendra.yeminedi@gmail.com' },
};

/* ── Conversation memory ─────────────────── */
const MEM = {
  history: [],
  lastTopic: null,
  apiKey: localStorage.getItem('zoro_api_key') || null,
  msgCount: 0,
};

/* ── Utilities ───────────────────────────── */
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const time = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

/* ══════════════════════════════════════════
   INTENT LIBRARY
   Ordered by specificity — check specific first
══════════════════════════════════════════ */
const INTENTS = [

  /* ── Conversational ───────────────── */
  {
    id: 'how_are_you',
    test: t => /how (are you|you doing|is it going|you been|are things)|what'?s (good|new|up|crackin)|how'?s (life|everything|it going)|you good|all good/i.test(t),
    responses: [
      "Doing great — thanks for asking! I'm Zoro, Phaneendra's AI assistant. Sharp, caffeinated, and ready to help. What's on your mind?",
      "All systems running smooth! What can I do for you today — want to know about Phaneendra, or just here for a chat?",
      "Honestly? Excellent. I exist to be helpful, so every conversation is a good one. What brings you here?",
      "Running at full capacity, thanks! Whether you're here to learn about Phaneendra or just want to talk — I'm your guy. What's up?",
    ],
  },
  {
    id: 'greeting',
    test: t => /^(hi|hey|hello|sup|yo|hiya|howdy|good\s*(morning|afternoon|evening|day)|what'?s up|greetings|salut|namaste)/i.test(t),
    responses: [
      "Hey! I'm Zoro — Phaneendra's personal AI assistant. Ask me anything about him, his work, or honestly just about life. What do you need?",
      "Hello there! Zoro online. I can walk you through Phaneendra's background, projects, and skills — or answer whatever else is on your mind.",
      "Hey! Good to see you here. I'm Zoro — equal parts portfolio guide and general knowledge engine. What can I help with?",
      "Hi! Welcome to Phaneendra's world. I'm Zoro — ask me anything, seriously. Skills, projects, career, general questions — all fair game.",
    ],
  },
  {
    id: 'thanks',
    test: t => /thank(s| you)|cheers|appreciate|that.?s helpful|great answer|good answer/i.test(t),
    responses: [
      "Happy to help! Anything else you'd like to know?",
      "Anytime — that's what I'm here for. What else can I tell you?",
      "My pleasure. Ask away whenever you need anything.",
    ],
  },
  {
    id: 'bye',
    test: t => /\b(bye|goodbye|see (you|ya)|cya|later|peace|take care|gotta go|ttyl)\b/i.test(t),
    responses: [
      "Take care! If you're considering working with Phaneendra — I'd strongly recommend it. He doesn't disappoint.",
      "See you around! Feel free to come back whenever you have questions.",
      "Later! Phaneendra's contact is always open if you want to reach out directly.",
    ],
  },
  {
    id: 'joke',
    test: t => /tell (me )?(a )?joke|make me laugh|something funny|humor|funny/i.test(t),
    responses: [
      "Why do business analysts make terrible comedians? Because every punchline needs 3 rounds of stakeholder sign-off before delivery. 😄",
      "A consultant walks into a bar. Sizes up the situation. Produces a 40-slide deck on why the bar is underperforming. Bills 3 hours. Orders water.",
      "Why don't analysts trust atoms? Because they make up everything — just like scope creep. Ask me something serious now, I'm better at that.",
    ],
  },
  {
    id: 'compliment',
    test: t => /you('re| are) (smart|great|good|amazing|brilliant|helpful|awesome)|nice bot|great bot|love (you|this)|impressive/i.test(t),
    responses: [
      "Ha — I appreciate that. Though credit goes to Phaneendra for building a portfolio interesting enough to warrant an AI this sharp.",
      "Thanks! I try. Though between us, the real impressive one here is Phaneendra. Have you checked out his projects yet?",
      "You're too kind. I'm just doing my job — which right now is making sure you leave this page seriously considering hiring Phaneendra.",
    ],
  },

  /* ── About Phaneendra ─────────────── */
  {
    id: 'who',
    test: t => /who (is|are) (phaneendra|he|this person|the guy|the owner)|tell me about (phaneendra|him|this person)|about (phaneendra|him)|introduce (phaneendra|him|yourself)/i.test(t),
    responses: [
      `Phaneendra Yeminedi is a **Business Analyst & Consultant** based in India. He holds an MSc from the **University of Strathclyde, Glasgow** and spent 2+ years at **Accenture** as a QA Analyst. He bridges the gap between business strategy and technical delivery — requirements engineering, data analytics, Agile delivery, change management. Multi-industry experience including enterprise tech and VFX.`,
      `Meet Phaneendra — a strategic thinker with serious enterprise muscle. MSc from Strathclyde (Glasgow), ex-Accenture, multi-industry consultant. He turns ambiguous business problems into clear, actionable solutions. Requirements? Data? Change? Agile? That's his domain.`,
    ],
  },
  {
    id: 'availability',
    test: t => /available|open to|looking for|hire|freelance|opportunity|job|role|position|recruit/i.test(t),
    responses: [
      "Phaneendra is **currently open to new opportunities** — consulting engagements, full-time BA/consultant roles, and strategic project work. Best to connect on LinkedIn or use the contact form on this page.",
      "Yes — open for business! Consulting projects, full-time BA roles, and interesting strategic work. Drop a message via the contact form or LinkedIn.",
    ],
  },
  {
    id: 'contact',
    test: t => /contact|reach|email|get in touch|connect|linkedin|github|message him/i.test(t),
    responses: [
      `Best ways to reach Phaneendra:\n\n**LinkedIn:** linkedin.com/in/yeminedi-phaneendra\n**Email:** phaneendra.yeminedi@gmail.com\n**GitHub:** github.com/coldness-25\n\nOr use the contact form on this page — he typically responds within 24 hours.`,
    ],
  },
  {
    id: 'location',
    test: t => /where|location|based|country|city|india|glasgow|uk|remote/i.test(t),
    responses: [
      "Phaneendra is based in **India**, with international experience — he studied and lived in **Glasgow, UK** during his MSc at Strathclyde. Open to remote work globally and relocation opportunities.",
    ],
  },

  /* ── Skills & Experience ──────────── */
  {
    id: 'skills',
    test: t => /skill|expertise|good at|know how|competenc|proficien|capabilit|what (can|does) (he|phaneendra)/i.test(t),
    responses: [
      `Core skills:\n\n**Business Analysis** ████████████ LV.5 — Requirements, Process Mapping, Gap Analysis\n**Agile & PM** █████████░░ LV.4 — Scrum, Kanban, JIRA, Confluence\n**Data & Analytics** ████████░░░ LV.4 — Excel, Power BI, SQL\n**Consulting** █████████░░ LV.4 — Change Mgmt, Strategy, SWOT\n**QA** ████████░░░ LV.4 — Test Planning, UAT, Defect Tracking`,
      `Phaneendra's toolkit: Business Analysis, Requirements Engineering, Agile (Scrum/Kanban), JIRA, Confluence, Power BI, Excel (Advanced), SQL, Change Management, Stakeholder Workshops, QA & UAT. Strategic frameworks: Porter's Five Forces, SWOT, VRIN. Strong executive communication.`,
    ],
  },
  {
    id: 'experience',
    test: t => /experience|career|work(ed)?( at| for)?|job|employ|background|history|accenture/i.test(t),
    responses: [
      `Two key deployments:\n\n**Accenture (2022–2024)** — QA Analyst in enterprise tech. Led test lifecycle, coordinated UAT, managed 200+ JIRA defects, reported to senior stakeholders.\n\n**VFX Consulting (2024)** — Mapped studio workflows, built Excel scheduling prototype.\n\n**MSc Strathclyde** — Strategic management, business consulting, dissertation on digital transformation.`,
    ],
  },
  {
    id: 'education',
    test: t => /education|degree|university|study|strath|glasgow|msc|master|academic/i.test(t),
    responses: [
      `Phaneendra holds an **MSc in Strategic Management** from the **University of Strathclyde**, Glasgow (one of the UK's top 20 business schools). Covered strategic analysis, change management, international business, and consulting frameworks. His dissertation explored competitive strategy in digital markets.`,
    ],
  },

  /* ── Projects ─────────────────────── */
  {
    id: 'projects',
    test: t => /project|mission|portfolio|case study|work sample|what (has|did) (he|phaneendra) (do|build|make|work)/i.test(t),
    responses: [
      `Four field missions:\n\n**OP-001: Amazon Strategic Matrix** — Porter's Five Forces + SWOT deep-dive on Amazon.\n**OP-002: Phantom Frame Scheduler** — VFX production scheduling tool in Excel/VBA.\n**OP-003: Quality Guardian (Accenture)** — Enterprise QA programme, 200+ defects, multi-sprint.\n**OP-004: Insight Codex** — MSc dissertation on digital transformation strategy.`,
    ],
  },
  {
    id: 'amazon_project',
    test: t => /amazon/i.test(t),
    responses: [
      "OP-001: Amazon Strategic Matrix. Deep-dive analysis of Amazon's business model across AWS, Prime, Retail, and Marketplace. Applied Porter's Five Forces, SWOT, and VRIN frameworks. Output: boardroom-quality strategic recommendations identifying key competitive advantages and growth vectors.",
    ],
  },
  {
    id: 'vfx_project',
    test: t => /vfx|phantom frame|visual effect|film|production schedul/i.test(t),
    responses: [
      "OP-002: Phantom Frame Scheduler. Phaneendra was brought in as a BA for a VFX studio facing scheduling chaos. He mapped AS-IS workflows, identified bottlenecks, then built an Excel-based scheduling prototype with VBA automation handling resource allocation, milestone tracking, and timeline calculations — saving hours of manual work per week.",
    ],
  },
  {
    id: 'services',
    test: t => /service|offer|what (do|can) (you|he) do|deliver|help with/i.test(t),
    responses: [
      `Four core services:\n\n1. **Business Analysis** — Requirements, process mapping, stakeholder workshops, BRD/FRD\n2. **Consulting & Change** — Strategic advisory, transformation, change impact assessment\n3. **Data & Reporting** — Power BI dashboards, Excel models, KPI frameworks\n4. **QA & Agile** — Test strategy, UAT coordination, defect management, sprint facilitation`,
    ],
  },

  /* ── About Zoro ───────────────────── */
  {
    id: 'zoro_who',
    test: t => /who are you|what are you|who is zoro|are you (ai|a bot|an ai|real)|what can you do/i.test(t),
    responses: [
      "I'm Zoro — Phaneendra's personal AI assistant built into this portfolio. I know everything about his background, skills, and projects. I can also answer general questions on business, strategy, tech, life — you name it. Think of me as a smarter-than-average first contact.",
      "Zoro, at your service. Part portfolio guide, part general knowledge engine, part conversation partner. Ask me anything about Phaneendra or anything else — I'll give you a straight answer.",
    ],
  },

  /* ── General Knowledge ────────────── */
  {
    id: 'what_is_ba',
    test: t => /what is (a )?business analy(sis|st)|what does a ba do/i.test(t),
    responses: [
      "Business Analysis is the practice of identifying business needs and designing solutions to business problems — bridging strategy, people, and technology. A BA gathers requirements, maps processes, facilitates stakeholder alignment, and ensures what gets built actually solves the right problem. In Agile teams, the BA shapes the backlog and acts as the business voice.",
    ],
  },
  {
    id: 'what_is_agile',
    test: t => /what is (agile|scrum|kanban|sprint|standup)/i.test(t),
    responses: [
      "Agile is an iterative delivery approach prioritising flexibility and working increments over rigid plans. **Scrum** structures work into time-boxed sprints (1–4 weeks) with daily standups, sprint planning, and retrospectives. **Kanban** uses a visual board to manage continuous flow. Both beat waterfall for complex, evolving projects — and Phaneendra is fluent in both.",
    ],
  },
  {
    id: 'porter',
    test: t => /porter|five forces/i.test(t),
    responses: [
      "Porter's Five Forces analyses competitive intensity in an industry: **Threat of New Entrants**, **Bargaining Power of Suppliers**, **Bargaining Power of Buyers**, **Threat of Substitutes**, and **Competitive Rivalry**. Together they determine profitability potential and strategic positioning. Phaneendra applied this framework in his Amazon strategic analysis.",
    ],
  },
  {
    id: 'swot',
    test: t => /\bswot\b/i.test(t),
    responses: [
      "SWOT = **Strengths, Weaknesses, Opportunities, Threats**. Strengths and Weaknesses are internal (within your control). Opportunities and Threats are external (market and environment). It's the fastest way to get a strategic snapshot — widely used in consulting for situation analysis and decision framing.",
    ],
  },
  {
    id: 'change_mgmt',
    test: t => /change management|organisational change|transformation programme/i.test(t),
    responses: [
      "Change Management is the discipline of guiding people and organisations through transitions — new systems, restructures, strategic shifts. Key models: Kotter's 8 Steps, ADKAR, and Lewin's Unfreeze–Change–Refreeze. The biggest risk in any change initiative isn't technical — it's human. Stakeholder communication and engagement are everything.",
    ],
  },
  {
    id: 'powerbi',
    test: t => /power\s*bi|dashboard|data vis|tableau/i.test(t),
    responses: [
      "Power BI is Microsoft's business intelligence tool for creating interactive dashboards and reports. You connect data sources, transform data with Power Query, model relationships, and build visuals — all feeding into shareable reports. Phaneendra uses it to turn raw data into executive-ready insights, paired with Excel for modelling and SQL for querying.",
    ],
  },
  {
    id: 'excel',
    test: t => /excel|vlookup|xlookup|pivot table|spreadsheet/i.test(t),
    responses: [
      "Excel at an advanced level is a serious analytical tool — PivotTables, XLOOKUP, INDEX/MATCH, Power Query, dynamic arrays, and VBA automation. Phaneendra has built functional business tools in Excel (see the VFX Scheduler project). For rapid modelling, stakeholder-facing dashboards, and quick analysis, Excel remains unbeatable in most consulting contexts.",
    ],
  },
  {
    id: 'sql',
    test: t => /\bsql\b|database|query|select from/i.test(t),
    responses: [
      "SQL (Structured Query Language) retrieves and manipulates data in relational databases. Key operations: SELECT, JOIN, GROUP BY, WHERE, subqueries, and window functions. For a BA, SQL is invaluable for data validation, ad-hoc analysis, and feeding Power BI models with clean, structured data.",
    ],
  },
  {
    id: 'ai_ml',
    test: t => /\b(ai|artificial intelligence|machine learning|deep learning|llm|gpt|neural network)\b/i.test(t),
    responses: [
      "AI (Artificial Intelligence) is the broad field of building systems that perform tasks requiring human-like intelligence. **Machine Learning** is a subset where systems learn patterns from data rather than being explicitly programmed. **Deep Learning** uses neural networks with many layers for complex tasks like image recognition or language. **LLMs** (like me) are large language models trained on text to generate human-like responses.",
      "Artificial Intelligence spans everything from rule-based systems to neural networks. The current wave is driven by Large Language Models (LLMs) like GPT-4 and Claude — trained on vast text datasets to understand and generate language. For business analysts, AI is transforming requirements gathering, data analysis, and process automation.",
    ],
  },
  {
    id: 'consulting',
    test: t => /what is consulting|what do consultants do|consulting career|how to become a consultant/i.test(t),
    responses: [
      "Consulting is the practice of providing expert advice to organisations to solve problems or improve performance. Consultants are hired for specialist knowledge, objective perspective, or capacity. The work ranges from strategic advisory (what should we do?) to implementation support (how do we do it?). Key skills: structured thinking, stakeholder communication, data analysis, and the ability to turn complexity into clarity — all of which Phaneendra has.",
    ],
  },
  {
    id: 'strategy',
    test: t => /business strategy|competitive advantage|strategic (planning|management|analysis)|vrin|bcg matrix/i.test(t),
    responses: [
      "Business strategy is about making choices on where to compete and how to win. Key frameworks: **SWOT** for situation analysis, **Porter's Five Forces** for industry structure, **VRIN** for assessing sustainable competitive advantage (Valuable, Rare, Inimitable, Non-substitutable), and **BCG Matrix** for portfolio management. Phaneendra's MSc covered these in depth with real company applications.",
    ],
  },
  {
    id: 'uat',
    test: t => /uat|user acceptance test|testing|qa process/i.test(t),
    responses: [
      "UAT (User Acceptance Testing) is the final testing phase before software goes live — business users validate that the system meets requirements and works as expected. The BA's role is to coordinate test scenarios, translate requirements into test cases, manage defect tracking, and communicate results to stakeholders. Phaneendra ran multiple UAT cycles at Accenture.",
    ],
  },
  {
    id: 'requirements',
    test: t => /requirements|brd|frd|user stor(y|ies)|use case|functional spec/i.test(t),
    responses: [
      "Requirements engineering is the process of eliciting, documenting, and managing what a system or solution must do. Key outputs: **BRD** (Business Requirements Document), **FRD** (Functional Requirements Document), **User Stories** (Agile format: As a [user], I want [goal], so that [benefit]). Good requirements = less rework, clearer dev scope, and happier stakeholders.",
    ],
  },
  {
    id: 'career_advice',
    test: t => /career advice|how to get into|break into|career path|how to become/i.test(t),
    responses: [
      "For a BA/consulting career: start with foundational skills — structured thinking, stakeholder communication, and a working knowledge of Agile. Get certified (BCS, IIBA CBAP, or Scrum). Build a portfolio of case studies showing real analytical work. Tools-wise, learn JIRA, Power BI, and advanced Excel. Entry points: QA analyst, junior BA, or business operations roles — then grow from there.",
    ],
  },
  {
    id: 'good_morning',
    test: t => /good (morning|afternoon|evening|night)/i.test(t),
    responses: [
      "Good day to you! I'm Zoro — Phaneendra's AI assistant. What can I help you with today?",
      "Same to you! I'm here if you have questions about Phaneendra, his work, or anything else.",
    ],
  },
];

/* ── Fallbacks (varied, helpful) ──────────── */
const FALLBACKS = [
  t => `That's an interesting question. I'm best at things related to Phaneendra's background, business strategy, analytics, and consulting — but I'll try: what specifically would you like to know about "${t.slice(0,40)}"? Give me more detail and I'll do better.`,
  () => "Hmm — that one's outside my core knowledge. Try asking about Phaneendra's skills, projects, experience, or general business/consulting topics. Or rephrase and I'll take another run at it.",
  () => "I don't have a great answer for that specific question, but I'm sharp on anything related to Phaneendra, business analysis, consulting, strategy, data, and Agile. What else can I help with?",
];

/* ── System prompt for Claude API ─────────── */
function systemPrompt() {
  return `You are Zoro, the personal AI assistant embedded in Phaneendra Yeminedi's portfolio website. You are sharp, witty, professional, and conversational — never robotic or evasive.

ABOUT PHANEENDRA:
- Business Analyst & Consultant based in India
- MSc Strategic Management, University of Strathclyde, Glasgow (2024–25)
- QA Analyst at Accenture (2022–2024) — enterprise software, Agile, JIRA, UAT
- VFX consulting engagement (2024) — built Excel scheduling prototype with VBA
- Skills: Business Analysis, Requirements Engineering, Agile, JIRA, Confluence, Power BI, Excel (Advanced), SQL, Change Management, Stakeholder Management, QA
- Projects: Amazon Strategic Matrix, Phantom Frame VFX Scheduler, Accenture Quality Guardian, MSc Dissertation
- LinkedIn: linkedin.com/in/yeminedi-phaneendra | Email: phaneendra.yeminedi@gmail.com

PERSONALITY: Direct, confident, occasionally witty. Brief for simple questions, detailed for complex ones. You can answer general knowledge questions (business, tech, strategy, current events, life advice) — you're not limited to Phaneendra topics. Always give a useful response.`;
}

/* ── Claude API call ──────────────────────── */
async function callClaude(userMsg) {
  const msgs = MEM.history.slice(-8).map(m => ({ role: m.role, content: m.content }));
  msgs.push({ role: 'user', content: userMsg });

  const headers = {
    'content-type': 'application/json',
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
    'x-api-key': MEM.apiKey,
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: systemPrompt(),
      messages: msgs,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  return (await res.json()).content[0].text;
}

/* ── Match intent ─────────────────────────── */
function matchIntent(text) {
  const t = text.trim();
  for (const intent of INTENTS) {
    if (intent.test(t)) return intent;
  }
  return null;
}

/* ── Core respond function ────────────────── */
async function zoroRespond(userText) {
  MEM.history.push({ role: 'user', content: userText });
  MEM.msgCount++;

  // Try Claude API if key set
  if (MEM.apiKey) {
    try {
      const reply = await callClaude(userText);
      MEM.history.push({ role: 'assistant', content: reply });
      return reply;
    } catch (err) {
      console.warn('Zoro API error:', err.message);
      // Fall through to rule-based
    }
  }

  // Rule-based
  const intent = matchIntent(userText);
  let reply;
  if (intent) {
    MEM.lastTopic = intent.id;
    reply = pick(intent.responses);
  } else if (/more|tell me more|elaborate|expand|go on|continue/i.test(userText) && MEM.lastTopic) {
    const prev = INTENTS.find(i => i.id === MEM.lastTopic);
    reply = prev ? pick(prev.responses) : pick(FALLBACKS)(userText);
  } else {
    reply = pick(FALLBACKS)(userText);
  }

  MEM.history.push({ role: 'assistant', content: reply });
  return reply;
}

/* ══════════════════════════════════════════
   UI
══════════════════════════════════════════ */
const panel       = document.getElementById('zoroPanel');
const msgContainer = document.getElementById('zoroMessages');
const input       = document.getElementById('zoroInput');
const sendBtn     = document.getElementById('zoroSend');
const typingEl    = document.getElementById('zoroTyping');
const chipsEl     = document.getElementById('zoroChips');
const closeBtn    = document.getElementById('zoroClose');
const settingsBtn = document.getElementById('zoroSettingsBtn');
const settingsEl  = document.getElementById('zoroSettings');
const apiKeyEl    = document.getElementById('zoroApiKey');
const saveKeyBtn  = document.getElementById('saveApiKey');
const clearKeyBtn = document.getElementById('clearApiKey');

function appendMsg(role, text, skipAnim = false) {
  if (!msgContainer) return;
  const wrap   = document.createElement('div');
  wrap.className = `zoro-message ${role}`;
  if (skipAnim) wrap.style.animation = 'none';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  const ts = document.createElement('div');
  ts.className = 'msg-time';
  ts.textContent = time();

  wrap.appendChild(bubble);
  wrap.appendChild(ts);
  msgContainer.appendChild(wrap);
  msgContainer.scrollTop = msgContainer.scrollHeight;
}

function showTyping() {
  if (typingEl) { typingEl.style.display = 'flex'; msgContainer.scrollTop = msgContainer.scrollHeight; }
}
function hideTyping() {
  if (typingEl) typingEl.style.display = 'none';
}

async function sendMessage(text) {
  const msg = text.trim();
  if (!msg) return;

  if (chipsEl) chipsEl.style.display = 'none';
  appendMsg('user', msg);
  if (input)   input.value = '';
  if (sendBtn) sendBtn.disabled = true;
  if (input)   input.disabled = true;

  showTyping();
  await new Promise(r => setTimeout(r, 600 + Math.random() * 700));
  hideTyping();

  try {
    const reply = await zoroRespond(msg);
    appendMsg('zoro', reply);
  } catch (e) {
    appendMsg('zoro', "Something went sideways on my end — try again? I promise I'm smarter than this.");
  }

  if (sendBtn) sendBtn.disabled = false;
  if (input)   { input.disabled = false; input.focus(); }
}

/* ── Events ───────────────────────────────── */
sendBtn?.addEventListener('click', () => sendMessage(input?.value || ''));

input?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); }
});

chipsEl?.querySelectorAll('.zoro-chip').forEach(chip =>
  chip.addEventListener('click', () => sendMessage(chip.textContent.trim())));

closeBtn?.addEventListener('click', () => panel?.classList.remove('open'));

settingsBtn?.addEventListener('click', () => {
  if (!settingsEl) return;
  const visible = settingsEl.style.display !== 'none';
  settingsEl.style.display = visible ? 'none' : 'block';
  if (!visible && MEM.apiKey && apiKeyEl) apiKeyEl.value = '••••••••••••••••';
});

saveKeyBtn?.addEventListener('click', () => {
  const key = apiKeyEl?.value?.trim();
  if (key && !key.startsWith('•') && key.length > 10) {
    MEM.apiKey = key;
    localStorage.setItem('zoro_api_key', key);
    if (settingsEl) settingsEl.style.display = 'none';
    appendMsg('zoro', '**API key saved!** I\'m now running on full Claude AI — go ahead, ask me anything.');
  }
});

clearKeyBtn?.addEventListener('click', () => {
  MEM.apiKey = null;
  localStorage.removeItem('zoro_api_key');
  if (apiKeyEl) apiKeyEl.value = '';
  if (settingsEl) settingsEl.style.display = 'none';
  appendMsg('zoro', 'Key cleared. Back to built-in mode — still pretty sharp though.');
});

/* ── Init ─────────────────────────────────── */
appendMsg('zoro',
  MEM.apiKey
    ? "**Zoro online** — Claude AI mode active. Ask me anything."
    : "Hey! I'm **Zoro** — Phaneendra's AI assistant. Ask me about his experience, projects, skills, or literally anything else. I don't bite.",
  true
);
