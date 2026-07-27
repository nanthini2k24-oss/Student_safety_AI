// ===== Mental Wellness page =====
import { store, addActivity, checkAchievements, computeStats, confetti } from './utils.js';
import { breathingExercises, affirmations } from './dat.js';

let breathTimer = null;
let breathStep = 0;
let breathSeconds = 0;
let breathTotal = 0;

export function renderWellness(page, ctx) {
  const state = store.get();
  const journal = state.journal || [];

  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">Calm your mind</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">Mental Wellness</h2>
        <p style="margin:0">Breathing exercises, calming animations, positive affirmations, and a personal journal — your space to feel steady and supported.</p>
      </div>

      <div class="grid grid-3 mb-5">
        ${breathingExercises.map((b, i) => `
          <div class="glass reveal delay-${(i % 3) + 1}" style="text-align:center">
            <div class="breath-circle" style="background:radial-gradient(circle at 40% 35%, ${b.color === 'blue' ? '#7cc0ff,#1f8bff' : b.color === 'green' ? '#a7f3c5,#16b85f' : '#ffd54a,#f5a800'})">
              <span>${b.name.split(' ')[0]}</span>
            </div>
            <h3 style="font-size:18px;margin-top:14px">${b.name}</h3>
            <p class="muted" style="font-size:14px">${b.desc}</p>
            <button class="btn btn-green btn-block mt-3" data-breath="${b.id}">Start 2-minute session</button>
          </div>`).join('')}
      </div>

      <div class="grid grid-2 mb-5">
        <div class="glass reveal">
          <h3 style="font-size:18px">🌿 Mindfulness activity</h3>
          <p class="mt-2" style="color:var(--text-soft)">Try the 5-4-3-2-1 grounding technique to settle your mind.</p>
          <div class="mt-3" id="groundingList">
            ${groundingSteps().map((s, i) => `
              <div class="journey-reminder" style="animation:slideUp 0.4s var(--ease) both;animation-delay:${i * 0.1}s">
                <div class="jr-icon" style="background:var(--green-500)">${s.icon}</div>
                <div><strong>${s.title}</strong> — ${s.text}</div>
              </div>`).join('')}
          </div>
        </div>

        <div class="glass reveal delay-1" style="background:linear-gradient(135deg,var(--blue-50),var(--green-50))">
          <h3 style="font-size:18px">💬 Affirmation of the moment</h3>
          <div class="text-center mt-4" id="affirmBox">
            <div style="font-size:54px;margin-bottom:10px">💙</div>
            <p style="font-family:var(--font-display);font-weight:600;font-size:22px;color:var(--blue-600);line-height:1.3" id="affirmText">${affirmations[0]}</p>
          </div>
          <button class="btn btn-ghost btn-block mt-4" id="nextAffirm">Next affirmation →</button>
        </div>
      </div>

      <div class="glass reveal">
        <h3 style="font-size:18px">📓 My personal journal</h3>
        <p class="muted" style="font-size:14px;margin-top:4px">Write down your thoughts, feelings, or anything on your mind. Only you can see this — it stays on your device.</p>
        <div class="field mt-3">
          <textarea id="journalEntry" class="textarea" placeholder="Today I felt..."></textarea>
        </div>
        <button class="btn btn-green" id="saveJournal">Save journal entry</button>
        <div class="mt-4" id="journalList">
          ${journal.slice(0, 8).map(j => `
            <div class="journey-history-item" style="align-items:flex-start">
              <div style="flex:1"><strong>${new Date(j.date).toLocaleDateString()}</strong><div style="margin-top:6px;color:var(--text-soft)">${j.text}</div></div>
              <button class="btn btn-sm btn-ghost" data-del="${j.id}">Delete</button>
            </div>`).join('') || '<div class="empty"><div class="em-icon">📓</div>No journal entries yet. Start writing — it helps!</div>'}
        </div>
      </div>
    </div>
  `;

  // breathing
  page.querySelectorAll('[data-breath]').forEach(btn => {
    btn.addEventListener('click', () => startBreathing(page, ctx, btn.dataset.breath));
  });

  // affirmation
  let affirmIdx = 0;
  page.querySelector('#nextAffirm').addEventListener('click', () => {
    affirmIdx = (affirmIdx + 1) % affirmations.length;
    const t = page.querySelector('#affirmText');
    t.style.opacity = '0';
    setTimeout(() => { t.textContent = affirmations[affirmIdx]; t.style.transition = 'opacity 0.4s'; t.style.opacity = '1'; }, 200);
  });

  // journal
  page.querySelector('#saveJournal').addEventListener('click', () => {
    const text = page.querySelector('#journalEntry').value.trim();
    if (!text) return;
    store.update(s => {
      s.journal = s.journal || [];
      s.journal.unshift({ id: 'j-' + Date.now(), text, date: Date.now() });
      addActivity(s, { icon: '📓', color: 'blue', title: 'Wrote a journal entry' });
    });
    page.querySelector('#journalEntry').value = '';
    refreshJournal(page);
  });
  page.querySelectorAll('[data-del]').forEach(b => {
    b.addEventListener('click', () => {
      store.update(s => { s.journal = (s.journal || []).filter(j => j.id !== b.dataset.del); });
      refreshJournal(page);
    });
  });
}

function groundingSteps() {
  return [
    { icon: '👁️', title: '5 things you can SEE', text: 'Look around. Name five objects you can see right now.' },
    { icon: '✋', title: '4 things you can TOUCH', text: 'Notice four things you can feel — your clothes, the chair, the floor.' },
    { icon: '👂', title: '3 things you can HEAR', text: 'Listen for three sounds, near or far.' },
    { icon: '👃', title: '2 things you can SMELL', text: 'Notice two scents around you, or two favourite smells.' },
    { icon: '👅', title: '1 thing you can TASTE', text: 'Notice one taste in your mouth, or take a sip of water.' },
  ];
}

function startBreathing(page, ctx, id) {
  const ex = breathingExercises.find(e => e.id === id);
  if (!ex) return;
  if (breathTimer) clearInterval(breathTimer);
  breathStep = 0;
  breathSeconds = 0;
  breathTotal = 0;

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal text-center">
      <h3>${ex.name}</h3>
      <p class="muted">${ex.desc}</p>
      <div class="breath-circle mt-4" id="breathCircle" style="background:radial-gradient(circle at 40% 35%, ${ex.color === 'blue' ? '#7cc0ff,#1f8bff' : ex.color === 'green' ? '#a7f3c5,#16b85f' : '#ffd54a,#f5a800'});width:240px;height:240px">
        <span id="breathLabel" style="font-size:22px">Get ready...</span>
      </div>
      <div class="mt-3" style="font-family:var(--font-display);font-weight:700;font-size:28px;color:var(--blue-600)" id="breathCount">0:00</div>
      <div class="muted" style="font-size:13px;margin-top:6px">Session: 2 minutes</div>
      <button class="btn btn-ghost mt-4" id="stopBreath">End early</button>
    </div>`;
  document.body.appendChild(modal);

  const circle = modal.querySelector('#breathCircle');
  const label = modal.querySelector('#breathLabel');
  const count = modal.querySelector('#breathCount');

  function nextStep() {
    const dur = ex.pattern[breathStep % 4];
    const labelText = ex.labels[breathStep % 4];
    if (dur > 0) {
      label.textContent = labelText + ` (${dur}s)`;
      circle.style.animation = 'none';
      void circle.offsetWidth;
      if (breathStep % 4 === 0) circle.style.animation = 'breathe 8s ease-in-out infinite';
    } else {
      label.textContent = labelText;
      circle.style.animation = 'none';
    }
    breathStep++;
  }

  nextStep();
  breathTimer = setInterval(() => {
    breathTotal++;
    breathSeconds++;
    const m = Math.floor(breathTotal / 60), s = breathTotal % 60;
    count.textContent = `${m}:${String(s).padStart(2, '0')}`;
    const stepDur = ex.pattern[(breathStep - 1) % 4] || 4;
    if (breathSeconds >= stepDur) { breathSeconds = 0; nextStep(); }
    if (breathTotal >= 120) {
      finishBreathing(ctx, modal);
    }
  }, 1000);

  modal.querySelector('#stopBreath').addEventListener('click', () => finishBreathing(ctx, modal));
  modal.addEventListener('click', (e) => { if (e.target === modal) finishBreathing(ctx, modal); });
}

