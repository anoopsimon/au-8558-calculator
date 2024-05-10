const fs = require('fs');

// Function to calculate the stay period
function calculateStayPeriod(entryDate, exitDate) {
    const entry = new Date(entryDate);
    const exit = new Date(exitDate);
    const differenceMs = exit - entry;
    const differenceDays = differenceMs / (1000 * 60 * 60 * 24);
    return differenceDays;
}

// Function to run tests and generate HTML report
function runTests() {
    let passed = 0;
    let total = 0;
    const results = [];

    function assertEqual(actual, expected, message) {
        total++;
        if (actual === expected) {
            passed++;
            results.push({ message, passed: true });
            console.log(`✅ Test ${total}: ${message}`);
        } else {
            results.push({ message, passed: false });
            console.error(`❌ Test ${total}: ${message}. Expected ${expected}, but got ${actual}`);
        }
    }

    // Test cases
    assertEqual(calculateStayPeriod('2024-01-01', '2024-01-31'), 30, 'should calculate stay period correctly for full month');
    assertEqual(calculateStayPeriod('2024-01-01', '2024-02-01'), 31, 'should include both entry and exit dates');
    assertEqual(calculateStayPeriod('2024-01-01', '2024-01-01'), 0, 'should return 0 for same entry and exit dates');
    assertEqual(calculateStayPeriod('2024-01-01', '2024-01-02'), 1, 'should calculate stay period correctly for one day');
    assertEqual(calculateStayPeriod('2024-01-01', '2024-01-15'), 14, 'should calculate stay period correctly for half a month');
    assertEqual(calculateStayPeriod('2024-01-01', '2024-02-28'), 58, 'should calculate stay period correctly for two months and three days');
    assertEqual(calculateStayPeriod('2024-02-28', '2024-03-01'), 2, 'should calculate stay period correctly for a leap year');
    assertEqual(calculateStayPeriod('2024-12-31', '2025-01-01'), 1, 'should calculate stay period correctly for different years');
    assertEqual(calculateStayPeriod('2024-12-31', '2025-01-31'), 31, 'should calculate stay period correctly for two different years');
    assertEqual(calculateStayPeriod('2024-12-31', '2025-02-28'), 59, 'should calculate stay period correctly for two different years and a leap year');
    assertEqual(calculateStayPeriod('2024-12-31', '2025-03-01'), 60, 'should calculate stay period correctly for two different years and a leap year');
    assertEqual(calculateStayPeriod('2024-01-01', '2024-01-15T12:00:00'), 14.5, 'should handle exit date with time');
    assertEqual(calculateStayPeriod('2024-01-01T12:00:00', '2024-01-15T12:00:00'), 14, 'should handle entry and exit dates with time');
    assertEqual(calculateStayPeriod('2024-01-01', '2024-01-01T12:00:00'), 0.5, 'should handle entry date with time');
    assertEqual(calculateStayPeriod('2024-01-01T12:00:00', '2024-01-01T12:00:01'), 0.000011574074074074073, 'should handle entry and exit dates with milliseconds precision');
    assertEqual(calculateStayPeriod('2024-01-15', '2024-01-01'), -14, 'should return negative value if exit date is before entry date');
    assertEqual(calculateStayPeriod('2024-01-01', '2023-12-31'), -1, 'should handle exit date before entry date with different years');
    assertEqual(calculateStayPeriod('2024-01-01T12:00:00', '2024-01-01T11:59:59'), -0.000011574074074074073, 'should handle negative stay period with milliseconds precision');

    // Print test summary
    console.log(`\n${passed}/${total} tests passed.`);

    // Generate HTML report
    generateHTMLReport(results);
}

// Function to generate HTML report
function generateHTMLReport(results) {
    const totalTests = results.length;
    const passedTests = results.filter(result => result.passed).length;
    const failedTests = totalTests - passedTests;

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Results</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.css">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    margin: 20px;
                    padding: 20px;
                    background-color: #f7f7f7;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                li {
                    margin-bottom: 5px;
                    padding: 10px;
                }
                .passed {
                    background-color: #dff0d8;
                    color: #3c763d;
                }
                .failed {
                    background-color: #f2dede;
                    color: #a94442;
                }
                .summary {
                    margin-top: 40px;
                    text-align: center;
                }
                canvas {
                    margin-top: 20px;
                    max-width: 400px;
                    margin-left: auto;
                    margin-right: auto;
                    display: block;
                }
            </style>
        </head>
        <body>
            <h1>Test Results</h1>
            <ul>
                ${results.map(result => `<li class="${result.passed ? 'passed' : 'failed'}">${result.message}</li>`).join('')}
            </ul>
            <div class="summary">
                <h2>Summary</h2>
                <p>${totalTests} tests total</p>
                <p>${passedTests} tests passed</p>
                <p>${failedTests} tests failed</p>
                <canvas id="summaryChart" width="200" height="200"></canvas>
            </div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
            <script>
                var ctx = document.getElementById('summaryChart').getContext('2d');
                var summaryChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Passed', 'Failed'],
                        datasets: [{
                            label: 'Test Results',
                            data: [${passedTests}, ${failedTests}],
                            backgroundColor: [
                                '#5cb85c',
                                '#d9534f'
                            ]
                        }]
                    }
                });
            </script>
        </body>
        </html>
    `;

    fs.writeFileSync('test-report.html', htmlContent);
    console.log('HTML report generated: test-report.html');
}

// Run the tests
runTests();
