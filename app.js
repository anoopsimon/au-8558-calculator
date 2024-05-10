// app.js
document.getElementById('addStayPeriod').addEventListener('click', function() {
    const form = document.getElementById('stayPeriods');
    const newPeriod = form.firstElementChild.cloneNode(true);
    newPeriod.querySelectorAll('input').forEach(input => input.value = '');
    form.appendChild(newPeriod);
});

document.getElementById('calculate').addEventListener('click', function() {
    const periods = document.querySelectorAll('.date-range');
    let totalDays = 0;
    periods.forEach(period => {
        const entryDate = new Date(period.querySelector('.entry').value);
        const exitDate = new Date(period.querySelector('.exit').value);
        totalDays += (exitDate - entryDate) / (1000 * 60 * 60 * 24);
    });
    const resultText = totalDays > 330 ? "Overstay" : "Legal Stay";
    document.getElementById('result').textContent = `${resultText}. Total days: ${totalDays}`;
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        e.target.parentNode.remove();
    }
});
