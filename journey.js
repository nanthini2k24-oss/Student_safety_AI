// ===== Safe Journey / Guardian Journey Mode =====
import { store, addActivity, checkAchievements, computeStats, confetti } from '../utils.js';
import { mapPoints } from '../dat.js';

let journeyTimer = null;
let journeyStart = null;
let journeyProgress = 0;
let journeyActive = false;
let reminderIdx = 0;

const journeyReminders = [
  { icon: '🚸', text: 'Use pedestrian crossings. Look left, right, left again.', warn: false, color: 'blue' },
  { icon: '⚠️', text: 'Approaching accident-prone area near Lake Road. Stay extra alert.', warn: true, color: 'coral' },
  { icon: '🎒', text: 'Keep your bag close and your phone charged. You\'re doing great!', warn: false, color: 'green' },
  { icon: '👁️', text: 'Stay aware of strangers. Trust your instincts — if it feels wrong, leave.', warn: true, color: 'coral' },
  { icon: '🏥', text: 'City Care Hospital is nearby if you need help. Stay safe!', warn: false, color: 'blue' },
  { icon: '🏪', text: '24/7 Mart is a safe shelter on your route if you feel unsafe.', warn: false, color: 'green' },
];

export function renderJourney(page, ctx) {
  const state = store.get();
  const profile = state.profile || {};
  const history = (state.journeys || []).filter(j => j.completed).slice(0, 8);

  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">Guardian Journey Mode</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">Safe Journey</h2>
        <p style="margin:0">Press start to begin a tracked journey with a live timer, animated route progress, and smart safety reminders along the way.</p>
      </div>

      <div class="grid grid-2 mb-5">
        <div class="glass journey-hero reveal">
          <div class="journey-status idle" id="journeyStatus"><span>●</span> Not started</div>
          <div class="journey-timer" id="journeyTimer">00:00</div>
          <div class="muted">Journey time</div>
          <div class="journey-progress">
            <div class="flex justify-between mb-2"><span class="muted" style="font-size:14px;font-weight:600">Route progress</span><span id="progressPct" style="font-weight:700;color:var(--blue-600)">0%</span></div>
            <div class="progress"><span id="progressBar" style="width:0%"></span></div>
          </div>
          <div class="flex gap-3 justify-center wrap mt-4">
            <button id="startJourney" class="btn btn-green btn-lg">Start Journey</button>
            <button id="completeJourney" class="btn btn-coral btn-lg" disabled>Complete & Save</button>
          </div>
          <div class="mt-3 muted" style="font-size:13px">From <strong>${profile.name || 'Home'}'s home</strong> to <strong>${profile.school || 'School'}</strong></div>
        </div>

        <div class="glass reveal delay-1">
          <h3 style="font-size:18px">📍 Route overview</h3>
          <div class="route-info mt-3">
            <div class="ri-item"><div class="ri-num" id="routeDist">1.2</div><div class="ri-label">km</div></div>
            <div class="ri-item"><div class="ri-num" id="routeTime">15</div><div class="ri-label">min</div></div>
            <div class="ri-item"><div class="ri-num">3</div><div class="ri-label">crossings</div></div>
          </div>
          <div class="mt-4">
            ${[mapPoints.home, ...mapPoints.crossings, mapPoints.school].map((p, i, arr) => `
              <div class="info-row">
                <span class="ir-label">${i === 0 ? '🏠' : i === arr.length - 1 ? '🏫' : '🚸'} ${p.name || p.label}</span>
                <span class="ir-val" style="font-size:12px">${i === 0 ? 'Start' : i === arr.length - 1 ? 'End' : 'Waypoint'}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="glass reveal mb-5">
        <h3 style="font-size:18px">🛡️ Live safety reminders</h3>
        <p class="muted" style="font-size:14px;margin-top:4px">Reminders appear as you progress along your route.</p>
        <div class="journey-reminders mt-3" id="reminderList">
          <div class="journey-reminder"><div class="jr-icon" style="background:var(--neutral-300)">📋</div><div>Press <strong>Start Journey</strong> to receive live safety reminders as you travel.</div></div>
        </div>
      </div>

      <div class="glass reveal">
        <div class="flex items-center justify-between wrap gap-3 mb-3">
          <h3 style="font-size:18px">🧭 Journey history</h3>
          <span class="pill pill-blue">${(state.journeys || []).filter(j => j.completed).length} completed</span>
        </div>
        <div id="historyList">
          ${history.length ? history.map(j => `
            <div class="journey-history-item">
              <div><strong>${j.route || 'School route'}</strong><div class="muted" style="font-size:13px">${new Date(j.date).toLocaleDateString()} · ${j.duration ? Math.floor(j.duration / 60) + 'm ' + (j.duration % 60) + 's' : '—'}</div></div>
              <span class="pill pill-green">✓ Completed</span>
            </div>`).join('') : '<div class="empty"><div class="em-icon">🧭</div>No completed journeys yet. Your first safe journey earns you the Safe Explorer badge!</div>'}
        </div>
      </div>
    </div>
  `;

  journeyProgress = 0;
  journeyActive = false;
  if (journeyTimer) { clearInterval(journeyTimer); journeyTimer = null; }

  page.querySelector('#startJourney').addEventListener('click', () => startJourney(page));
  page.querySelector('#completeJourney').addEventListener('click', () => completeJourney(page, ctx));
}

function startJourney(page) {
  if (journeyActive) return;
  journeyActive = true;
  journeyStart = Date.now();
  journeyProgress = 0;
  reminderIdx = 0;
  const status = page.querySelector('#journeyStatus');
  status.className = 'journey-status active';
  status.innerHTML = '<span>●</span> Journey active — stay safe!';
  page.querySelector('#startJourney').disabled = true;
  page.querySelector('#completeJourney').disabled = false;
  addActivity(store.get(), { icon: '🧭', color: 'green', title: 'Started a Guardian Journey' });
  store.update(s => {});

  // timer
  journeyTimer = setInterval(() => {
    if (!journeyActive) return;
    const elapsed = Math.floor((Date.now() - journeyStart) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    page.querySelector('#journeyTimer').textContent = `${m}:${s}`;
    // progress over ~90s
    journeyProgress = Math.min(elapsed / 90 * 100, 100);
    page.querySelector('#progressBar').style.width = journeyProgress + '%';
    page.querySelector('#progressPct').textContent = Math.round(journeyProgress) + '%';
    // reminders at 20%, 40%, 60%, 80%
    const targetIdx = Math.floor(journeyProgress / 18);
    if (targetIdx > reminderIdx && reminderIdx < journeyReminders.length) {
      addReminder(page, journeyReminders[reminderIdx]);
      reminderIdx++;
    }
    if (journeyProgress >= 100) {
      page.querySelector('#journeyStatus').className = 'journey-status done';
      page.querySelector('#journeyStatus').innerHTML = '<span>✓</span> You reached school!';
    }
  }, 1000);

  // first reminder
  addReminder(page, journeyReminders[0]);
  reminderIdx = 1;
}

function addReminder(page, reminder) {
  const list = page.querySelector('#reminderList');
  if (list.querySelector('.journey-reminder .em-icon')) list.innerHTML = '';
  const item = document.createElement('div');
  item.className = `journey-reminder ${reminder.warn ? 'warn' : ''}`;
  item.style.animation = 'slideUp 0.4s var(--ease) both';
  item.innerHTML = `<div class="jr-icon" style="background:${reminder.warn ? 'var(--coral-500)' : 'var(--blue-500)'}">${reminder.icon}</div><div>${reminder.text}</div>`;
  list.appendChild(item);
}

function completeJourney(page, ctx) {
  if (!journeyActive) return;
  journeyActive = false;
  if (journeyTimer) clearInterval(journeyTimer);
  const duration = Math.floor((Date.now() - journeyStart) / 1000);
  const completed = journeyProgress >= 80;

  store.update(s => {
    s.journeys = s.journeys || [];
    s.journeys.unshift({ date: Date.now(), duration, route: 'Home → School', progress: Math.round(journeyProgress), completed });
    addActivity(s, { icon: completed ? '✅' : '🧭', color: completed ? 'green' : 'yellow', title: completed ? 'Completed a safe school journey!' : 'Saved a journey' });
  });

  const status = page.querySelector('#journeyStatus');
  status.className = 'journey-status done';
  status.innerHTML = '<span>✓</span> Journey saved!';
  page.querySelector('#startJourney').disabled = false;
  page.querySelector('#completeJourney').disabled = true;

  if (completed) confetti(140, 0.5);
  ctx.checkAchievements(store.get(), computeStats(store.get()));

  // refresh history
  const hist = store.get().journeys.filter(j => j.completed).slice(0, 8);
  page.querySelector('#historyList').innerHTML = hist.length ? hist.map(j => `
    <div class="journey-history-item">
      <div><strong>${j.route || 'School route'}</strong><div class="muted" style="font-size:13px">${new Date(j.date).toLocaleDateString()} · ${j.duration ? Math.floor(j.duration / 60) + 'm ' + (j.duration % 60) + 's' : '—'}</div></div>
      <span class="pill pill-green">✓ Completed</span>
    </div>`).join('') : '<div class="empty"><div class="em-icon">🧭</div>No completed journeys yet.</div>';
}
