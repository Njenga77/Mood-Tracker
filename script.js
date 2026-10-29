// ===== Storage helpers (used by every page) =====

// The name of the "drawer" in localStorage where we keep all check-ins
const KEY = "moodTrackerCheckins";

// Get all saved check-ins. Gives an empty list if nothing is saved yet.
function loadCheckins() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; } // saved data is broken: start fresh, do not crash
}

// Save the full list of check-ins. localStorage only keeps text, so we convert first.
function saveCheckins(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

// ===== Building blocks for the page =====

// Build one check-in card. showDeleteButton is true on Progress, false on Home.
function buildCheckinCard(checkin, showDeleteButton) {
  const li = document.createElement("li");
  const title = document.createElement("strong");
  title.textContent = checkin.mood; // textContent keeps user text safe

  const meta = document.createElement("span");
  meta.textContent = `${checkin.date}, ${checkin.sleep} hrs sleep, peace ${checkin.comfort}/5`;
  li.append(title, meta);

  // Only show the note if the user wrote one
  if (checkin.note) {
    const p = document.createElement("p");
    p.textContent = checkin.note;
    li.append(p);
  }

  // Hover: add a CSS class when the mouse is on the card, remove it when it leaves
  li.addEventListener("mouseenter", () => li.classList.add("hover"));
  li.addEventListener("mouseleave", () => li.classList.remove("hover"));

  if (showDeleteButton) {
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.className = "delete-btn";
    // Click: keep every check-in except this one, save, then redraw the list
    btn.addEventListener("click", () => {
      saveCheckins(loadCheckins().filter(x => x.id !== checkin.id));
      showProgressList();
    });
    li.append(btn);
  }
  return li;
}

// A friendly message card for when there are no check-ins yet
function buildEmptyMessage() {
  const li = document.createElement("li");
  li.textContent = "No check-ins yet. Whenever you feel ready, add your first reflection on the Check-in page.";
  return li;
}

// ===== Home page: summary boxes and the latest 3 check-ins =====
function showHomeSummary() {
  const list = loadCheckins();
  const stats = document.getElementById("stats");   // where the summary boxes go
  const recent = document.getElementById("recent"); // where the latest cards go

  // Add up all sleep hours, and work out the average peace score
  const totalSleep = list.reduce((sum, checkin) => sum + checkin.sleep, 0);
  // If the list is empty we show "0" (this avoids dividing by zero)
  const avgComfort = list.length ? (list.reduce((sum, checkin) => sum + checkin.comfort, 0) / list.length).toFixed(1) : "0";

  // Each pair is [label, value]. Build one box for each pair.
  [["Check-ins", list.length], ["Hours slept", totalSleep], ["Average peace", avgComfort]]
    .forEach(([label, value]) => {
      const box = document.createElement("div");
      const num = document.createElement("b");
      num.textContent = value;
      box.append(num, label);
      stats.append(box);
    });

  if (list.length === 0) recent.append(buildEmptyMessage());
  // Take the last 3, newest first, and show them without a Delete button
  list.slice(-3).reverse().forEach(checkin => recent.append(buildCheckinCard(checkin, false)));
}

// ===== Check-in page: check the form, then save =====
function setupCheckinForm() {
  const form = document.getElementById("checkin-form");
  const msg = document.getElementById("message"); // where we show errors or success
  const today = new Date().toISOString().split("T")[0]; // today as YYYY-MM-DD
  form.elements.date.value = today; // fill today's date for the user

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop the page from reloading

    // Read the values. Number() turns form text into real numbers.
    const mood = form.elements.mood.value.trim();
    const date = form.elements.date.value;
    const sleep = Number(form.elements.sleep.value);
    const comfort = Number(form.elements.comfort.value);

    // Collect all problems first, so the user can fix them together
    const errors = [];
    if (!mood) errors.push("Choose how you are feeling.");
    if (!date || date > today) errors.push("Choose today or an earlier date.");
    if (!Number.isInteger(sleep) || sleep < 1 || sleep > 24) errors.push("Hours of sleep must be a whole number from 1 to 24.");
    if (!comfort) errors.push("Choose a peace of mind level.");

    // If there are problems, show them and stop. Nothing is saved.
    if (errors.length) {
      msg.className = "error";
      msg.textContent = errors.join(" ");
      return;
    }

    // Load the list, add the new check-in, save the list again
    const list = loadCheckins();
    // id: the current time in milliseconds, so every check-in has a different id
    list.push({ id: Date.now(), mood, date, sleep, comfort, note: form.elements.note.value.trim() });
    saveCheckins(list);

    // Clear the form, put today's date back, and show a success message
    form.reset();
    form.elements.date.value = today;
    msg.className = "success";
    msg.textContent = "Check-in saved gently. Thank you for taking time for yourself. See it on the Progress page.";
  });
}

// ===== Progress page: all check-ins with a mood filter =====
function showProgressList() {
  const list = loadCheckins();
  const filter = document.getElementById("filter"); // the mood dropdown
  const ul = document.getElementById("all");        // the list of cards
  const chosen = filter.value; // remember the current choice before we rebuild the dropdown

  // Make a list of the different moods saved (Set removes repeats)
  const moods = [...new Set(list.map(checkin => checkin.mood))];
  filter.textContent = ""; // empty the dropdown
  filter.append(new Option("All moods", ""));
  moods.forEach(name => filter.append(new Option(name, name)));
  // Put the old choice back if it still exists
  filter.value = moods.includes(chosen) ? chosen : "";

  // Keep only the check-ins that match the chosen mood, newest first
  ul.textContent = "";
  const shown = list.filter(checkin => !filter.value || checkin.mood === filter.value).reverse();
  if (shown.length === 0) ul.append(buildEmptyMessage());
  shown.forEach(s => ul.append(buildCheckinCard(s, true)));
}

// ===== Start: each page has data-page on <body>. Run the matching function. =====
const page = document.body.dataset.page;
if (page === "home") showHomeSummary();
if (page === "checkin") setupCheckinForm();
if (page === "progress") {
  // Redraw the list whenever the user picks a different mood
  document.getElementById("filter").addEventListener("change", showProgressList);
  showProgressList();
}