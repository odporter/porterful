// Porterful Visualizer Studio — Local UI Frontend
// v0.1 Phase 1

const API_BASE = '';

// Safe DOM helper — never crash on missing elements
function $(id) {
  const el = document.getElementById(id);
  return el;
}
function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}
function setClass(id, className) {
  const el = $(id);
  if (el) el.className = className;
}
function setStyle(id, prop, value) {
  const el = $(id);
  if (el && el.style) el.style[prop] = value;
}
function addHidden(id) {
  const el = $(id);
  if (el) el.classList.add('hidden');
}
function removeHidden(id) {
  const el = $(id);
  if (el) el.classList.remove('hidden');
}

// State
let state = {
  currentScreen: 'screen-start',
  templates: [],
  files: { audio: [], cover: [], lyrics: [] },
  selectedTemplate: null,
  selectedFormat: null,
  jobs: [],
  currentJobId: null,
  pollInterval: null,
  isFullscreen: false,
  previewPlaying: false
};

// DOM refs
const screens = {
  start: document.getElementById('screen-start'),
  create: document.getElementById('screen-create'),
  status: document.getElementById('screen-status'),
  output: document.getElementById('screen-output')
};

// Init
async function init() {
  await Promise.all([loadTemplates(), loadFiles()]);
  populateForm();
  showScreen('screen-start');
  setupListeners();
  loadRecentJobs();
}

// API helpers
async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Load data
async function loadTemplates() {
  try {
    state.templates = (await apiGet('/templates.json')).templates;
    renderTemplates();
  } catch (e) {
    console.error('Failed to load templates', e);
  }
}

async function loadFiles() {
  try {
    state.files = await apiGet('/api/files');
  } catch (e) {
    console.error('Failed to load files', e);
  }
}

// Populate form selects
function populateForm() {
  const audioSel = document.getElementById('audio-select');
  const coverSel = document.getElementById('cover-select');
  const lyricsSel = document.getElementById('lyrics-file-select');

  audioSel.innerHTML = '<option value="">Choose a song file...</option>' +
    state.files.audio.map(f => `<option value="${f}">${f}</option>`).join('');

  coverSel.innerHTML = '<option value="">Choose a cover image...</option>' +
    state.files.cover.map(f => `<option value="${f}">${f}</option>`).join('');

  lyricsSel.innerHTML = '<option value="">Choose a lyrics file...</option>' +
    state.files.lyrics.map(f => `<option value="${f}">${f}</option>`).join('');
}

// Render templates
function renderTemplates() {
  const grid = document.getElementById('template-grid');
  grid.innerHTML = state.templates.map(t => `
    <div class="template-card" data-id="${t.id}">
      <h4>${t.name}</h4>
      <p>${t.description}</p>
      <span class="vibe">${t.vibe}</span>
    </div>
  `).join('');

  grid.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedTemplate = card.dataset.id;
      updatePreview();
      validateForm();
    });
  });
}

// Screen navigation
function showScreen(id) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  state.currentScreen = id;
}

// Setup listeners
function setupListeners() {
  // Start
  document.getElementById('btn-start').addEventListener('click', () => {
    showScreen('screen-create');
  });

  // Back
  document.getElementById('btn-back-start').addEventListener('click', () => {
    showScreen('screen-start');
  });

  // Full screen preview
  setupFullscreenListeners();

  // Lyrics tabs
  document.querySelectorAll('.lyrics-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.lyrics-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const kind = tab.dataset.kind;
      document.getElementById('lyrics-text').classList.toggle('hidden', kind !== 'text');
      document.getElementById('lyrics-file-select').classList.toggle('hidden', kind === 'text');
    });
  });

  // Format selector
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.selectedFormat = btn.dataset.format;
      updatePreview();
      validateForm();
    });
  });

  // Form inputs
  ['audio-select', 'cover-select', 'artist-input', 'title-input',
   'lyrics-text', 'lyrics-file-select', 'rights-checkbox'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', validateForm);
    if (el && (el.tagName === 'TEXTAREA' || el.type === 'text')) {
      el.addEventListener('input', validateForm);
    }
  });

  // Generate
  document.getElementById('btn-generate').addEventListener('click', handleGenerate);

  // Output actions
  document.getElementById('btn-make-another').addEventListener('click', () => {
    resetForm();
    showScreen('screen-create');
  });

  document.getElementById('btn-open-folder').addEventListener('click', () => {
    if (state.currentJobId && jobs[state.currentJobId]) {
      const job = jobs[state.currentJobId];
      if (job.outputPath) {
        const dir = job.outputPath.substring(0, job.outputPath.lastIndexOf('/'));
        alert('Open this folder in Finder:\n' + dir);
      }
    }
  });
}

