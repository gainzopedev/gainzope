import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';

const API_BASE_URL = 'http://localhost:4000';
const firebaseConfig = {
  apiKey: 'AIzaSyC8gFmHj7ZG8VmCiwg84Skubtw-alPMJqU',
  authDomain: 'gainzope-c579f.firebaseapp.com',
  projectId: 'gainzope-c579f',
  appId: '1:955496044269:web:82a49b0d052f093653dee4'
};

const auth = getAuth(initializeApp(firebaseConfig));
const byId = (id) => document.getElementById(id);
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

let allSubscribers = [];
let currentFilter = 'all';
let searchTimer;
let currentAnalytics = null;

// Toast Notification
function showToast(message) {
  const container = byId('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

// Format relative and localized timestamp
function formatTimestamp(value) {
  if (!value) return '—';
  const date = new Date(value);
  const now = new Date();
  const diffSecs = Math.floor((now - date) / 1000);

  let relative = '';
  if (diffSecs < 60) relative = 'Just now';
  else if (diffSecs < 3600) relative = `${Math.floor(diffSecs / 60)}m ago`;
  else if (diffSecs < 86400) relative = `${Math.floor(diffSecs / 3600)}h ago`;
  else relative = `${Math.floor(diffSecs / 86400)}d ago`;

  const formatted = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);

  return `<div style="display:grid;gap:2px;">
    <span>${formatted}</span>
    <small style="color:var(--muted);font-size:11px;">${relative}</small>
  </div>`;
}

function setBusy(button, busy, label) {
  if (!button) return;
  if (!button.dataset.label) button.dataset.label = button.textContent;
  button.disabled = busy;
  button.textContent = busy ? label : button.dataset.label;
}

// Authentication handling
async function executeSignIn(email, password) {
  let token = null;
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    token = await cred.user.getIdToken();
  } catch (sdkError) {
    // REST API fallback
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || sdkError.message || 'Login failed.');
    token = data.idToken;
    localStorage.setItem('gainzope_token', token);
    localStorage.setItem('gainzope_admin_email', email);
  }
  return token;
}

async function getToken() {
  if (auth.currentUser) {
    try {
      return await auth.currentUser.getIdToken(true);
    } catch {
      // ignore
    }
  }
  return localStorage.getItem('gainzope_token');
}

async function api(path, options = {}) {
  const token = await getToken();
  if (!token) throw new Error('You must be signed in.');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      handleSignOut();
      throw new Error(data.error || 'Session expired. Please sign in again.');
    }
    throw new Error(data.error || 'Server request failed.');
  }
  return data;
}

// Live Clock
function updateClock() {
  const clockEl = byId('live-clock');
  if (!clockEl) return;
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }).format(now);
  clockEl.textContent = `${time} IST`;
}
setInterval(updateClock, 1000);
updateClock();

// Tab Navigation
function setupTabs() {
  const tabButtons = document.querySelectorAll('.nav-tab');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.tab-pane').forEach((pane) => {
        pane.hidden = true;
        pane.classList.remove('active');
      });

      const activePane = byId(`tab-content-${tabId}`);
      if (activePane) {
        activePane.hidden = false;
        activePane.classList.add('active');
      }
    });
  });
}

