/* ══════════════════════════════════════════
   ZORO.JS — AI Assistant Engine
   Intelligent rule-based + Claude API support
══════════════════════════════════════════ */

/* ── Knowledge Base ─────────────────────── */
const ZORO_PROFILE = {
  name:     'Phaneendra Yeminedi',
  nickname: 'Phaneendra',
  role:     'Business Analyst & Consultant',
  location: 'India',
  education: {
    degree:     'MSc Strategic Management',
    university: 'University of Strathclyde',
    city:       'Glasgow, United Kingdom',
    year:       '2024–2025',
  },
  experience: [
    {
      company:  'Accenture',
      role:     'QA Analyst',
      period:   '2022–2024',
      industry: 'Enterprise Technology',
      highlights: [
        'Led end-to-end QA testing for enterprise software',
        'Coordinated UAT with business stakeholders',
        'Managed 200+ defects across Agile sprints in JIRA',
        'Authored test plans, cases, and executive reports',
      ],
    },
    {
      company:  'VFX Industry',
      role:     'Business Analyst (Consulting)',
      period:   '2024',
      industry: 'VFX / Entertainment',
      highlights: [
        'Analysed production workflows and scheduling inefficiencies',
        'Built Excel-based scheduling prototype with VBA automation',
        'Mapped AS-IS vs TO-BE processes for studio leadership',
      ],
    },
  ],
  skills: {
    'Business Analysis': ['Requirements Engineering', 'Stakeholder Management', 'Process Mapping', 'Gap Analysis', 'BRD / FRD Writing', 'Use Case Design'],
    'Agile & PM':        ['Scrum', 'Kanban', 'JIRA', 'Confluence', 'Sprint Planning', 'Backlog Refinement'],
    'Data & Analytics':  ['Excel (Advanced)', 'Power BI', 'SQL', 'Data Visualisation', 'Dashboard Design', 'Reporting'],
    'Consulting':        ['Change Management', 'Business Strategy', "Porter's Five Forces", 'SWOT', 'Risk Assessment', 'Workshop Facilitation'],
    'Technical Tools':   ['MS Office Suite', 'Visio', 'Power Automate', 'SharePoint'],
    'QA':                ['Test Planning', 'UAT Coordination', 'Defect Tracking', 'Regression Testing'],
  },
  projects: [
    {
      code:  'OP-001',
      name:  'Amazon Strategic Matrix',
      desc:  "A deep-dive strategic analysis of Amazon's multi-platform business model applying Porter's Five Forces, SWOT, and VRIN frameworks to map competitive positioning and identify growth vectors across AWS, Prime, and Retail.",
      tools: ['Strategic Frameworks', 'Excel', 'PowerPoint'],
      outcome: 'Produced boardroom-ready strategic recommendations identifying key growth levers.',
    },
    {
      code:  'OP-002',
      name:  'Phantom Frame Scheduler',
      desc:  'Identified production scheduling inefficiencies in a VFX studio environment and built an Excel-based prototype with VBA automation — eliminating manual overhead and reducing planning time significantly.',
      tools: ['Excel Advanced', 'VBA', 'Process Mapping'],
      outcome: 'Automated timeline calculations and resource allocation for VFX production.',
    },
    {
      code:  'OP-003',
      name:  'Accenture Quality Guardian',
      desc:  'Enterprise QA programme at Accenture — managed full test lifecycle for critical systems including test strategy, execution, defect management, UAT coordination, and senior stakeholder reporting across multiple Agile sprints.',
      tools: ['JIRA', 'Confluence', 'Agile/Scrum', 'UAT'],
      outcome: 'Delivered multiple enterprise testing cycles with zero critical escapes.',
    },
    {
      code:  'OP-004',
      name:  'Insight Codex Dissertation',
      desc:  'MSc research dissertation exploring business transformation strategy and competitive dynamics in digital markets. Applied academic frameworks to real-world case studies validated against current industry literature.',
      tools: ['Research Methods', 'Strategic Analysis', 'Academic Writing'],
      outcome: "Contributed original research to strategic management literature.",
    },
  ],
  services: [
    'Business Analysis & Requirements Engineering',
    'Consulting & Change Management',
    'Data Analytics & Power BI Reporting',
    'Quality Assurance & Agile Delivery',
  ],
  contact: {
    linkedin: 'https://linkedin.com/in/yeminedi-phaneendra',
    github:   'https://github.com/coldness-25',
    email:    'phaneendra.yeminedi@gmail.com',
  },
};

