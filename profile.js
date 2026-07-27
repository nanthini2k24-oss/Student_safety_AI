// ===== Profile page =====
import { store, computeStats } from './utils.js';

export function renderProfile(page, ctx) {
  const state = store.get();
  const profile = state.profile || {};
  const stats = computeStats(state);

  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">Your account</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">Student Profile</h2>
        <p style="margin:0">View and update your personal details, medical information, and safety ID.</p>
      </div>

      <div class="glass profile-header reveal mb-5">
        <div class="profile-avatar">${profile.avatarInitials || (profile.name || 'S')[0]}</div>
        <div style="flex:1">
          <div class="profile-name">${profile.name || 'Student'}</div>
          <div class="muted">${profile.grade || ''} · ${profile.school || ''}</div>
          <div class="flex gap-3 wrap mt-3">
            <span class="pill pill-blue">Roll: ${profile.rollNo || '—'}</span>
            <span class="pill pill-green">Bus ${profile.busNo || '—'}</span>
            <span class="pill pill-yellow">Score: ${stats.score}</span>
          </div>
        </div>
        <button class="btn btn-green" id="editProfile">✏️ Edit profile</button>
      </div>

      <div class="grid grid-2 mb-5">
        <div class="glass reveal">
          <h3 style="font-size:18px">👤 Personal details</h3>
          <div class="mt-3">
            <div class="info-row"><span class="ir-label">Full name</span><span class="ir-val">${profile.name || '—'}</span></div>
            <div class="info-row"><span class="ir-label">Grade / Class</span><span class="ir-val">${profile.grade || '—'}</span></div>
            <div class="info-row"><span class="ir-label">Roll number</span><span class="ir-val">${profile.rollNo || '—'}</span></div>
            <div class="info-row"><span class="ir-label">School</span><span class="ir-val">${profile.school || '—'}</span></div>
            <div class="info-row"><span class="ir-label">Assigned bus</span><span class="ir-val">Bus ${profile.busNo || '—'}</span></div>
          </div>
        </div>
        <div class="glass reveal delay-1">
          <h3 style="font-size:18px">🩺 Medical information</h3>
          <div class="mt-3">
            <div class="info-row"><span class="ir-label">Blood group</span><span class="ir-val">${profile.bloodGroup || '—'}</span></div>
            <div class="info-row"><span class="ir-label">Allergies</span><span class="ir-val">${profile.allergies || 'None'}</span></div>
            <div class="info-row"><span class="ir-label">Guardian</span><span class="ir-val">${profile.guardian || '—'}</span></div>
            <div class="info-row"><span class="ir-label">Guardian phone</span><span class="ir-val">${profile.guardianPhone || '—'}</span></div>
            <div class="info-row"><span class="ir-label">Emergency number</span><span class="ir-val">${profile.emergencyNumber || '112'}</span></div>
          </div>
          <a href="#/emergency" data-link class="btn btn-coral btn-sm btn-block mt-3">Open Emergency Dashboard →</a>
        </div>
      </div>

      <div class="grid grid-3 mb-5">
        <div class="glass reveal">
          <h3 style="font-size:16px">📊 Safety stats</h3>
          <div class="mt-3">
            <div class="info-row"><span class="ir-label">Safety score</span><span class="ir-val" style="color:var(--blue-600)">${stats.score}/100</span></div>
            <div class="info-row"><span class="ir-label">Journeys completed</span><span class="ir-val">${stats.journeysCompleted}</span></div>
            <div class="info-row"><span class="ir-label">Day streak</span><span class="ir-val">${stats.journeyStreak} 🔥</span></div>
            <div class="info-row"><span class="ir-label">Badges earned</span><span class="ir-val">${state.unlockedAchievements.length}</span></div>
          </div>
        </div>
        <div class="glass reveal delay-1">
          <h3 style="font-size:16px">👨‍👩‍👧 Trusted contacts</h3>
          <div class="mt-3">
            ${(profile.trustedContacts || []).map(c => `<div class="info-row"><span class="ir-label">${c.name}</span><span class="ir-val">${c.phone}</span></div>`).join('') || '<div class="muted">No contacts added.</div>'}
          </div>
          <a href="#/emergency" data-link class="btn btn-ghost btn-sm btn-block mt-3">Manage contacts →</a>
        </div>
        <div class="glass reveal delay-2">
          <h3 style="font-size:16px">📅 Member since</h3>
          <div class="mt-3">
            <div class="info-row"><span class="ir-label">Account created</span><span class="ir-val">2026</span></div>
            <div class="info-row"><span class="ir-label">Mood check-ins</span><span class="ir-val">${state.moodCheckIns || 0}</span></div>
            <div class="info-row"><span class="ir-label">Journal entries</span><span class="ir-val">${(state.journal || []).length}</span></div>
            <div class="info-row"><span class="ir-label">Community reports</span><span class="ir-val">${stats.reportsSubmitted}</span></div>
          </div>
        </div>
      </div>

      <div class="glass reveal">
        <h3 style="font-size:18px">Danger zone</h3>
        <p class="muted mt-2">Reset all your data — journeys, moods, reports, achievements, and journal. This cannot be undone.</p>
        <button class="btn btn-coral mt-3" id="resetData">Reset all data</button>
      </div>
    </div>
  `;

  page.querySelector('#editProfile').addEventListener('click', () => editProfileModal(page, profile));
  page.querySelector('#resetData').addEventListener('click', () => {
    if (confirm('This will erase ALL your data (journeys, moods, badges, journal, reports). Are you sure?')) {
      localStorage.removeItem('ssa_state_v1');
      location.hash = '#/';
      location.reload();
    }
  });
}

function editProfileModal(page, profile) {
  import('../utils.js').then(({ showModal }) => {
    const modal = showModal(`
      <h3>Edit profile</h3>
      <div class="field mt-3"><label>Full name</label><input id="pName" class="input" value="${profile.name || ''}" /></div>
      <div class="grid grid-2 gap-3">
        <div class="field"><label>Grade / Class</label><input id="pGrade" class="input" value="${profile.grade || ''}" /></div>
        <div class="field"><label>Roll number</label><input id="pRoll" class="input" value="${profile.rollNo || ''}" /></div>
      </div>
      <div class="field"><label>School</label><input id="pSchool" class="input" value="${profile.school || ''}" /></div>
      <div class="grid grid-2 gap-3">
        <div class="field"><label>Assigned bus number</label><input id="pBus" class="input" value="${profile.busNo || ''}" /></div>
        <div class="field"><label>Blood group</label><input id="pBlood" class="input" value="${profile.bloodGroup || ''}" /></div>
      </div>
      <div class="field"><label>Allergies</label><input id="pAllergy" class="input" value="${profile.allergies || ''}" /></div>
      <div class="grid grid-2 gap-3">
        <div class="field"><label>Guardian name</label><input id="pGuardian" class="input" value="${profile.guardian || ''}" /></div>
        <div class="field"><label>Guardian phone</label><input id="pGuardianPhone" class="input" value="${profile.guardianPhone || ''}" /></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
        <button class="btn btn-green" id="pSave">Save changes</button>
      </div>
    `);
    modal.querySelector('#pSave').addEventListener('click', () => {
      const name = modal.querySelector('#pName').value.trim();
      store.update(s => {
        s.profile = s.profile || {};
        s.profile.name = name;
        s.profile.grade = modal.querySelector('#pGrade').value.trim();
        s.profile.rollNo = modal.querySelector('#pRoll').value.trim();
        s.profile.school = modal.querySelector('#pSchool').value.trim();
        s.profile.busNo = modal.querySelector('#pBus').value.trim();
        s.profile.bloodGroup = modal.querySelector('#pBlood').value.trim();
        s.profile.allergies = modal.querySelector('#pAllergy').value.trim();
        s.profile.guardian = modal.querySelector('#pGuardian').value.trim();
        s.profile.guardianPhone = modal.querySelector('#pGuardianPhone').value.trim();
        s.profile.avatarInitials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'S';
      });
      modal.remove();
      renderProfile(page, {});
    });
  });
}
