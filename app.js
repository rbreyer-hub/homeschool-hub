/*
 * Main application: renders weekly syllabus, handles navigation, progress, modals.
 */

const STORAGE_KEY = 'homeschool-progress-v1';
const STATE_KEY = 'homeschool-state-v1';

let state = loadState();

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
    return { week: s.week || 1, grade: s.grade || 'all' };
  } catch { return { week: 1, grade: 'all' }; }
}
function saveState() {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function progressKey(week, grade, subject) { return `w${week}-g${grade}-${subject}`; }

function markComplete(week, grade, subject, done) {
  const p = loadProgress();
  p[progressKey(week, grade, subject)] = done;
  saveProgress(p);
  updateWeekProgressBar();
}

function isComplete(week, grade, subject) {
  return loadProgress()[progressKey(week, grade, subject)] === true;
}

function escHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

const SUBJECT_META = {
  math:    { icon: "M", label: "Math",    cls: "subject-math" },
  science: { icon: "S", label: "Science", cls: "subject-science" },
  reading: { icon: "R", label: "Reading", cls: "subject-reading" },
  writing: { icon: "W", label: "Writing", cls: "subject-writing" }
};

function lessonKey(week, grade, subject, day) { return `w${week}-g${grade}-${subject}-day${day}`; }
function isLessonDone(week, grade, subject, day) { return loadProgress()[lessonKey(week, grade, subject, day)] === true; }
function markLessonDone(week, grade, subject, day, done) {
  const p = loadProgress();
  p[lessonKey(week, grade, subject, day)] = done;
  saveProgress(p);
  updateWeekProgressBar();
}

function renderSubjectBlock(grade, subjectKey, block) {
  const meta = SUBJECT_META[subjectKey];
  const isLiteracy = subjectKey === 'reading' || subjectKey === 'writing';
  const activityBtns = (block.activities || []).map((a, i) => {
    return `<button class="activity-btn ${subjectKey}" data-act="${i}" data-grade="${grade}" data-subject="${subjectKey}">&#9658; ${escHtml(a.label)}</button>`;
  }).join('');
  const objs = (block.objectives || []).map(o => `<li>${escHtml(o)}</li>`).join('');
  const resources = (block.resources || []).map(r => `<li><a href="${escHtml(r.url)}" target="_blank" rel="noopener">${escHtml(r.label)}</a> &#8599;</li>`).join('');

  let mainContent = '';
  if (isLiteracy) {
    const focus = block.focus ? `<p class="focus-line">${escHtml(block.focus)}</p>` : '';
    const lessonRows = (block.lessons || []).map(l => {
      const done = isLessonDone(state.week, grade, subjectKey, l.day);
      return `
        <div class="lesson-row ${done ? 'done' : ''}">
          <label class="lesson-check">
            <input type="checkbox" class="lesson-checkbox"
                   data-grade="${grade}" data-subject="${subjectKey}" data-day="${l.day}"
                   ${done ? 'checked' : ''} />
            <span class="day-chip">Day ${l.day}</span>
          </label>
          <div class="lesson-body">
            <div class="lesson-title">${escHtml(l.title)} <span class="lesson-duration">${escHtml(l.duration || '')}</span></div>
            <div class="lesson-task">${escHtml(l.task)}</div>
          </div>
        </div>
      `;
    }).join('');
    mainContent = `
      ${focus}
      <div class="section-heading">4 Daily Lessons</div>
      <div class="lessons-list">${lessonRows}</div>
    `;
  } else {
    mainContent = `
      <div class="section-heading">Objectives</div>
      <ul class="objectives">${objs}</ul>
      <div class="section-heading">Interactive Activities</div>
      <div class="activities">${activityBtns || '<em style="color:#5a6378;">Use resources &amp; challenge below.</em>'}</div>
    `;
  }

  const complete = isComplete(state.week, grade, subjectKey);
  return `
    <div class="subject-block ${meta.cls}">
      <h3 class="subject-title">
        <span class="subject-icon">${meta.icon}</span>
        ${meta.label}
      </h3>
      <p class="topic">${escHtml(block.topic || '')}</p>

      ${mainContent}

      <div class="challenge">
        <strong>&#128161; ${isLiteracy ? 'Bonus Challenge' : 'Thinking Challenge'}:</strong> ${escHtml(block.challenge || '')}
      </div>

      <div class="section-heading">Supplementary Resources</div>
      <ul class="resources">${resources}</ul>

      <div class="completion-row">
        <label>
          <input type="checkbox" class="complete-check"
                 data-grade="${grade}" data-subject="${subjectKey}"
                 ${complete ? 'checked' : ''} />
          Mark ${meta.label.toLowerCase()} complete
        </label>
      </div>
    </div>
  `;
}

function renderWeek() {
  const weekIdx = state.week - 1;
  const week = CURRICULUM[weekIdx];
  if (!week) return;
  const view = document.getElementById('weekView');
  const weekNum = state.week;

  const gradesToShow = state.grade === 'all' ? ['1', '3', '5'] : [state.grade];

  const literacyWeek = (typeof LITERACY !== 'undefined' && LITERACY[weekIdx]) ? LITERACY[weekIdx] : null;

  const sections = gradesToShow.map(g => {
    const gData = week.grades[g];
    if (!gData) return '';
    const mathHtml    = renderSubjectBlock(g, 'math',    gData.math);
    const sciHtml     = renderSubjectBlock(g, 'science', gData.science);
    const litData     = literacyWeek && literacyWeek.grades[g];
    const readingHtml = litData ? renderSubjectBlock(g, 'reading', litData.reading) : '';
    const writingHtml = litData ? renderSubjectBlock(g, 'writing', litData.writing) : '';
    return `
      <section class="grade-section" data-grade="${g}">
        <span class="grade-label">${g === '1' ? '1st Grade' : g === '3' ? '3rd Grade' : '5th Grade'}</span>
        ${mathHtml}
        ${sciHtml}
        ${readingHtml}
        ${writingHtml}
      </section>
    `;
  }).join('');

  const subjectList = ['math', 'science', 'reading', 'writing'];
  const totalCount = gradesToShow.length * subjectList.length;
  const doneCount = gradesToShow.reduce((acc, g) => {
    return acc + subjectList.reduce((a, s) => a + (isComplete(weekNum, g, s) ? 1 : 0), 0);
  }, 0);
  const pct = Math.round((doneCount / totalCount) * 100);

  view.innerHTML = `
    <div class="week-header">
      <div>
        <h2>Week ${weekNum}: ${escHtml(week.theme)}</h2>
        <div class="week-theme">${doneCount} of ${totalCount} subjects complete for the view</div>
      </div>
      <div>
        <div class="week-progress-bar"><div class="week-progress-fill" id="weekFill" style="width:${pct}%;"></div></div>
      </div>
    </div>
    ${sections}
  `;

  // Attach events
  view.querySelectorAll('.activity-btn').forEach(btn => {
    btn.onclick = () => {
      const grade = btn.dataset.grade;
      const subjectKey = btn.dataset.subject;
      const idx = parseInt(btn.dataset.act);
      const act = CURRICULUM[weekIdx].grades[grade][subjectKey].activities[idx];
      launchActivity(act.type, act.config || {});
    };
  });
  view.querySelectorAll('.complete-check').forEach(chk => {
    chk.onchange = () => {
      markComplete(weekNum, chk.dataset.grade, chk.dataset.subject, chk.checked);
    };
  });
  view.querySelectorAll('.lesson-checkbox').forEach(chk => {
    chk.onchange = () => {
      markLessonDone(weekNum, chk.dataset.grade, chk.dataset.subject, parseInt(chk.dataset.day), chk.checked);
      chk.closest('.lesson-row').classList.toggle('done', chk.checked);
      // If all 4 days are done, auto-check the subject-complete box
      const subj = chk.dataset.subject;
      const grade = chk.dataset.grade;
      const allDone = [1,2,3,4].every(d => isLessonDone(weekNum, grade, subj, d));
      if (allDone && !isComplete(weekNum, grade, subj)) {
        markComplete(weekNum, grade, subj, true);
        const subjBox = view.querySelector(`.complete-check[data-grade="${grade}"][data-subject="${subj}"]`);
        if (subjBox) subjBox.checked = true;
      }
    };
  });
}

function updateWeekProgressBar() {
  const weekNum = state.week;
  const gradesToShow = state.grade === 'all' ? ['1', '3', '5'] : [state.grade];
  const subjectList = ['math', 'science', 'reading', 'writing'];
  const totalCount = gradesToShow.length * subjectList.length;
  const doneCount = gradesToShow.reduce((acc, g) => {
    return acc + subjectList.reduce((a, s) => a + (isComplete(weekNum, g, s) ? 1 : 0), 0);
  }, 0);
  const pct = Math.round((doneCount / totalCount) * 100);
  const fill = document.getElementById('weekFill');
  if (fill) fill.style.width = pct + '%';
  // Update "X of Y" text
  const themeEl = document.querySelector('.week-theme');
  if (themeEl) themeEl.textContent = `${doneCount} of ${totalCount} subjects complete for the view`;
}

function populateWeekSelect() {
  const sel = document.getElementById('weekSelect');
  sel.innerHTML = '';
  CURRICULUM.forEach((w, i) => {
    const opt = document.createElement('option');
    opt.value = i + 1;
    opt.textContent = `Week ${i + 1} — ${w.theme}`;
    sel.appendChild(opt);
  });
  sel.value = state.week;
}

function setWeek(n) {
  const clamped = Math.max(1, Math.min(CURRICULUM.length, n));
  state.week = clamped;
  document.getElementById('weekSelect').value = clamped;
  saveState();
  renderWeek();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setGrade(g) {
  state.grade = g;
  document.querySelectorAll('.grade-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.grade === g);
  });
  saveState();
  renderWeek();
}

function renderProgress() {
  const progress = loadProgress();
  const rows = [];
  let totalDone = 0, totalAll = 0;
  const gradeLabels = { '1': '1st', '3': '3rd', '5': '5th' };
  ['1', '3', '5'].forEach(g => {
    let gDone = 0, gAll = 0;
    for (let w = 1; w <= CURRICULUM.length; w++) {
      ['math', 'science', 'reading', 'writing'].forEach(s => {
        gAll++;
        if (progress[progressKey(w, g, s)]) gDone++;
      });
    }
    totalDone += gDone; totalAll += gAll;
    const pct = Math.round((gDone / gAll) * 100);
    rows.push(`<div class="progress-item"><span>${gradeLabels[g]} Grade</span><span>${gDone}/${gAll} (${pct}%)</span></div>`);
  });
  const overallPct = Math.round((totalDone / totalAll) * 100);
  document.getElementById('progressContent').innerHTML = `
    <div class="progress-item"><strong>Overall</strong><strong>${totalDone}/${totalAll} (${overallPct}%)</strong></div>
    <div class="progress-bar-big"><div class="fill" style="width:${overallPct}%;"></div></div>
    ${rows.join('')}
    <div style="margin-top:1rem;color:#5a6378;font-size:0.9rem;">Progress auto-saves in your browser. Reset to clear and start fresh.</div>
  `;
}

// ---------- Export / Import ----------
const APP_VERSION = '1.1.0';
const DATA_KEYS = [STORAGE_KEY, STATE_KEY, 'homeschool-projects-v1'];

function exportData() {
  const payload = {
    app: 'homeschool-hub',
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {}
  };
  DATA_KEYS.forEach(k => {
    const val = localStorage.getItem(k);
    if (val !== null) {
      try { payload.data[k] = JSON.parse(val); }
      catch { payload.data[k] = val; }
    }
  });
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const ts = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `homeschool-hub-backup-${ts}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showSettingsStatus('✓ Export downloaded', 'correct');
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed || parsed.app !== 'homeschool-hub' || !parsed.data) {
        showSettingsStatus('Not a valid Homeschool Hub export file.', 'wrong');
        return;
      }
      if (!confirm('Importing will OVERWRITE your current data. Continue?')) return;
      DATA_KEYS.forEach(k => {
        if (parsed.data[k] !== undefined) {
          localStorage.setItem(k, JSON.stringify(parsed.data[k]));
        }
      });
      state = loadState();
      populateWeekSelect();
      setGrade(state.grade);
      renderWeek();
      if (!document.getElementById('projectsView').classList.contains('hidden')) renderProjects();
      showSettingsStatus('✓ Import complete — data restored.', 'correct');
    } catch (err) {
      showSettingsStatus('Could not read file: ' + err.message, 'wrong');
    }
  };
  reader.onerror = () => showSettingsStatus('Error reading file.', 'wrong');
  reader.readAsText(file);
}

function showSettingsStatus(msg, type) {
  const el = document.getElementById('settingsStatus');
  el.innerHTML = msg;
  el.className = 'feedback ' + (type || 'info');
  setTimeout(() => { if (el.innerHTML === msg) { el.innerHTML = ''; el.className = 'feedback'; } }, 5000);
}

// ---------- Projects view ----------
let projectFilter = 'all';

function renderProjects() {
  const list = document.getElementById('projectsList');
  const all = loadProjects();
  const filtered = projectFilter === 'all' ? all : all.filter(p => p.category === projectFilter);
  if (filtered.length === 0) {
    list.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#5a6378;padding:2rem;">No projects in this category yet. Click <strong>+ Add New Idea</strong> to create one.</p>';
    return;
  }
  list.innerHTML = filtered.map(p => renderProjectCard(p)).join('');
  list.querySelectorAll('.card-expand button').forEach(btn => {
    btn.onclick = () => {
      const card = btn.closest('.project-card');
      card.classList.toggle('expanded');
      const details = card.querySelector('.card-details');
      if (details) details.classList.toggle('hidden');
      btn.textContent = card.classList.contains('expanded') ? 'Show less' : 'Show details';
    };
  });
  list.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      if (confirm('Delete this project?')) {
        deleteUserProject(id);
        renderProjects();
      }
    };
  });
}

function renderProjectCard(p) {
  const catInfo = CATEGORY_INFO[p.category] || CATEGORY_INFO.build;
  const ages = (p.ages || []).map(a => `<span>${a === '1' ? '1st' : a === '3' ? '3rd' : '5th'}</span>`).join('');
  const materials = (p.materials || []).map(m => `<li>${escHtml(m)}</li>`).join('');
  const steps = (p.steps || []).map(s => `<li>${escHtml(s)}</li>`).join('');
  const userBadge = p.userAdded ? '<span class="user-added-badge">Yours</span>' : '';
  const deleteBtn = p.userAdded ? `<button class="delete-btn" data-id="${p.id}" title="Delete">✕</button>` : '';
  return `
    <div class="project-card ${p.userAdded ? 'user-added' : ''}" data-cat="${p.category}">
      ${deleteBtn}
      <div class="card-head">
        <h3>${escHtml(p.title)}${userBadge}</h3>
        <span class="cat-badge">${catInfo.icon} ${catInfo.label}</span>
      </div>
      <div class="ages-line">Ages: ${ages || '<span>All</span>'}</div>
      <div class="card-details hidden">
        <div class="card-section">
          <div class="card-section-heading">Materials</div>
          <ul>${materials || '<li><em>None specified</em></li>'}</ul>
        </div>
        <div class="card-section">
          <div class="card-section-heading">Steps</div>
          <ol>${steps || '<li><em>None specified</em></li>'}</ol>
        </div>
      </div>
      <div class="lesson-box">
        <strong>💡 What we're teaching:</strong> ${escHtml(p.lesson || '')}
      </div>
      <div class="card-expand"><button>Show details</button></div>
    </div>
  `;
}

function switchView(v) {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  const syllabus = document.getElementById('weekView');
  const controls = document.getElementById('syllabusControls');
  const projects = document.getElementById('projectsView');
  if (v === 'projects') {
    syllabus.classList.add('hidden');
    controls.classList.add('hidden');
    projects.classList.remove('hidden');
    renderProjects();
  } else {
    syllabus.classList.remove('hidden');
    controls.classList.remove('hidden');
    projects.classList.add('hidden');
  }
}

function handleAddProject(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const ages = Array.from(form.querySelectorAll('input[name="ages"]:checked')).map(i => i.value);
  const project = {
    title: data.get('title').trim(),
    category: data.get('category'),
    ages: ages.length ? ages : ['1','3','5'],
    materials: data.get('materials').split('\n').map(s => s.trim()).filter(Boolean),
    steps: data.get('steps').split('\n').map(s => s.trim()).filter(Boolean),
    lesson: data.get('lesson').trim()
  };
  if (!project.title) return;
  addUserProject(project);
  form.reset();
  document.getElementById('addProjectModal').classList.add('hidden');
  renderProjects();
}

// ---------- Event wiring ----------
document.addEventListener('DOMContentLoaded', () => {
  populateWeekSelect();
  setGrade(state.grade);
  renderWeek();

  // View switching
  document.querySelectorAll('.view-btn').forEach(b => {
    b.onclick = () => switchView(b.dataset.view);
  });

  // Project category tabs
  document.querySelectorAll('.cat-tab').forEach(t => {
    t.onclick = () => {
      projectFilter = t.dataset.cat;
      document.querySelectorAll('.cat-tab').forEach(x => x.classList.toggle('active', x === t));
      renderProjects();
    };
  });

  // Add project modal
  document.getElementById('addProjectBtn').onclick = () => {
    document.getElementById('addProjectModal').classList.remove('hidden');
  };
  document.getElementById('closeAddProject').onclick = () => {
    document.getElementById('addProjectModal').classList.add('hidden');
  };
  document.getElementById('cancelProject').onclick = () => {
    document.getElementById('addProjectModal').classList.add('hidden');
  };
  document.getElementById('addProjectForm').onsubmit = handleAddProject;

  // Settings / export / import
  document.getElementById('settingsBtn').onclick = () => {
    document.getElementById('settingsModal').classList.remove('hidden');
  };
  document.getElementById('closeSettings').onclick = () => {
    document.getElementById('settingsModal').classList.add('hidden');
  };
  document.getElementById('exportBtn').onclick = exportData;
  document.getElementById('importBtn').onclick = () => {
    document.getElementById('importFileInput').click();
  };
  document.getElementById('importFileInput').onchange = e => {
    const file = e.target.files[0];
    if (file) importData(file);
    e.target.value = '';
  };

  document.getElementById('weekSelect').onchange = e => setWeek(parseInt(e.target.value));
  document.getElementById('prevWeek').onclick = () => setWeek(state.week - 1);
  document.getElementById('nextWeek').onclick = () => setWeek(state.week + 1);

  document.querySelectorAll('.grade-tab').forEach(tab => {
    tab.onclick = () => setGrade(tab.dataset.grade);
  });

  document.getElementById('printBtn').onclick = () => window.print();

  document.getElementById('progressBtn').onclick = () => {
    renderProgress();
    document.getElementById('progressModal').classList.remove('hidden');
  };
  document.getElementById('closeProgress').onclick = () => {
    document.getElementById('progressModal').classList.add('hidden');
  };
  document.getElementById('resetProgress').onclick = () => {
    if (confirm('Reset ALL progress? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      renderProgress();
      renderWeek();
    }
  };

  document.getElementById('closeModal').onclick = () => {
    document.getElementById('activityModal').classList.add('hidden');
  };

  // Close modals on backdrop click
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) m.classList.add('hidden');
    });
  });

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') setWeek(state.week - 1);
    if (e.key === 'ArrowRight') setWeek(state.week + 1);
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    }
  });
});