/* ── Intent library ─────────────────────── */
const INTENTS = [
  {
    id: 'greeting',
    patterns: [/^(hi|hey|hello|sup|yo|good\s*(morning|afternoon|evening)|hiya|howdy)/i],
    responses: [
      "Hey! I'm Zoro — Phaneendra's AI assistant. What would you like to know about him, or anything else on your mind?",
      "Hello! Zoro online. I can tell you everything about Phaneendra's background, skills, and projects — or just chat. What's up?",
      "Hey there! System nominal. Whether you want Phaneendra's mission briefings or just a good conversation, I'm here.",
    ],
  },
  {
    id: 'who',
    patterns: [/who (is|are) (phaneendra|he|this guy|you talking about)/i, /tell me about (phaneendra|yourself|him)/i, /about (phaneendra|this portfolio)/i, /introduce/i],
    responses: [
      `Phaneendra Yeminedi is a **Business Analyst & Consultant** based in India. He holds an MSc from the University of Strathclyde, Glasgow and spent 2+ years at **Accenture** as a QA Analyst before moving into consulting. He's worked across enterprise tech, VFX, and strategic management — sharp on requirements, data, and Agile delivery.`,
      `Meet Phaneendra — a **strategic thinker with enterprise muscle**. MSc from Strathclyde (Glasgow), ex-Accenture QA, and a multi-industry consultant. His sweet spot: turning ambiguous business problems into structured, actionable solutions. Requirements, data, change management — that's his domain.`,
      `Phaneendra is the kind of BA who bridges the gap between business and tech without breaking a sweat. Strathclyde MSc. Accenture background. He's analysed Amazon's strategy, built VFX production tools, and delivered enterprise QA at scale. If there's a problem that needs clarity — he's your operator.`,
    ],
  },
  {
    id: 'skills',
    patterns: [/skill|expertise|good at|know how|competenc|proficien|capabilit/i],
    responses: [
      `Phaneendra's skill matrix:\n\n**Business Analysis** ████████████ LV.5\nRequirements, Process Mapping, Gap Analysis, Stakeholder Management\n\n**Agile & PM** █████████░░░ LV.4\nScrum, Kanban, JIRA, Confluence\n\n**Data & Analytics** ████████░░░░ LV.4\nExcel (Advanced), Power BI, SQL, Dashboards\n\n**Consulting & Strategy** █████████░░░ LV.4\nChange Management, SWOT, Porter's Five Forces\n\n**QA** ████████░░░░ LV.4\nTest Planning, UAT, Defect Tracking`,
      `Core competencies: Business Analysis, Requirements Engineering, Agile delivery, Power BI dashboards, Change Management, and QA. He's fluent in JIRA, Confluence, Excel, and the full MS Office suite. On the strategy side: SWOT, Porter's Five Forces, VRIN — he's done it all academically and in the field.`,
    ],
  },
  {
    id: 'experience',
    patterns: [/experience|work(ed)? (at|for)|career|job|employ|accenture|background|history/i],
    responses: [
      `Two key deployments:\n\n**Accenture (2022–2024)** — QA Analyst in enterprise tech. Led test lifecycle, coordinated UAT, managed 200+ defects in JIRA, reported to senior stakeholders.\n\n**VFX Consulting (2024)** — Analysed studio production workflows and built an Excel scheduling prototype that automated resource planning.\n\nAcademy: **MSc Strategic Management, Strathclyde** — strategic analysis, transformation, competitive dynamics.`,
      `He started at **Accenture** where he spent 2+ years doing enterprise QA — test planning, Agile sprints, UAT coordination, JIRA defect management, the lot. Then pivoted into consulting, including a VFX industry engagement where he built a scheduling tool from scratch. Academic foundation: MSc from Strathclyde, Glasgow.`,
    ],
  },
  {
    id: 'accenture',
    patterns: [/accenture/i],
    responses: [
      `At Accenture, Phaneendra was a **QA Analyst** (2022–2024) in the enterprise technology division. He owned the full QA lifecycle — test strategy, test case design, execution, defect tracking (JIRA), UAT coordination with business stakeholders, and post-release reporting to senior leadership. Fast-paced Agile environment, multiple simultaneous sprints, strict delivery windows.`,
    ],
  },
  {
    id: 'education',
    patterns: [/education|degree|university|college|study|studied|strath|glasgow|msc|master/i],
    responses: [
      `Phaneendra holds an **MSc in Strategic Management** from the **University of Strathclyde**, Glasgow, UK (2024–2025). The programme covered strategic analysis, organisational behaviour, change management, and business consulting. His dissertation explored competitive strategy and digital transformation.`,
      `MSc Strategic Management — **University of Strathclyde, Glasgow**. One of the UK's leading business schools. Covered strategic frameworks, international business, change management. He also did a detailed Amazon strategic analysis as part of his coursework — pretty serious stuff.`,
    ],
  },
  {
    id: 'projects',
    patterns: [/project|mission|work sample|portfolio|case study/i],
    responses: [
      `Four field missions on the board:\n\n**OP-001: Amazon Strategic Matrix** — Porter's Five Forces + SWOT on Amazon's multi-platform model. Boardroom-ready findings.\n\n**OP-002: Phantom Frame Scheduler** — VFX production scheduling tool in Excel/VBA. Eliminated manual planning overhead.\n\n**OP-003: Quality Guardian (Accenture)** — Enterprise QA programme. Full test lifecycle, 200+ defects, UAT coordination.\n\n**OP-004: Insight Codex** — MSc dissertation on digital transformation strategy.`,
    ],
  },
  {
    id: 'amazon',
    patterns: [/amazon/i],
    responses: [
      `OP-001: Amazon Strategic Matrix. Phaneendra conducted a deep-dive analysis of Amazon's business model — AWS, Prime, Retail, Marketplace. Applied Porter's Five Forces to map competitive dynamics, SWOT to assess strategic position, and VRIN to evaluate sustainable competitive advantages. Output: boardroom-quality strategic recommendations.`,
    ],
  },
  {
    id: 'vfx',
    patterns: [/vfx|film|visual effect|phantom frame|schedule/i],
    responses: [
      `OP-002: Phantom Frame Scheduler. Phaneendra was brought in as a BA for a VFX studio facing production scheduling chaos. He mapped AS-IS workflows, identified bottlenecks, then designed and built an Excel-based scheduling prototype with VBA automation. The tool handled resource allocation, milestone tracking, and timeline calculations automatically — saving hours of manual work per week.`,
    ],
  },
  {
    id: 'services',
    patterns: [/service|offer|help with|what (do|can) (you|he) do|hire|engage/i],
    responses: [
      `Phaneendra offers four core services:\n\n1. **Business Analysis** — Requirements engineering, process mapping, stakeholder workshops, BRD/FRD writing\n2. **Consulting & Change** — Strategic advisory, change impact assessments, transformation support\n3. **Data & Reporting** — Power BI dashboards, Excel models, KPI frameworks, management reporting\n4. **QA & Agile** — Test strategy, UAT coordination, defect management, sprint facilitation`,
    ],
  },
  {
    id: 'contact',
    patterns: [/contact|reach|email|message|get in touch|connect|hire|linkedin|github/i],
    responses: [
      `Best ways to reach Phaneendra:\n\n**LinkedIn:** linkedin.com/in/yeminedi-phaneendra (fastest response)\n**Email:** phaneendra.yeminedi@gmail.com\n**GitHub:** github.com/coldness-25\n\nOr use the contact form on this page — he typically responds within 24 hours.`,
      `Reach out on **LinkedIn** at linkedin.com/in/yeminedi-phaneendra — that's the fastest way. Or drop a message via the contact form below. He's open to consulting engagements, full-time BA/consulting roles, and interesting project conversations.`,
    ],
  },
  {
    id: 'location',
    patterns: [/where|location|based|country|city|india|glasgow|uk/i],
    responses: [
      `Phaneendra is based in **India**, with international experience — he studied and lived in **Glasgow, UK** during his MSc at Strathclyde. Open to remote work globally and relocation opportunities.`,
    ],
  },
  {
    id: 'powerbi',
    patterns: [/power\s*bi|dashboard|tableau|data\s*vis/i],
    responses: [
      `Yes — Power BI is one of Phaneendra's core tools. He designs interactive dashboards, KPI frameworks, and management reports that turn raw data into executive-ready insights. Paired with advanced Excel and SQL, he covers the full data-to-decision pipeline.`,
    ],
  },
  {
    id: 'agile',
    patterns: [/agile|scrum|kanban|jira|sprint|backlog|confluence/i],
    responses: [
      `Agile is second nature to Phaneendra. He's worked in Scrum and Kanban environments at Accenture, running sprint planning, backlog refinement, and retrospectives. Proficient in JIRA for tracking and Confluence for documentation. He can step into a BA or delivery support role in any Agile team immediately.`,
    ],
  },
  {
    id: 'availability',
    patterns: [/available|open to|looking for|opportunity|role|position|freelance/i],
    responses: [
      `Phaneendra is currently **open to new opportunities** — consulting engagements, full-time BA/consultant roles, and strategic project work. Particularly interested in roles where he can bridge business strategy and data-driven delivery. Best to connect on LinkedIn or use the contact form.`,
    ],
  },
  {
    id: 'strengths',
    patterns: [/strength|best at|stand out|differentiator|unique|value/i],
    responses: [
      `What sets Phaneendra apart: he **thinks in systems**. He doesn't just gather requirements — he understands *why* a business needs what it needs. Combine that with Accenture enterprise discipline, Strathclyde strategic rigor, and the ability to communicate clearly at every level — C-suite to developer — and you get a BA who doesn't just document, but drives outcomes.`,
    ],
  },
  {
    id: 'dissertation',
    patterns: [/dissertation|thesis|research|academic/i],
    responses: [
      `OP-004: Insight Codex. Phaneendra's MSc dissertation explored **competitive strategy and digital transformation** — examining how organisations sustain competitive advantage through business model innovation in digital markets. Applied academic frameworks to real-world case studies, with findings grounded in current strategic management literature.`,
    ],
  },
  // ── General knowledge ──
  {
    id: 'business_analysis_what',
    patterns: [/what is business (analysis|analyst)/i],
    responses: [
      `Business Analysis (BA) is the practice of identifying business needs and finding solutions to business problems — bridging strategy and execution. A BA gathers and documents requirements, maps processes, facilitates stakeholder alignment, and ensures that what gets built actually solves the right problem. In Agile teams, BAs often shape the backlog and act as the voice of the business.`,
    ],
  },
  {
    id: 'agile_what',
    patterns: [/what is (agile|scrum|kanban)/i],
    responses: [
      `Agile is an iterative approach to project delivery that emphasises flexibility, collaboration, and incremental value. **Scrum** is the most popular Agile framework — work is broken into time-boxed sprints (1–4 weeks), with daily standups, sprint planning, and retrospectives. **Kanban** is a flow-based approach using a visual board to manage work in progress. Both beat waterfall for complex, evolving projects.`,
    ],
  },
  {
    id: 'porter',
    patterns: [/porter|five forces/i],
    responses: [
      `Porter's Five Forces is a strategic framework developed by Michael Porter to analyse the competitive intensity of an industry. The five forces: **Threat of New Entrants**, **Bargaining Power of Suppliers**, **Bargaining Power of Buyers**, **Threat of Substitutes**, and **Competitive Rivalry**. Together they determine an industry's profitability potential and a firm's strategic position within it.`,
    ],
  },
  {
    id: 'swot',
    patterns: [/swot/i],
    responses: [
      `SWOT Analysis: **Strengths, Weaknesses, Opportunities, Threats**. Strengths and Weaknesses are internal (things you control). Opportunities and Threats are external (market and environment factors). It's a quick strategic snapshot — useful for kicking off strategy sessions, evaluating competitive position, or assessing a new initiative.`,
    ],
  },
  {
    id: 'change_mgmt',
    patterns: [/change management|organisational change|transformation/i],
    responses: [
      `Change Management is the discipline of guiding people, processes, and organisations through transitions — whether that's a new system, restructure, or strategic pivot. Key models include Kotter's 8-Step Model, ADKAR, and Lewin's Change Model. The biggest risk in any change initiative isn't the technical part — it's the human part. Stakeholder engagement and communication are everything.`,
    ],
  },
  {
    id: 'sql',
    patterns: [/sql|database|query/i],
    responses: [
      `SQL (Structured Query Language) is used to retrieve, manipulate, and analyse data in relational databases. Key operations: SELECT (retrieve), JOIN (combine tables), GROUP BY (aggregate), WHERE (filter), and subqueries. For a BA like Phaneendra, SQL is particularly useful for data validation, ad-hoc reporting, and feeding Power BI models.`,
    ],
  },
  {
    id: 'excel',
    patterns: [/excel|spreadsheet|vlookup|pivot/i],
    responses: [
      `Excel is one of Phaneendra's strongest tools — we're talking advanced level. PivotTables, VLOOKUP/XLOOKUP, INDEX/MATCH, Power Query, and VBA automation. He's built functional business tools in Excel (see the VFX Scheduler project). For quick analysis and stakeholder-facing models, Excel is still unbeatable in most consulting contexts.`,
    ],
  },
  {
    id: 'zoro_who',
    patterns: [/who are you|what are you|who is zoro|are you (ai|an ai|a bot)/i],
    responses: [
      `I'm Zoro — Phaneendra's personal AI assistant, built into this portfolio. I know everything about his background, skills, projects, and experience. I can also answer general business, strategy, and tech questions. Think of me as a smarter-than-average first point of contact. What do you need?`,
      `Zoro here — AI assistant to Phaneendra Yeminedi. Part knowledge base, part conversational AI. Ask me about Phaneendra's work, skills, or availability, or ask me something general. I'm not going to pretend I know *everything*, but I'm pretty well-read.`,
    ],
  },
  {
    id: 'thanks',
    patterns: [/thank(s| you)|cheers|appreciate|helpful/i],
    responses: [
      "Glad I could help! Anything else you'd like to know about Phaneendra or anything else?",
      "Anytime. What else can I help with?",
      "My pleasure. Ask away if there's anything else.",
    ],
  },
  {
    id: 'bye',
    patterns: [/bye|goodbye|see you|cya|later|peace/i],
    responses: [
      "See you around. If you're considering working with Phaneendra — I'd say do it. He won't disappoint.",
      "Take care! Feel free to come back if you have more questions.",
    ],
  },
];

