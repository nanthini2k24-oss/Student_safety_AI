// ===== Student Dashboard =====
import { store, computeStats, animateCount, addActivity, checkAchievements, timeAgo } from '../utils.js';
import { safetyTips, dailyMissions, moods } from '../dat.js';

export function renderDashboard(page, ctx) {
  const state = store.get();
  const stats = computeStats(state);
  const profile = state.profile || {};
  const todayKey = new Date().toDateString();
  const todayMissions = state._todayMissions && state._todayMissions.length ? state._todayMissions : dailyMissions.slice(0, 4);
  const missionStates = state.missions[todayKey] || todayMissions.map(() => false);
  const tip = safetyTips[new Date().getDate() % safetyTips.length];
  const mood = stats.todayMood ? moods.find(m => m.id === stats.todayMood.moodId) : null;

  page.innerHTML = `
    <div class="container section-tight">
      <div class="dash-hero">
        <div class="glass welcome-card reveal">
          <span class="pill mb-3">Welcome back</span>
          <h2>Hello, ${profile.name || 'Student'}! 👋</h2>
          <p class="mt-2">${greetingByTime()} Here's your safety snapshot for today, ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
          <div class="flex gap-3 wrap mt-5">
            <a href="#/journey" data-link class="btn btn-yellow">Start Safe Journey</a>
            <a href="#/safebuddy" data-link class="btn" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.4)">Talk to SafeBuddy</a>
          </div>
        </div>
        <div class="glass reveal delay-1 text-center">
          <h3 style="font-size:18px;color:var(--text-soft)">Today's Safety Score</h3>
          ${scoreRing(stats.score)}
          <div class="pill ${stats.score >= 75 ? 'pill-green' : stats.score >= 50 ? 'pill-yellow' : 'pill-coral'} mt-3">${stats.score >= 75 ? 'Excellent' : stats.score >= 50 ? 'Good — keep going' : "Let's improve together"}</div>
        </div>
      </div>

      <div class="grid grid-4 mb-5">
        ${statCards(stats, profile).map((c, i) => `
          <div class="glass stat-card reveal delay-${(i % 4) + 1}">
            <div class="stat-icon" style="background:${c.bg}">${c.svg}</div>
            <div class="stat-num" data-count="${c.value}">0</div>
            <div class="stat-label">${c.label}</div>
          </div>`).join('')}
      </div>

      <div class="grid grid-3 mb-5">
        <div class="glass reveal">
          <h3 style="font-size:18px">Today's Mood</h3>
          <div class="text-center mt-4">
            <div style="font-size:64px">${mood ? mood.emoji : '🤔'}</div>
            <div style="font-weight:700;color:var(--text);margin-top:8px">${mood ? mood.label : 'Not checked in yet'}</div>
            <a href="#/mood" data-link class="btn btn-sm btn-ghost mt-3">${mood ? 'Update mood' : 'Check in now'}</a>
          </div>
        </div>
        <div class="glass tip-card reveal delay-1">
          <div class="flex items-center gap-3 mb-3"><span style="font-size:26px">${tip.icon}</span><h3 style="font-size:18px">Daily Safety Tip</h3></div>
          <p style="font-weight:700;color:var(--text)">${tip.title}</p>
          <p class="mt-2" style="color:var(--text-soft)">${tip.text}</p>
          <a href="#/learning" data-link class="btn btn-sm btn-ghost mt-3">Learn more →</a>
        </div>
        <div class="glass reveal delay-2">
          <h3 style="font-size:18px">Today's Safe Journey</h3>
          <div class="mt-3">
            <div class="info-row"><span class="ir-label">Assigned bus</span><span class="ir-val">Bus ${profile.busNo || '—'}</span></div>
            <div class="info-row"><span class="ir-label">Journeys today</span><span class="ir-val">${stats.todayJourneys}</span></div>
            <div class="info-row"><span class="ir-label">Streak</span><span class="ir-val">${stats.journeyStreak} days 🔥</span></div>
          </div>
          <a href="#/journey" data-link class="btn btn-sm btn-green btn-block mt-3">Start Guardian Mode</a>
        </div>
      </div>

      <div class="grid grid-2 mb-5">
        <div class="glass reveal">
          <div class="flex items-center justify-between mb-3">
            <h3 style="font-size:18px">Today's Safety Mission</h3>
            <span class="pill pill-blue">${stats.missionsDone}/${missionStates.length} done</span>
          </div>
          <div id="missionList">
            ${todayMissions.map((m, i) => `
              <div class="mission-item ${missionStates[i] ? 'completed' : ''}" data-mission="${i}">
                <div class="mission-check ${missionStates[i] ? 'done' : ''}">${missionStates[i] ? '✓' : ''}</div>
                <div><div class="mi-title">${m.text}</div><div class="muted" style="font-size:13px">+${m.reward} safety points</div></div>
              </div>`).join('')}
          </div>
        </div>
        <div class="glass reveal delay-1">
          <h3 style="font-size:18px">Weekly Progress</h3>
          <div class="text-center mt-3">
            <div class="big-num">${stats.weeklyProgress}%</div>
            <div class="muted">toward your weekly goal</div>
          </div>
          <div class="progress mt-4"><span style="width:${stats.weeklyProgress}%"></span></div>
          <div class="grid grid-2 gap-3 mt-4">
            <div class="glass-soft" style="padding:14px;border-radius:12px;text-align:center">
              <div style="font-family:var(--font-display);font-weight:700;font-size:24px;color:var(--green-600)">${stats.journeyStreak}</div>
              <div class="muted" style="font-size:13px">day streak</div>
            </div>
            <div class="glass-soft" style="padding:14px;border-radius:12px;text-align:center">
              <div style="font-family:var(--font-display);font-weight:700;font-size:24px;color:var(--blue-600)">${stats.quizzesCompleted}</div>
              <div class="muted" style="font-size:13px">quizzes done</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-3 mb-5">
        <div class="glass reveal" style="grid-column:span 2">
          <h3 style="font-size:18px">Recent Activities</h3>
          <div class="mt-3" id="activityList">
            ${(state.activities || []).length ? state.activities.map(a => `
              <div class="activity-item">
                <div class="activity-dot" style="background:${activityBg(a.color)}">${a.icon}</div>
                <div><div class="ai-title">${a.title}</div><div class="ai-time">${timeAgo(a.date)}</div></div>
              </div>`).join('') : '<div class="empty"><div class="em-icon">📋</div>No activity yet. Start a journey or talk to SafeBuddy!</div>'}
          </div>
        </div>
        <div class="glass reveal delay-1">
          <h3 style="font-size:18px">Quick Actions</h3>
          <div class="quick-actions mt-3">
            ${quickActions().map(qa => `
              <div class="quick-action" data-action="${qa.action}">
                <div class="qa-icon" style="background:${qa.bg}">${qa.svg}</div>
                <div class="qa-label">${qa.label}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="glass reveal mb-5">
        <div class="flex items-center justify-between wrap gap-3 mb-4">
          <h3 style="font-size:18px">Safety Statistics</h3>
          <a href="#/analytics" data-link class="btn btn-sm btn-ghost">Full analytics →</a>
        </div>
        <div class="grid grid-4">
          ${miniStats(stats).map(s => `
            <div style="text-align:center;padding:14px;border-radius:12px;background:var(--surface-soft)">
              <div style="font-family:var(--font-display);font-weight:700;font-size:26px;color:${s.color}">${s.value}</div>
              <div class="muted" style="font-size:13px;font-weight:600">${s.label}</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="grid grid-2">
        <div class="glass reveal">
          <h3 style="font-size:18px">🛡️ SafeBuddy Motivation Corner</h3>
          <p class="mt-3" style="font-size:18px;font-style:italic;color:var(--text)">"${motivationQuote()}"</p>
          <p class="muted mt-2">— SafeBuddy AI</p>
          <a href="#/safebuddy" data-link class="btn btn-sm btn-green mt-3">Chat with SafeBuddy →</a>
        </div>
        <div class="glass reveal delay-1">
          <h3 style="font-size:18px">🧭 Safe Journey History</h3>
          <div class="mt-3" id="journeyHistory">
            ${(state.journeys || []).slice(0, 4).map(j => `
              <div class="journey-history-item">
                <div><strong>${j.route || 'School route'}</strong><div class="muted" style="font-size:13px">${new Date(j.date).toLocaleDateString()} · ${j.duration ? Math.floor(j.duration/60)+'m '+(j.duration%60)+'s' : '—'}</div></div>
                <span class="pill ${j.completed ? 'pill-green' : 'pill-yellow'}">${j.completed ? 'Completed' : 'In progress'}</span>
              </div>`).join('') || '<div class="empty"><div class="em-icon">🧭</div>No journeys yet. Start your first safe journey!</div>'}
          </div>
        </div>
      </div>
    </div>
  `;

  // animate counters
  page.querySelectorAll('[data-count]').forEach(el => animateCount(el, parseInt(el.dataset.count, 10)));

  // mission toggle
  page.querySelectorAll('.mission-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.mission, 10);
      const newDone = !missionStates[idx];
      missionStates[idx] = newDone;
      store.update(s => { s.missions[todayKey] = missionStates; });
      // update UI
      const check = item.querySelector('.mission-check');
      check.classList.toggle('done', newDone);
      check.textContent = newDone ? '✓' : '';
      item.classList.toggle('completed', newDone);
      if (newDone) {
        addActivity(store.get(), { icon: '🎯', color: 'green', title: `Completed mission: ${todayMissions[idx].text.slice(0, 40)}...` });
        store.update(s => {});
        ctx.checkAchievements(store.get(), computeStats(store.get()));
      }
      // refresh missionsDone pill
      const done = missionStates.filter(Boolean).length;
      page.querySelector('.pill-blue').textContent = `${done}/${missionStates.length} done`;
    });
  });

  // quick actions
  page.querySelectorAll('.quick-action').forEach(qa => {
    qa.addEventListener('click', () => {
      const action = qa.dataset.action;
      const map = { journey: '#/journey', map: '#/map', safebuddy: '#/safebuddy', emergency: '#/emergency', learning: '#/learning', mood: '#/mood', community: '#/community', selfdefence: '#/selfdefence' };
      if (map[action]) location.hash = map[action];
    });
  });
}

