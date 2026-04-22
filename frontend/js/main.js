/* =============================================================
   System Health Monitor - Dashboard JavaScript
   ============================================================= */

const LATEST_API = "http://127.0.0.1:5000/api/health/latest";
const PREDICT_API = "http://127.0.0.1:5000/api/health/predict";
const HISTORY_API = "http://127.0.0.1:5000/api/metrics/history";

const sectionButtons = Array.from(document.querySelectorAll("[data-section]"));

let cpuChart;
let memoryChart;
let diskChart;
let healthChart;

function showLoading(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove("hidden");
    }
}

function hideLoading(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add("hidden");
    }
}

function applyStatus(el, status) {
    if (!el) return;

    const nextStatus = String(status || "UNKNOWN").toUpperCase();
    el.className = `status-pill status-${nextStatus}`;
    el.textContent = nextStatus;
}

async function fetchHealthData() {
    showLoading("loading-health");

    try {
        const resp = await fetch(LATEST_API);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const data = await resp.json();
        if (!data) return;

        applyStatus(document.getElementById("health-status"), data.health_status);
        document.getElementById("health-score").textContent = data.health_score;
        document.getElementById("cpu").textContent = Number(data.cpu_usage).toFixed(1);
        document.getElementById("memory").textContent = Number(data.memory_usage).toFixed(1);
        document.getElementById("disk").textContent = Number(data.disk_usage).toFixed(1);
        document.getElementById("processes").textContent = data.process_count;
        document.getElementById("timestamp").textContent = data.timestamp;

        applyStatus(document.getElementById("rule-status"), data.health_status);
    } catch (err) {
        console.error("Health fetch error:", err);
        const status = document.getElementById("health-status");
        if (status) {
            status.className = "status-pill status-CRITICAL";
            status.textContent = "API ERROR";
        }
    } finally {
        hideLoading("loading-health");
    }
}

async function fetchMLPrediction() {
    try {
        const resp = await fetch(PREDICT_API);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const data = await resp.json();
        applyStatus(document.getElementById("ml-status"), data.predicted_health_status);
    } catch (err) {
        console.error("ML prediction error:", err);
    }
}

async function fetchMetricsHistory() {
    showLoading("loading-table");

    try {
        const resp = await fetch(HISTORY_API);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const data = await resp.json();
        const tbody = document.querySelector("#metrics-table tbody");

        if (!tbody) return;

        tbody.innerHTML = "";

        data.forEach((row) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.timestamp}</td>
                <td>${Number(row.cpu_usage).toFixed(1)}</td>
                <td>${Number(row.memory_usage).toFixed(1)}</td>
                <td>${Number(row.disk_usage).toFixed(1)}</td>
                <td>${row.process_count}</td>
                <td>${row.health_score}</td>
                <td><span class="status-pill status-${String(row.health_status).toUpperCase()}">${String(row.health_status).toUpperCase()}</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("History fetch error:", err);
    } finally {
        hideLoading("loading-table");
    }
}