// Render SVG Analytics Chart
function renderTrafficChart(timeline = []) {
  const container = byId('traffic-chart-container');
  if (!container) return;

  if (!timeline || !timeline.length) {
    container.innerHTML = '<div class="chart-placeholder">No traffic data recorded yet.</div>';
    return;
  }

  const maxVisits = Math.max(5, ...timeline.map((d) => d.visits || 0));
  const maxSubs = Math.max(2, ...timeline.map((d) => d.subscribers || 0));
  const height = 200;
  const width = 1000;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const stepX = chartWidth / (timeline.length - 1 || 1);

  // Generate path points for Visits (Cyan)
  const visitPoints = timeline.map((d, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + chartHeight - (d.visits / maxVisits) * chartHeight;
    return { x, y, data: d };
  });

  // Generate path points for Unique Visitors (Lime)
  const uniquePoints = timeline.map((d, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + chartHeight - ((d.uniqueVisitors || 0) / maxVisits) * chartHeight;
    return { x, y, data: d };
  });

  const pathD = visitPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');
  const uniqueD = uniquePoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

  const areaD = `${pathD} L ${visitPoints[visitPoints.length - 1].x.toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} L ${visitPoints[0].x.toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} Z`;

  // Bars for Subscribers (Green bars)
  const barWidth = Math.max(6, Math.min(22, stepX * 0.35));
  const barsSvg = timeline.map((d, i) => {
    const x = padding.left + i * stepX - barWidth / 2;
    const barH = d.subscribers > 0 ? Math.max(4, (d.subscribers / maxSubs) * (chartHeight * 0.75)) : 0;
    const y = padding.top + chartHeight - barH;
    return barH > 0
      ? `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth}" height="${barH.toFixed(1)}" rx="3" fill="#10b981" opacity="0.85">
           <title>${d.label}: ${d.subscribers} waitlist signup(s)</title>
         </rect>`
      : '';
  }).join('');

  // X Axis labels
  const xLabels = timeline.map((d, i) => {
    // Show every 2nd label if many points
    if (timeline.length > 8 && i % 2 !== 0 && i !== timeline.length - 1) return '';
    const x = padding.left + i * stepX;
    const y = height - 10;
    return `<text x="${x.toFixed(1)}" y="${y}" fill="#828a7a" font-size="11" font-family="JetBrains Mono" text-anchor="middle">${d.label}</text>`;
  }).join('');

  // Horizontal grid lines
  const gridLines = [0, 0.5, 1].map((ratio) => {
    const y = padding.top + chartHeight * (1 - ratio);
    const val = Math.round(maxVisits * ratio);
    return `
      <line x1="${padding.left}" y1="${y.toFixed(1)}" x2="${width - padding.right}" y2="${y.toFixed(1)}" stroke="#1f271a" stroke-dasharray="4 4" />
      <text x="${padding.left - 10}" y="${(y + 4).toFixed(1)}" fill="#828a7a" font-size="10" font-family="JetBrains Mono" text-anchor="end">${val}</text>
    `;
  }).join('');

  // Circles for interactive points
  const dotsSvg = visitPoints.map((p) => `
    <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="#070906" stroke="#38bdf8" stroke-width="2.5" class="chart-dot">
      <title>${p.data.label}: ${p.data.visits} visits (${p.data.uniqueVisitors || 0} unique), ${p.data.subscribers} signups</title>
    </circle>
  `).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%;height:100%;">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      ${gridLines}
      ${barsSvg}
      <path d="${areaD}" fill="url(#areaGradient)" />
      <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" />
      <path d="${uniqueD}" fill="none" stroke="#c8ff00" stroke-width="2" stroke-dasharray="3 3" stroke-linecap="round" />
      ${dotsSvg}
      ${xLabels}
    </svg>
  `;
}

// Fetch & Update Analytics Dashboard
async function loadAnalytics() {
  try {
    const data = await api('/api/admin/website/analytics');
    currentAnalytics = data;

    // KPI Cards
    byId('total-pageviews').textContent = (data.totalVisits || 0).toLocaleString();
    byId('unique-visitors-badge').textContent = `Unique: ${(data.uniqueVisitors || 0).toLocaleString()}`;
    byId('today-visits-badge').textContent = `Today: +${data.todayVisits || 0}`;

    byId('subscriber-total').textContent = (data.totalSubscribers || 0).toLocaleString();
    byId('launch-subscriber-total').textContent = `Launch: ${data.launchSubscribers || 0}`;
    byId('footer-subscriber-total').textContent = `Footer: ${data.footerSubscribers || 0}`;

    const convRate = data.conversionRate || 0;
    byId('conversion-rate-value').textContent = `${convRate}%`;
    byId('conversion-rate-bar').style.width = `${Math.min(100, convRate)}%`;

    // Device breakdown
    const devices = data.deviceBreakdown || { desktop: 0, mobile: 0 };
    const totalDevices = (devices.desktop || 0) + (devices.mobile || 0) || 1;
    const mobilePct = Math.round(((devices.mobile || 0) / totalDevices) * 100);
    const desktopPct = 100 - mobilePct;

    byId('device-mobile-pct').textContent = `${mobilePct}% (${devices.mobile || 0})`;
    byId('device-desktop-pct').textContent = `${desktopPct}% (${devices.desktop || 0})`;
    byId('device-bar-mobile').style.width = `${mobilePct}%`;
    byId('device-bar-desktop').style.width = `${desktopPct}%`;

    // Referrers List
    const refContainer = byId('referrers-list');
    if (refContainer && data.referrers) {
      refContainer.innerHTML = data.referrers.length
        ? data.referrers.map((r) => `
            <div class="ref-row">
              <span>${escapeHtml(r.source)}</span>
              <b>${r.count} visit${r.count === 1 ? '' : 's'}</b>
            </div>
          `).join('')
        : '<div class="ref-row"><span>Direct Navigation</span><b>100%</b></div>';
    }

    // Chart
    renderTrafficChart(data.timeline);
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
}

// Fetch Subscribers
async function loadSubscribers() {
  try {
    const data = await api('/api/admin/website/email-subscribers?limit=100');
    allSubscribers = data.items || [];

    byId('nav-subs-count').textContent = allSubscribers.length;
    byId('badge-all').textContent = allSubscribers.length;
    byId('badge-launch').textContent = allSubscribers.filter((s) => /launch/i.test(s.source || '')).length;
    byId('badge-footer').textContent = allSubscribers.filter((s) => !/launch/i.test(s.source || '')).length;

    renderSubscribers();
  } catch (error) {
    byId('subscriber-list').innerHTML = `<tr><td colspan="5" class="table-empty error">${escapeHtml(error.message)}</td></tr>`;
  }
}

function renderSubscribers() {
  const query = byId('subscriber-search').value.trim().toLowerCase();
  const tbody = byId('subscriber-list');

  const filtered = allSubscribers.filter((item) => {
    const matchFilter = currentFilter === 'all'
      ? true
      : currentFilter === 'launch'
        ? /launch/i.test(item.source || '')
        : !/launch/i.test(item.source || '');
    const matchQuery = !query || item.email.toLowerCase().includes(query);
    return matchFilter && matchQuery;
  });

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="table-empty">No subscribers found matching the criteria.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map((sub) => {
    const initial = (sub.email[0] || 'U').toUpperCase();
    const sourceLabel = /launch/i.test(sub.source || '') ? 'Launch Alert' : 'Website Footer';
    const sourceClass = /launch/i.test(sub.source || '') ? 'lime' : 'cyan';

    return `
      <tr>
        <td>
          <div class="sub-cell">
            <span class="sub-avatar">${escapeHtml(initial)}</span>
            <span class="sub-email-text">${escapeHtml(sub.email)}</span>
          </div>
        </td>
        <td>
          <span class="tag-pill ${sourceClass}">${escapeHtml(sourceLabel)}</span>
        </td>
        <td>${formatTimestamp(sub.createdAt)}</td>
        <td>
          <span class="status-badge active">● ${escapeHtml(sub.status || 'Active')}</span>
        </td>
        <td>
          <button class="copy-btn" data-email="${escapeHtml(sub.email)}" title="Copy email address">
            Copy
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Attach copy listeners
  tbody.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = btn.dataset.email;
      navigator.clipboard.writeText(email).then(() => {
        btn.textContent = 'Copied!';
        btn.style.color = 'var(--lime)';
        btn.style.borderColor = 'var(--lime)';
        showToast(`Copied: ${email}`);
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 1800);
      });
    });
  });
}

