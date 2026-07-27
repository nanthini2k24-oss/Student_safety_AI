// ===== Student Safety AI — Main orchestrator =====
import { store, computeStats, attachRipple, initReveal, checkAchievements } from './utils.js';
import { defaultProfile, defaultSettings, dailyMissions, liveAlerts } from './dat.js';
import { renderHome } from './home.js';
import { renderDashboard } from './dashboard.js';
import { renderMap } from './map.js';
import { renderBus } from './bus.js';
import { renderJourney } from './journey.js';
import { renderSafeBuddy } from './safebuddy.js';
import { renderMood } from './mood.js';
import { renderWellness } from './wellness.js';
import { renderSelfDefence } from './selfdefence.js';
import { renderLearning } from './learning.js';
import { renderCommunity } from './community.js';
import { renderEmergency } from './emergency.js';
import { renderAnalytics } from './analytics.js';
import { renderAchievements } from './achievements.js';
import { renderProfile } from './profile.js';
import { renderSettings } from './settings.js';

const routes = {
  '/': renderHome,
  '/dashboard': renderDashboard,
  '/map': renderMap,
  '/bus': renderBus,
  '/journey': renderJourney,
  '/safebuddy': renderSafeBuddy,
  '/mood': renderMood,
  '/wellness': renderWellness,
  '/selfdefence': renderSelfDefence,
  '/learning': renderLearning,
  '/community': renderCommunity,
  '/emergency': renderEmergency,
  '/analytics': renderAnalytics,
  '/achievements': renderAchievements,
  '/profile': renderProfile,
  '/settings': renderSettings,
};

// ===== Boot =====
function boot() {
  const state = store.init();
  if (!state.profile) { state.profile = { ...defaultProfile }; store.set(state); }
  if (!state.settings) { state.settings = { ...defaultSettings }; store.set(state); }
  if (!state.reports || !state.reports.length) {
    import('./dat.js').then(({ communitySeedReports }) => {
      store.update(s => { s.reports = [...communitySeedReports]; });
    });
  }
  // seed today's missions if none
  const tk = new Date().toDateString();
  if (!state.missions[tk]) {
    store.update(s => {
      const todays = [...dailyMissions].sort(() => Math.random() - 0.5).slice(0, 4);
      s.missions[tk] = todays.map(() => false);
      s._todayMissions = todays;
    });
  }

  setupCursor();
  setupNavbar();
  setupRipples();
  setupSOS();
  window.addEventListener('hashchange', router);
  router();

  // hide loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1600);

  // periodic achievement check
  const stats = computeStats(store.get());
  checkAchievements(store.get(), stats);
}

// ===== Router =====
function router() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const render = routes[hash] || routes['/'];
  const page = document.getElementById('page');
  // page transition
  page.classList.add('page-enter');
  page.innerHTML = '';
  requestAnimationFrame(() => {
    page.classList.add('page-enter-active');
    render(page, { store, computeStats, checkAchievements });
    setTimeout(() => {
      page.classList.remove('page-enter');
      page.classList.add('page-enter-done');
      setTimeout(() => { page.classList.remove('page-enter-active', 'page-enter-done'); }, 600);
    }, 20);
    // active nav link
    document.querySelectorAll('.nav-menu a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === location.hash || (a.getAttribute('href') === '#/' && (location.hash === '' || location.hash === '#/')));
    });
    // close mobile menu
    document.getElementById('navMenu')?.classList.remove('open');
    document.getElementById('navToggle')?.classList.remove('open');
    // re-init reveal + ripples on new content
    initReveal();
    document.querySelectorAll('.btn, .quick-action, .bus-card, .technique-card, .cat-chip, .topic, .mood-emoji, .sign-card, .quiz-option, .mission-check').forEach(attachRipple);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Custom cursor =====
function setupCursor() {
  if (window.matchMedia('(max-width: 900px)').matches) return;
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`; });
  function loop() {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    if (cursor) cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .quick-action, .bus-card, .technique-card, .cat-chip, .topic, .mood-emoji, .sign-card, .quiz-option, input, textarea, select')) {
      cursor?.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .quick-action, .bus-card, .technique-card, .cat-chip, .topic, .mood-emoji, .sign-card, .quiz-option, input, textarea, select')) {
      cursor?.classList.remove('hover');
    }
  });
}

// ===== Navbar =====
function setupNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });
  document.querySelectorAll('[data-link]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      if (location.hash === href) return;
      location.hash = href;
    });
  });
}

// ===== Ripple for all existing buttons =====
function setupRipples() {
  document.querySelectorAll('.btn, .sos-btn').forEach(attachRipple);
}

// ===== SOS =====
function setupSOS() {
  const btn = document.getElementById('sosBtn');
  btn.addEventListener('click', () => {
    import('./emergency.js').then(({ openSOSModal }) => openSOSModal());
  });
}

// expose for pages
window.__ssa = { store, computeStats, checkAchievements, attachRipple, initReveal, liveAlerts };

document.addEventListener('DOMContentLoaded', boot);
