// ===== Home page =====
import { safetyTips, liveAlerts, achievements } from './dat.js';
import { store, computeStats, animateCount, initReveal } from './utils.js';

export function renderHome(page, ctx) {
  const state = store.get();
  const stats = computeStats(state);
  const profile = state.profile || {};

  page.innerHTML = `
    <section class="hero">
      <div class="hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Your daily safety companion</span>
          <h1>Protect every step of your <span class="grad">school journey</span></h1>
          <div class="typing-line" id="typingLine"></div>
          <p>Student Safety AI guides you from home to school and back — with smart routes, a friendly AI buddy, self-defence lessons, and instant emergency help, all in one safe place.</p>
          <div class="hero-cta">
            <a href="#/dashboard" data-link class="btn btn-lg btn-glow">Open my Dashboard</a>
            <a href="#/journey" data-link class="btn btn-lg btn-green">Start Safe Journey</a>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><div class="big-num counter-shimmer" data-count="${stats.journeysCompleted}">0</div><div class="label">Safe journeys</div></div>
            <div class="hero-stat"><div class="big-num counter-shimmer" data-count="${stats.score}">0</div><div class="label">Safety score</div></div>
            <div class="hero-stat"><div class="big-num counter-shimmer" data-count="${state.unlockedAchievements.length}">0</div><div class="label">Badges earned</div></div>
          </div>
        </div>
        <div class="hero-scene">
          ${campusScene()}
        </div>
      </div>
    </section>

    <div class="container">
      <div class="alert-ticker reveal mt-6">
        <div class="marquee">
          ${[...liveAlerts, ...liveAlerts].map(a => `<span><span class="alert-dot"></span>${a.text}</span>`).join('')}
        </div>
      </div>
    </div>

    <section class="section container">
      <div class="section-title reveal">
        <span class="eyebrow">Everything in one place</span>
        <h2>One platform, total student safety</h2>
        <p>From the moment you leave home to the moment you return, we've got your back — with smart tools, friendly guidance, and instant help.</p>
      </div>
      <div class="grid grid-3">
        ${featureCards().map((c, i) => `
          <div class="glass feature-card reveal delay-${(i % 4) + 1}">
            <div class="feature-icon ${c.fi}">${c.svg}</div>
            <h3>${c.title}</h3>
            <p>${c.desc}</p>
            <a href="${c.href}" data-link class="feature-link">Explore <span>→</span></a>
          </div>`).join('')}
      </div>
    </section>

    <section class="section container">
      <div class="grid grid-2">
        <div class="glass tip-card reveal">
          <div class="flex items-center gap-3 mb-3"><span class="tip-icon">💡</span><h3>Today's Safety Tip</h3></div>
          <p style="font-size:18px;font-weight:600;color:var(--text)">${safetyTips[new Date().getDate() % safetyTips.length].title}</p>
          <p class="mt-2">${safetyTips[new Date().getDate() % safetyTips.length].text}</p>
          <a href="#/learning" data-link class="btn btn-sm btn-ghost mt-4">More safety lessons →</a>
        </div>
        <div class="glass reveal delay-1">
          <div class="flex items-center gap-3 mb-3"><span style="font-size:26px">🎯</span><h3>Today's Mission</h3></div>
          <p style="font-size:18px;font-weight:600;color:var(--text)">${(state._todayMissions || []).slice(0,1)[0]?.text || 'Walk with a buddy on part of your journey today'}</p>
          <p class="mt-2 muted">Complete missions to raise your safety score and unlock achievements.</p>
          <a href="#/dashboard" data-link class="btn btn-sm btn-green mt-4">Go to Dashboard →</a>
        </div>
      </div>
    </section>

    <section class="section container">
      <div class="section-title reveal">
        <span class="eyebrow">Celebrate progress</span>
        <h2>Earn safety achievements</h2>
        <p>Every safe choice you make earns a glowing badge. Collect them all and become a Safety Sentinel.</p>
      </div>
      <div class="grid grid-3">
        ${achievements.slice(0, 6).map((a, i) => {
          const unlocked = state.unlockedAchievements.includes(a.id);
          const maxVal = a.id === 'safety-sentinel' ? 7 : a.id === 'calm-breeze' ? 2 : a.id === 'road-master' ? 100 : 1;
          const pct = unlocked ? 100 : Math.min(Math.round((a.progress(stats) / maxVal) * 100), 100);
          return `
          <div class="glass achievement-card ${unlocked ? 'unlocked' : 'locked'} reveal delay-${(i % 4) + 1}">
            <div class="ach-badge ${unlocked ? 'badge-glow' : ''}">${a.icon}</div>
            <div class="ach-title">${a.title}</div>
            <div class="ach-desc">${a.desc}</div>
            <div class="ach-progress"><div class="progress"><span style="width:${pct}%"></span></div></div>
            ${unlocked ? '<div class="pill pill-yellow mt-3" style="font-size:11px">UNLOCKED</div>' : '<div class="pill pill-blue mt-3" style="font-size:11px">LOCKED</div>'}
          </div>`;
        }).join('')}
      </div>
      <div class="text-center mt-6 reveal">
        <a href="#/achievements" data-link class="btn btn-ghost">View all achievements →</a>
      </div>
    </section>

    <section class="section container">
      <div class="glass reveal" style="background:linear-gradient(135deg,rgba(31,139,255,0.92),rgba(22,184,95,0.88));color:#fff;border:0;text-align:center;padding:48px 24px">
        <h2 style="color:#fff;font-size:clamp(26px,4vw,38px)">Your safety is our mission</h2>
        <p style="color:rgba(255,255,255,0.9);max-width:620px;margin:12px auto 24px">Stay alert, stay calm, and stay connected. Student Safety AI is here for you every day, every journey, every feeling.</p>
        <a href="#/safebuddy" data-link class="btn btn-yellow btn-lg">Talk to SafeBuddy AI</a>
      </div>
    </section>
  `;

  // animate counters + typing
  page.querySelectorAll('[data-count]').forEach(el => animateCount(el, parseInt(el.dataset.count, 10)));
  typingAnimation(page.querySelector('#typingLine'), [
    'Safe journeys, every day.',
    'A friend who always listens.',
    'Confidence on every road.',
    'Help is one tap away.',
  ]);
  initReveal();
}

