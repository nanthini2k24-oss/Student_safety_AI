// ===== Analytics Dashboard =====
import { store, computeStats } from './utils.js';
import { achievements, moods, safetyScoreFactors } from './dat.js';

let charts = [];

export function renderAnalytics(page, ctx) {
  const state = store.get();
  const stats = computeStats(state);

  // destroy previous charts
  charts.forEach(c => c?.destroy()); charts = [];

  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">Your safety journey in numbers</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">Analytics Dashboard</h2>
        <p style="margin:0">Track your safety score, mood trends, completed journeys, reports, quizzes, achievements, and weekly progress — all in one view.</p>
      </div>

      <div class="kpi-grid mb-5">
        ${kpis(stats, state).map((k, i) => `
          <div class="kpi ${k.cls} reveal delay-${(i % 4) + 1}">
            <div class="kpi-num">${k.value}</div>
            <div class="kpi-label">${k.label}</div>
          </div>`).join('')}
      </div>

      <div class="grid grid-2 mb-5">
        <div class="glass chart-card reveal">
          <h3 style="font-size:16px">🛡️ Safety score breakdown</h3>
          <canvas id="scoreChart" style="margin-top:14px"></canvas>
        </div>
        <div class="glass chart-card reveal delay-1">
          <h3 style="font-size:16px">📈 Mood trend (last 14 days)</h3>
          <canvas id="moodTrendChart" style="margin-top:14px"></canvas>
        </div>
      </div>

      <div class="grid grid-2 mb-5">
        <div class="glass chart-card reveal">
          <h3 style="font-size:16px">🧭 Journeys completed (per week)</h3>
          <canvas id="journeyChart" style="margin-top:14px"></canvas>
        </div>
        <div class="glass chart-card reveal delay-1">
          <h3 style="font-size:16px">📊 Activity distribution</h3>
          <canvas id="activityChart" style="margin-top:14px"></canvas>
        </div>
      </div>

      <div class="grid grid-2 mb-5">
        <div class="glass chart-card reveal">
          <h3 style="font-size:16px">🏆 Achievement progress</h3>
          <div class="mt-3">
            ${achievements.map(a => {
              const unlocked = state.unlockedAchievements.includes(a.id);
              const prog = unlocked ? 100 : Math.round((a.progress(stats) / (a.id === 'safety-sentinel' ? 7 : 1)) * 100);
              return `
                <div style="margin-bottom:14px">
                  <div class="flex justify-between mb-2"><span style="font-weight:600;font-size:14px">${a.icon} ${a.title}</span><span class="muted" style="font-size:13px">${unlocked ? '✓ Unlocked' : prog + '%'}</span></div>
                  <div class="progress"><span style="width:${unlocked ? 100 : prog}%;background:${unlocked ? 'var(--yellow-400)' : 'linear-gradient(90deg,var(--blue-400),var(--green-400))'}"></span></div>
                </div>`;
            }).join('')}
          </div>
        </div>
        <div class="glass chart-card reveal delay-1">
          <h3 style="font-size:16px">🎯 Weekly progress</h3>
          <canvas id="weeklyChart" style="margin-top:14px"></canvas>
          <div class="text-center mt-3">
            <div style="font-family:var(--font-display);font-weight:700;font-size:32px;color:var(--green-600)">${stats.weeklyProgress}%</div>
            <div class="muted">toward your weekly goal</div>
          </div>
        </div>
      </div>

      <div class="glass reveal">
        <h3 style="font-size:18px">📋 Summary report</h3>
        <div class="grid grid-4 mt-3">
          ${summaryItems(stats, state).map(s => `
            <div style="padding:16px;border-radius:12px;background:var(--surface-soft);text-align:center">
              <div style="font-size:24px">${s.icon}</div>
              <div style="font-family:var(--font-display);font-weight:700;font-size:22px;color:${s.color};margin-top:6px">${s.value}</div>
              <div class="muted" style="font-size:13px;font-weight:600">${s.label}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  `;

  // build charts after DOM
  setTimeout(() => buildCharts(page, stats, state), 60);
}

function kpis(stats, state) {
  return [
    { cls: 'kpi-blue', value: stats.score, label: 'Safety score' },
    { cls: 'kpi-green', value: stats.journeysCompleted, label: 'Journeys completed' },
    { cls: 'kpi-yellow', value: stats.journeyStreak, label: 'Day streak' },
    { cls: 'kpi-coral', value: state.unlockedAchievements.length, label: 'Badges unlocked' },
  ];
}

function summaryItems(stats, state) {
  return [
    { icon: '🚸', value: stats.journeysCompleted, label: 'Total journeys', color: 'var(--blue-600)' },
    { icon: '📝', value: stats.quizzesCompleted, label: 'Quizzes done', color: 'var(--green-600)' },
    { icon: '🛡️', value: stats.reportsSubmitted, label: 'Reports submitted', color: 'var(--coral-600)' },
    { icon: '🌬️', value: stats.breathingMinutes, label: 'Breathing minutes', color: '#b07a00' },
    { icon: '💬', value: stats.safebuddyChats, label: 'SafeBuddy chats', color: 'var(--blue-600)' },
    { icon: '📅', value: state.moodCheckIns || 0, label: 'Mood check-ins', color: 'var(--green-600)' },
    { icon: '🎯', value: stats.missionsDone, label: "Today's missions", color: '#b07a00' },
    { icon: '📓', value: (state.journal || []).length, label: 'Journal entries', color: 'var(--coral-600)' },
  ];
}

function buildCharts(page, stats, state) {
  // safety score breakdown (radar)
  const scoreCtx = page.querySelector('#scoreChart');
  if (scoreCtx) {
    charts.push(new Chart(scoreCtx, {
      type: 'radar',
      data: {
        labels: safetyScoreFactors.map(f => f.label),
        datasets: [{
          label: 'Score',
          data: safetyScoreFactors.map(f => f.getValue(stats)),
          backgroundColor: 'rgba(31,139,255,0.2)',
          borderColor: '#1f8bff',
          pointBackgroundColor: '#1f8bff',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { r: { beginAtZero: true, max: 30, ticks: { display: false } } },
      },
    }));
  }

  // mood trend (line, 14 days)
  const moodCtx = page.querySelector('#moodTrendChart');
  if (moodCtx) {
    const moods14 = (state.moods || []).filter(m => Date.now() - m.date <= 14 * 86400000).sort((a, b) => a.date - b.date);
    // group by day, average
    const byDay = {};
    moods14.forEach(m => { const k = new Date(m.date).toDateString(); byDay[k] = byDay[k] || []; byDay[k].push(m.score); });
    const days = []; const labels = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toDateString();
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      days.push(byDay[k] ? (byDay[k].reduce((a, b) => a + b, 0) / byDay[k].length) : null);
    }
    charts.push(new Chart(moodCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Mood score',
          data: days,
          borderColor: '#16b85f',
          backgroundColor: 'rgba(22,184,95,0.15)',
          fill: true, tension: 0.4, spanGaps: true,
          pointBackgroundColor: '#16b85f', pointRadius: 4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } },
      },
    }));
  }

  // journeys per week (bar)
  const journeyCtx = page.querySelector('#journeyChart');
  if (journeyCtx) {
    const weeks = [0, 0, 0, 0];
    (state.journeys || []).filter(j => j.completed).forEach(j => {
      const w = Math.floor((Date.now() - j.date) / (7 * 86400000));
      if (w >= 0 && w < 4) weeks[3 - w]++;
    });
    charts.push(new Chart(journeyCtx, {
      type: 'bar',
      data: {
        labels: ['3 weeks ago', '2 weeks ago', 'Last week', 'This week'],
        datasets: [{ label: 'Journeys', data: weeks, backgroundColor: ['#7cc0ff', '#48a6ff', '#1f8bff', '#16b85f'], borderRadius: 8 }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } },
    }));
  }

  // activity distribution (doughnut)
  const actCtx = page.querySelector('#activityChart');
  if (actCtx) {
    const counts = { Journey: 0, Mood: 0, Learning: 0, Community: 0, Wellness: 0, Other: 0 };
    (state.activities || []).forEach(a => {
      const t = a.title.toLowerCase();
      if (t.includes('journey')) counts.Journey++;
      else if (t.includes('mood')) counts.Mood++;
      else if (t.includes('quiz') || t.includes('learn') || t.includes('game')) counts.Learning++;
      else if (t.includes('report') || t.includes('hazard')) counts.Community++;
      else if (t.includes('breath') || t.includes('journal')) counts.Wellness++;
      else counts.Other++;
    });
    charts.push(new Chart(actCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(counts),
        datasets: [{ data: Object.values(counts), backgroundColor: ['#1f8bff', '#16b85f', '#ffc11f', '#ff6f5e', '#7cc0ff', '#cbd5e1'], borderWidth: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
    }));
  }

  // weekly progress (bar)
  const weeklyCtx = page.querySelector('#weeklyChart');
  if (weeklyCtx) {
    charts.push(new Chart(weeklyCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Progress',
          data: [60, 75, 50, 80, stats.weeklyProgress, 40, 30],
          backgroundColor: ['#48a6ff', '#48a6ff', '#48a6ff', '#48a6ff', '#16b85f', '#48a6ff', '#48a6ff'],
          borderRadius: 8,
        }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } },
    }));
  }
}
