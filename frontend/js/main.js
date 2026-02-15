const API_URL = "http://127.0.0.1:5000/api/health/latest";
const PREDICT_API = "http://127.0.0.1:5000/api/health/predict";

async function fetchHealthData() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }

        const data = await response.json();
        console.log("API DATA:", data);

        if (!data) {
            document.getElementById("health-status").innerText = "Waiting for data...";
            return;
        }

        document.getElementById("health-status").innerText = data.health_status;
        document.getElementById("health-score").innerText = data.health_score;
        document.getElementById("cpu").innerText = data.cpu_usage.toFixed(1);
        document.getElementById("memory").innerText = data.memory_usage.toFixed(1);
        document.getElementById("disk").innerText = data.disk_usage.toFixed(1);
        document.getElementById("processes").innerText = data.process_count;
        document.getElementById("timestamp").innerText = data.timestamp;

        const statusEl = document.getElementById("rule-status");
        statusEl.className = "status-pill status-" + data.health_status;
        statusEl.innerText = data.health_status;


    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById("health-status").innerText = "API Error";
    }
}

async function fetchMLPrediction() {
    try {
        const response = await fetch(PREDICT_API);
        const data = await response.json();

        const mlStatusEl = document.getElementById("ml-status");
        const mlStatus = data.predicted_health_status;

        mlStatusEl.innerText = mlStatus;
        mlStatusEl.className = "status-pill status-" + mlStatus;

    } catch (error) {
        console.error("ML prediction error:", error);
    }
}

fetchHealthData();
setInterval(fetchHealthData, 5000);

const HISTORY_API = "http://127.0.0.1:5000/api/metrics/history";

async function fetchMetricsHistory() {
    try {
        const response = await fetch(HISTORY_API);
        const data = await response.json();

        const tableBody = document.querySelector("#metrics-table tbody");
        tableBody.innerHTML = "";

        data.forEach(row => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${row.timestamp}</td>
                <td>${row.cpu_usage.toFixed(1)}</td>
                <td>${row.memory_usage.toFixed(1)}</td>
                <td>${row.disk_usage.toFixed(1)}</td>
                <td>${row.process_count}</td>
                <td>${row.health_score}</td>
                <td class="status-${row.health_status}">
                    ${row.health_status}
                </td>
            `;

            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("History fetch error:", error);
    }
}

// Fetch table initially and refresh every 10 seconds
fetchMetricsHistory();
setInterval(fetchMetricsHistory, 10000);

let cpuChart, memoryChart, healthChart;

async function renderCharts() {
    try {
        const response = await fetch(HISTORY_API);
        const data = await response.json();

        // Reverse to show oldest → newest
        data.reverse();

        const labels = data.map(d => d.timestamp);
        const cpuData = data.map(d => d.cpu_usage);
        const memoryData = data.map(d => d.memory_usage);
        const healthData = data.map(d => d.health_score);

        // Destroy old charts (important for refresh)
        if (cpuChart) cpuChart.destroy();
        if (memoryChart) memoryChart.destroy();
        if (healthChart) healthChart.destroy();

        cpuChart = new Chart(document.getElementById("cpuChart"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "CPU Usage (%)",
                    data: cpuData,
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.1)",
                    tension: 0.3
                }]
            }
        });

        memoryChart = new Chart(document.getElementById("memoryChart"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Memory Usage (%)",
                    data: memoryData,
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16,185,129,0.1)",
                    tension: 0.3
                }]
            }
        });

        healthChart = new Chart(document.getElementById("healthChart"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Health Score",
                    data: healthData,
                    borderColor: "#f59e0b",
                    backgroundColor: "rgba(245,158,11,0.1)",
                    tension: 0.3
                }]
            }
        });

    } catch (error) {
        console.error("Chart rendering error:", error);
    }
}

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active-section");
    });

    document.getElementById(sectionId).classList.add("active-section");
}

// Initial render + refresh every 15 seconds
renderCharts();
setInterval(renderCharts, 15000);

fetchHealthData();
fetchMLPrediction();

setInterval(() => {
    fetchHealthData();
    fetchMLPrediction();
}, 5000);