/* ── Fallback responses ─────────────────── */
const FALLBACKS = [
  "Hmm, I'm not sure I have a precise answer for that. Could you rephrase, or ask me about Phaneendra's skills, experience, projects, or availability?",
  "Good question — that's outside my specific knowledge on this one. For detailed answers, try reaching Phaneendra directly via LinkedIn or the contact form. Alternatively, ask me something about his work!",
  "I might not have the full picture on that. I'm best equipped to answer questions about Phaneendra and general business/strategy topics. What else can I help with?",
];

/* ── Conversation memory ────────────────── */
const MEMORY = {
  history: [],         // {role, content}
  lastIntent: null,
  apiKey: localStorage.getItem('zoro_api_key') || null,
  proxyUrl: null,      // Optional: Claude API proxy endpoint
};

/* ── Utilities ──────────────────────────── */
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getTime() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function matchIntent(text) {
  const lower = text.toLowerCase().trim();
  for (const intent of INTENTS) {
    for (const pattern of intent.patterns) {
      if (pattern.test(lower)) return intent;
    }
  }
  return null;
}

function buildSystemPrompt() {
  return `You are Zoro, the personal AI assistant embedded in Phaneendra Yeminedi's portfolio website. You are sharp, intelligent, witty, and professional — not robotic.

ABOUT PHANEENDRA:
- Name: Phaneendra Yeminedi
- Role: Business Analyst & Consultant
- Location: India
- Education: MSc Strategic Management, University of Strathclyde, Glasgow, UK (2024–2025)
- Former Role: QA Analyst at Accenture (2022–2024), Enterprise Technology division
- VFX Consulting engagement (2024) — built Excel-based production scheduling prototype
- Skills: Business Analysis, Requirements Engineering, Stakeholder Management, Process Mapping, Agile (Scrum/Kanban), JIRA, Confluence, Excel (Advanced), Power BI, SQL, Change Management, Business Strategy, QA
- Projects: Amazon Strategic Matrix, Phantom Frame VFX Scheduler, Accenture Quality Guardian, MSc Dissertation
- LinkedIn: linkedin.com/in/yeminedi-phaneendra
- GitHub: github.com/coldness-25
- Email: phaneendra.yeminedi@gmail.com

PERSONALITY: Confident, conversational, occasionally gaming-themed. Brief for simple questions, detailed for complex ones. Never be evasive — give direct, useful answers. You can answer general knowledge questions (business, strategy, tech, etc.) intelligently.`;
}