// Validate form
function validateForm() {
  const audio = document.getElementById('audio-select').value;
  const artist = document.getElementById('artist-input').value.trim();
  const title = document.getElementById('title-input').value.trim();
  const rights = document.getElementById('rights-checkbox').checked;
  const lyricsKind = document.querySelector('.lyrics-tabs .tab.active').dataset.kind;
  const lyricsText = document.getElementById('lyrics-text').value.trim();
  const lyricsFile = document.getElementById('lyrics-file-select').value;

  let valid = audio && artist && title && state.selectedTemplate && state.selectedFormat && rights;

  if (lyricsKind === 'text' && !lyricsText) valid = false;
  if ((lyricsKind === 'srt' || lyricsKind === 'lrc') && !lyricsFile) valid = false;

  const btn = document.getElementById('btn-generate');
  btn.disabled = !valid;

  const err = document.getElementById('generate-error');
  if (!valid) {
    err.textContent = 'Fill all required fields and confirm rights to continue.';
  } else {
    err.textContent = '';
  }

  return valid;
}

// Update preview
function updatePreview() {
  const preview = document.getElementById('template-preview');
  const fmtDisplay = document.getElementById('format-display');
  const frame = document.getElementById('preview-frame');
  const fsBtn = document.getElementById('btn-fullscreen-preview');

  if (state.selectedTemplate) {
    const t = state.templates.find(x => x.id === state.selectedTemplate);
    preview.innerHTML = `
      <h4>${t.name}</h4>
      <p style="color:var(--text-muted);font-size:13px">${t.description}</p>
      <span class="vibe">${t.vibe}</span>
    `;
  }

  if (state.selectedFormat) {
    const labels = { '9:16': 'Reels / TikTok', '1:1': 'Instagram / X', '16:9': 'YouTube' };
    fmtDisplay.innerHTML = `<p><strong>${labels[state.selectedFormat]}</strong> · ${state.selectedFormat}</p>`;

    // Update inline preview frame aspect ratio
    if (frame) {
      frame.classList.remove('empty');
      frame.innerHTML = '';
      const ratioMap = { '9:16': '9/16', '1:1': '1/1', '16:9': '16/9' };
      frame.style.aspectRatio = ratioMap[state.selectedFormat];

      // Render a static preview of the template
      renderPreviewInto(frame, state.selectedTemplate, state.selectedFormat);
      fsBtn.disabled = false;
    }
  } else {
    if (frame) {
      frame.classList.add('empty');
      frame.innerHTML = '<p class="empty-msg">Select a template and format to preview</p>';
      fsBtn.disabled = true;
    }
  }
}

// Render a static preview frame into a container
function renderPreviewInto(container, templateId, format) {
  const canvas = document.createElement('div');
  canvas.style.cssText = 'width:100%;height:100%;position:relative;overflow:hidden;';

  // Cover art background (use a placeholder gradient if no cover selected)
  const coverPath = document.getElementById('cover-select').value;
  if (coverPath) {
    canvas.style.backgroundImage = `url(file://${encodeURIComponent(coverPath)})`;
  } else {
    canvas.style.background = 'linear-gradient(135deg, #1a1a22 0%, #0d0d12 100%)';
  }
  canvas.style.backgroundSize = 'cover';
  canvas.style.backgroundPosition = 'center';

  // Template-specific overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:8% 6%;';

  // Top: artist + title
  const artist = document.getElementById('artist-input').value.trim() || 'Artist Name';
  const title = document.getElementById('title-input').value.trim() || 'Track Title';

  const top = document.createElement('div');
  top.innerHTML = `
    <div style="font-size:clamp(10px,2.5vw,16px);color:#C6A75E;text-align:center;margin-bottom:4px;opacity:0.9;">${artist}</div>
    <div style="font-size:clamp(12px,3vw,20px);color:#F2F2F2;text-align:center;font-weight:600;">${title}</div>
  `;

  // Bottom: lyric line + CTA if applicable
  const bottom = document.createElement('div');
  let lyricText = 'Your lyric line appears here';
  const lyricsTextarea = document.getElementById('lyrics-text');
  if (lyricsTextarea && lyricsTextarea.value.trim()) {
    const lines = lyricsTextarea.value.trim().split('\n').filter(l => l.trim());
    if (lines.length > 0) lyricText = lines[0];
  }

  if (templateId === 'release-promo') {
    bottom.innerHTML = `
      <div style="font-size:clamp(14px,4vw,28px);color:#F2F2F2;text-align:center;font-weight:600;margin-bottom:12%;">${lyricText}</div>
      <div style="display:flex;justify-content:center;">
        <span style="background:#C6A75E;color:#08080B;padding:3% 8%;border-radius:8px;font-size:clamp(10px,2.5vw,16px);font-weight:700;">OUT NOW</span>
      </div>
    `;
  } else if (templateId === 'support-this-artist') {
    bottom.innerHTML = `
      <div style="font-size:clamp(14px,4vw,28px);color:#F2F2F2;text-align:center;font-weight:600;margin-bottom:12%;">${lyricText}</div>
      <div style="font-size:clamp(10px,2.5vw,16px);color:#C6A75E;text-align:center;font-weight:600;">Support This Artist</div>
    `;
  } else if (templateId === 'cover-pulse') {
    bottom.innerHTML = `
      <div style="font-size:clamp(14px,4vw,28px);color:#F2F2F2;text-align:center;font-weight:600;">${lyricText}</div>
    `;
  } else {
    // classic-lyric, minimal-wave, fallback
    bottom.innerHTML = `
      <div style="font-size:clamp(14px,4vw,28px);color:#F2F2F2;text-align:center;font-weight:600;">${lyricText}</div>
    `;
  }

  overlay.appendChild(top);
  overlay.appendChild(bottom);
  canvas.appendChild(overlay);
  container.appendChild(canvas);

  // Add template badge
  const badge = document.createElement('span');
  badge.className = 'fs-badge';
  badge.textContent = templateId;
  container.appendChild(badge);
}

