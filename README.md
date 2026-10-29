# Mood Tracker

A simple multi-page web app that helps people who are living with depression and trying to recover. Each day they write a short check-in, and later they can look back and see how they have been doing.

**Live site:** https://njenga77.github.io/Mood-Tracker/

## Overview

When you are going through depression, it is hard to see that things are slowly changing. Bad days feel like they will last forever. This app is my answer to that problem. It lets a person record how they feel each day (mood, sleep, peace of mind and a short note), and then shows their history and a small summary, so they can see their own progress.

The app also shows real Kenyan helplines on the home page and in every footer, because tracking a mood is not a replacement for talking to a person.

I built it as my final project for the FSD-FT01 course (HTML, CSS and JavaScript).

## Features

- **3 linked pages:** Home, Check-in and Progress
- **Check-in form** with five fields: mood, date, hours of sleep, peace of mind (1 to 5) and an optional note
- **Form validation** in JavaScript with clear, kind error messages, and a success message after saving
- **Home page summary:** total check-ins, total hours slept, average peace score, and the latest 3 check-ins
- **Progress page:** all check-ins, newest first, with a **filter by mood**
- **Delete button** on each check-in on the Progress page
- **Data is saved in the browser** with `localStorage`, so it is still there after closing the tab
- **Kenya helplines** on the Home page and in the footer of every page
- **Responsive design** for mobile, tablet and desktop
- A calm colour palette chosen to feel gentle, not harsh

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Shows the summary boxes, the latest check-ins and the helplines |
| Check-in | `checkin.html` | The only page that adds data (the form) |
| Progress | `progress.html` | Shows all saved check-ins with a mood filter and delete buttons |

## Technologies used

- **HTML5** with semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- **CSS3** with variables, Flexbox, Grid and media queries
- **JavaScript (vanilla)** for DOM manipulation, event listeners, validation and `localStorage`
- **Git and GitHub** for version control and hosting (GitHub Pages)

## How it works

- Each page has `<body data-page="...">`. At the bottom of `script.js`, a small router reads that label and runs the right function for the page.
- Check-ins are stored as a list under one `localStorage` key, `moodTrackerCheckins`.
- To save, the code loads the list, adds the new check-in, and saves the list again. To delete, it keeps every check-in except the one clicked.
- The cards on the Home and Progress pages are built with JavaScript (`document.createElement`), not typed in the HTML.

### Validation rules

- Mood must be chosen
- Date must be today or earlier
- Hours of sleep must be a whole number from 1 to 24
- Peace of mind must be chosen (1 to 5)
- The note is optional

## How to run

1. Download or clone the repository:
   ```
   git clone https://github.com/Njenga77/Mood-Tracker.git
   ```
2. Open the folder and open `index.html` in a browser, or use the **Live Server** extension in VS Code.
3. Or just visit the live site: https://njenga77.github.io/Mood-Tracker/

No installs or build steps are needed.

## Project structure

```
Mood-Tracker/
  index.html      Home page
  checkin.html    Check-in form page
  progress.html   Progress page
  styles.css      All the styling
  script.js       All the JavaScript
  README.md
  LICENSE
```

## How I tested it

I tested by hand in the browser:

- Pressing Save with an empty form shows the error messages and saves nothing
- A valid check-in shows the success message and appears on Home and Progress
- The mood filter shows only the chosen mood
- The Delete button removes one check-in and the list updates
- With no data, the pages show a friendly "no check-ins yet" message
- The layout changes correctly on a phone-sized screen, a tablet-sized screen and a desktop screen

## Known bugs and limits

- **Date can be wrong late at night.** The form fills in today's date using UTC time. Kenya is 3 hours ahead, so between midnight and 3am the date may show yesterday. The user can change it by hand.
- **Zero hours of sleep is not allowed.** The form accepts 1 to 24 hours, so someone who did not sleep at all cannot enter 0.
- **Data stays in one browser.** `localStorage` is not shared between devices, and clearing the browser data deletes the check-ins.
- **No edit button.** To fix a check-in, you delete it and add it again.
- **Helpline numbers may change.** Please check that a number is still correct before relying on it.
- This app is a personal tracking tool. It is **not** medical advice and does not replace professional help.

## Ideas for the future

- Show the average of the last 7 check-ins, so progress is easier to see
- Show a gentle message when someone saves a very low peace score
- Add an edit button and a chart of mood over time

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Titus Njenga, [@Njenga77](https://github.com/Njenga77)
