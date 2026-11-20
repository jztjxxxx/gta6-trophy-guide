// GTA 6 Trophy Guide & Tracker — all local, no network.
// Loads data/trophies.json (the only fetch in the app), renders the checklist,
// the roadmap and one trophy detail at a time. Progress lives in localStorage
// under KEY and can be exported to / imported from a JSON file.

const KEY = 'gta6-trophy-tracker-v1';
const SPOILER_KEY = 'gta6-trophy-spoilers-v1';

const listEl = document.getElementById('trophy-list');
const emptyEl = document.getElementById('empty-state');
const countEl = document.getElementById('result-count');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const hideEarnedEl = document.getElementById('hide-earned');
const spoilerEl = document.getElementById('spoiler');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let earned = new Set();
try {
  earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
} catch {
  earned = new Set();
}
earned = new Set([...earned].filter((id) => trophies.some((t) => t.id === id)));

let spoilersHidden = localStorage.getItem(SPOILER_KEY) === '1';
spoilerEl.checked = spoilersHidden;

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function saveSpoiler() {
  localStorage.setItem(SPOILER_KEY, spoilersHidden ? '1' : '0');
}

function isSpoilerHidden(t) {
  return spoilersHidden && t.kind === 'story' && !earned.has(t.id);
}

function gradeChip(t) {
  return `<span class="chip chip-${t.grade}">${t.grade}</span>`;
}

function kindLabel(t) {
  return t.kind === 'story' ? 'Story' : t.kind === 'collectible' ? 'Collectible' : t.kind === 'activity' ? 'Activity' : t.kind === 'missable' ? 'Missable' : 'General';
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  const pct = Math.round((done / total) * 100);
  document.getElementById('progress-count').textContent = `${done} of ${total} earned`;
  document.getElementById('progress-percent').textContent = `${pct}%`;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  const others = trophies.filter((t) => t.grade !== 'platinum');
  const othersDone = others.filter((t) => earned.has(t.id)).length;
  document.getElementById('platinum-line').textContent =
    `Platinum: ${othersDone} of ${others.length} other trophies earned`;
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (gradeEl.value === 'gold-silver') {
      if (t.grade !== 'gold' && t.grade !== 'silver') return false;
    } else if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) {
      return false;
    }
    if (kindEl.value === 'missable') {
      if (!t.missable) return false;
    } else if (kindEl.value !== 'all' && t.kind !== kindEl.value) {
      return false;
    }
    if (hideEarnedEl.checked && earned.has(t.id)) return false;
    if (q && !`${t.name} ${t.description}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderList() {
  const shown = visibleTrophies();
  listEl.replaceChildren();
  for (const t of shown) {
    const li = document.createElement('li');
    li.className = 'trophy' + (earned.has(t.id) ? ' earned' : '');
    li.dataset.id = String(t.id);

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'trophy-check';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id);
      else earned.delete(t.id);
      save();
      renderProgress();
      renderList();
    });

    const body = document.createElement('div');
    const name = document.createElement('h3');
    name.className = 'trophy-name';
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    if (isSpoilerHidden(t)) {
      name.textContent = 'Story trophy — hidden until earned';
      desc.textContent = 'Turn off “Hide story spoilers” or earn this trophy to reveal it.';
    } else {
      name.textContent = t.name;
      desc.textContent = t.description;
    }
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    meta.innerHTML = gradeChip(t) + `<span class="chip chip-kind">${kindLabel(t)}</span>` +
      (t.missable ? '<span class="chip chip-missable">missable</span>' : '');
    const guideBtn = document.createElement('button');
    guideBtn.type = 'button';
    guideBtn.className = 'trophy-guide-link';
    guideBtn.textContent = 'Guide & sources →';
    guideBtn.addEventListener('click', () => { location.hash = `#/trophy/${t.id}`; });
    meta.append(guideBtn);
    body.append(name, desc, meta);

    const detailBtn = document.createElement('button');
    detailBtn.type = 'button';
    detailBtn.className = 'trophy-detail-btn';
    detailBtn.textContent = 'Details';
    detailBtn.addEventListener('click', () => { location.hash = `#/trophy/${t.id}`; });

    li.append(box, body, detailBtn);
    listEl.append(li);
  }
  emptyEl.hidden = shown.length > 0;
  countEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies · ${earned.size} earned`;
}

function renderDetail(id) {
  const t = trophies.find((x) => x.id === id);
  const card = document.getElementById('detail-card');
  if (!t) {
    card.innerHTML = '<h2>Trophy not found</h2><p>That trophy is not in the official list of 55.</p>';
    return;
  }
  card.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = isSpoilerHidden(t) ? 'Story trophy — hidden until earned' : t.name;
  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  meta.innerHTML = gradeChip(t) + `<span class="chip chip-kind">${kindLabel(t)}</span>` +
    (t.missable ? '<span class="chip chip-missable">missable</span>' : '');
  const desc = document.createElement('p');
  desc.className = 'official-desc';
  desc.textContent = isSpoilerHidden(t)
    ? 'The name and official description are hidden until you earn this trophy (spoiler setting is on).'
    : `Official description: “${t.description}”`;
  const guideH = document.createElement('h3');
  guideH.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.textContent = t.guide;
  const countH = document.createElement('h3');
  countH.textContent = 'Progress';
  const count = document.createElement('p');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', `Mark ${t.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id);
    else earned.delete(t.id);
    save();
    renderProgress();
    renderDetail(id);
    renderList();
  });
  const countLabel = document.createElement('label');
  countLabel.append(box, document.createTextNode(earned.has(t.id) ? ' Earned — ticked off' : ' Not earned yet — tick to mark it earned'));
  count.append(countLabel);
  const srcH = document.createElement('h3');
  srcH.textContent = 'Sources';
  const srcList = document.createElement('ul');
  srcList.className = 'sources';
  for (const s of t.sources) {
    const li = document.createElement('li');
    li.textContent = s;
    srcList.append(li);
  }
  if (t.psn_count !== undefined) {
    const li = document.createElement('li');
    li.textContent = `Count from the kit's starter guide: ${t.psn_count}.`;
    srcList.append(li);
  }
  card.append(h, meta, desc, guideH, guide, countH, count, srcH, srcList);
}

