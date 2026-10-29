const KEY = "moodTrackerCheckins";

function loadCheckins() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
}

function saveCheckins(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
}

function buildCheckinCard(checkin, showDeleteButton) {
    const li = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = checkin.mood;

    const meta = document.createElement("span");
    meta.textContent = `${checkin.date}, ${checkin.sleep} hrs sleep, peace ${checkin.comfort}/5`;
    li.append(title, meta);
    if (checkin.note) {
        const p = document.createElement("p");
        p.textContent = checkin.note;
        li.append(p);
    }

    li.addEventListener("mouseenter", () => li.classList.add("hover"));
    li.addEventListener("mouseleave", () => li.classList.remove("hover"));

    if (showDeleteButton) {
        const btn = document.createElement("button");
        btn.textContent = "Delete";
        btn.className = "delete-btn";
        btn.addEventListener("click", () => {
            saveCheckins(loadCheckins().filter(x => x.id !== checkin.id));
            showProgressList();
        });
        li.append(btn);
    }
    return li;
}

function buildEmptyMessage() {
    const li = document.createElement("li");
    li.textContent = "No check-ins yet. Whenever you feel ready, add your first reflection on the Check-in page.";
    return li;
}

function showHomeSummary() {
    const list = loadCheckins();
    const stats = document.getElementById("stats");
    const recent = document.getElementById("recent");

    const totalSleep = list.reduce((sum, checkin) => sum + checkin.sleep, 0);
    const avgComfort = list.length ? (list.reduce((sum, checkin) => sum + checkin.comfort, 0) / list.length).toFixed(1) : "0";

    [["Check-ins", list.length], ["Hours slept", totalSleep], ["Average peace", avgComfort]]
        .forEach(([label, value]) => {
            const box = document.createElement("div");
            const num = document.createElement("b");
            num.textContent = value;
            box.append(num, label);
            stats.append(box);
        });
    if (list.length === 0) recent.append(buildEmptyMessage());
    list.slice(-3).reverse().forEach(checkin => recent.append(buildCheckinCard(checkin, false)));
}

function setupCheckinForm() {
    const form = document.getElementById("checkin-form");
    const msg = document.getElementById("message");
    const today = new Date().toLocaleDateString("en-CA").toISOString().split("T")[0];
    form.elements.date.value = today;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const mood = form.elements.mood.value.trim();
        const date = form.elements.date.value;
        const sleep = Number(form.elements.sleep.value);
        const comfort = Number(form.elements.comfort.value);


        const errors = [];
        if (!mood) errors.push("Choose how you are feeling.");
        if (!date || date > today) errors.push("Choose today or an earlier date.");
        if (!Number.isInteger(sleep) || sleep < 0 || sleep > 24) errors.push("Hours of sleep must be a whole number from 1 to 24.");
        if (!comfort) errors.push("Choose a peace of mind level.");

        if (errors.length) {
            msg.className = "error";
            msg.textContent = errors.join(" ");
            return;
        }

        const list = loadCheckins();
        list.push({ id: Date.now(), mood, date, sleep, comfort, note: form.elements.note.value.trim() });
        saveCheckins(list);
        form.reset();
        form.elements.date.value = today;
        msg.className = "success";
        msg.textContent = "Check-in saved. Thank you for taking time for yourself — see it on the Progress page.";
    });
}

function showProgressList() {
    const list = loadCheckins();
    const filter = document.getElementById("filter");
    const ul = document.getElementById("all");
    const chosen = filter.value;

    const moods = [...new Set(list.map(checkin => checkin.mood))];
    filter.textContent = "";
    filter.append(new Option("All moods", ""));
    moods.forEach(name => filter.append(new Option(name, name)));
    filter.value = moods.includes(chosen) ? chosen : "";

    ul.textContent = "";
    const shown = list.filter(checkin => !filter.value || checkin.mood === filter.value).reverse();
    if (shown.length === 0) ul.append(buildEmptyMessage());
    shown.forEach(s => ul.append(buildCheckinCard(s, true)));
}

const page = document.body.dataset.page;
if (page === "home") showHomeSummary();
if (page === "checkin") setupCheckinForm();
if (page === "progress") {
    document.getElementById("filter").addEventListener("change", showProgressList);
    showProgressList();
}