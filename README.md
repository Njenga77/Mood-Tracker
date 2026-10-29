# Mood Pulse (Mood Tracker)

## Overview
A multi-page web app designed using the **Study Log** architecture to help people track their daily emotional check-ins, triggers, mindful self-care minutes, mood scores, and energy levels across pages.

## What Was Adapted from the Study Log Template
1. **Same 3-Page Semantic Structure (`index.html`, `add.html`, `history.html`)**:
   - Retains `<body data-page="home|add|history">` routing so a single `script.js` powers every page without global namespace pollution.
   - Keeps the semantic `<header>`, `<nav>`, `<main>`, `<section>`, and `<footer>` layout.
2. **Domain Mapping (Study Sessions → Mood Check-ins)**:
   - `studyLogSessions` in `localStorage` → `moodPulseCheckins`
   - `Subject` → `Primary mood` (`Joyful`, `Calm`, `Energized`, `Grateful`, `Focused`, `Tired`, `Anxious`, `Stressed`, `Low`) with emoji icons + `Main activity or trigger` text input
   - `Minutes studied` → `Mindful or self-care minutes` (1–600 whole-number validation, converted to `Mindful hours` on the Home page)
   - `Focus (1–5)` → `Mood score (1–5)` and `Energy level (1–5)` (both validated and averaged on the Home page)
   - `Note (optional)` → `Reflection or gratitude note (optional)`
3. **Creative Enhancements**:
   - **Color-Coded Check-in Cards**: Each `<li>` receives a `data-level="high|mid|low"` attribute based on its 1–5 mood rating, styling its left border in green (`--good`), ochre (`--mid`), or crimson (`--bad`).
   - **Emotional Balance Bar**: The Home page computes the proportion of positive (4–5), balanced (3), and low (1–2) check-ins and renders a proportional segmented progress bar.
   - **Calming Botanical Palette**: Updated `:root` design tokens in `styles.css` to a sage-and-amber wellness theme while keeping high WCAG contrast and mobile-first responsive media queries (`600px` tablet, `960px` desktop).

## Features
- **3 linked pages**:
  - **Home (`index.html`)**: Displays total check-ins, mindful hours, average mood score, average energy level, an emotional balance bar, and the 3 latest check-ins.
  - **Add check-in (`add.html`)**: Validates all inputs at once with helpful error messages and saves new entries to `localStorage`.
  - **History (`history.html`)**: Lists all saved check-ins in reverse chronological order, dynamically populates a mood filter dropdown (`Set`), and lets users delete individual entries.
- **XSS-safe DOM rendering**: Built strictly with `document.createElement` and `textContent`.
- **Responsive layout**: Mobile-first Flexbox and CSS Grid adapting at `600px` and `960px`.

## Technologies
HTML5 (semantic elements), CSS3 (custom properties, Flexbox, Grid, media queries), vanilla JavaScript (ES6+, `localStorage`).

## How to run
Unzip the folder and open `index.html` in any web browser, or use the VS Code Live Server extension.

## Known limits
- Data lives locally in one browser (`localStorage`); clearing site data removes saved check-ins.
- No edit button yet (delete an entry on the History page and re-add it).
