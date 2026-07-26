// ===== Self Defence Academy =====
import { store, addActivity, checkAchievements, computeStats, confetti } from '../utils.js';
import { selfDefenceTechniques, selfDefenceQuiz } from '../dat.js';

let activeTech = 0;
let activeStep = 0;
let stepTimer = null;

export function renderSelfDefence(page, ctx) {
  const state = store.get();
  const progress = state.selfDefenceProgress || {};

  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:16px">
        <span class="eyebrow">Escape-focused self defence</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">Girls Safety Self Defence Academy</h2>
        <p style="margin:0">Learn step-by-step techniques with animated guides. The focus is always on <strong>escaping danger, protecting yourself, seeking help, and reaching a safe place</strong> — never on fighting.</p>
      </div>

      <div class="glass reveal mb-4" style="background:linear-gradient(135deg,#fff5f3,#fff);border-color:var(--coral-300)">
        <div class="flex items-center gap-3">
          <span style="font-size:32px">🛡️</span>
          <div>
            <strong style="color:var(--coral-600)">Remember: Your goal is always to escape.</strong>
            <div class="muted" style="font-size:14px">These techniques create the seconds you need to run to a safe, crowded place and tell a trusted adult. You are never in trouble for protecting yourself.</div>
          </div>
        </div>
      </div>

      <div class="glass reveal mb-4">
        <h3 style="font-size:16px;margin-bottom:12px">Choose a technique</h3>
        <div class="technique-list" id="techList">
          ${selfDefenceTechniques.map((t, i) => {
            const done = progress[t.id] === 'done';
            return `
            <div class="technique-card ${i === 0 ? 'selected' : ''}" data-tech="${i}">
              <div class="tc-num">Lesson ${i + 1}</div>
              <div class="tc-title">${t.icon} ${t.title}</div>
              <div class="muted" style="font-size:12px;margin-top:4px">Focus: ${t.focus}</div>
              <div class="tc-progress"><div class="progress"><span style="width:${done ? 100 : 0}%;background:${done ? 'var(--green-500)' : 'var(--blue-400)'}"></span></div></div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div id="techStage" class="reveal delay-1"></div>

      <div class="glass reveal mt-5" id="quizSection">
        <div class="flex items-center justify-between wrap gap-3 mb-3">
          <h3 style="font-size:20px">🧠 Self-defence knowledge quiz</h3>
          <span class="pill pill-coral">Escape-first mindset</span>
        </div>
        <p class="muted">Test your understanding. Remember: every answer should prioritize getting to safety.</p>
        <div id="quizBox" class="quiz-box mt-3"></div>
      </div>
    </div>
  `;

  page.querySelectorAll('.technique-card').forEach(card => {
    card.addEventListener('click', () => {
      activeTech = parseInt(card.dataset.tech, 10);
      activeStep = 0;
      page.querySelectorAll('.technique-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      renderTechnique(page, ctx);
    });
  });

  renderTechnique(page, ctx);
  renderQuiz(page, ctx);
}

function renderTechnique(page, ctx) {
  const tech = selfDefenceTechniques[activeTech];
  const progress = store.get().selfDefenceProgress || {};
  const stage = page.querySelector('#techStage');
  stage.innerHTML = `
    <div class="glass technique-stage">
      <div class="flex items-center justify-between wrap gap-3 mb-3">
        <div>
          <span class="pill pill-coral">Lesson ${activeTech + 1} of ${selfDefenceTechniques.length}</span>
          <h3 style="font-size:22px;margin-top:8px">${tech.icon} ${tech.title}</h3>
          <p class="muted" style="font-size:14px;margin-top:4px">Focus: ${tech.focus}</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-ghost" id="replayBtn">↺ Replay</button>
          <button class="btn btn-sm btn-green" id="markLearned">Mark as learned</button>
        </div>
      </div>

      <p style="color:var(--text-soft);font-size:15px">${tech.desc}</p>

      <div class="step-list" id="stepList">
        ${tech.steps.map((s, i) => `<div class="step-pill ${i === 0 ? 'active' : ''}" data-step="${i}">Step ${i + 1}</div>`).join('')}
      </div>

      <div class="figure-stage" id="figureStage">
        ${renderSkeleton(tech, 0)}
      </div>

      <div class="glass-soft mt-3" style="padding:16px;border-radius:12px" id="stepText">
        <strong>Step 1:</strong> ${tech.steps[0]}
      </div>

      <div class="flex gap-3 wrap mt-4">
        <button class="btn btn-green" id="playSteps">▶ Play all steps</button>
        <button class="btn btn-ghost" id="prevStep">← Previous</button>
        <button class="btn btn-ghost" id="nextStep">Next →</button>
      </div>
    </div>
  `;

  activeStep = 0;
  page.querySelector('#replayBtn').addEventListener('click', () => { activeStep = 0; updateStep(page, tech); });
  page.querySelector('#playSteps').addEventListener('click', () => playSteps(page, ctx, tech));
  page.querySelector('#prevStep').addEventListener('click', () => { if (activeStep > 0) { activeStep--; updateStep(page, tech); } });
  page.querySelector('#nextStep').addEventListener('click', () => { if (activeStep < tech.steps.length - 1) { activeStep++; updateStep(page, tech); } else { markLearned(page, ctx, tech); } });
  page.querySelector('#markLearned').addEventListener('click', () => markLearned(page, ctx, tech));
}

function renderSkeleton(tech, stepIdx) {
  // pose varies by technique and step
  const pose = getPose(tech.id, stepIdx);
  const arrow = tech.arrows[0] || { x: '50%', y: '20%', dir: '↑', label: '' };
  return `
    <div class="skeleton" style="transform:translateX(-50%) scale(${pose.scale || 1})">
      <div class="skeleton-head"></div>
      <div class="skeleton-body"></div>
      <div class="skeleton-arm skeleton-arm-left" style="transform:rotate(${pose.leftArm}deg);transition:transform 0.6s var(--ease)"></div>
      <div class="skeleton-arm skeleton-arm-right" style="transform:rotate(${pose.rightArm}deg);transition:transform 0.6s var(--ease)"></div>
      <div class="skeleton-leg skeleton-leg-left" style="transform:rotate(${pose.leftLeg}deg);transition:transform 0.6s var(--ease)"></div>
      <div class="skeleton-leg skeleton-leg-right" style="transform:rotate(${pose.rightLeg}deg);transition:transform 0.6s var(--ease)"></div>
    </div>
    <div class="arrow" style="left:${arrow.x};top:${arrow.y}">${arrow.dir}</div>
    <div style="position:absolute;top:14px;left:14px;background:var(--surface-strong);padding:8px 14px;border-radius:var(--r-pill);font-weight:700;font-size:14px;color:var(--coral-600)">${arrow.label}</div>
    <div style="position:absolute;bottom:14px;right:14px;background:var(--surface-strong);padding:8px 14px;border-radius:var(--r-pill);font-weight:600;font-size:13px;color:var(--text-soft)">Step ${stepIdx + 1}/${tech.steps.length}</div>
  `;
}

function getPose(techId, step) {
  // simple poses — each step moves the figure
  const poses = {
    ready: [
      { leftArm: 30, rightArm: -30, leftLeg: -10, rightLeg: 10 },
      { leftArm: 30, rightArm: -30, leftLeg: -10, rightLeg: 10 },
      { leftArm: 25, rightArm: -25, leftLeg: -8, rightLeg: 8 },
      { leftArm: 30, rightArm: -30, leftLeg: -10, rightLeg: 10 },
    ],
    wrist: [
      { leftArm: 90, rightArm: -20, leftLeg: 0, rightLeg: 0 },
      { leftArm: 110, rightArm: -10, leftLeg: -5, rightLeg: 5 },
      { leftArm: 130, rightArm: 10, leftLeg: -20, rightLeg: 20, scale: 0.95 },
      { leftArm: 60, rightArm: -40, leftLeg: -25, rightLeg: 25, scale: 0.9 },
    ],
    palm: [
      { leftArm: 40, rightArm: -40, leftLeg: 0, rightLeg: 0 },
      { leftArm: 40, rightArm: -70, leftLeg: 5, rightLeg: -5 },
      { leftArm: 30, rightArm: -90, leftLeg: 10, rightLeg: -10 },
      { leftArm: 20, rightArm: -60, leftLeg: -20, rightLeg: 20, scale: 0.95 },
    ],
    elbow: [
      { leftArm: 40, rightArm: -40, leftLeg: 0, rightLeg: 0 },
      { leftArm: 70, rightArm: -70, leftLeg: 5, rightLeg: -5 },
      { leftArm: 90, rightArm: -90, leftLeg: 10, rightLeg: -10 },
      { leftArm: 50, rightArm: -50, leftLeg: -25, rightLeg: 25, scale: 0.92 },
    ],
    knee: [
      { leftArm: 30, rightArm: -30, leftLeg: 0, rightLeg: 0 },
      { leftArm: 60, rightArm: -60, leftLeg: 0, rightLeg: 0 },
      { leftArm: 70, rightArm: -70, leftLeg: -45, rightLeg: 10 },
      { leftArm: 40, rightArm: -40, leftLeg: -10, rightLeg: 30, scale: 0.95 },
    ],
    bag: [
      { leftArm: 50, rightArm: -50, leftLeg: 0, rightLeg: 0 },
      { leftArm: 30, rightArm: -30, leftLeg: 0, rightLeg: 0 },
      { leftArm: 20, rightArm: -20, leftLeg: -5, rightLeg: 5 },
      { leftArm: 10, rightArm: -10, leftLeg: -20, rightLeg: 20, scale: 0.95 },
    ],
    voice: [
      { leftArm: 60, rightArm: -60, leftLeg: 0, rightLeg: 0 },
      { leftArm: 80, rightArm: -80, leftLeg: 5, rightLeg: -5 },
      { leftArm: 100, rightArm: -100, leftLeg: 10, rightLeg: -10 },
      { leftArm: 70, rightArm: -70, leftLeg: 0, rightLeg: 0 },
    ],
    escape: [
      { leftArm: 60, rightArm: -60, leftLeg: -10, rightLeg: 10 },
      { leftArm: 70, rightArm: -70, leftLeg: -25, rightLeg: 25, scale: 1.05 },
      { leftArm: 80, rightArm: -80, leftLeg: -40, rightLeg: 40, scale: 1.1 },
      { leftArm: 90, rightArm: -90, leftLeg: -50, rightLeg: 50, scale: 1.15 },
    ],
    stranger: [
      { leftArm: 30, rightArm: -30, leftLeg: 0, rightLeg: 0 },
      { leftArm: 40, rightArm: -40, leftLeg: -5, rightLeg: 5 },
      { leftArm: 50, rightArm: -50, leftLeg: -10, rightLeg: 10 },
      { leftArm: 60, rightArm: -60, leftLeg: -20, rightLeg: 20, scale: 0.95 },
    ],
    emergency: [
      { leftArm: 90, rightArm: -30, leftLeg: 0, rightLeg: 0 },
      { leftArm: 100, rightArm: -30, leftLeg: -5, rightLeg: 5 },
      { leftArm: 110, rightArm: -40, leftLeg: -10, rightLeg: 10 },
      { leftArm: 90, rightArm: -30, leftLeg: 0, rightLeg: 0 },
    ],
  };
  return (poses[techId] || poses.ready)[step] || poses.ready[0];
}

function updateStep(page, tech) {
  page.querySelectorAll('.step-pill').forEach((p, i) => {
    p.classList.toggle('active', i === activeStep);
    p.classList.toggle('done', i < activeStep);
  });
  page.querySelector('#figureStage').innerHTML = renderSkeleton(tech, activeStep);
  page.querySelector('#stepText').innerHTML = `<strong>Step ${activeStep + 1}:</strong> ${tech.steps[activeStep]}`;
}

function playSteps(page, ctx, tech) {
  if (stepTimer) clearInterval(stepTimer);
  activeStep = 0;
  updateStep(page, tech);
  stepTimer = setInterval(() => {
    activeStep++;
    if (activeStep >= tech.steps.length) {
      clearInterval(stepTimer);
      markLearned(page, ctx, tech);
      return;
    }
    updateStep(page, tech);
  }, 2200);
}

function markLearned(page, ctx, tech) {
  if (stepTimer) clearInterval(stepTimer);
  store.update(s => {
    s.selfDefenceProgress = s.selfDefenceProgress || {};
    s.selfDefenceProgress[tech.id] = 'done';
    addActivity(s, { icon: tech.icon, color: 'coral', title: `Learned technique: ${tech.title}` });
  });
  confetti(90, 0.5);
  ctx.checkAchievements(store.get(), computeStats(store.get()));
  // update technique card progress
  const cards = page.querySelectorAll('.technique-card');
  const card = cards[activeTech];
  if (card) {
    const bar = card.querySelector('.progress span');
    if (bar) { bar.style.width = '100%'; bar.style.background = 'var(--green-500)'; }
  }
  // advance suggestion
  const stage = page.querySelector('#techStage');
  const msg = document.createElement('div');
  msg.className = 'glass mt-3';
  msg.style.cssText = 'text-align:center;background:linear-gradient(135deg,var(--green-50),#fff);border-color:var(--green-200);animation:slideUp 0.4s var(--ease) both';
  msg.innerHTML = `<div style="font-size:32px">✅</div><strong style="color:var(--green-600)">Great work!</strong><p class="muted mt-2">You've learned <strong>${tech.title}</strong>. Remember: the goal is always to escape to safety. ${activeTech < selfDefenceTechniques.length - 1 ? 'Try the next technique!' : 'You\'ve completed all techniques — you\'re a Safety Sentinel!'}</p>`;
  stage.appendChild(msg);
}

// ===== Quiz =====
let quizIdx = 0;
let quizScore = 0;
let quizAnswered = false;

function renderQuiz(page, ctx) {
  quizIdx = 0;
  quizScore = 0;
  showQuestion(page, ctx);
}

function showQuestion(page, ctx) {
  const q = selfDefenceQuiz[quizIdx];
  const box = page.querySelector('#quizBox');
  if (!q) {
    box.innerHTML = `
      <div class="text-center">
        <div style="font-size:48px">🎉</div>
        <h3 style="font-size:22px;margin-top:8px">Quiz complete!</h3>
        <p class="mt-2">You scored <strong style="color:var(--coral-600)">${quizScore}/${selfDefenceQuiz.length}</strong>.</p>
        <button class="btn btn-green mt-3" id="retryQuiz">Retry quiz</button>
      </div>`;
    store.update(s => {
      s.quizScores = s.quizScores || { road: [], signs: [], defence: [] };
      s.quizScores.defence = s.quizScores.defence || [];
      s.quizScores.defence.push(Math.round((quizScore / selfDefenceQuiz.length) * 100));
      addActivity(s, { icon: '🧠', color: 'coral', title: `Completed self-defence quiz: ${quizScore}/${selfDefenceQuiz.length}` });
    });
    ctx.checkAchievements(store.get(), computeStats(store.get()));
    box.querySelector('#retryQuiz').addEventListener('click', () => renderQuiz(page, ctx));
    return;
  }
  quizAnswered = false;
  box.innerHTML = `
    <div class="quiz-q">Q${quizIdx + 1}. ${q.q}</div>
    <div class="quiz-options">
      ${q.options.map((o, i) => `<button class="quiz-option" data-opt="${i}">${o}</button>`).join('')}
    </div>
    <div id="quizExplain" class="mt-3" style="display:none"></div>
    <div class="flex justify-between items-center mt-3">
      <span class="muted">Question ${quizIdx + 1} of ${selfDefenceQuiz.length}</span>
      <span class="pill pill-blue">Score: ${quizScore}</span>
    </div>`;
  box.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (quizAnswered) return;
      quizAnswered = true;
      const chosen = parseInt(btn.dataset.opt, 10);
      const correct = chosen === q.answer;
      box.querySelectorAll('.quiz-option').forEach((b, i) => {
        b.classList.add('disabled');
        if (i === q.answer) b.classList.add('correct');
        if (i === chosen && !correct) b.classList.add('wrong');
      });
      if (correct) quizScore++;
      const exp = box.querySelector('#quizExplain');
      exp.style.display = 'block';
      exp.innerHTML = `<div class="journey-reminder ${correct ? '' : 'warn'}"><div class="jr-icon" style="background:${correct ? 'var(--green-500)' : 'var(--coral-500)'}">${correct ? '✓' : 'ℹ'}</div><div>${q.explain}</div></div>`;
      setTimeout(() => { quizIdx++; showQuestion(page, ctx); }, 2400);
    });
  });
}
