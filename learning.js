// ===== Road Safety Learning =====
import { store, addActivity, checkAchievements, computeStats, confetti } from './utils.js';
import { trafficSigns, roadRules, roadSafetyQuiz } from './dat.js';

let signalTimer = null;
let gameLoop = null;
let gameScore = 0;
let gamePlayerX = 40;

export function renderLearning(page, ctx) {
  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">Learn and play</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">Road Safety Learning</h2>
        <p style="margin:0">Traffic signs, road rules, animated signals, stranger awareness, bullying awareness, safety quizzes, and a fun mini-game.</p>
      </div>

      <!-- Animated traffic signal -->
      <div class="glass reveal mb-5 text-center">
        <h3 style="font-size:18px">🚦 Animated traffic signal</h3>
        <p class="muted">Watch the signal change. Cross only on green — and always check that vehicles have stopped.</p>
        <div class="traffic-light mt-3" id="trafficLight">
          <div class="light red on"></div>
          <div class="light yellow"></div>
          <div class="light green"></div>
        </div>
        <div class="mt-3" id="signalText" style="font-weight:700;color:var(--coral-600)">STOP — red signal</div>
      </div>

      <!-- Traffic signs -->
      <div class="glass reveal mb-5">
        <h3 style="font-size:18px">🚸 Traffic signs</h3>
        <p class="muted">Tap a sign to learn its meaning.</p>
        <div class="sign-grid mt-3">
          ${trafficSigns.map((s, i) => `
            <div class="sign-card" data-sign="${i}">
              <div class="sign-shape ${s.shape === 'triangle' ? 'sign-triangle' : s.shape === 'circle' ? 'sign-circle' : s.shape === 'octagon' ? 'sign-octagon' : s.shape === 'diamond' ? 'sign-diamond' : ''}" style="background:${s.color};border:3px solid ${s.border || 'transparent'};color:${s.color === '#f04d3a' || s.color === '#16b85f' ? '#fff' : '#1e293b'};display:grid;place-items:center;font-family:var(--font-display);font-weight:700;font-size:14px">
                ${s.text || ''}
              </div>
              <div class="sign-name">${s.name}</div>
              <div class="sign-meaning">${s.meaning}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Road rules -->
      <div class="glass reveal mb-5">
        <h3 style="font-size:18px">📋 Road rules every student should know</h3>
        <div class="grid grid-2 mt-3">
          ${roadRules.map(r => `
            <div class="journey-reminder">
              <div class="jr-icon" style="background:var(--blue-500)">${r.icon}</div>
              <div><strong>${r.title}</strong> — ${r.text}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Awareness -->
      <div class="grid grid-2 mb-5">
        <div class="glass reveal" style="background:linear-gradient(135deg,#fff5f3,#fff);border-color:var(--coral-300)">
          <h3 style="font-size:18px">👁️ Stranger awareness</h3>
          <div class="mt-3">
            <div class="journey-reminder"><div class="jr-icon" style="background:var(--coral-500)">1</div><div>Keep an arm's length plus a step away from strangers.</div></div>
            <div class="journey-reminder"><div class="jr-icon" style="background:var(--coral-500)">2</div><div>Never accept gifts, food, or rides from strangers.</div></div>
            <div class="journey-reminder"><div class="jr-icon" style="background:var(--coral-500)">3</div><div>If a stranger asks for directions, do not go with them — tell an adult.</div></div>
            <div class="journey-reminder"><div class="jr-icon" style="background:var(--coral-500)">4</div><div>Trust your gut. If something feels wrong, leave and tell a trusted adult.</div></div>
          </div>
        </div>
        <div class="glass reveal delay-1" style="background:linear-gradient(135deg,var(--blue-50),#fff);border-color:var(--blue-200)">
          <h3 style="font-size:18px">🤝 Bullying awareness</h3>
          <div class="mt-3">
            <div class="journey-reminder"><div class="jr-icon" style="background:var(--blue-500)">1</div><div>Bullying is never your fault. You deserve to feel safe.</div></div>
            <div class="journey-reminder"><div class="jr-icon" style="background:var(--blue-500)">2</div><div>Stay near other people and walk away calmly if targeted.</div></div>
            <div class="journey-reminder"><div class="jr-icon" style="background:var(--blue-500)">3</div><div>Tell a trusted teacher, parent, or counsellor — do not stay silent.</div></div>
            <div class="journey-reminder"><div class="jr-icon" style="background:var(--blue-500)">4</div><div>If you see bullying, tell an adult. Bystanders can help too.</div></div>
          </div>
          <a href="#/safebuddy" data-link class="btn btn-sm btn-green mt-3">Talk to SafeBuddy about it →</a>
        </div>
      </div>

      <!-- Quiz -->
      <div class="glass reveal mb-5">
        <div class="flex items-center justify-between wrap gap-3 mb-3">
          <h3 style="font-size:20px">📝 Road safety quiz</h3>
          <span class="pill pill-blue">Score 100% to earn Road Sign Master badge</span>
        </div>
        <div id="roadQuizBox" class="quiz-box"></div>
      </div>

      <!-- Mini game -->
      <div class="glass reveal">
        <div class="flex items-center justify-between wrap gap-3 mb-3">
          <h3 style="font-size:20px">🎮 Mini-game: Safe Crossing</h3>
          <div class="flex gap-3 items-center">
            <span class="pill pill-green">Score: <strong id="gameScore">0</strong></span>
            <button class="btn btn-sm btn-green" id="startGame">Start game</button>
          </div>
        </div>
        <p class="muted">Move your character with the left/right arrow keys (or tap the sides on mobile). Avoid the obstacles and reach a high score!</p>
        <div class="game-area mt-3" id="gameArea">
          <div class="game-player" id="gamePlayer">🧒</div>
          <div class="empty" style="position:absolute;inset:0;display:grid;place-items:center"><div>Press <strong>Start game</strong> to play</div></div>
        </div>
      </div>
    </div>
  `;

  startSignal(page);
  startRoadQuiz(page, ctx);
  setupGame(page);

  page.querySelectorAll('.sign-card').forEach(card => {
    card.addEventListener('click', () => {
      const i = parseInt(card.dataset.sign, 10);
      const s = trafficSigns[i];
      import('../utils.js').then(({ showModal }) => {
        showModal(`
          <h3>${s.name}</h3>
          <p style="margin:12px 0">${s.meaning}</p>
          <div style="text-align:center;margin:16px 0">
            <div class="sign-shape ${s.shape === 'triangle' ? 'sign-triangle' : s.shape === 'circle' ? 'sign-circle' : s.shape === 'octagon' ? 'sign-octagon' : s.shape === 'diamond' ? 'sign-diamond' : ''}" style="background:${s.color};border:3px solid ${s.border || 'transparent'};color:${s.color === '#f04d3a' || s.color === '#16b85f' ? '#fff' : '#1e293b'};display:grid;place-items:center;font-family:var(--font-display);font-weight:700;width:80px;height:80px;margin:0 auto">${s.text || ''}</div>
          </div>
          <div class="modal-actions"><button class="btn btn-green" onclick="this.closest('.modal-backdrop').remove()">Got it</button></div>
        `);
      });
    });
  });
}

function startSignal(page) {
  if (signalTimer) clearInterval(signalTimer);
  const states = [
    { cls: 'red', text: 'STOP — red signal. Wait on the kerb.', color: 'var(--coral-600)' },
    { cls: 'yellow', text: 'SLOW — yellow signal. Prepare to stop.', color: '#b07a00' },
    { cls: 'green', text: 'CROSS — green signal. Still check that vehicles stopped.', color: 'var(--green-600)' },
  ];
  let idx = 0;
  function update() {
    const lights = page.querySelectorAll('#trafficLight .light');
    lights.forEach(l => l.classList.remove('on', 'red', 'yellow', 'green'));
    lights[0].classList.add('red');
    lights[1].classList.add('yellow');
    lights[2].classList.add('green');
    lights.forEach(l => l.classList.remove('on'));
    lights[idx].classList.add('on');
    const st = states[idx];
    const txt = page.querySelector('#signalText');
    txt.textContent = st.text;
    txt.style.color = st.color;
    idx = (idx + 1) % 3;
  }
  update();
  signalTimer = setInterval(update, 2500);
}

// ===== Road quiz =====
let roadIdx = 0, roadScore = 0, roadAnswered = false;
function startRoadQuiz(page, ctx) {
  roadIdx = 0; roadScore = 0;
  showRoadQuestion(page, ctx);
}
function showRoadQuestion(page, ctx) {
  const q = roadSafetyQuiz[roadIdx];
  const box = page.querySelector('#roadQuizBox');
  if (!q) {
    const pct = Math.round((roadScore / roadSafetyQuiz.length) * 100);
    box.innerHTML = `
      <div class="text-center">
        <div style="font-size:48px">🎉</div>
        <h3 style="font-size:22px;margin-top:8px">Quiz complete!</h3>
        <p class="mt-2">You scored <strong style="color:var(--blue-600)">${roadScore}/${roadSafetyQuiz.length}</strong> (${pct}%).</p>
        ${pct === 100 ? '<p style="color:var(--green-600);font-weight:700">🏆 Perfect! You earned the Road Sign Master badge!</p>' : '<p class="muted">Review the rules and try again for 100%.</p>'}
        <button class="btn btn-green mt-3" id="retryRoadQuiz">Retry quiz</button>
      </div>`;
    store.update(s => {
      s.quizScores = s.quizScores || { road: [], signs: [], defence: [] };
      s.quizScores.road = s.quizScores.road || [];
      s.quizScores.road.push(pct);
      if (pct > (s.quizScores.road.length > 1 ? Math.max(...s.quizScores.road.slice(0, -1)) : 0)) {
        // best score tracked via max
      }
      addActivity(s, { icon: '📝', color: 'blue', title: `Completed road safety quiz: ${pct}%` });
    });
    if (pct === 100) confetti(160, 0.5);
    ctx.checkAchievements(store.get(), computeStats(store.get()));
    box.querySelector('#retryRoadQuiz').addEventListener('click', () => startRoadQuiz(page, ctx));
    return;
  }
  roadAnswered = false;
  box.innerHTML = `
    <div class="quiz-q">Q${roadIdx + 1}. ${q.q}</div>
    <div class="quiz-options">
      ${q.options.map((o, i) => `<button class="quiz-option" data-opt="${i}">${o}</button>`).join('')}
    </div>
    <div id="roadExplain" class="mt-3" style="display:none"></div>
    <div class="flex justify-between items-center mt-3">
      <span class="muted">Question ${roadIdx + 1} of ${roadSafetyQuiz.length}</span>
      <span class="pill pill-blue">Score: ${roadScore}</span>
    </div>`;
  box.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (roadAnswered) return;
      roadAnswered = true;
      const chosen = parseInt(btn.dataset.opt, 10);
      const correct = chosen === q.answer;
      box.querySelectorAll('.quiz-option').forEach((b, i) => {
        b.classList.add('disabled');
        if (i === q.answer) b.classList.add('correct');
        if (i === chosen && !correct) b.classList.add('wrong');
      });
      if (correct) roadScore++;
      const exp = box.querySelector('#roadExplain');
      exp.style.display = 'block';
      exp.innerHTML = `<div class="journey-reminder ${correct ? '' : 'warn'}"><div class="jr-icon" style="background:${correct ? 'var(--green-500)' : 'var(--coral-500)'}">${correct ? '✓' : 'ℹ'}</div><div>${q.explain}</div></div>`;
      setTimeout(() => { roadIdx++; showRoadQuestion(page, ctx); }, 2400);
    });
  });
}

// ===== Mini game =====
function setupGame(page) {
  const startBtn = page.querySelector('#startGame');
  const area = page.querySelector('#gameArea');
  const player = page.querySelector('#gamePlayer');
  const scoreEl = page.querySelector('#gameScore');
  let obstacles = [];
  let running = false;

  startBtn.addEventListener('click', () => {
    if (running) return;
    running = true;
    gameScore = 0;
    gamePlayerX = 40;
    obstacles.forEach(o => o.el.remove());
    obstacles = [];
    area.querySelector('.empty')?.remove();
    player.style.left = gamePlayerX + 'px';
    scoreEl.textContent = '0';
    startBtn.disabled = true;

    function spawnObstacle() {
      if (!running) return;
      const el = document.createElement('div');
      el.className = 'game-obstacle';
      const lane = Math.random() > 0.5 ? '🚗' : '🚲';
      el.textContent = lane;
      el.style.animationDuration = (2 + Math.random() * 1.5) + 's';
      area.appendChild(el);
      obstacles.push({ el });
      setTimeout(() => { el.remove(); obstacles = obstacles.filter(o => o.el !== el); if (running) { gameScore++; scoreEl.textContent = gameScore; } }, 2600);
    }
    const spawnTimer = setInterval(spawnObstacle, 800);
    gameLoop = { spawnTimer, stop: () => { clearInterval(spawnTimer); running = false; startBtn.disabled = false; } };

    // controls
    function move(e) {
      if (!running) return;
      if (e.key === 'ArrowLeft' && gamePlayerX > 10) { gamePlayerX -= 24; player.style.left = gamePlayerX + 'px'; }
      if (e.key === 'ArrowRight' && gamePlayerX < area.clientWidth - 50) { gamePlayerX += 24; player.style.left = gamePlayerX + 'px'; }
    }
    document.addEventListener('keydown', move);
    area.addEventListener('click', (ev) => {
      if (!running) return;
      const rect = area.getBoundingClientRect();
      if (ev.clientX - rect.left < rect.width / 2) { if (gamePlayerX > 10) { gamePlayerX -= 24; player.style.left = gamePlayerX + 'px'; } }
      else { if (gamePlayerX < area.clientWidth - 50) { gamePlayerX += 24; player.style.left = gamePlayerX + 'px'; } }
    });

    // collision check
    const collideTimer = setInterval(() => {
      if (!running) return;
      const pr = player.getBoundingClientRect();
      obstacles.forEach(o => {
        const or = o.el.getBoundingClientRect();
        if (Math.abs(pr.left - or.left) < 30 && Math.abs(pr.bottom - or.bottom) < 30) {
          running = false;
          clearInterval(spawnTimer);
          clearInterval(collideTimer);
          gameLoop.stop();
          import('../utils.js').then(({ showModal }) => {
            showModal(`<h3>Game over!</h3><p style="margin:12px 0">You scored <strong>${gameScore}</strong>. Nice reflexes!</p><p class="muted">Remember: in real life, look both ways and cross only when it's safe.</p><div class="modal-actions"><button class="btn btn-green" onclick="this.closest('.modal-backdrop').remove()">Play again</button></div>`);
          });
          document.removeEventListener('keydown', move);
          store.update(s => addActivity(s, { icon: '🎮', color: 'yellow', title: `Played Safe Crossing game — score ${gameScore}` }));
        }
      });
    }, 100);
  });
}
