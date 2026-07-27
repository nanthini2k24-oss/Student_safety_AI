// ===== SafeBuddy AI chatbot =====
import { store, addActivity, checkAchievements, computeStats } from './utils.js';
import { safeBuddyTopics, safeBuddyResponses, motivationalQuotes } from './dat.js';

export function renderSafeBuddy(page, ctx) {
  page.innerHTML = `
    <div class="container section-tight">
      <div class="section-title reveal" style="text-align:left;margin-bottom:20px">
        <span class="eyebrow">Your kind safety friend</span>
        <h2 style="font-size:clamp(28px,4vw,40px)">SafeBuddy AI</h2>
        <p style="margin:0">Share how you feel — fear, loneliness, bullying, stress, or anxiety. SafeBuddy listens without judgment and helps you feel safe and supported.</p>
      </div>

      <div class="chat-wrap reveal delay-1">
        <div class="glass chat-box">
          <div class="chat-header">
            <div class="chat-avatar">🤖</div>
            <div>
              <div style="font-family:var(--font-display);font-weight:600;font-size:18px">SafeBuddy</div>
              <div class="muted" style="font-size:13px"><span style="color:var(--green-500)">●</span> Online · always here for you</div>
            </div>
          </div>
          <div class="chat-messages" id="chatMessages"></div>
          <div class="chat-quick" id="chatQuick">
            ${safeBuddyTopics.map(t => `<button data-topic="${t.key}">${t.icon} ${t.label}</button>`).join('')}
          </div>
          <div class="chat-input">
            <input type="text" id="chatInput" class="input" placeholder="Type how you're feeling..." />
            <button id="chatSend" class="btn btn-green">Send</button>
          </div>
        </div>

        <div class="chat-side">
          <div class="glass" style="margin-bottom:16px">
            <h3 style="font-size:16px;margin-bottom:10px">How SafeBuddy helps</h3>
            <p class="muted" style="font-size:14px">SafeBuddy is a friendly rule-based companion. It listens, offers calming exercises, motivational support, and reminds you of emergency options. You are never alone.</p>
          </div>
          <div class="glass" style="margin-bottom:16px">
            <h3 style="font-size:16px;margin-bottom:10px">Need real help?</h3>
            <p class="muted" style="font-size:14px">If you are in danger or feel unsafe right now, please use the SOS button. Real people are ready to help.</p>
            <a href="#/emergency" data-link class="btn btn-coral btn-sm btn-block mt-3">Open Emergency</a>
          </div>
          <div class="glass">
            <h3 style="font-size:16px;margin-bottom:10px">💬 Daily affirmation</h3>
            <p style="font-style:italic;color:var(--text);font-size:15px">"${motivationalQuotes[new Date().getDate() % motivationalQuotes.length]}"</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const messages = page.querySelector('#chatMessages');
  const input = page.querySelector('#chatInput');
  const send = page.querySelector('#chatSend');

  // greeting
  pushBot(messages, pick(safeBuddyResponses.greeting));

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    pushUser(messages, text);
    input.value = '';
    store.update(s => { s.safebuddyChats = (s.safebuddyChats || 0) + 1; addActivity(s, { icon: '💬', color: 'blue', title: 'Shared feelings with SafeBuddy AI' }); });
    setTimeout(() => {
      const reply = respond(text);
      pushBot(messages, reply.text);
      if (reply.suggestEmergency) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-coral btn-sm mt-2';
        btn.textContent = '🆘 Open Emergency';
        btn.onclick = () => location.hash = '#/emergency';
        messages.lastChild.appendChild(btn);
      }
      messages.scrollTop = messages.scrollHeight;
      ctx.checkAchievements(store.get(), computeStats(store.get()));
    }, 600);
  }

  send.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });

  page.querySelectorAll('#chatQuick button').forEach(b => {
    b.addEventListener('click', () => {
      const key = b.dataset.topic;
      const topic = safeBuddyTopics.find(t => t.key === key);
      pushUser(messages, `${topic.icon} ${topic.label}`);
      store.update(s => { s.safebuddyChats = (s.safebuddyChats || 0) + 1; addActivity(s, { icon: '💬', color: 'blue', title: `Talked to SafeBuddy about ${topic.label}` }); });
      setTimeout(() => {
        pushBot(messages, pick(safeBuddyResponses[key] || safeBuddyResponses.default));
        messages.scrollTop = messages.scrollHeight;
        ctx.checkAchievements(store.get(), computeStats(store.get()));
      }, 600);
    });
  });
}

function respond(text) {
  const t = text.toLowerCase();
  let key = 'default';
  let suggestEmergency = false;
  if (/(danger|hurt|attack|follow|scared|afraid|frightened)/.test(t)) { key = 'fear'; suggestEmergency = /danger|hurt|attack|follow/.test(t); }
  else if (/(lonely|alone|nobody|no one|isolated)/.test(t)) key = 'lonely';
  else if (/(bully|bullying|tease|teasing|hitting|beat)/.test(t)) { key = 'bullying'; suggestEmergency = /hitting|beat|hurt/.test(t); }
  else if (/(stress|stressed|pressure|overwhelm|too much|homework|exam)/.test(t)) key = 'stress';
  else if (/(anxious|anxiety|panic|worried|nervous|heart racing)/.test(t)) key = 'anxiety';
  else if (/(angry|mad|furious|rage|upset)/.test(t)) key = 'angry';
  else if (/(happy|good|great|excited|wonderful|joy)/.test(t)) key = 'happy';
  else if (/(breath|breathe|calm|relax|ground)/.test(t)) key = 'breathing';
  else if (/(thank|thanks|thx)/.test(t)) key = 'thanks';
  return { text: pick(safeBuddyResponses[key] || safeBuddyResponses.default), suggestEmergency };
}

function pushBot(container, text) {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `${text.replace(/\n/g, '<br>')}<div class="msg-time">${nowTime()}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
function pushUser(container, text) {
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `${text}<div class="msg-time">${nowTime()}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
function nowTime() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