function greetingByTime() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning!';
  if (h < 17) return 'Good afternoon!';
  return 'Good evening!';
}

function scoreRing(score) {
  const r = 70, c = 2 * Math.PI * r, offset = c - (score / 100) * c;
  return `
    <div class="score-ring mt-3">
      <svg width="180" height="180">
        <circle cx="90" cy="90" r="${r}" stroke="var(--neutral-100)" stroke-width="12" fill="none"/>
        <circle cx="90" cy="90" r="${r}" stroke="url(#scoreGrad)" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${offset}" style="transition:stroke-dashoffset 1.2s var(--ease)"/>
        <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f8bff"/><stop offset="1" stop-color="#16b85f"/></linearGradient></defs>
      </svg>
      <div class="score-val" data-count="${score}">0</div>
      <div class="score-label">out of 100</div>
    </div>`;
}

function statCards(stats, profile) {
  return [
    { label: 'Safe journeys', value: stats.journeysCompleted, bg: 'linear-gradient(135deg,#48a6ff,#1f8bff)', svg: walkSvg },
    { label: 'Day streak', value: stats.journeyStreak, bg: 'linear-gradient(135deg,#34d27b,#16b85f)', svg: fireSvg },
    { label: 'Badges earned', value: store.get().unlockedAchievements.length, bg: 'linear-gradient(135deg,#ffd54a,#f5a800)', svg: starSvg },
    { label: 'Community reports', value: stats.reportsSubmitted, bg: 'linear-gradient(135deg,#ff9d8a,#f04d3a)', svg: shieldSvg },
  ];
}