function typingAnimation(el, phrases) {
  if (!el) return;
  let pi = 0, ci = 0, deleting = false;
  el.classList.add('typing');
  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 45 : 75);
  }
  tick();
}

function campusScene() {
  // floating safety icons (inline SVG)
  return `
    <div class="campus">
      <div class="sun"></div>
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
      <div class="bird bird-1"></div>
      <div class="bird bird-2"></div>
      <div class="bird bird-3"></div>
      <div class="particles">${Array.from({ length: 18 }).map(() => `<span class="particle" style="left:${Math.random() * 100}%;animation-delay:${-Math.random() * 12}s;animation-duration:${8 + Math.random() * 6}s"></span>`).join('')}</div>
      <div class="tree sway tree-1"><div class="tree-crown"></div><div class="tree-trunk"></div></div>
      <div class="tree sway tree-2"><div class="tree-crown"></div><div class="tree-trunk"></div></div>
      <div class="tree sway tree-3"><div class="tree-crown"></div><div class="tree-trunk"></div></div>
      <div class="tree sway tree-4"><div class="tree-crown"></div><div class="tree-trunk"></div></div>
      <div class="school"><div class="school-window school-window-1"></div><div class="school-window school-window-2"></div><div class="school-door"></div></div>
      <div class="ground"></div>
      <div class="road"></div>
      <div class="bus"><div class="bus-body"></div><div class="bus-wheel bus-wheel-1"></div><div class="bus-wheel bus-wheel-2"></div></div>
      <div class="child child-1"><div class="child-head"></div><div class="child-body"></div><div class="child-legs"><div class="child-leg"></div><div class="child-leg"></div></div></div>
      <div class="child child-2"><div class="child-head"></div><div class="child-body"></div><div class="child-legs"><div class="child-leg"></div><div class="child-leg"></div></div></div>
      <div class="child child-3"><div class="child-head"></div><div class="child-body"></div><div class="child-legs"><div class="child-leg"></div><div class="child-leg"></div></div></div>
      <div class="float-icon float-1">${shieldIcon}</div>
      <div class="float-icon float-2">${heartIcon}</div>
      <div class="float-icon float-3">${sosIcon}</div>
      <div class="float-icon float-4">${starIcon}</div>
      <div class="wave"></div>
      <div class="wave wave-2"></div>
    </div>`;
}

