window.addEventListener('DOMContentLoaded', function() {
    // Always use CORS proxy for Google Sheets CSV
    const googleCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQx2fFSOZ9Rh8NCSxyNk4xv32prfBq7i5rFjDib2EMogJBgSVbvRjfCFreW_NNAlpVq4Iw0BcNdnj7q/pub?output=csv';
    const csvUrl = 'https://corsproxy.io/?' + encodeURIComponent(googleCsvUrl);
    fetch(csvUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(csvText => {
            const rows = csvText.split('\n').map(row => row.split(','));
            // Assume first row is header, find the index of "Name" column
            const header = rows[0];
            const nameIdx = header.findIndex(h => h.trim().toLowerCase() === 'name');
            if (nameIdx === -1) {
                alert('Name column not found in CSV!');
                return;
            }
            const names = rows.slice(1).map(row => row[nameIdx]).filter(Boolean);
            // Display names in a list
            const list = document.createElement('ul');
            names.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                list.appendChild(li);
            });
            // Add to a div with id 'namesList', or create it if missing
            let namesDiv = document.getElementById('namesList');
            if (!namesDiv) {
                namesDiv = document.createElement('div');
                namesDiv.id = 'namesList';
                document.body.appendChild(namesDiv);
            }
            namesDiv.innerHTML = '';
            namesDiv.appendChild(list);
        })
        .catch(err => {
            alert('Failed to fetch CSV. Make sure the sheet is published and public. Error: ' + err);
        });
});

<script>
  function updateCountdown() {
    const endTime = new Date("2025-10-31T17:00:00+01:00").getTime();
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    const container = document.getElementById("countdown-timer");

    if (timeLeft <= 0) {
      container.innerHTML = "A bajnokokat már kihirdették!";
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    container.innerHTML = days + " nap " + hours + " óra " + minutes + " perc " + seconds + " mp";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
</script>
