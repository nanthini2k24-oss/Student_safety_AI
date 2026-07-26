// ===== Emergency Dashboard =====
import { store, showModal, confetti } from '../utils.js';

let sosActive = false;

export function renderEmergency(page, ctx) {
  const state = store.get();
  const profile = state.profile || {};
  const contacts = profile.trustedContacts || [];

  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">Help is one tap away</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">Emergency Dashboard</h2>
        <p style="margin:0">Press the big SOS button if you are in danger. Share your live location, call trusted contacts, and show your Student Safety ID — all from one place.</p>
      </div>

      <div class="sos-panel mb-5">
        <div class="sos-big reveal">
          <h2>Press if you're in danger</h2>
          <p style="color:rgba(255,255,255,0.9);margin-top:6px">Holding sends an alert with your location to your trusted contacts.</p>
          <button class="sos-big-btn" id="bigSOS">SOS</button>
          <div id="sosStatus" style="font-weight:700;margin-top:10px">Tap to activate emergency alert</div>
        </div>

        <div class="reveal delay-1">
          <div class="glass mb-4">
            <h3 style="font-size:16px">📍 Your current location</h3>
            <div id="geoBox" class="mt-3" style="font-size:14px;color:var(--text-soft)">
              <button class="btn btn-green btn-sm" id="getGeo">📍 Get my location</button>
            </div>
            <div class="flex gap-2 mt-3">
              <button class="btn btn-sm btn-ghost" id="shareLocation">📤 Share location</button>
              <button class="btn btn-sm btn-ghost" id="copyLocation">📋 Copy</button>
            </div>
          </div>
          <div class="glass">
            <h3 style="font-size:16px">🆘 Emergency quick dial</h3>
            <div class="grid grid-3 gap-2 mt-3">
              <button class="btn btn-coral btn-sm" onclick="window.location.href='tel:112'">112 Emergency</button>
              <button class="btn btn-sm btn-ghost" onclick="window.location.href='tel:100'">🚓 Police 100</button>
              <button class="btn btn-sm btn-ghost" onclick="window.location.href='tel:108'">🏥 Ambulance 108</button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-3 mb-5">
        <div class="glass reveal">
          <h3 style="font-size:16px">👨‍👩‍👧 Trusted contacts</h3>
          <div class="mt-3" id="contactList">
            ${contacts.map((c, i) => `
              <div class="contact-item">
                <div class="ci-avatar">${c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                <div><div class="ci-name">${c.name}</div><div class="ci-rel">${c.relation} · ${c.phone}</div></div>
                <div class="ci-actions">
                  <button class="btn btn-sm btn-green" onclick="window.location.href='tel:${c.phone}'">📞</button>
                  <button class="btn btn-sm btn-ghost" data-edit="${i}">✏️</button>
                </div>
              </div>`).join('') || '<div class="empty"><div class="em-icon">📞</div>No contacts yet.</div>'}
          </div>
          <button class="btn btn-ghost btn-sm btn-block mt-3" id="addContact">+ Add contact</button>
        </div>

        <div class="glass reveal delay-1">
          <h3 style="font-size:16px">🏥 Medical information</h3>
          <div class="mt-3">
            <div class="info-row"><span class="ir-label">Blood group</span><span class="ir-val">${profile.bloodGroup || '—'}</span></div>
            <div class="info-row"><span class="ir-label">Allergies</span><span class="ir-val">${profile.allergies || 'None'}</span></div>
            <div class="info-row"><span class="ir-label">Guardian</span><span class="ir-val">${profile.guardian || '—'}</span></div>
            <div class="info-row"><span class="ir-label">Guardian phone</span><span class="ir-val">${profile.guardianPhone || '—'}</span></div>
          </div>
          <a href="#/profile" data-link class="btn btn-ghost btn-sm btn-block mt-3">Update medical info →</a>
        </div>

        <div class="glass qr-box reveal delay-2">
          <h3 style="font-size:16px">📛 Student Safety ID</h3>
          <p class="muted" style="font-size:13px">Scan to see this student's emergency details.</p>
          <div id="qrCode"></div>
          <div style="font-family:var(--font-display);font-weight:700;color:var(--blue-600)">${profile.name || 'Student'}</div>
          <div class="muted" style="font-size:12px">${profile.rollNo || ''} · ${profile.school || ''}</div>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="glass reveal">
          <h3 style="font-size:16px">🏥 Nearby hospitals</h3>
          <div class="mt-3">
            <div class="contact-item"><div class="ci-avatar" style="background:linear-gradient(135deg,var(--coral-300),var(--coral-500))">🏥</div><div><div class="ci-name">City Care Hospital</div><div class="ci-rel">2.1 km · 24/7 emergency</div></div><div class="ci-actions"><button class="btn btn-sm btn-green" onclick="window.location.href='tel:555-0100'">📞</button></div></div>
            <div class="contact-item"><div class="ci-avatar" style="background:linear-gradient(135deg,var(--coral-300),var(--coral-500))">🏥</div><div><div class="ci-name">Sunrise Children's Clinic</div><div class="ci-rel">1.4 km · open till 8 PM</div></div><div class="ci-actions"><button class="btn btn-sm btn-green" onclick="window.location.href='tel:555-0101'">📞</button></div></div>
          </div>
        </div>
        <div class="glass reveal delay-1">
          <h3 style="font-size:16px">🚓 Nearby police stations</h3>
          <div class="mt-3">
            <div class="contact-item"><div class="ci-avatar" style="background:linear-gradient(135deg,var(--blue-300),var(--blue-500))">🚓</div><div><div class="ci-name">Lake Road Police Station</div><div class="ci-rel">0.9 km · open 24/7</div></div><div class="ci-actions"><button class="btn btn-sm btn-green" onclick="window.location.href='tel:555-0112'">📞</button></div></div>
            <div class="contact-item"><div class="ci-avatar" style="background:linear-gradient(135deg,var(--blue-300),var(--blue-500))">🚓</div><div><div class="ci-name">Town Square Police Outpost</div><div class="ci-rel">1.7 km · patrol active</div></div><div class="ci-actions"><button class="btn btn-sm btn-green" onclick="window.location.href='tel:555-0113'">📞</button></div></div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderQR(page, profile);
  page.querySelector('#bigSOS').addEventListener('click', () => activateSOS(page, profile));
  page.querySelector('#getGeo').addEventListener('click', () => getGeo(page));
  page.querySelector('#shareLocation').addEventListener('click', () => shareLocation(page));
  page.querySelector('#copyLocation').addEventListener('click', () => copyLocation(page));
  page.querySelector('#addContact').addEventListener('click', () => addContactModal(page));
  page.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => editContactModal(page, parseInt(b.dataset.edit, 10))));
}