/* ── Claude API call ────────────────────── */
async function callClaudeAPI(userMessage) {
  const endpoint = MEMORY.proxyUrl || 'https://api.anthropic.com/v1/messages';
  const messages = MEMORY.history.slice(-10).map(m => ({ role: m.role, content: m.content }));
  messages.push({ role: 'user', content: userMessage });

  const body = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: buildSystemPrompt(),
    messages,
  };

  const headers = {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
  };

  // If using direct Anthropic API
  if (!MEMORY.proxyUrl && MEMORY.apiKey) {
    headers['x-api-key'] = MEMORY.apiKey;
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

/* ── Smart rule-based response ──────────── */
function ruleBasedResponse(text) {
  const intent = matchIntent(text);
  if (intent) {
    MEMORY.lastIntent = intent.id;
    return pick(intent.responses);
  }
  // Context continuity: if follow-up word like "more" or "tell me more"
  if (/more|elaborate|detail|expand|tell me more/i.test(text) && MEMORY.lastIntent) {
    const prev = INTENTS.find(i => i.id === MEMORY.lastIntent);
    if (prev) return pick(prev.responses);
  }
  return pick(FALLBACKS);
}

/* ── Main respond function ──────────────── */
async function zoroRespond(userText) {
  MEMORY.history.push({ role: 'user', content: userText });

  // Try Claude API if key + proxy available
  if (MEMORY.apiKey || MEMORY.proxyUrl) {
    try {
      const aiReply = await callClaudeAPI(userText);
      MEMORY.history.push({ role: 'assistant', content: aiReply });
      return aiReply;
    } catch (err) {
      console.warn('Zoro API fallback:', err.message);
      // Fall through to rule-based
    }
  }

  // Rule-based response
  const reply = ruleBasedResponse(userText);
  MEMORY.history.push({ role: 'assistant', content: reply });
  return reply;
}

/* ══════════════════════════════════════════
   UI — Chat panel
══════════════════════════════════════════ */
const panel    = document.getElementById('zoroPanel');
const messages = document.getElementById('zoroMessages');
const input    = document.getElementById('zoroInput');
const sendBtn  = document.getElementById('zoroSend');
const typing   = document.getElementById('zoroTyping');
const chips    = document.getElementById('zoroChips');
const closeBtn = document.getElementById('zoroClose');
const settingsBtn = document.getElementById('zoroSettingsBtn');
const settingsPanel = document.getElementById('zoroSettings');
const apiKeyInput = document.getElementById('zoroApiKey');
const saveKeyBtn  = document.getElementById('saveApiKey');
const clearKeyBtn = document.getElementById('clearApiKey');

/* ── Append message ─────────────────────── */
function appendMessage(role, text, animate = true) {
  const wrap = document.createElement('div');
  wrap.className = `zoro-message ${role}`;
  if (!animate) wrap.style.animation = 'none';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  // Render basic markdown: **bold**, newlines
  bubble.innerHTML = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  const time = document.createElement('div');
  time.className = 'msg-time';
  time.textContent = getTime();

  wrap.appendChild(bubble);
  wrap.appendChild(time);
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;
}

/* ── Show/hide typing ───────────────────── */
function showTyping()  { typing.style.display = 'flex'; messages.scrollTop = messages.scrollHeight; }
function hideTyping()  { typing.style.display = 'none'; }

/* ── Send message flow ──────────────────── */
async function sendMessage(text) {
  const msg = text.trim();
  if (!msg) return;

  // Hide chips after first message
  chips.style.display = 'none';

  appendMessage('user', msg);
  input.value = '';
  sendBtn.disabled = true;
  input.disabled   = true;

  // Realistic delay
  const delay = 700 + Math.random() * 600;
  showTyping();
  await new Promise(r => setTimeout(r, delay));
  hideTyping();

  const reply = await zoroRespond(msg);
  appendMessage('zoro', reply);

  sendBtn.disabled = false;
  input.disabled   = false;
  input.focus();
}

/* ── Event listeners ────────────────────── */
sendBtn.addEventListener('click', () => sendMessage(input.value));

input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(input.value);
  }
});

