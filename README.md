# Homeschool Hub

A complete weekly homeschool syllabus and project library for **1st, 3rd, and 5th grade** — with **Math** and **Science** across 36 weeks, interactive activity widgets, and a full project/adventure library (build, hike, camp, fish).

Works as a **Chrome extension** or a plain static site.

## Features

- **36-week syllabus** across 3 grade levels × 2 subjects (math + science)
- **30+ interactive activity widgets** (arithmetic drills, matching games, fractions, place value, coordinates, quizzes, and more)
- **Thinking Challenges** designed to build analytical & critical thinking
- **Supplementary resource links** (Khan Academy, NASA, Mystery Science, USGS, etc.)
- **32 seed projects** across four categories:
  - 🔬 Build / Experiment
  - 🥾 Nature Walks / Hikes
  - ⛺ Camping
  - 🎣 Fishing
- **Add your own projects** with title, materials, steps, and the lesson being taught
- **Progress tracking** saved locally per-grade, per-subject, per-week
- **Export / Import** your data as a JSON file (share across devices, back up before a reinstall)
- **Print-friendly** weekly syllabus

## Install as a Chrome extension

1. Clone this repo or download the ZIP.
2. Open Chrome and go to `chrome://extensions`.
3. Toggle **Developer mode** (top right).
4. Click **Load unpacked** and select this folder.
5. Click the extension icon in your toolbar to open the app in a new tab.

## Run as a plain website

```bash
python3 -m http.server 8765
# then open http://localhost:8765/ in your browser
```

Or just open `index.html` directly in a browser (all paths are relative).

## Export & Import

Click the **⚙ Data** button in the top bar.

- **Export All Data** downloads a JSON file containing completion checkboxes, current week/grade, and all custom projects.
- **Import Data** reads a JSON file and restores everything. Prompts before overwriting.

Use this to:
- Back up before switching computers
- Share curriculum state between parent and kids
- Reset to a known-good state

## File layout

```
homeschool-app/
├── manifest.json      — Chrome extension manifest (v3)
├── background.js      — Service worker (opens app on icon click)
├── index.html         — Main app shell
├── styles.css         — All styles
├── curriculum.js      — 36-week curriculum data
├── projects.js        — Seed project & adventure data + storage helpers
├── activities.js      — Interactive widgets (30+ types)
├── app.js             — Navigation, rendering, export/import, progress
├── icons/             — Extension icons (16, 32, 48, 128 px)
└── README.md
```

## Data storage

All user data lives in browser `localStorage` under these keys:

- `homeschool-progress-v1` — completion checkboxes
- `homeschool-state-v1` — current week & grade selection
- `homeschool-projects-v1` — user-added projects

No data leaves your browser unless you explicitly export it.

## License

Personal / educational use. Feel free to fork and adapt.