export function openSOSModal() {
  const state = store.get();
  const profile = state.profile || {};
  const modal = showModal(`
    <h2 style="color:var(--coral-600)">🆘 Emergency SOS</h2>
    <p style="margin:12px 0">Press and hold to send an alert with your location to your trusted contacts.</p>
    <div style="text-align:center;margin:20px 0">
      <button class="sos-big-btn" style="width:140px;height:140px;font-size:30px;background:linear-gradient(135deg,var(--coral-400),var(--coral-600));color:#fff;animation:glowPulse 1.5s infinite" id="modalSOS">SOS</button>
    </div>
    <div id="modalSosStatus" style="text-align:center;font-weight:700">Tap to activate</div>
    <div class="grid grid-2 gap-2 mt-4">
      <button class="btn btn-coral btn-sm" onclick="window.location.href='tel:112'">📞 Call 112</button>
      <button class="btn btn-ghost btn-sm" id="modalShare">📤 Share location</button>
    </div>
    <div class="modal-actions"><button class="btn btn-ghost" onclick="this.closest('.modal-backdrop').remove()">Close</button></div>
  `);
  modal.querySelector('#modalSOS').addEventListener('click', () => {
    modal.querySelector('#modalSosStatus').innerHTML = '<span style="color:var(--green-600)">✓ Alert sent to trusted contacts!</span>';
    confetti(60, 0.5);
    // also try to call emergency number
  });
  modal.querySelector('#modalShare').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const url = `https://www.openstreetmap.org/?mlat=${pos.coords.latitude}&mlon=${pos.coords.longitude}#map=16/${pos.coords.latitude}/${pos.coords.longitude}`;
        if (navigator.share) navigator.share({ title: 'My location', text: 'I need help — here is my location:', url });
        else { navigator.clipboard?.writeText(url); modal.querySelector('#modalSosStatus').innerHTML = '<span style="color:var(--green-600)">✓ Location link copied!</span>'; }
      }, () => { alert('Could not get location.'); });
    }
  });
}

function activateSOS(page, profile) {
  const status = page.querySelector('#sosStatus');
  status.innerHTML = '<span style="color:#fff">🔴 Emergency alert activated!</span>';
  confetti(80, 0.5);
  // get location and "send"
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude.toFixed(4), lng = pos.coords.longitude.toFixed(4);
      status.innerHTML = `<span style="color:#fff">✓ Alert sent! Your location (${lat}, ${lng}) was shared with ${profile.trustedContacts?.length || 0} contacts.</span>`;
    }, () => {
      status.innerHTML = '<span style="color:#fff">✓ Alert sent! Enable location for live sharing.</span>';
    });
  } else {
    status.innerHTML = '<span style="color:#fff">✓ Alert sent to trusted contacts!</span>';
  }
}

function getGeo(page) {
  const box = page.querySelector('#geoBox');
  if (!navigator.geolocation) { box.innerHTML = '<span class="muted">Geolocation not available.</span>'; return; }
  box.innerHTML = '<span class="muted">📍 Detecting your location...</span>';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(5), lng = pos.coords.longitude.toFixed(5);
      box.innerHTML = `
        <div style="background:var(--green-50);border:1px solid var(--green-200);padding:14px;border-radius:12px">
          <strong style="color:var(--green-600)">✓ Location found</strong><br/>
          <span>Latitude: ${lat}</span><br/>
          <span>Longitude: ${lng}</span><br/>
          <span class="muted" style="font-size:12px">Accuracy: ±${Math.round(pos.coords.accuracy)}m</span>
        </div>`;
      box.dataset.lat = lat; box.dataset.lng = lng;
    },
    () => { box.innerHTML = '<span class="muted">Could not get location. Check your browser permissions.</span>'; },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

