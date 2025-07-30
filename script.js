
const countdownEl = document.getElementById("countdown");
const startBtn = document.getElementById("startBtn");
const resultList = document.getElementById("resultList");

const targetDate = new Date("2025-07-30T17:38:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
        countdownEl.textContent = "A sorsolás elkezdődött!";
        askPassword();
        clearInterval(timer);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownEl.textContent = `Hátralévő idő: ${days} nap ${hours} óra ${minutes} perc ${seconds} másodperc`;
}

function askPassword() {
    const pw = prompt("Csak staff: add meg a jelszót!");
    if (pw === "baziliszkusz") {
        startBtn.style.display = "inline-block";
        startBtn.addEventListener("click", startDraw);
    } else {
        alert("Hozzáférés megtagadva.");
    }
}

async function startDraw() {
    const response = await fetch("tickets.json");
    const tickets = await response.json();

    const drawn = [];
    while (drawn.length < 6 && tickets.length > 0) {
        const index = Math.floor(Math.random() * tickets.length);
        const name = tickets[index];
        if (!drawn.includes(name)) {
            drawn.push(name);
            const li = document.createElement("li");
            li.textContent = `🎉 ${name}`;
            resultList.appendChild(li);
            await new Promise(r => setTimeout(r, 1500));
        }
    }
}
const timer = setInterval(updateCountdown, 1000);