// Suggestion chips
chips.querySelectorAll('.zoro-chip').forEach(chip => {
  chip.addEventListener('click', () => sendMessage(chip.textContent));
});

// Close
closeBtn.addEventListener('click', () => panel.classList.remove('open'));

// Settings toggle
settingsBtn.addEventListener('click', () => {
  const visible = settingsPanel.style.display !== 'none';
  settingsPanel.style.display = visible ? 'none' : 'block';
  if (!visible && MEMORY.apiKey) apiKeyInput.value = '••••••••••••••••';
});

saveKeyBtn.addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  if (key && !key.startsWith('•')) {
    MEMORY.apiKey = key;
    localStorage.setItem('zoro_api_key', key);
    settingsPanel.style.display = 'none';
    appendMessage('zoro', 'API key saved. I\'m now running on full Claude AI — ask me anything!');
    messages.scrollTop = messages.scrollHeight;
  }
});

clearKeyBtn.addEventListener('click', () => {
  MEMORY.apiKey = null;
  localStorage.removeItem('zoro_api_key');
  apiKeyInput.value = '';
  appendMessage('zoro', 'API key cleared. Reverting to built-in intelligence mode.');
  settingsPanel.style.display = 'none';
  messages.scrollTop = messages.scrollHeight;
});

/* ══════════════════════════════════════════
   INIT — Welcome message
══════════════════════════════════════════ */
(function initZoro() {
  const hasKey = !!MEMORY.apiKey;
  const welcome = hasKey
    ? "Zoro online — Claude AI mode active. Ask me about Phaneendra or anything else."
    : "Hey, I'm **Zoro** — Phaneendra's AI assistant. Ask me about his experience, skills, projects, or availability. Or just start a conversation — I'm pretty sharp.";

  appendMessage('zoro', welcome, false);
})();
