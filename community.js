// ===== Community Safety Reports =====
import { store, addActivity, checkAchievements, computeStats, timeAgo, confetti } from './utils.js';
import { communityCategories } from './dat.js';

export function renderCommunity(page, ctx) {
  const state = store.get();
  const reports = state.reports || [];
  const myReports = reports.filter(r => r.reporter === 'self');

  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">Keep your community safe</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">Community Safety Reports</h2>
        <p style="margin:0">Spot a hazard on your way? Report it here so everyone can stay alert. Your reports help make every student's journey safer.</p>
      </div>

      <div class="grid grid-2 mb-5">
        <div class="glass reveal">
          <h3 style="font-size:18px">📝 Report a hazard</h3>
          <div class="report-form mt-3">
            <div>
              <label style="font-weight:700;color:var(--text-soft);font-size:14px;margin-bottom:8px;display:block">What did you spot?</label>
              <div class="cat-grid" id="catGrid">
                ${communityCategories.map(c => `<div class="cat-chip" data-cat="${c.id}"><span class="cc-icon">${c.icon}</span>${c.label}</div>`).join('')}
              </div>
            </div>
            <div class="field">
              <label>Describe what you saw</label>
              <textarea id="reportDesc" class="textarea" placeholder="e.g. A big pothole near the school gate, hard to see at night."></textarea>
            </div>
            <div class="grid grid-2 gap-3">
              <div class="field" style="margin:0">
                <label>Location</label>
                <input id="reportLocation" class="input" placeholder="e.g. Maple Street" />
              </div>
              <div class="field" style="margin:0">
                <label>Use my current location</label>
                <button class="btn btn-ghost btn-block" id="useGeo" type="button" style="height:46px">📍 Detect location</button>
              </div>
            </div>
            <button class="btn btn-green btn-block" id="submitReport">Submit report</button>
          </div>
        </div>

        <div class="glass reveal delay-1">
          <h3 style="font-size:18px">📊 Your impact</h3>
          <div class="text-center mt-3">
            <div style="font-family:var(--font-display);font-weight:700;font-size:48px;color:var(--green-600)">${myReports.length}</div>
            <div class="muted">reports you've submitted</div>
          </div>
          <div class="grid grid-2 gap-3 mt-4">
            <div class="glass-soft" style="padding:14px;border-radius:12px;text-align:center">
              <div style="font-family:var(--font-display);font-weight:700;font-size:24px;color:var(--blue-600)">${reports.length}</div>
              <div class="muted" style="font-size:13px">total in community</div>
            </div>
            <div class="glass-soft" style="padding:14px;border-radius:12px;text-align:center">
              <div style="font-family:var(--font-display);font-weight:700;font-size:24px;color:#b07a00">${reports.filter(r => r.status === 'verified').length}</div>
              <div class="muted" style="font-size:13px">verified</div>
            </div>
          </div>
          <p class="muted mt-4" style="font-size:14px">Every report you submit makes your community safer and can earn you the <strong>Guardian Angel</strong> badge.</p>
        </div>
      </div>

      <div class="glass reveal">
        <div class="flex items-center justify-between wrap gap-3 mb-3">
          <h3 style="font-size:18px">📢 Community feed</h3>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-ghost" data-filter="all">All</button>
            <button class="btn btn-sm btn-ghost" data-filter="mine">Mine</button>
            <button class="btn btn-sm btn-ghost" data-filter="verified">Verified</button>
          </div>
        </div>
        <div id="feedList"></div>
      </div>
    </div>
  `;

  let selectedCat = null;
  page.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      selectedCat = chip.dataset.cat;
      page.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  page.querySelector('#submitReport').addEventListener('click', () => {
    const desc = page.querySelector('#reportDesc').value.trim();
    const loc = page.querySelector('#reportLocation').value.trim();
    if (!selectedCat) { alert('Please choose a hazard category.'); return; }
    if (!desc) { alert('Please describe what you saw.'); return; }
    store.update(s => {
      s.reports = s.reports || [];
      s.reports.unshift({ id: 'r-' + Date.now(), category: selectedCat, desc, location: loc || 'Unspecified', date: Date.now(), status: 'pending', reporter: 'self' });
      addActivity(s, { icon: '🛡️', color: 'coral', title: `Reported a community hazard: ${communityCategories.find(c => c.id === selectedCat).label}` });
    });
    page.querySelector('#reportDesc').value = '';
    page.querySelector('#reportLocation').value = '';
    selectedCat = null;
    page.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('selected'));
    confetti(60, 0.5);
    ctx.checkAchievements(store.get(), computeStats(store.get()));
    refresh(page);
  });

  page.querySelector('#useGeo').addEventListener('click', () => {
    if (!navigator.geolocation) { alert('Geolocation is not available on this device.'); return; }
    const btn = page.querySelector('#useGeo');
    btn.textContent = '📍 Detecting...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        page.querySelector('#reportLocation').value = `Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`;
        btn.textContent = '✓ Location found';
      },
      () => { btn.textContent = '📍 Detect location'; alert('Could not get your location. Please type it instead.'); },
      { timeout: 8000 }
    );
  });

  page.querySelectorAll('[data-filter]').forEach(b => {
    b.addEventListener('click', () => refresh(page, b.dataset.filter));
  });

  refresh(page);
}

function refresh(page, filter = 'all') {
  const state = store.get();
  let reports = state.reports || [];
  if (filter === 'mine') reports = reports.filter(r => r.reporter === 'self');
  if (filter === 'verified') reports = reports.filter(r => r.status === 'verified');
  const list = page.querySelector('#feedList');
  list.innerHTML = reports.length ? reports.map(r => {
    const cat = communityCategories.find(c => c.id === r.category) || { icon: '⚠️', label: 'Hazard' };
    return `
      <div class="feed-item">
        <div class="fi-head">
          <span class="fi-cat">${cat.icon} ${cat.label}</span>
          <span class="fi-time">${timeAgo(r.date)}${r.reporter === 'self' ? ' · You' : ''}</span>
        </div>
        <div class="fi-desc">${r.desc}</div>
        <div class="fi-meta">
          <span>📍 ${r.location}</span>
          <span class="pill ${r.status === 'verified' ? 'pill-green' : 'pill-yellow'}" style="font-size:11px">${r.status === 'verified' ? '✓ Verified' : '⏳ Pending review'}</span>
        </div>
      </div>`;
  }).join('') : '<div class="empty"><div class="em-icon">📢</div>No reports to show. Be the first to report a hazard!</div>';
}