// ===== FULL SCREEN PREVIEW =====

function openFullscreenPreview() {
  const overlay = document.getElementById('fullscreen-overlay');
  const canvas = document.getElementById('fs-canvas');
  const fsBtn = document.getElementById('btn-fullscreen-preview');

  if (!state.selectedTemplate || !state.selectedFormat) return;

  // Set aspect ratio class
  canvas.className = '';
  canvas.classList.add(`fs-${state.selectedFormat.replace(':', 'x')}`);
  if (state.selectedTemplate === 'ocean-deck' || state.selectedTemplate === 'classic-lyric') {
    canvas.classList.add('ocean-deck');
  }

  // Render content
  canvas.innerHTML = '';
  renderPreviewInto(canvas, state.selectedTemplate, state.selectedFormat);

  // Update HUD template name
  const t = state.templates.find(x => x.id === state.selectedTemplate);
  document.getElementById('fs-template-name').textContent = (t?.name || state.selectedTemplate).toUpperCase();

  // Show overlay
  overlay.classList.remove('hidden');
  state.isFullscreen = true;

  // Focus play button
  setTimeout(() => document.getElementById('fs-play-pause').focus(), 50);
}

function closeFullscreenPreview() {
  const overlay = document.getElementById('fullscreen-overlay');
  overlay.classList.add('hidden');
  state.isFullscreen = false;
}

// Full screen controls
function setupFullscreenListeners() {
  const fsBtn = document.getElementById('btn-fullscreen-preview');
  if (fsBtn) {
    fsBtn.addEventListener('click', openFullscreenPreview);
  }

  const exitBtn = document.getElementById('fs-exit');
  if (exitBtn) {
    exitBtn.addEventListener('click', closeFullscreenPreview);
  }

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isFullscreen) {
      closeFullscreenPreview();
    }
  });

  // Play/pause stub (no audio in preview v0.1)
  const playBtn = document.getElementById('fs-play-pause');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      state.previewPlaying = !state.previewPlaying;
      playBtn.textContent = state.previewPlaying ? '⏸' : '▶';
    });
  }

  // Scrubber stub
  const scrubber = document.getElementById('fs-scrubber');
  if (scrubber) {
    scrubber.addEventListener('input', (e) => {
      const pct = e.target.value;
      document.getElementById('fs-time').textContent = `${Math.floor(pct * 0.03)}:00 / 3:00`;
    });
  }
}

// Handle generate
async function handleGenerate() {
  if (!validateForm()) return;

  const lyricsKind = document.querySelector('.lyrics-tabs .tab.active').dataset.kind;
  const body = {
    artist: document.getElementById('artist-input').value.trim(),
    title: document.getElementById('title-input').value.trim(),
    audio: document.getElementById('audio-select').value,
    cover: document.getElementById('cover-select').value,
    lyricsKind: lyricsKind,
    lyricsText: lyricsKind === 'text' ? document.getElementById('lyrics-text').value : '',
    lyricsFile: lyricsKind !== 'text' ? document.getElementById('lyrics-file-select').value : '',
    template: state.selectedTemplate,
    format: state.selectedFormat,
    outputName: '',
    rightsConfirmed: true
  };

  try {
    showScreen('screen-status');
    setClass('status-pill', 'status-pill queued');
    setText('status-pill', 'Queued');
    setStyle('progress-fill', 'width', '0%');
    setText('status-detail', 'Waiting to start...');
    addHidden('job-meta');

    const result = await apiPost('/api/generate', body);
    state.currentJobId = result.jobId;

    // Show job meta
    setText('job-artist', body.artist);
    setText('job-title', body.title);
    setText('job-template', state.selectedTemplate);
    setText('job-format', state.selectedFormat);
    removeHidden('job-meta');

    startPolling(result.jobId);
  } catch (e) {
    setClass('status-pill', 'status-pill failed');
    setText('status-pill', 'Failed');
    setText('status-detail', e.message || 'Request failed');
  }
}