function finishBreathing(ctx, modal) {
  if (breathTimer) clearInterval(breathTimer);
  const minutes = Math.max(1, Math.round(breathTotal / 60));
  store.update(s => {
    s.breathingMinutes = (s.breathingMinutes || 0) + minutes;
    addActivity(s, { icon: '🌬️', color: 'green', title: `Completed a ${minutes}-minute breathing exercise` });
  });
  confetti(80, 0.5);
  ctx.checkAchievements(store.get(), computeStats(store.get()));
  if (modal) modal.remove();
}

function refreshJournal(page) {
  const state = store.get();
  const list = page.querySelector('#journalList');
  if (!list) return;
  const journal = state.journal || [];
  list.innerHTML = journal.slice(0, 8).map(j => `
    <div class="journey-history-item" style="align-items:flex-start">
      <div style="flex:1"><strong>${new Date(j.date).toLocaleDateString()}</strong><div style="margin-top:6px;color:var(--text-soft)">${j.text}</div></div>
      <button class="btn btn-sm btn-ghost" data-del="${j.id}">Delete</button>
    </div>`).join('') || '<div class="empty"><div class="em-icon">📓</div>No journal entries yet.</div>';
  list.querySelectorAll('[data-del]').forEach(b => {
    b.addEventListener('click', () => {
      store.update(s => { s.journal = (s.journal || []).filter(j => j.id !== b.dataset.del); });
      refreshJournal(page);
    });
  });
}