// Fetch Campaigns
async function loadCampaigns() {
  const history = byId('campaign-history');
  try {
    const data = await api('/api/admin/website/email-campaigns');
    const campaigns = data.items || [];
    if (campaigns[0]) {
      const sentDate = new Date(campaigns[0].sentAt || campaigns[0].createdAt);
      byId('last-campaign').textContent = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(sentDate);
      byId('last-campaign-detail').textContent = `${campaigns[0].recipientCount} recipients · ${campaigns[0].status}`;
    }
    history.innerHTML = campaigns.length
      ? campaigns.map((campaign) => `
          <article>
            <div>
              <b>${escapeHtml(campaign.subject)}</b>
              <small>${new Date(campaign.sentAt || campaign.createdAt).toLocaleString('en-IN')} · ${campaign.recipientCount} recipients</small>
            </div>
            <span class="${campaign.status === 'sent' ? 'sent' : ''}">${escapeHtml(campaign.status)}</span>
          </article>
        `).join('')
      : '<p class="muted">No broadcast campaigns sent yet.</p>';
  } catch (error) {
    history.innerHTML = '<p class="error">' + escapeHtml(error.message) + '</p>';
  }
}

function exportSubscribers() {
  if (!allSubscribers.length) {
    byId('subscriber-message').textContent = 'No subscribers available to export.';
    return;
  }
  const rows = [
    ['Email Address', 'Registration Date', 'Source Channel', 'Status'],
    ...allSubscribers.map((item) => [
      item.email,
      item.createdAt ? new Date(item.createdAt).toISOString() : '',
      item.source,
      item.status
    ])
  ];
  const csv = rows.map((row) => row.map((cell) => '"' + String(cell || '').replace(/"/g, '""') + '"').join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `gainzope-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Subscribers CSV exported successfully!');
}

function campaignPayload(includeTestEmail = false) {
  return {
    subject: byId('campaign-subject').value.trim(),
    preview: byId('campaign-preview').value.trim(),
    content: byId('campaign-content').value.trim(),
    ...(includeTestEmail ? { testEmail: byId('test-email').value.trim() } : {})
  };
}

function setCampaignMessage(message, error = false) {
  const field = byId('campaign-message');
  field.textContent = message;
  field.classList.toggle('error', error);
}

function updateEmailPreview() {
  const subject = byId('campaign-subject').value.trim() || 'GAINZOPE Android App is Live!';
  const preview = byId('campaign-preview').value.trim() || 'Download now and start saving on mobile recharge.';
  const content = byId('campaign-content').value.trim() || 'Write your message on the left to see how the email will read in subscriber inboxes.';
  byId('preview-subject').textContent = subject;
  byId('preview-text').textContent = preview;
  byId('preview-heading').textContent = subject;
  byId('preview-content').textContent = content;
}

async function sendTest() {
  const button = byId('send-test');
  const payload = campaignPayload(true);
  if (!payload.testEmail) return setCampaignMessage('Enter a test email address first.', true);
  if (!payload.subject || !payload.content) return setCampaignMessage('Add a subject and message before sending.', true);
  setBusy(button, true, 'Sending test…');
  setCampaignMessage('');
  try {
    const data = await api('/api/admin/website/email-campaigns/test', { method: 'POST', body: JSON.stringify(payload) });
    setCampaignMessage(data.message);
    showToast('Test email dispatched!');
  } catch (error) {
    setCampaignMessage(error.message, true);
  } finally {
    setBusy(button, false);
  }
}

async function sendCampaign(event) {
  event.preventDefault();
  const button = byId('send-campaign');
  const payload = campaignPayload();
  if (!payload.subject || !payload.content) return setCampaignMessage('Add a subject and message before sending.', true);
  const count = Number(byId('subscriber-total').textContent) || allSubscribers.length;
  if (!count) return setCampaignMessage('No active subscribers to send to yet.', true);
  if (!window.confirm(`Broadcast this email to ${count} active subscriber(s)?`)) return;
  setBusy(button, true, 'Broadcasting…');
  setCampaignMessage('');
  try {
    const data = await api('/api/admin/website/email-campaigns/send', { method: 'POST', body: JSON.stringify(payload) });
    setCampaignMessage(data.message);
    showToast('Broadcast completed successfully!');
    byId('campaign-form').reset();
    updateEmailPreview();
    await Promise.all([loadCampaigns(), loadAnalytics()]);
  } catch (error) {
    setCampaignMessage(error.message, true);
  } finally {
    setBusy(button, false);
  }
}

// Global Refresh
async function refreshAll() {
  const btn = byId('refresh-subscribers');
  if (btn) btn.classList.add('rotating');
  try {
    await Promise.all([loadAnalytics(), loadSubscribers(), loadCampaigns()]);
    showToast('Live dashboard data updated!');
  } finally {
    if (btn) btn.classList.remove('rotating');
  }
}

// Sign Out
function handleSignOut() {
  signOut(auth).catch(() => {});
  localStorage.removeItem('gainzope_token');
  localStorage.removeItem('gainzope_admin_email');
  byId('admin-view').hidden = true;
  byId('login-view').hidden = false;
}

// Initialization & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();

  // Login form
  byId('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = byId('login-button');
    const msg = byId('login-message');
    const email = byId('email').value.trim();
    const password = byId('password').value.trim();

    msg.textContent = '';
    msg.classList.remove('error');
    setBusy(btn, true, 'Authenticating…');

    try {
      await executeSignIn(email, password);
      byId('admin-email').textContent = email;
      byId('login-view').hidden = true;
      byId('admin-view').hidden = false;
      await refreshAll();
    } catch (err) {
      msg.textContent = err.message;
      msg.classList.add('error');
    } finally {
      setBusy(btn, false);
    }
  });

  // Sign out button
  byId('sign-out')?.addEventListener('click', handleSignOut);

  // Refresh button
  byId('refresh-subscribers')?.addEventListener('click', refreshAll);

  // Search input
  byId('subscriber-search')?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderSubscribers, 150);
  });

  // Filter tabs
  byId('filter-tabs')?.addEventListener('click', (e) => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;
    document.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderSubscribers();
  });

  // Export CSV
  byId('export-subscribers')?.addEventListener('click', exportSubscribers);

  // Campaign Inputs
  ['campaign-subject', 'campaign-preview', 'campaign-content'].forEach((id) => {
    byId(id)?.addEventListener('input', updateEmailPreview);
  });
  byId('send-test')?.addEventListener('click', sendTest);
  byId('campaign-form')?.addEventListener('submit', sendCampaign);

  // Check existing session
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      byId('admin-email').textContent = user.email || 'admin';
      byId('login-view').hidden = true;
      byId('admin-view').hidden = false;
      await refreshAll();
    } else {
      const storedToken = localStorage.getItem('gainzope_token');
      if (storedToken) {
        byId('admin-email').textContent = localStorage.getItem('gainzope_admin_email') || 'admin';
        byId('login-view').hidden = true;
        byId('admin-view').hidden = false;
        await refreshAll();
      }
    }
  });

  // Auto-refresh analytics every 30 seconds
  setInterval(() => {
    if (!byId('admin-view').hidden) {
      loadAnalytics().catch(() => {});
    }
  }, 30000);
});