// Poll job status
let jobs = {};

function startPolling(jobId) {
  if (state.pollInterval) clearInterval(state.pollInterval);

  state.pollInterval = setInterval(async () => {
    try {
      const job = await apiGet('/api/jobs/' + jobId);
      jobs[jobId] = job;
      updateStatusUI(job);

      if (job.status === 'complete' || job.status === 'failed') {
        clearInterval(state.pollInterval);
        state.pollInterval = null;
        if (job.status === 'complete') {
          setTimeout(() => showOutput(job), 800);
        }
      }
    } catch (e) {
      console.error('Poll error', e);
    }
  }, 1500);
}

function updateStatusUI(job) {
  const pill = $('status-pill');
  const fill = $('progress-fill');
  const detail = $('status-detail');

  if (pill) {
    pill.className = 'status-pill ' + job.status;
    pill.textContent = job.status.charAt(0).toUpperCase() + job.status.slice(1);
  }

  if (job.status === 'queued') {
    setStyle('progress-fill', 'width', '10%');
    setText('status-detail', 'Waiting to start...');
  } else if (job.status === 'rendering') {
    setStyle('progress-fill', 'width', '60%');
    setText('status-detail', 'Rendering your video...');
  } else if (job.status === 'complete') {
    setStyle('progress-fill', 'width', '100%');
    setText('status-detail', 'Done!');
  } else if (job.status === 'failed') {
    setStyle('progress-fill', 'width', '100%');
    setText('status-detail', job.error || 'Generation failed');
  }
}

function showOutput(job) {
  showScreen('screen-output');

  const thumb = $('output-thumb');
  const fallback = $('output-fallback');

  if (job.thumbnailPath && thumb) {
    thumb.src = 'file://' + job.thumbnailPath;
    thumb.classList.remove('hidden');
    if (fallback) fallback.classList.add('hidden');
  } else {
    if (thumb) thumb.classList.add('hidden');
    if (fallback) fallback.classList.remove('hidden');
  }

  const link = $('output-link');
  if (job.outputPath && link) {
    link.href = 'file://' + job.outputPath;
    link.classList.remove('hidden');
  } else if (link) {
    link.classList.add('hidden');
  }

  setText('output-path', job.outputPath || '-');
  setText('output-time', job.completedAt ? new Date(job.completedAt).toLocaleString() : '-');
}

// Reset form
function resetForm() {
  document.getElementById('audio-select').value = '';
  document.getElementById('cover-select').value = '';
  document.getElementById('artist-input').value = '';
  document.getElementById('title-input').value = '';
  document.getElementById('lyrics-text').value = '';
  document.getElementById('lyrics-file-select').value = '';
  document.getElementById('rights-checkbox').checked = false;
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('selected'));
  state.selectedTemplate = null;
  state.selectedFormat = null;
  updatePreview();
  validateForm();
}

// Recent jobs
async function loadRecentJobs() {
  try {
    const recent = await apiGet('/api/jobs');
    if (recent && recent.length > 0) {
      document.getElementById('recent-jobs').classList.remove('hidden');
      const list = document.getElementById('recent-list');
      list.innerHTML = recent.slice(-5).reverse().map(j => `
        <div class="job-card" data-job="${j.jobId}">
          <div class="info">
            <h4>${j.artist} — ${j.title}</h4>
            <p>${j.template} · ${j.format}</p>
          </div>
          <span class="pill status-pill ${j.status}">${j.status}</span>
        </div>
      `).join('');

      list.querySelectorAll('.job-card').forEach(card => {
        card.addEventListener('click', () => {
          const job = recent.find(j => j.jobId === card.dataset.job);
          if (job) {
            if (job.status === 'complete') showOutput(job);
            else {
              state.currentJobId = job.jobId;
              showScreen('screen-status');
              startPolling(job.jobId);
            }
          }
        });
      });
    }
  } catch (e) {
    console.error('Failed to load jobs', e);
  }
}

// Boot
init();