const walkSvg = '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:#fff"><circle cx="13" cy="4" r="2" stroke="currentColor" stroke-width="2"/><path d="M9 21l3-7-3-3 1-5 4 2 1 4" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const fireSvg = '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:#fff"><path d="M12 3c0 4-4 5-4 9a4 4 0 008 0c0-2-2-3-2-5 0 0 2 1 2 4 0-4-4-5-4-8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const starSvg = '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:#fff"><path d="M12 3l2.5 6h6.5l-5 4 2 6.5L12 16l-6 3.5 2-6.5-5-4h6.5L12 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const shieldSvg = '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:#fff"><path d="M12 2L4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

function quickActions() {
  return [
    { label: 'Start Journey', action: 'journey', bg: 'linear-gradient(135deg,#48a6ff,#1f8bff)', svg: walkSvg },
    { label: 'School Map', action: 'map', bg: 'linear-gradient(135deg,#34d27b,#16b85f)', svg: mapSvg },
    { label: 'SafeBuddy', action: 'safebuddy', bg: 'linear-gradient(135deg,#7cc0ff,#48a6ff)', svg: chatSvg },
    { label: 'Emergency', action: 'emergency', bg: 'linear-gradient(135deg,#ff9d8a,#f04d3a)', svg: sosSvg },
    { label: 'Safety Quiz', action: 'learning', bg: 'linear-gradient(135deg,#ffd54a,#f5a800)', svg: bookSvg },
    { label: 'Track Mood', action: 'mood', bg: 'linear-gradient(135deg,#a7f3c5,#34d27b)', svg: heartSvg },
    { label: 'Report Hazard', action: 'community', bg: 'linear-gradient(135deg,#ff9d8a,#ffc11f)', svg: flagSvg },
    { label: 'Self Defence', action: 'selfdefence', bg: 'linear-gradient(135deg,#f04d3a,#d63522)', svg: punchSvg },
  ];
}
const mapSvg = '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:#fff"><path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V4l5 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const chatSvg = '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:#fff"><path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const sosSvg = '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:#fff"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M9 9a3 3 0 016 0v6a3 3 0 01-6 0V9z" stroke="currentColor" stroke-width="2"/></svg>';
const bookSvg = '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:#fff"><path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const heartSvg = '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:#fff"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const flagSvg = '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:#fff"><path d="M5 21V4M5 4h12l-2 4 2 4H5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
const punchSvg = '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:#fff"><path d="M7 11h10v6a3 3 0 01-3 3H10a3 3 0 01-3-3v-6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

function miniStats(stats) {
  return [
    { label: 'Total journeys', value: stats.journeysCompleted, color: 'var(--blue-600)' },
    { label: 'Quizzes passed', value: stats.quizzesCompleted, color: 'var(--green-600)' },
    { label: 'Breathing (min)', value: stats.breathingMinutes, color: '#b07a00' },
    { label: 'Avg mood / 5', value: stats.avgMood ? stats.avgMood.toFixed(1) : '—', color: 'var(--coral-600)' },
  ];
}

function activityBg(c) {
  return { blue: 'linear-gradient(135deg,#48a6ff,#1f8bff)', green: 'linear-gradient(135deg,#34d27b,#16b85f)', yellow: 'linear-gradient(135deg,#ffd54a,#f5a800)', coral: 'linear-gradient(135deg,#ff9d8a,#f04d3a)' }[c] || 'var(--blue-500)';
}

function motivationQuote() {
  const quotes = [
    "You are braver than you believe and stronger than you seem.",
    "Every safe step is a victory. Celebrate the small wins today.",
    "A calm mind is a safe mind. Breathe, then decide.",
    "Asking for help is a sign of strength, not weakness.",
  ];
  return quotes[new Date().getDate() % quotes.length];
}
