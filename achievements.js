// ===== Achievements page =====
import { store, computeStats } from './utils.js';
import { achievements } from './dat.js';

export function renderAchievements(page, ctx) {
  const state = store.get();
  const stats = computeStats(state);
  const unlocked = state.unlockedAchievements || [];
  const unlockedCount = unlocked.length;
  const pct = Math.round((unlockedCount / achievements.length) * 100);

  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">Celebrate your safety journey</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">Achievements</h2>
        <p style="margin:0">Unlock badges by making safe choices every day. Every achievement is a real step toward becoming a Safety Sentinel.</p>
      </div>

      <div class="glass reveal mb-5" style="background:linear-gradient(135deg,var(--yellow-50),#fff);border-color:var(--yellow-200)">
        <div class="flex items-center justify-between wrap gap-4">
          <div>
            <h3 style="font-size:22px;color:#b07a00">🏆 Your collection</h3>
            <p class="muted mt-2">You've unlocked <strong style="color:#b07a00">${unlockedCount}</strong> of <strong>${achievements.length}</strong> achievements.</p>
          </div>
          <div style="min-width:200px">
            <div class="flex justify-between mb-2"><span class="muted" style="font-size:13px;font-weight:600">Overall progress</span><span style="font-weight:700;color:#b07a00">${pct}%</span></div>
            <div class="progress" style="height:14px"><span style="width:${pct}%;background:linear-gradient(90deg,var(--yellow-300),var(--yellow-400))"></span></div>
          </div>
        </div>
      </div>

      <div class="achievement-grid">
        ${achievements.map((a, i) => {
          const isUnlocked = unlocked.includes(a.id);
          const maxVal = a.id === 'safety-sentinel' ? 7 : a.id === 'calm-breeze' ? 2 : a.id === 'road-master' ? 100 : 1;
          const prog = isUnlocked ? 100 : Math.round((a.progress(stats) / maxVal) * 100);
          return `
          <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'} reveal delay-${(i % 4) + 1}">
            <div class="ach-badge ${isUnlocked ? 'badge-glow' : ''}">${a.icon}</div>
            <div class="ach-title">${a.title}</div>
            <div class="ach-desc">${a.desc}</div>
            <div class="ach-progress"><div class="progress"><span style="width:${isUnlocked ? 100 : prog}%;background:${isUnlocked ? 'var(--yellow-400)' : 'linear-gradient(90deg,var(--blue-400),var(--green-400))'}"></span></div></div>
            <div class="mt-3">${isUnlocked ? '<span class="pill pill-yellow" style="font-size:11px">✓ UNLOCKED</span>' : '<span class="pill pill-blue" style="font-size:11px">' + (a.progress(stats) + '/' + maxVal) + '</span>'}</div>
          </div>`;
        }).join('')}
      </div>

      <div class="glass reveal mt-5 text-center" style="background:linear-gradient(135deg,rgba(31,139,255,0.92),rgba(22,184,95,0.88));color:#fff;border:0">
        <h3 style="color:#fff;font-size:22px">Keep going, ${state.profile?.name || 'student'}!</h3>
        <p style="color:rgba(255,255,255,0.9);margin-top:8px">Every safe choice brings you closer to becoming a true Safety Sentinel. Start a journey, take a quiz, or talk to SafeBuddy to earn your next badge.</p>
        <div class="flex gap-3 justify-center wrap mt-4">
          <a href="#/journey" data-link class="btn btn-yellow">Start a journey</a>
          <a href="#/learning" data-link class="btn" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.4)">Take a quiz</a>
          <button class="btn" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.4)" id="testUnlock">Test unlock next badge</button>
        </div>
      </div>
    </div>
  `;

  page.querySelector('#testUnlock')?.addEventListener('click', () => {
    const fresh = store.get();
    const freshStats = computeStats(fresh);
    const next = achievements.find(a => !fresh.unlockedAchievements.includes(a.id));
    if (!next) { alert('You already unlocked all achievements. Amazing!'); return; }
    // force-fulfill the requirement for this badge, then check
    store.update(s => {
      if (next.id === 'safe-explorer') { s.journeys = s.journeys || []; s.journeys.unshift({ date: Date.now(), duration: 600, route: 'Home → School', progress: 100, completed: true }); addActivity(s, { icon: '🧭', color: 'green', title: 'Completed a safe school journey!' }); }
      else if (next.id === 'road-master') { s.quizScores = s.quizScores || { road: [], signs: [], defence: [] }; s.quizScores.road = s.quizScores.road || []; s.quizScores.road.push(100); addActivity(s, { icon: '🚦', color: 'yellow', title: 'Scored 100% in the Traffic Signs Quiz!' }); }
      else if (next.id === 'safebuddy-pal') { s.safebuddyChats = (s.safebuddyChats || 0) + 1; addActivity(s, { icon: '💬', color: 'blue', title: 'Shared feelings with SafeBuddy AI' }); }
      else if (next.id === 'guardian-angel') { s.reports = s.reports || []; s.reports.unshift({ id: 'r-test-' + Date.now(), category: 'broken-road', desc: 'Test report — pothole near school.', location: 'Test Street', date: Date.now(), status: 'pending', reporter: 'self' }); addActivity(s, { icon: '🛡️', color: 'coral', title: 'Reported a community road hazard' }); }
      else if (next.id === 'calm-breeze') { s.breathingMinutes = (s.breathingMinutes || 0) + 2; addActivity(s, { icon: '🌬️', color: 'green', title: 'Completed a 2-minute breathing exercise' }); }
      else if (next.id === 'safety-sentinel') { for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); s.journeys = s.journeys || []; s.journeys.unshift({ date: d.getTime(), duration: 600, route: 'Home → School', progress: 100, completed: true }); } addActivity(s, { icon: '⭐', color: 'yellow', title: 'Maintained a 7-day safe journey streak!' }); }
    });
    const updated = store.get();
    const updatedStats = computeStats(updated);
    checkAchievements(updated, updatedStats);
    // re-render
    setTimeout(() => renderAchievements(page, ctx), 800);
  });
}
