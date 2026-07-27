// ===== Settings page =====
import { store } from './utils.js';
import { defaultSettings } from './dat.js';

export function renderSettings(page, ctx) {
  const state = store.get();
  const settings = state.settings || { ...defaultSettings };

  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">Customize your experience</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">Settings</h2>
        <p style="margin:0">Control notifications, safety features, and personal preferences. All settings stay on your device.</p>
      </div>

      <div class="glass reveal mb-5">
        <h3 style="font-size:18px">🔔 Notifications & alerts</h3>
        <div class="mt-3">
          ${toggleRow('notifications', 'Daily safety tips notifications', settings.notifications)}
          ${toggleRow('dailyTips', 'Show a new safety tip each day', settings.dailyTips)}
          ${toggleRow('moodReminders', 'Remind me to check in my mood', settings.moodReminders)}
        </div>
      </div>

      <div class="glass reveal mb-5">
        <h3 style="font-size:18px">🛡️ Safety features</h3>
        <div class="mt-3">
          ${toggleRow('sosLocationShare', 'Share my location when I press SOS', settings.sosLocationShare)}
          ${toggleRow('safeBuddyAuto', 'SafeBuddy auto-suggests emergency help', settings.safeBuddyAuto)}
          ${toggleRow('animations', 'Enable animations & effects', settings.animations)}
        </div>
      </div>

      <div class="glass reveal mb-5">
        <h3 style="font-size:18px">🎨 Appearance</h3>
        <div class="field mt-3">
          <label>Theme</label>
          <select id="themeSelect" class="select">
            <option value="soft" ${settings.theme === 'soft' ? 'selected' : ''}>Soft Blue-Green (default)</option>
            <option value="bright" ${settings.theme === 'bright' ? 'selected' : ''}>Bright Daylight</option>
            <option value="calm" ${settings.theme === 'calm' ? 'selected' : ''}>Calm Mint</option>
          </select>
        </div>
        <div class="muted" style="font-size:13px;margin-top:8px">More themes coming soon.</div>
      </div>

      <div class="glass reveal mb-5">
        <h3 style="font-size:18px">ℹ️ About</h3>
        <div class="mt-3">
          <div class="info-row"><span class="ir-label">App name</span><span class="ir-val">Student Safety AI</span></div>
          <div class="info-row"><span class="ir-label">Version</span><span class="ir-val">1.0.0</span></div>
          <div class="info-row"><span class="ir-label">Built with</span><span class="ir-val">HTML5, CSS3, JavaScript</span></div>
          <div class="info-row"><span class="ir-label">Data storage</span><span class="ir-val">LocalStorage (on this device)</span></div>
        </div>
      </div>

      <div class="glass reveal">
        <h3 style="font-size:18px">💾 Data management</h3>
        <p class="muted mt-2">All your data lives only on this device in your browser's LocalStorage. Clearing your browser data will erase it.</p>
        <div class="flex gap-3 wrap mt-3">
          <button class="btn btn-ghost" id="exportData">📤 Export my data</button>
          <button class="btn btn-coral" id="resetData">🗑️ Reset all data</button>
        </div>
      </div>
    </div>
  `;

  // toggles
  page.querySelectorAll('.toggle').forEach(t => {
    t.addEventListener('click', () => {
      const key = t.dataset.key;
      t.classList.toggle('on');
      store.update(s => { s.settings = s.settings || {}; s.settings[key] = t.classList.contains('on'); });
    });
  });

  page.querySelector('#themeSelect').addEventListener('change', (e) => {
    store.update(s => { s.settings = s.settings || {}; s.settings.theme = e.target.value; });
    applyTheme(e.target.value);
  });

  page.querySelector('#exportData').addEventListener('click', () => {
    const data = JSON.stringify(store.get(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'student-safety-ai-data.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  page.querySelector('#resetData').addEventListener('click', () => {
    if (confirm('This will erase ALL your data. Are you sure?')) {
      localStorage.removeItem('ssa_state_v1');
      location.hash = '#/'; location.reload();
    }
  });

  applyTheme(settings.theme);
}

function toggleRow(key, label, on) {
  return `
    <div class="toggle-row">
      <span style="font-weight:600;color:var(--text)">${label}</span>
      <div class="toggle ${on ? 'on' : ''}" data-key="${key}"></div>
    </div>`;
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'bright') {
    root.style.setProperty('--bg', 'linear-gradient(180deg, #e0f2ff 0%, #f0faff 50%, #e8fff0 100%)');
  } else if (theme === 'calm') {
    root.style.setProperty('--bg', 'linear-gradient(180deg, #e8fff5 0%, #f0fff8 50%, #eaf8ff 100%)');
  } else {
    root.style.setProperty('--bg', 'linear-gradient(180deg, #eaf4ff 0%, #f4fbff 40%, #effff5 100%)');
  }
}
