const KEY = "moodTrackerCheckins";

function loadEntries () {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch {return []; }
}

function saveEntries (list) {
    localStorage.setItem(KEY, JSON.stringify(list)); 
}