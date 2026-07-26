// ===== Student Safety AI — Utilities =====
// LocalStorage state management + shared UI helpers (confetti, ripple, counters, toasts).
import { achievements } from './dat.js';

const STORAGE_KEY = 'ssa_state_v1';

export const store = {
  get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  },
  set(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { console.warn('Storage failed', e); }
  },
  init() {
    let s = this.get();
    if (!s) {
      s = {
        version: 1,
        profile: null,
        settings: null,
        unlockedAchievements: [],
        journeys: [],
        moods: [],
        reports: [],
        quizScores: { road: [], signs: [], defence: [] },
        safebuddyChats: 0,
        breathingMinutes: 0,
        missions: {},
        activities: [],
        journal: [],
        moodCheckIns: 0,
      };
      this.set(s);
    }
    return s;
  },
  update(mutator) {
    const s = this.get() || this.init();
    mutator(s);
    this.set(s);
    return s;
  },
};

// Compute aggregate stats from stored state
export function computeStats(state) {
  const today = new Date().toDateString();
  const journeysCompleted = (state.journeys || []).filter(j => j.completed).length;
  const todayJourneys = (state.journeys || []).filter(j => j.completed && new Date(j.date).toDateString() === today).length;

  // journey streak
  const journeyDates = (state.journeys || []).filter(j => j.completed).map(j => new Date(j.date).toDateString());
  let journeyStreak = 0;
  if (journeyDates.length) {
    const set = new Set(journeyDates);
    let d = new Date();
    while (set.has(d.toDateString())) { journeyStreak++; d.setDate(d.getDate() - 1); }
  }

  const moods = state.moods || [];
  const last7 = moods.filter(m => Date.now() - m.date <= 7 * 86400000);
  const avgMood = last7.length ? last7.reduce((a, m) => a + m.score, 0) / last7.length : 0;

  const reportsSubmitted = (state.reports || []).filter(r => r.reporter === 'self').length;
  const quizzesCompleted = (state.quizScores.road.length + state.quizScores.defence.length);
  const bestRoadQuizScore = state.quizScores.road.length ? Math.max(...state.quizScores.road) : 0;
  const bestDefenceQuizScore = state.quizScores.defence.length ? Math.max(...state.quizScores.defence) : 0;

  const todayMood = moods.filter(m => new Date(m.date).toDateString() === today).sort((a, b) => b.date - a.date)[0] || null;

  const missionsToday = state.missions[today] || [];
  const missionsDone = missionsToday.filter(Boolean).length;

  // safety score 0-100
  let score = 0;
  score += Math.min(journeysCompleted * 6, 30);
  score += Math.min(quizzesCompleted * 5, 25);
  score += avgMood ? Math.round((avgMood / 5) * 20) : 10;
  score += Math.min(reportsSubmitted * 5, 15);
  score += Math.min(state.breathingMinutes * 2, 10);
  score = Math.min(Math.round(score), 100);

  return {
    journeysCompleted,
    todayJourneys,
    journeyStreak,
    avgMood,
    reportsSubmitted,
    quizzesCompleted,
    bestRoadQuizScore,
    bestDefenceQuizScore,
    todayMood,
    missionsToday,
    missionsDone,
    safebuddyChats: state.safebuddyChats || 0,
    breathingMinutes: state.breathingMinutes || 0,
    score,
    weeklyProgress: Math.min(Math.round((journeysCompleted / 10) * 100), 100),
  };
}

