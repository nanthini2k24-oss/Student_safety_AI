// ===== Bus Tracking page =====
import { store, animateCount, addActivity } from '../utils.js';
import { busRoutes } from '../dat.js';

let busAnimTimer = null;
let currentBusIdx = 0;
let currentStopIdx = 0;

export function renderBus(page, ctx) {
  const state = store.get();
  const profile = state.profile || {};
  const assignedBus = busRoutes.find(b => b.number === String(profile.busNo)) || busRoutes[0];
  currentBusIdx = busRoutes.indexOf(assignedBus);

  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">Track your ride</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">School Bus Tracking</h2>
        <p style="margin:0">Select your assigned bus to see its route, stops, estimated arrival, driver details, and live occupancy.</p>
      </div>

      <div class="glass reveal mb-4">
        <h3 style="font-size:16px;margin-bottom:12px">Select your bus</h3>
        <div class="bus-list" id="busList">
          ${busRoutes.map((b, i) => `
            <div class="bus-card ${i === currentBusIdx ? 'selected' : ''}" data-bus="${i}">
              <div class="bc-num">Bus ${b.number}</div>
              <div class="bc-route">${b.name}</div>
              <div class="muted mt-2" style="font-size:12px">${b.stops.length} stops · ${b.capacity} seats</div>
            </div>`).join('')}
        </div>
      </div>

      <div id="busDetail" class="reveal delay-1"></div>
    </div>
  `;

  page.querySelectorAll('.bus-card').forEach(card => {
    card.addEventListener('click', () => {
      currentBusIdx = parseInt(card.dataset.bus, 10);
      page.querySelectorAll('.bus-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      renderBusDetail(page);
    });
  });

  renderBusDetail(page);
}

function renderBusDetail(page) {
  const bus = busRoutes[currentBusIdx];
  const occupancy = 40 + Math.floor(Math.random() * 40); // 40-80%
  currentStopIdx = Math.min(currentStopIdx, bus.stops.length - 1);
  const nextStop = bus.stops[currentStopIdx + 1] || bus.stops[bus.stops.length - 1];
  const eta = nextStop ? Math.round((currentStopIdx + 1) * 2.5) : 0;

  const detail = page.querySelector('#busDetail');
  detail.innerHTML = `
    <div class="bus-detail">
      <div class="glass">
        <div class="flex items-center justify-between wrap gap-3 mb-3">
          <div>
            <h3 style="font-size:22px">Bus ${bus.number} — ${bus.name}</h3>
            <p class="muted">Live tracking simulation · updates every few seconds</p>
          </div>
          <span class="pill pill-green" id="busStatus">● On the way</span>
        </div>

        <div class="bus-track" id="busTrack">
          <div class="bus-track-line"></div>
          <div class="bus-track-progress" id="trackProgress" style="width:${(currentStopIdx / (bus.stops.length - 1)) * 100}%"></div>
          ${bus.stops.map((s, i) => `<div class="bus-track-stop ${i === currentStopIdx ? 'current' : ''}" style="left:${(i / (bus.stops.length - 1)) * 100}%"></div>`).join('')}
          <div class="bus-track-vehicle bus-mini" id="trackVehicle" style="left:${(currentStopIdx / (bus.stops.length - 1)) * 100}%">🚌</div>
        </div>

        <div class="grid grid-3 mt-4">
          <div style="text-align:center;padding:14px;border-radius:12px;background:var(--surface-soft)">
            <div style="font-family:var(--font-display);font-weight:700;font-size:22px;color:var(--blue-600)" id="etaNum">${eta}</div>
            <div class="muted" style="font-size:12px;font-weight:600">ETA (min)</div>
          </div>
          <div style="text-align:center;padding:14px;border-radius:12px;background:var(--surface-soft)">
            <div style="font-family:var(--font-display);font-weight:700;font-size:18px;color:var(--green-600)" id="currentStopName">${bus.stops[currentStopIdx].name}</div>
            <div class="muted" style="font-size:12px;font-weight:600">Current stop</div>
          </div>
          <div style="text-align:center;padding:14px;border-radius:12px;background:var(--surface-soft)">
            <div style="font-family:var(--font-display);font-weight:700;font-size:22px;color:#b07a00">${occupancy}%</div>
            <div class="muted" style="font-size:12px;font-weight:600">Occupancy</div>
            <div class="occupancy-bar"><span style="width:${occupancy}%;background:${occupancy > 80 ? 'var(--coral-500)' : occupancy > 60 ? 'var(--yellow-400)' : 'var(--green-500)'}"></span></div>
          </div>
        </div>

        <div class="glass-soft mt-4" style="padding:16px;border-radius:12px">
          <h4 style="font-size:15px;margin-bottom:10px">📍 Route stops</h4>
          ${bus.stops.map((s, i) => `
            <div class="info-row">
              <span class="ir-label">${i === currentStopIdx ? '🚌 ' : i < currentStopIdx ? '✅ ' : '⏳ '}${s.name}</span>
              <span class="ir-val">${s.time}</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="glass">
        <h3 style="font-size:18px">Driver details</h3>
        <div class="driver-card mt-3">
          <div class="driver-avatar">${bus.driver.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
          <div>
            <div style="font-weight:700;font-size:18px">${bus.driver.name}</div>
            <div class="muted">Bus ${bus.number} · ${bus.driver.experience} experience</div>
            <div class="pill pill-yellow mt-2" style="font-size:12px">★ ${bus.driver.rating} rating</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="info-row"><span class="ir-label">Phone</span><span class="ir-val">${bus.driver.phone}</span></div>
          <div class="info-row"><span class="ir-label">Capacity</span><span class="ir-val">${bus.capacity} seats</span></div>
          <div class="info-row"><span class="ir-label">Total stops</span><span class="ir-val">${bus.stops.length}</span></div>
        </div>
        <button class="btn btn-green btn-block mt-4" onclick="window.location.href='tel:${bus.driver.phone}'">📞 Call driver</button>
        <a href="#/journey" data-link class="btn btn-ghost btn-block mt-2">Start Guardian Journey →</a>
      </div>
    </div>
  `;

  startBusAnimation(page, bus);
}

function startBusAnimation(page, bus) {
  if (busAnimTimer) clearInterval(busAnimTimer);
  busAnimTimer = setInterval(() => {
    currentStopIdx = (currentStopIdx + 1) % bus.stops.length;
    const progress = page.querySelector('#trackProgress');
    const vehicle = page.querySelector('#trackVehicle');
    const stops = page.querySelectorAll('.bus-track-stop');
    const etaNum = page.querySelector('#etaNum');
    const currentStopName = page.querySelector('#currentStopName');
    if (!progress) { clearInterval(busAnimTimer); return; }
    const pct = (currentStopIdx / (bus.stops.length - 1)) * 100;
    progress.style.width = pct + '%';
    vehicle.style.left = pct + '%';
    stops.forEach((s, i) => s.classList.toggle('current', i === currentStopIdx));
    const eta = currentStopIdx < bus.stops.length - 1 ? Math.round((currentStopIdx + 1) * 2.5) : 0;
    if (etaNum) etaNum.textContent = eta;
    if (currentStopName) currentStopName.textContent = bus.stops[currentStopIdx].name;
  }, 3000);
}
