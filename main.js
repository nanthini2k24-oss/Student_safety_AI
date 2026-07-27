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
function setupSOS() {
  const btn = document.getElementById('sosBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    import('./emergency.js').then(({ openSOSModal }) => {
      if (typeof openSOSModal === 'function') {
        openSOSModal();
      }
    });
  });
}
