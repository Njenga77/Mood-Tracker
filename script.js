const KEY = "moodTrackerCheckins";

function loadCheckins () {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch {return []; }
}

function saveCheckins (checkins) {
    localStorage.setItem(KEY, JSON.stringify(list)); 
}

function buildCheckinCard(checkin, showDeleteButton) {
  const li = document.createElement("li");
  const title = document.createElement("strong");
  title.textContent = s.mood; 

  const meta = document.createElement("span");
  meta.textContent = `${s.date}, ${s.sleep} hrs sleep, peace ${s.comfort}/5`;
  li.append(title, meta);
  if (checkin.note) {
    const p = document.createElement("p");
    p.textContent = checkin.note;
    li.append(p);
  }

  li.addEventListener("mouseenter", () => li.classList.add("hover"));
  li.addEventListener("mouseleave", () => li.classList.remove("hover"));
}


