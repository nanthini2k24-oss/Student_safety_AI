// ===== Mood Tracker =====
import { store, addActivity, checkAchievements, computeStats } from './utils.js';
import { moods } from './dat.js';

let moodChart = null;

export function renderMood(page, ctx) {
  const state = store.get();
  const moodHistory = state.moods || [];
  const last7 = moodHistory.filter(m => Date.now() - m.date <= 7 * 86400000).sort((a, b) => a.date - b.date);

  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">How are you today?</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">Mood Tracker</h2>
        <p style="margin:0">Tap how you feel. Tracking your mood helps you understand yourself and spot when you might need extra support.</p>
      </div>

      <div class="glass reveal mb-5">
        <h3 style="font-size:18px;text-align:center">Choose your mood right now</h3>
        <div class="mood-picker" id="moodPicker">
          ${moods.map(m => `<div class="mood-emoji" data-mood="${m.id}" title="${m.label}">${m.emoji}</div>`).join('')}
        </div>
        <p class="text-center muted" id="moodFeedback">Pick the emoji that matches how you feel.</p>
      </div>

      <div class="grid grid-2 mb-5">
        <div class="glass reveal">
          <h3 style="font-size:18px">📈 Mood trend (last 7 entries)</h3>
          <canvas id="moodChart" style="max-height:260px;margin-top:16px"></canvas>
        </div>
        <div class="glass reveal delay-1">
          <h3 style="font-size:18px">📅 This week</h3>
          <div class="mood-calendar mt-3" id="moodCalendar"></div>
          <div class="mt-3" style="font-size:13px;color:var(--text-muted)">
            ${moods.map(m => `${m.emoji} ${m.label}`).join(' · ')}
          </div>
        </div>
      </div>

      <div class="glass reveal mb-5" id="moodRecommendation">
        <h3 style="font-size:18px">💙 Support recommendation</h3>
        <p class="mt-2" id="recText">Check in regularly to receive personalized support recommendations.</p>
      </div>

      <div class="glass reveal">
        <h3 style="font-size:18px">📜 Mood history</h3>
        <div class="mt-3" id="moodHistoryList">
          ${moodHistory.slice(0, 10).map(m => {
            const mood = moods.find(x => x.id === m.moodId);
            return `<div class="journey-history-item"><div><strong>${mood.emoji} ${mood.label}</strong><div class="muted" style="font-size:13px">${new Date(m.date).toLocaleString()}</div></div></div>`;
          }).join('') || '<div class="empty"><div class="em-icon">📅</div>No mood check-ins yet. Tap an emoji above to start!</div>'}
        </div>
      </div>
    </div>
  `;

  // mood picker
  page.querySelectorAll('.mood-emoji').forEach(el => {
    el.addEventListener('click', () => {
      const moodId = el.dataset.mood;
      const mood = moods.find(m => m.id === moodId);
      page.querySelectorAll('.mood-emoji').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      store.update(s => {
        s.moods = s.moods || [];
        s.moods.unshift({ moodId, score: mood.score, date: Date.now() });
        s.moodCheckIns = (s.moodCheckIns || 0) + 1;
        addActivity(s, { icon: mood.emoji, color: mood.score >= 4 ? 'green' : mood.score >= 3 ? 'blue' : 'coral', title: `Checked in mood: ${mood.label}` });
      });
      page.querySelector('#moodFeedback').innerHTML = `You feel <strong>${mood.label}</strong> right now. ${moodFeedback(mood)}`;
      updateRecommendation(page, mood);
      refreshChart(page);
      refreshCalendar(page);
      refreshHistory(page);
      ctx.checkAchievements(store.get(), computeStats(store.get()));
    });
  });

  refreshChart(page);
  refreshCalendar(page);
}

function moodFeedback(mood) {
  if (mood.score >= 4) return "That's wonderful! Hold on to this feeling. 💙";
  if (mood.score === 3) return "Okay days are okay. Be gentle with yourself today.";
  return "Thank you for sharing. It's brave to name how you feel.";
}

function updateRecommendation(page, mood) {
  const rec = page.querySelector('#moodRecommendation');
  if (mood.id === 'sad' || mood.id === 'scared') {
    rec.style.background = 'linear-gradient(135deg,#fff5f3,#fff)';
    rec.style.borderColor = 'var(--coral-300)';
    rec.querySelector('#recText').innerHTML = `You're feeling ${mood.label.toLowerCase()}. That's hard, and you don't have to carry it alone. <strong>SafeBuddy AI</strong> is here to listen, and the <strong>Emergency</strong> page has help if you need it.`;
    if (!rec.querySelector('#recBtns')) {
      const btns = document.createElement('div');
      btns.id = 'recBtns';
      btns.className = 'flex gap-3 wrap mt-3';
      btns.innerHTML = '<a href="#/safebuddy" data-link class="btn btn-green btn-sm">Talk to SafeBuddy</a><a href="#/emergency" data-link class="btn btn-coral btn-sm">Open Emergency</a><a href="#/wellness" data-link class="btn btn-ghost btn-sm">Breathing exercise</a>';
      rec.appendChild(btns);
    }
  } else if (mood.id === 'worried' || mood.id === 'angry') {
    rec.style.background = 'linear-gradient(135deg,var(--yellow-50),#fff)';
    rec.style.borderColor = 'var(--yellow-200)';
    rec.querySelector('#recText').innerHTML = `You're feeling ${mood.label.toLowerCase()}. A short breathing exercise can help settle those feelings. SafeBuddy is also here if you want to talk.`;
    if (!rec.querySelector('#recBtns')) {
      const btns = document.createElement('div');
      btns.id = 'recBtns';
      btns.className = 'flex gap-3 wrap mt-3';
      btns.innerHTML = '<a href="#/wellness" data-link class="btn btn-green btn-sm">Try breathing</a><a href="#/safebuddy" data-link class="btn btn-ghost btn-sm">Talk to SafeBuddy</a>';
      rec.appendChild(btns);
    }
  } else {
    rec.style.background = 'linear-gradient(135deg,var(--green-50),#fff)';
    rec.style.borderColor = 'var(--green-200)';
    rec.querySelector('#recText').innerHTML = `You're feeling ${mood.label.toLowerCase()}. Keep nurturing your wellbeing — a 2-minute breathing exercise keeps you balanced.`;
    const existing = rec.querySelector('#recBtns');
    if (existing) existing.remove();
  }
}

