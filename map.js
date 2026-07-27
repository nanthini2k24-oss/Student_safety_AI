// ===== School Map page (Leaflet + OpenStreetMap) =====
import { store, addActivity } from './utils.js';
import { mapPoints, busRoutes } from './dat.js';

let leafletMap = null;
let routeLine = null;
let markers = [];
let homeMarker = null;
let schoolMarker = null;

export function renderMap(page, ctx) {
  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:24px">
        <span class="eyebrow">Plan your safest route</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">School Safety Map</h2>
        <p style="margin:0">Pick your home and school to see the safest route with crossings, speed zones, hospitals, police stations, and safe places along the way.</p>
      </div>

      <div class="glass reveal mb-5" style="padding:18px 20px">
        <div class="grid grid-4" style="gap:14px;align-items:end">
          <div class="field" style="margin:0">
            <label>Your Home</label>
            <select id="homeSelect" class="select">
              ${homeOptions().map(h => `<option value="${h.lat},${h.lng}">${h.name}</option>`).join('')}
            </select>
          </div>
          <div class="field" style="margin:0">
            <label>Your School</label>
            <select id="schoolSelect" class="select">
              <option value="${mapPoints.school.lat},${mapPoints.school.lng}">${mapPoints.school.label}</option>
            </select>
          </div>
          <div class="field" style="margin:0">
            <label>Route mode</label>
            <select id="modeSelect" class="select">
              <option value="safest">Safest (recommended)</option>
              <option value="fastest">Fastest</option>
              <option value="scenic">Quiet / scenic</option>
            </select>
          </div>
          <button id="plotRoute" class="btn btn-green" style="height:46px">Show Safest Route</button>
        </div>
      </div>

      <div class="map-wrap reveal delay-1">
        <div id="leafletMap"></div>
        <div class="map-sidebar">
          <div class="glass">
            <h3 style="font-size:16px">Route summary</h3>
            <div class="route-info mt-3" id="routeInfo">
              <div class="ri-item"><div class="ri-num">—</div><div class="ri-label">Distance</div></div>
              <div class="ri-item"><div class="ri-num">—</div><div class="ri-label">Time</div></div>
              <div class="ri-item"><div class="ri-num">—</div><div class="ri-label">Crossings</div></div>
            </div>
            <button id="startFromMap" class="btn btn-green btn-block mt-3" disabled>Start this journey</button>
          </div>
          <div class="glass">
            <h3 style="font-size:16px">Map legend</h3>
            ${legend().map(l => `<div class="map-legend-item"><span class="map-dot" style="background:${l.color}"></span>${l.label}</div>`).join('')}
          </div>
          <div class="glass">
            <h3 style="font-size:16px">Nearby help</h3>
            <div id="nearbyHelp" style="font-size:14px;color:var(--text-soft)">
              <div class="info-row"><span class="ir-label">🏥 Hospital</span><span class="ir-val">${mapPoints.hospitals[0].name}</span></div>
              <div class="info-row"><span class="ir-label">🚓 Police</span><span class="ir-val">${mapPoints.police[0].name}</span></div>
              <div class="info-row"><span class="ir-label">🏪 Safe place</span><span class="ir-val">${mapPoints.safePlaces[0].name}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-3 mt-5">
        <div class="glass reveal">
          <h3 style="font-size:16px">🚸 Pedestrian crossings</h3>
          <p class="muted mt-2" style="font-size:14px">Always use these marked crossings. Drivers expect people here.</p>
          <div class="mt-3">${mapPoints.crossings.map(c => `<div class="info-row"><span class="ir-label">📍</span><span class="ir-val">${c.name}</span></div>`).join('')}</div>
        </div>
        <div class="glass reveal delay-1">
          <h3 style="font-size:16px">⚠️ Accident-prone areas</h3>
          <p class="muted mt-2" style="font-size:14px">Stay extra alert near these spots. Slow down and look around.</p>
          <div class="mt-3">${mapPoints.accidentProne.map(c => `<div class="info-row"><span class="ir-label">⚠️</span><span class="ir-val">${c.name}</span></div>`).join('')}</div>
        </div>
        <div class="glass reveal delay-2">
          <h3 style="font-size:16px">🚌 Bus stops</h3>
          <p class="muted mt-2" style="font-size:14px">Wait at least three big steps back from the road here.</p>
          <div class="mt-3">${mapPoints.busStops.map(c => `<div class="info-row"><span class="ir-label">🚏</span><span class="ir-val">${c.name}</span></div>`).join('')}</div>
        </div>
      </div>
    </div>
  `;

  // init map after DOM insert
  setTimeout(() => initLeaflet(), 50);

  page.querySelector('#plotRoute').addEventListener('click', () => plotRoute(page));
  page.querySelector('#homeSelect').addEventListener('change', () => plotRoute(page));
  page.querySelector('#startFromMap').addEventListener('click', () => {
    const home = page.querySelector('#homeSelect').value.split(',');
    location.hash = '#/journey';
  });
}

function homeOptions() {
  return [
    { name: 'Sunrise Apartments', lat: mapPoints.home.lat, lng: mapPoints.home.lng },
    { name: 'Riverside Flats', lat: 28.6100, lng: 77.2050 },
    { name: 'Hilltop Residency', lat: 28.6050, lng: 77.2000 },
    { name: 'Main Market area', lat: 28.6180, lng: 77.2160 },
  ];
}

function legend() {
  return [
    { color: '#1f8bff', label: 'Home' },
    { color: '#16b85f', label: 'School' },
    { color: '#ffd54a', label: 'Pedestrian crossing' },
    { color: '#f04d3a', label: 'Accident-prone area' },
    { color: '#f5a800', label: 'Speed-limit zone' },
    { color: '#ff6f5e', label: 'Hospital' },
    { color: '#0a72e6', label: 'Police station' },
    { color: '#34d27b', label: 'Safe public place' },
    { color: '#7c93ad', label: 'Bus stop' },
  ];
}

function initLeaflet() {
  if (leafletMap) { leafletMap.remove(); leafletMap = null; }
  if (typeof L === 'undefined') return;
  leafletMap = L.map('leafletMap', { scrollWheelZoom: true, zoomControl: true }).setView([mapPoints.home.lat, mapPoints.home.lng], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
  }).addTo(leafletMap);

  // home + school
  homeMarker = L.marker([mapPoints.home.lat, mapPoints.home.lng], { icon: coloredIcon('#1f8bff') }).addTo(leafletMap).bindPopup('<strong>Home</strong><br>Your starting point');
  schoolMarker = L.marker([mapPoints.school.lat, mapPoints.school.lng], { icon: coloredIcon('#16b85f') }).addTo(leafletMap).bindPopup(`<strong>${mapPoints.school.label}</strong><br>Your school`);

  // crossings (pulsing)
  mapPoints.crossings.forEach(c => {
    const m = L.marker([c.lat, c.lng], { icon: coloredIcon('#ffd54a') }).addTo(leafletMap).bindPopup(`<strong>Pedestrian crossing</strong><br>${c.name}`);
    markers.push(m);
  });
  // accident prone (pulsing red)
  mapPoints.accidentProne.forEach(c => {
    const m = L.marker([c.lat, c.lng], { icon: coloredIcon('#f04d3a') }).addTo(leafletMap).bindPopup(`<strong>⚠️ Accident-prone area</strong><br>${c.name}<br><em>Stay alert here!</em>`);
    markers.push(m);
  });
  // speed zones (circles)
  mapPoints.speedZones.forEach(z => {
    L.circle([z.lat, z.lng], { radius: z.radius, color: '#f5a800', fillColor: '#ffd54a', fillOpacity: 0.18, weight: 2 }).addTo(leafletMap).bindPopup(`<strong>Speed zone</strong><br>${z.name}`);
  });
  // hospitals
  mapPoints.hospitals.forEach(h => {
    L.marker([h.lat, h.lng], { icon: coloredIcon('#ff6f5e') }).addTo(leafletMap).bindPopup(`<strong>🏥 Hospital</strong><br>${h.name}<br>📞 ${h.phone}`);
  });
  // police
  mapPoints.police.forEach(p => {
    L.marker([p.lat, p.lng], { icon: coloredIcon('#0a72e6') }).addTo(leafletMap).bindPopup(`<strong>🚓 Police station</strong><br>${p.name}<br>📞 ${p.phone}`);
  });
  // safe places
  mapPoints.safePlaces.forEach(p => {
    L.marker([p.lat, p.lng], { icon: coloredIcon('#34d27b') }).addTo(leafletMap).bindPopup(`<strong>🏪 Safe place</strong><br>${p.name}<br>Seek shelter here if needed`);
  });
  // bus stops
  mapPoints.busStops.forEach(b => {
    L.marker([b.lat, b.lng], { icon: coloredIcon('#7c93ad') }).addTo(leafletMap).bindPopup(`<strong>🚏 Bus stop</strong><br>${b.name}`);
  });

  // auto-draw route
  setTimeout(() => plotRoute(document.getElementById('page')), 200);
}

function coloredIcon(color) {
  if (typeof L === 'undefined') return;
  return L.divIcon({
    className: 'ssa-marker',
    html: `<div class="pulse-marker" style="background:${color};width:16px;height:16px"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function plotRoute(page) {
  if (!leafletMap) return;
  const homeVal = page.querySelector('#homeSelect').value.split(',').map(Number);
  const schoolVal = page.querySelector('#schoolSelect').value.split(',').map(Number);
  const home = { lat: homeVal[0], lng: homeVal[1] };
  const school = { lat: schoolVal[0], lng: schoolVal[1] };

  // build a safe route that passes through crossings
  const route = [home];
  mapPoints.crossings.forEach(c => {
    if (isBetween(c, home, school)) route.push({ lat: c.lat, lng: c.lng });
  });
  route.push(school);

  if (routeLine) leafletMap.removeLayer(routeLine);
  routeLine = L.polyline(route, { color: '#1f8bff', weight: 5, opacity: 0.85, dashArray: '8 8' }).addTo(leafletMap);

  // animated dash
  let offset = 0;
  if (window.__routeAnim) clearInterval(window.__routeAnim);
  window.__routeAnim = setInterval(() => { offset -= 8; if (routeLine) routeLine.setStyle({ dashOffset: offset }); }, 80);

  // fit bounds
  leafletMap.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

  // compute distance + time
  let dist = 0;
  for (let i = 1; i < route.length; i++) dist += haversine(route[i - 1], route[i]);
  const walkTime = Math.round((dist / 5) * 60); // 5 km/h walking
  const crossingsOnRoute = route.length - 2;

  page.querySelector('#routeInfo').innerHTML = `
    <div class="ri-item"><div class="ri-num">${dist.toFixed(2)}km</div><div class="ri-label">Distance</div></div>
    <div class="ri-item"><div class="ri-num">${walkTime}m</div><div class="ri-label">Walk time</div></div>
    <div class="ri-item"><div class="ri-num">${crossingsOnRoute}</div><div class="ri-label">Crossings</div></div>
  `;
  page.querySelector('#startFromMap').disabled = false;

  store.update(s => {});
}

function isBetween(p, a, b) {
  // simple bounding-box check
  const minLat = Math.min(a.lat, b.lat) - 0.002, maxLat = Math.max(a.lat, b.lat) + 0.002;
  const minLng = Math.min(a.lng, b.lng) - 0.002, maxLng = Math.max(a.lng, b.lng) + 0.002;
  return p.lat >= minLat && p.lat <= maxLat && p.lng >= minLng && p.lng <= maxLng;
}

function haversine(a, b) {
  const R = 6371, toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