// ===== Ripple effect for buttons =====
export function attachRipple(el) {
  el.addEventListener('click', (e) => {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// ===== Confetti =====
let confettiCtx = null;
export function confetti(count = 120, originX = 0.5) {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const colors = ['#1f8bff', '#16b85f', '#ffc11f', '#ff6f5e', '#7cc0ff', '#34d27b'];
  const pieces = [];
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: window.innerWidth * originX,
      y: window.innerHeight * 0.3,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -10 - 4,
      g: 0.3,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1,
    });
  }
  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces.forEach(p => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.008;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    frame++;
    if (pieces.some(p => p.life > 0 && p.y < window.innerHeight + 40) && frame < 240) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
  tick();
}

// ===== Achievement toast + unlock =====
export function checkAchievements(state, stats) {
  let newlyUnlocked = false;
  achievements.forEach(a => {
    if (!state.unlockedAchievements.includes(a.id) && a.check(stats)) {
      state.unlockedAchievements.push(a.id);
      newlyUnlocked = true;
      showAchievementToast(a);
      confetti(160, 0.5);
      addActivity(state, { icon: '🏆', color: 'yellow', title: `Achievement unlocked: ${a.title}` });
    }
  });
  if (newlyUnlocked) store.set(state);
  return newlyUnlocked;
}

export function showAchievementToast(achievement) {
  const toast = document.getElementById('achievementToast');
  if (!toast) return;
  toast.innerHTML = `
    <div class="badge">${achievement.icon}</div>
    <div>
      <div class="at-title">Achievement Unlocked!</div>
      <div class="at-sub"><strong>${achievement.title}</strong> — ${achievement.desc}</div>
    </div>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4200);
}

// ===== Activity log =====
export function addActivity(state, { icon, color = 'blue', title }) {
  state.activities = state.activities || [];
  state.activities.unshift({ icon, color, title, date: Date.now() });
  state.activities = state.activities.slice(0, 12);
}

// ===== Animated counter =====
export function animateCount(el, target, duration = 1200, suffix = '') {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();
  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.round(start + (target - start) * eased);
    el.textContent = val + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ===== Scroll reveal observer =====
let revealObserver = null;
export function initReveal() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ===== Modal helper =====
export function showModal(html) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `<div class="modal">${html}</div>`;
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
  document.body.appendChild(backdrop);
  return backdrop;
}

// ===== Date helpers =====
export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  const d = Math.floor(h / 24);
  return d + 'd ago';
}
export function formatDate(ts) { return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
export function todayKey() { return new Date().toDateString(); }

// ===== CSS helpers =====
export function colorClass(c) { return { blue: 'fi-blue', green: 'fi-green', yellow: 'fi-yellow', coral: 'fi-coral' }[c] || 'fi-blue'; }

// ===== Icon helper (inline SVGs) =====
export const icons = {
  shield: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V4l5 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="2"/></svg>',
  bus: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M4 11h16" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="19" r="1.5" fill="currentColor"/><circle cx="16" cy="19" r="1.5" fill="currentColor"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  sos: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M9 9a3 3 0 016 0v6a3 3 0 01-6 0V9z" stroke="currentColor" stroke-width="2"/></svg>',
  punch: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 11h10v6a3 3 0 01-3 3H10a3 3 0 01-3-3v-6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 11V8a2 2 0 014 0v3" stroke="currentColor" stroke-width="2"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M4 5v14" stroke="currentColor" stroke-width="2"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="2"/><path d="M3 20a6 6 0 0112 0" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="9" r="2.5" stroke="currentColor" stroke-width="2"/><path d="M15 20a5 5 0 017-4.5" stroke="currentColor" stroke-width="2"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 19V5M4 19h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="7" y="11" width="3" height="6" stroke="currentColor" stroke-width="2"/><rect x="12" y="7" width="3" height="10" stroke="currentColor" stroke-width="2"/><rect x="17" y="13" width="3" height="4" stroke="currentColor" stroke-width="2"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M4 20a8 8 0 0116 0" stroke="currentColor" stroke-width="2"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  walk: '<svg viewBox="0 0 24 24" fill="none"><circle cx="13" cy="4" r="2" stroke="currentColor" stroke-width="2"/><path d="M9 21l3-7-3-3 1-5 4 2 1 4" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l2.5 6h6.5l-5 4 2 6.5L12 16l-6 3.5 2-6.5-5-4h6.5L12 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2 1a11 11 0 005 5l1-2 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  location: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="2"/></svg>',
};

console.log('[Student Safety AI] utils.js loaded');