const shieldIcon = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const heartIcon = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const sosIcon = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M9 9a3 3 0 016 0v6a3 3 0 01-6 0V9z" stroke="currentColor" stroke-width="2"/></svg>';
const starIcon = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l2.5 6h6.5l-5 4 2 6.5L12 16l-6 3.5 2-6.5-5-4h6.5L12 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

function featureCards() {
  return [
    { title: 'Student Dashboard', desc: 'Your safety score, mood, mission, and progress — all in one friendly view.', fi: 'fi-blue', href: '#/dashboard', svg: chartIcon },
    { title: 'Safe Journey', desc: 'Start Guardian Mode with a live timer, route progress, and smart reminders.', fi: 'fi-green', href: '#/journey', svg: walkIcon },
    { title: 'School Map', desc: 'See the safest route with crossings, speed zones, hospitals, and safe spots.', fi: 'fi-yellow', href: '#/map', svg: mapIcon },
    { title: 'Bus Tracking', desc: 'Track your assigned bus, stops, ETA, driver, and live occupancy.', fi: 'fi-blue', href: '#/bus', svg: busIcon },
    { title: 'SafeBuddy AI', desc: 'A kind chatbot to share fear, stress, or loneliness — anytime, no judgment.', fi: 'fi-green', href: '#/safebuddy', svg: chatIcon },
    { title: 'Self Defence Academy', desc: 'Learn escape-focused techniques with step-by-step animations and quizzes.', fi: 'fi-coral', href: '#/selfdefence', svg: punchIcon },
    { title: 'Safety Learning', desc: 'Road signs, traffic rules, stranger awareness, quizzes, and mini-games.', fi: 'fi-yellow', href: '#/learning', svg: bookIcon },
    { title: 'Community Reports', desc: 'Report hazards like broken roads and dark lanes — help keep everyone safe.', fi: 'fi-blue', href: '#/community', svg: usersIcon },
    { title: 'Emergency SOS', desc: 'One-tap SOS with your location, trusted contacts, and a safety ID QR.', fi: 'fi-coral', href: '#/emergency', svg: sosIcon },
  ];
}

const chartIcon = '<svg viewBox="0 0 24 24" fill="none" style="width:28px;height:28px"><path d="M4 19V5M4 19h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="7" y="11" width="3" height="6" stroke="currentColor" stroke-width="2"/><rect x="12" y="7" width="3" height="10" stroke="currentColor" stroke-width="2"/><rect x="17" y="13" width="3" height="4" stroke="currentColor" stroke-width="2"/></svg>';
const walkIcon = '<svg viewBox="0 0 24 24" fill="none" style="width:28px;height:28px"><circle cx="13" cy="4" r="2" stroke="currentColor" stroke-width="2"/><path d="M9 21l3-7-3-3 1-5 4 2 1 4" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const mapIcon = '<svg viewBox="0 0 24 24" fill="none" style="width:28px;height:28px"><path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V4l5 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="2"/></svg>';
const busIcon = '<svg viewBox="0 0 24 24" fill="none" style="width:28px;height:28px"><rect x="4" y="4" width="16" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M4 11h16" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="19" r="1.5" fill="currentColor"/><circle cx="16" cy="19" r="1.5" fill="currentColor"/></svg>';
const chatIcon = '<svg viewBox="0 0 24 24" fill="none" style="width:28px;height:28px"><path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const punchIcon = '<svg viewBox="0 0 24 24" fill="none" style="width:28px;height:28px"><path d="M7 11h10v6a3 3 0 01-3 3H10a3 3 0 01-3-3v-6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 11V8a2 2 0 014 0v3" stroke="currentColor" stroke-width="2"/></svg>';
const bookIcon = '<svg viewBox="0 0 24 24" fill="none" style="width:28px;height:28px"><path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M4 5v14" stroke="currentColor" stroke-width="2"/></svg>';
const usersIcon = '<svg viewBox="0 0 24 24" fill="none" style="width:28px;height:28px"><circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="2"/><path d="M3 20a6 6 0 0112 0" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="9" r="2.5" stroke="currentColor" stroke-width="2"/><path d="M15 20a5 5 0 017-4.5" stroke="currentColor" stroke-width="2"/></svg>';

