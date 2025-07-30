const drawButton = document.getElementById("drawButton");
const resultList = document.getElementById("resultList");
const exportButton = document.getElementById("exportButton");
const exportOutput = document.getElementById("exportOutput");

const drawDate = new Date("2025-10-31T18:00:00"); // Halloween 18:00

// Countdown logic
const countdownEl = document.getElementById("countdown");
const drawContainer = document.getElementById("draw-container");

function updateCountdown() {
  const now = new Date();
  const diff = drawDate - now;
  if (diff <= 0) {
    countdownEl.style.display = "none";
    drawContainer.style.display = "block";
    checkDrawn();
    return;
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  countdownEl.textContent = `Sorsolás kezdete: ${hours} óra ${mins} perc ${secs} másodperc`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Fetch drawn names if exist
function checkDrawn() {
  fetch("drawn.json")
    .then((res) => {
      if (!res.ok) throw new Error("Nincs elmentett sorsolás.");
      return res.json();
    })
    .then((data) => {
      showResults(data);
    })
    .catch(() => {
      drawButton.style.display = "inline-block";
    });
}

// Draw logic
drawButton.addEventListener("click", () => {
  fetch("tickets.json")
    .then((res) => res.json())
    .then((tickets) => {
      const shuffled = tickets.sort(() => 0.5 - Math.random());
      const unique = [...new Set(shuffled)];
      const drawn = unique.slice(0, 6);
      showResults(drawn);
      showExport(drawn);
    });
});

function showResults(drawn) {
  resultList.innerHTML = "";
  drawn.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    resultList.appendChild(li);
  });
}

function showExport(drawn) {
  exportButton.style.display = "inline-block";
  exportOutput.style.display = "block";
  exportOutput.value = JSON.stringify(drawn, null, 2);
}