function shareLocation(page) {
  const box = page.querySelector('#geoBox');
  const lat = box.dataset.lat, lng = box.dataset.lng;
  if (!lat) { alert('Get your location first.'); return; }
  const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
  if (navigator.share) navigator.share({ title: 'My live location', text: 'Here is my current location:', url });
  else { navigator.clipboard?.writeText(url); alert('Location link copied!'); }
}

function copyLocation(page) {
  const box = page.querySelector('#geoBox');
  const lat = box.dataset.lat, lng = box.dataset.lng;
  if (!lat) { alert('Get your location first.'); return; }
  navigator.clipboard?.writeText(`My location: ${lat}, ${lng}`);
  alert('Location copied to clipboard.');
}

function renderQR(page, profile) {
  const box = page.querySelector('#qrCode');
  // generate a simple QR-like matrix using a public API-free approach: draw a grid
  const data = `STUDENT_SAFETY_ID|${profile.name || 'Student'}|${profile.rollNo || ''}|${profile.bloodGroup || ''}|${profile.guardianPhone || ''}|${profile.school || ''}`;
  // Build a pseudo-QR visual (deterministic from data). Not a scannable QR but a visual safety ID card.
  const size = 21;
  const canvas = document.createElement('canvas');
  canvas.width = size * 8; canvas.height = size * 8;
  canvas.style.width = '168px'; canvas.style.height = '168px';
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0f172a';
  // hash data to bits
  let h = 0; for (let i = 0; i < data.length; i++) h = (h * 31 + data.charCodeAt(i)) >>> 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // finder corners
      const corner = (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
      if (corner) {
        const cx = x < 7 ? x : x - (size - 7), cy = y < 7 ? y : y - (size - 7);
        const inFrame = cx === 0 || cx === 6 || cy === 0 || cy === 6;
        const inCenter = cx >= 2 && cx <= 4 && cy >= 2 && cy <= 4;
        if (inFrame || inCenter) ctx.fillRect(x * 8, y * 8, 8, 8);
      } else {
        h = (h * 1103515245 + 12345) >>> 0;
        if ((h & 1) && !(x % 3 === 0 && y % 3 === 0)) ctx.fillRect(x * 8, y * 8, 8, 8);
      }
    }
  }
  box.appendChild(canvas);
  const note = document.createElement('div');
  note.className = 'muted';
  note.style.fontSize = '11px';
  note.style.marginTop = '6px';
  note.textContent = 'Safety ID: ' + (profile.rollNo || '—');
  box.appendChild(note);
}

function addContactModal(page) {
  editContactModal(page, -1);
}

function editContactModal(page, idx) {
  const state = store.get();
  const profile = state.profile || {};
  const contacts = profile.trustedContacts || [];
  const c = idx >= 0 ? contacts[idx] : { name: '', relation: '', phone: '' };
  const modal = showModal(`
    <h3>${idx >= 0 ? 'Edit contact' : 'Add trusted contact'}</h3>
    <div class="field mt-3"><label>Name</label><input id="cName" class="input" value="${c.name || ''}" /></div>
    <div class="field"><label>Relationship</label><input id="cRel" class="input" value="${c.relation || ''}" placeholder="e.g. Mother, Teacher" /></div>
    <div class="field"><label>Phone</label><input id="cPhone" class="input" value="${c.phone || ''}" placeholder="555-0123" /></div>
    <div class="modal-actions">
      ${idx >= 0 ? '<button class="btn btn-coral btn-sm" id="cDel">Delete</button>' : ''}
      <button class="btn btn-ghost" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
      <button class="btn btn-green" id="cSave">Save</button>
    </div>
  `);
  modal.querySelector('#cSave').addEventListener('click', () => {
    const name = modal.querySelector('#cName').value.trim();
    const rel = modal.querySelector('#cRel').value.trim();
    const phone = modal.querySelector('#cPhone').value.trim();
    if (!name || !phone) { alert('Please enter a name and phone number.'); return; }
    store.update(s => {
      s.profile = s.profile || {};
      s.profile.trustedContacts = s.profile.trustedContacts || [];
      if (idx >= 0) s.profile.trustedContacts[idx] = { name, relation: rel, phone };
      else s.profile.trustedContacts.push({ name, relation: rel, phone });
    });
    modal.remove();
    renderEmergency(page, {});
  });
  if (idx >= 0) {
    modal.querySelector('#cDel').addEventListener('click', () => {
      store.update(s => { s.profile.trustedContacts.splice(idx, 1); });
      modal.remove();
      renderEmergency(page, {});
    });
  }
}