function route() {
  const hash = location.hash || '#/';
  const checklist = document.getElementById('view-checklist');
  const roadmap = document.getElementById('view-roadmap');
  const detail = document.getElementById('view-detail');
  document.getElementById('tab-checklist').classList.remove('active');
  document.getElementById('tab-roadmap').classList.remove('active');
  checklist.hidden = true;
  roadmap.hidden = true;
  detail.hidden = true;
  const m = hash.match(/^#\/trophy\/(\d+)$/);
  if (m) {
    renderDetail(Number(m[1]));
    detail.hidden = false;
  } else if (hash === '#/roadmap') {
    roadmap.hidden = false;
    document.getElementById('tab-roadmap').classList.add('active');
  } else {
    checklist.hidden = false;
    document.getElementById('tab-checklist').classList.add('active');
  }
  window.scrollTo(0, 0);
}

searchEl.addEventListener('input', renderList);
gradeEl.addEventListener('change', renderList);
kindEl.addEventListener('change', renderList);
hideEarnedEl.addEventListener('change', renderList);
spoilerEl.addEventListener('change', () => {
  spoilersHidden = spoilerEl.checked;
  saveSpoiler();
  renderList();
});

document.getElementById('export').addEventListener('click', () => {
  const payload = { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(ids)) throw new Error('bad file');
    earned = new Set(ids.filter((id) => trophies.some((t) => t.id === id)));
    save();
    renderProgress();
    renderList();
  } catch {
    alert('That file is not a valid trophy-progress export.');
  }
  e.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies? This cannot be undone.')) return;
  earned = new Set();
  save();
  renderProgress();
  renderList();
});

window.addEventListener('hashchange', route);
renderProgress();
renderList();
route();
