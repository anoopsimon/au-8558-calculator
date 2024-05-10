document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('stayPeriods');
    document.getElementById('addStayPeriod').addEventListener('click', function() {
        const newPeriod = form.firstElementChild.cloneNode(true);
        newPeriod.querySelectorAll('input').forEach(input => input.value = '');
        form.appendChild(newPeriod);
    });

    // Event delegation for dynamically added delete buttons
    form.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            e.target.closest('.date-range').remove();
        }
    });

    document.getElementById('calculate').addEventListener('click', function() {
        const periods = Array.from(document.querySelectorAll('.date-range'))
            .map(period => ({
                entry: convertDate(period.querySelector('.entry').value),
                exit: convertDate(period.querySelector('.exit').value)
            }))
            .sort((a, b) => a.exit - b.exit); // Sort by exit date

        if (periods.some(period => isNaN(period.entry.getTime()) || isNaN(period.exit.getTime()))) {
            document.getElementById('result').textContent = "Please ensure all dates are entered correctly (DD/MM/YYYY).";
            return;
        }

        const lastExitDate = periods[periods.length - 1].exit;
        const eighteenMonthsAgo = new Date(lastExitDate.getFullYear(), lastExitDate.getMonth() - 18, lastExitDate.getDate());
        let totalDaysInside = 0;
        let resultsHtml = "<table><tr><th>Entry Date</th><th>Exit Date</th><th>Days Inside</th></tr>";

        periods.forEach(period => {
            if (period.exit > eighteenMonthsAgo) {
                const effectiveEntry = period.entry < eighteenMonthsAgo ? eighteenMonthsAgo : period.entry;
                const effectiveExit = period.exit;
                const daysInside = Math.round((effectiveExit - effectiveEntry) / (1000 * 60 * 60 * 24) + 1);
                totalDaysInside += daysInside;
                resultsHtml += `<tr><td>${formatDate(effectiveEntry)}</td><td>${formatDate(effectiveExit)}</td><td>${daysInside}</td></tr>`;
            }
        });

        resultsHtml += "</table>";
        document.getElementById('detailedResults').innerHTML = resultsHtml;

        const resultText = totalDaysInside > 365 ? "Overstay" : "Legal Stay";
        document.getElementById('result').textContent = `${resultText}. Total days inside: ${Math.round(totalDaysInside)}. Calculation starts from: ${formatDate(eighteenMonthsAgo)}`;
    });

    function convertDate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        return new Date(year, month - 1, day); // Adjust month index (0-based)
    }

    function formatDate(date) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
});

function addDateInputMask(inputElement) {
    inputElement.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (value.length > 5) {
            value = value.slice(0, 5) + '/' + value.slice(5, 9);
        }
        e.target.value = value.slice(0, 10);
    });
}

document.querySelectorAll('.date').forEach(input => {
    addDateInputMask(input);
});