function formatTimestamp(ts) {
    const raw = String(ts || "");
    const mysqlMatch = raw.match(/(\d{2}:\d{2}:\d{2})/);
    if (mysqlMatch) return mysqlMatch[1];

    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return raw;

    return date.toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

function buildChartOptions(yLabel, addPercent = true) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false
        },
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#334155",
                    boxWidth: 12,
                    boxHeight: 12,
                    usePointStyle: true,
                    pointStyle: "circle"
                }
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}${addPercent ? "%" : ""}`
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time",
                    color: "#64748b"
                },
                ticks: {
                    color: "#64748b",
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6,
                    padding: 10
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                title: {
                    display: true,
                    text: yLabel,
                    color: "#64748b"
                },
                ticks: {
                    color: "#64748b"
                },
                grid: {
                    color: "rgba(148, 163, 184, 0.22)",
                    borderDash: [4, 4],
                    drawBorder: false
                }
            }
        }
    };
}

function buildGradient(datasetContext, startColor, endColor) {
    const { chart } = datasetContext;

    if (!chart.chartArea) {
        return startColor;
    }

    const gradient = chart.ctx.createLinearGradient(0, chart.chartArea.top, 0, chart.chartArea.bottom);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    return gradient;
}

function createLineChart(canvasId, label, values, borderColor, gradientStart, gradientEnd, yLabel, addPercent = true) {
    return new Chart(document.getElementById(canvasId), {
        type: "line",
        data: {
            labels: values.labels,
            datasets: [{
                label,
                data: values.data,
                borderColor,
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 2.5,
                pointHoverRadius: 4,
                pointBackgroundColor: borderColor,
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                fill: true,
                backgroundColor: (context) => buildGradient(context, gradientStart, gradientEnd)
            }]
        },
        options: buildChartOptions(yLabel, addPercent)
    });
}

async function renderCharts() {
    try {
        const resp = await fetch(HISTORY_API);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const data = await resp.json();
        const orderedData = [...data].reverse();

        const labels = orderedData.map((item) => formatTimestamp(item.timestamp));
        const cpuData = orderedData.map((item) => item.cpu_usage);
        const memoryData = orderedData.map((item) => item.memory_usage);
        const diskData = orderedData.map((item) => item.disk_usage);
        const healthData = orderedData.map((item) => item.health_score);

        if (cpuChart) cpuChart.destroy();
        if (memoryChart) memoryChart.destroy();
        if (diskChart) diskChart.destroy();
        if (healthChart) healthChart.destroy();

        cpuChart = createLineChart(
            "cpuChart",
            "CPU Usage (%)",
            { labels, data: cpuData },
            "#2563eb",
            "rgba(37, 99, 235, 0.28)",
            "rgba(37, 99, 235, 0.02)",
            "Usage (%)"
        );

        memoryChart = createLineChart(
            "memoryChart",
            "Memory Usage (%)",
            { labels, data: memoryData },
            "#14b8a6",
            "rgba(20, 184, 166, 0.28)",
            "rgba(20, 184, 166, 0.02)",
            "Usage (%)"
        );

        diskChart = createLineChart(
            "diskChart",
            "Disk Usage (%)",
            { labels, data: diskData },
            "#f59e0b",
            "rgba(245, 158, 11, 0.28)",
            "rgba(245, 158, 11, 0.02)",
            "Usage (%)"
        );

        healthChart = createLineChart(
            "healthChart",
            "Health Score",
            { labels, data: healthData },
            "#ef4444",
            "rgba(239, 68, 68, 0.22)",
            "rgba(239, 68, 68, 0.02)",
            "Health Score",
            false
        );
    } catch (err) {
        console.error("Chart render error:", err);
    }
}

function isSectionVisible(sectionId) {
    const section = document.getElementById(sectionId);
    return Boolean(section && section.classList.contains("active-section"));
}

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach((section) => {
        section.classList.toggle("active-section", section.id === sectionId);
    });

    sectionButtons.forEach((button) => {
        const isActive = button.dataset.section === sectionId;
        button.classList.toggle("active", isActive);

        if (isActive) {
            button.setAttribute("aria-current", "page");
        } else {
            button.removeAttribute("aria-current");
        }
    });

    if (sectionId === "trends") {
        requestAnimationFrame(() => {
            renderCharts();
        });
    }
}

sectionButtons.forEach((button) => {
    button.addEventListener("click", () => showSection(button.dataset.section));
});

fetchHealthData();
fetchMLPrediction();
fetchMetricsHistory();

if (isSectionVisible("trends")) {
    requestAnimationFrame(() => {
        renderCharts();
    });
}

setInterval(fetchHealthData, 5000);
setInterval(fetchMLPrediction, 5000);
setInterval(fetchMetricsHistory, 10000);
setInterval(() => {
    if (isSectionVisible("trends")) {
        renderCharts();
    }
}, 15000);
