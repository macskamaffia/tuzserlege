// Firebase config – saját adatokkal helyettesítsd
const firebaseConfig = {
  apiKey: "AIzaSyAb3h37qh_4rm9J9lbxRMwNMApWo_ExxXI",
  authDomain: "tuzserlege-3e50f.firebaseapp.com",
  databaseURL: "https://tuzserlege-3e50f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tuzserlege-3e50f",
  storageBucket: "tuzserlege-3e50f.firebasestorage.app",
  messagingSenderId: "607271028125",
  appId: "1:607271028125:web:002093b6cd81c6f6eadb74"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const ADMIN_HASH = "f10e2821bbbea527ea02200352313bc059445190"; // hash: 'trimagus2025'

const drawButton = document.getElementById("drawButton");
const resultList = document.getElementById("resultList");
const exportButton = document.getElementById("exportButton");
const exportOutput = document.getElementById("exportOutput");
const loginButton = document.getElementById("loginButton");
const adminPass = document.getElementById("adminPass");
const countdownEl = document.getElementById("countdown");
const drawContainer = document.getElementById("draw-container");

let isAdmin = false;

const drawDate = new Date("2025-10-31T18:00:00");

function updateCountdown() {
  const now = new Date();
  const diff = drawDate - now;
  if (diff <= 0) {
    countdownEl.textContent = "A Tűz Serlege lángra kapott!";
    drawContainer.style.display = "block";
    checkDrawn();
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  countdownEl.textContent = `${days} nap ${hours} óra ${mins} perc ${secs} másodperc hátra.`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

function sha1(str) {
  return crypto.subtle.digest("SHA-1", new TextEncoder().encode(str)).then(buf => {
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  });
}

loginButton.addEventListener("click", () => {
  const pw = adminPass.value.trim();
  if (pw === "trimagus2025") {
    isAdmin = true;
    drawButton.style.display = "inline-block";
    loginButton.style.display = "none";
    adminPass.style.display = "none";
  } else {
    alert("Hibás jelszó.");
  }
});

function checkDrawn() {
  db.ref("drawn").once("value").then(snapshot => {
    const data = snapshot.val();
    if (data) {
      showResults(data);
      showExport(data);
    } else if (isAdmin) {
      drawButton.style.display = "inline-block";
    }
  });
}

drawButton.addEventListener("click", () => {
  db.ref("tickets").once("value").then(snapshot => {
    const tickets = snapshot.val();
    const weightedList = buildWeightedList(tickets);
    const shuffled = weightedList.sort(() => 0.5 - Math.random());
    const unique = [...new Set(shuffled)];
    const drawn = unique.slice(0, 6);
    db.ref("drawn").set(drawn);
    showResults(drawn);
    showExport(drawn);
  });
});

function buildWeightedList(tickets) {
  const list = [];
  for (const [name, weight] of Object.entries(tickets)) {
    for (let i = 0; i < weight; i++) list.push(name);
  }
  return list;
}

function showResults(drawn) {
  resultList.innerHTML = "";
  drawn.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.classList.add("flame");
    resultList.appendChild(li);
  });
}

function showExport(drawn) {
  if (!isAdmin) return;
  exportButton.style.display = "inline-block";
  exportOutput.style.display = "block";
  exportOutput.value = JSON.stringify(drawn, null, 2);
}

db.ref("drawn").on("value", snapshot => {
  const data = snapshot.val();
  if (data) showResults(data);
});