function refreshChart(page) {
  const state = store.get();
  const last7 = (state.moods || []).slice(0, 7).reverse();
  const ctx = page.querySelector('#moodChart');
  if (!ctx) return;
  if (moodChart) moodChart.destroy();
  if (!last7.length) {
    moodChart = null;
    return;
  }
  moodChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: last7.map(m => new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [{
        label: 'Mood score',
        data: last7.map(m => m.score),
        borderColor: '#1f8bff',
        backgroundColor: 'rgba(31,139,255,0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: last7.map(m => m.score >= 4 ? '#16b85f' : m.score >= 3 ? '#ffd54a' : '#f04d3a'),
        pointRadius: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } },
    },
  });
}

function refreshCalendar(page) {
  const state = store.get();
  const cal = page.querySelector('#moodCalendar');
  if (!cal) return;
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const ds = d.toDateString();
    const entry = (state.moods || []).filter(m => new Date(m.date).toDateString() === ds).sort((a, b) => b.date - a.date)[0];
    const mood = entry ? moods.find(m => m.id === entry.moodId) : null;
    days.push(`<div class="mood-day ${mood ? '' : 'empty'}" title="${d.toLocaleDateString()}">${mood ? mood.emoji : '·'}</div>`);
  }
  cal.innerHTML = days.join('');
}

function refreshHistory(page) {
  const state = store.get();
  const list = page.querySelector('#moodHistoryList');
  if (!list) return;
  list.innerHTML = (state.moods || []).slice(0, 10).map(m => {
    const mood = moods.find(x => x.id === m.moodId);
    return `<div class="journey-history-item"><div><strong>${mood.emoji} ${mood.label}</strong><div class="muted" style="font-size:13px">${new Date(m.date).toLocaleString()}</div></div></div>`;
  }).join('') || '<div class="empty"><div class="em-icon">📅</div>No mood check-ins yet.</div>';
}
