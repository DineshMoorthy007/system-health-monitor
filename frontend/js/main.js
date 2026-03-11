/* =============================================================
   System Health Monitor — Dashboard JavaScript
   ============================================================= */

const LATEST_API  = "http://127.0.0.1:5000/api/health/latest";
const PREDICT_API = "http://127.0.0.1:5000/api/health/predict";
const HISTORY_API = "http://127.0.0.1:5000/api/metrics/history";

// ── Loading indicator helpers ──────────────────────────────────

function showLoading(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("hidden");
}

function hideLoading(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
}

// ── Status badge helper ────────────────────────────────────────
// Applies the correct colour class and label text to a status pill.

function applyStatus(el, status) {
    if (!el) return;
    el.className = "status-pill status-" + status;
    el.innerText  = status;
}

// ── Live system health ─────────────────────────────────────────

async function fetchHealthData() {
    showLoading("loading-health");
    try {
        const resp = await fetch(LATEST_API);
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const data = await resp.json();

        if (!data) return;

        applyStatus(document.getElementById("health-status"), data.health_status);
        document.getElementById("health-score").innerText  = data.health_score;
        document.getElementById("cpu").innerText           = data.cpu_usage.toFixed(1);
        document.getElementById("memory").innerText        = data.memory_usage.toFixed(1);
        document.getElementById("disk").innerText          = data.disk_usage.toFixed(1);
        document.getElementById("processes").innerText    = data.process_count;
        document.getElementById("timestamp").innerText    = data.timestamp;

        // Mirror rule-based result in the comparison card
        applyStatus(document.getElementById("rule-status"), data.health_status);

    } catch (err) {
        console.error("Health fetch error:", err);
        document.getElementById("health-status").innerText = "API Error";
    } finally {
        hideLoading("loading-health");
    }
}

// ── ML prediction ──────────────────────────────────────────────

async function fetchMLPrediction() {
    try {
        const resp = await fetch(PREDICT_API);
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const data = await resp.json();
        applyStatus(document.getElementById("ml-status"), data.predicted_health_status);
    } catch (err) {
        console.error("ML prediction error:", err);
    }
}

// ── Historical metrics table ───────────────────────────────────

async function fetchMetricsHistory() {
    showLoading("loading-table");
    try {
        const resp = await fetch(HISTORY_API);
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const data = await resp.json();

        const tbody = document.querySelector("#metrics-table tbody");
        tbody.innerHTML = "";

        data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.timestamp}</td>
                <td>${row.cpu_usage.toFixed(1)}</td>
                <td>${row.memory_usage.toFixed(1)}</td>
                <td>${row.disk_usage.toFixed(1)}</td>
                <td>${row.process_count}</td>
                <td>${row.health_score}</td>
                <td><span class="status-pill status-${row.health_status}">${row.health_status}</span></td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("History fetch error:", err);
    } finally {
        hideLoading("loading-table");
    }
}

// ── Charts ─────────────────────────────────────────────────────

/**
 * Extracts HH:MM:SS from a MySQL datetime string ("YYYY-MM-DD HH:MM:SS")
 * or any date string parseable by Date. Falls back to the raw value.
 */
function formatTimestamp(ts) {
    const d = new Date(ts);
    if (isNaN(d)) return ts;
    return d.toLocaleTimeString("en-GB"); // 24-h HH:MM:SS
}

let cpuChart, memoryChart, diskChart, healthChart;

/**
 * Returns a shared Chart.js options object.
 * @param {string}  yLabel      - Y-axis title text
 * @param {boolean} addPercent  - Append "%" to tooltip values
 */
function buildChartOptions(yLabel, addPercent = true) {
    return {
        responsive: true,
        maintainAspectRatio: false,   // canvas fills .chart-canvas-wrapper height
        plugins: {
            legend: {
                position: "top",
                labels: { font: { size: 13 } }
            },
            tooltip: {
                callbacks: {
                    label: ctx =>
                        `${ctx.dataset.label}: ${ctx.parsed.y}${addPercent ? "%" : ""}`
                }
            }
        },
        scales: {
            x: {
                title: { display: true, text: "Time" },
                ticks:  { maxTicksLimit: 8, maxRotation: 0, autoSkip: true },
                grid:  { color: "rgba(0,0,0,0.05)" }
            },
            y: {
                title: { display: true, text: yLabel },
                grid:  { color: "rgba(0,0,0,0.05)" }
            }
        }
    };
}

async function renderCharts() {
    try {
        const resp = await fetch(HISTORY_API);
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const data = await resp.json();

        // Display oldest entry on the left
        data.reverse();

        const labels     = data.map(d => formatTimestamp(d.timestamp));
        const cpuData    = data.map(d => d.cpu_usage);
        const memData    = data.map(d => d.memory_usage);
        const diskData   = data.map(d => d.disk_usage);
        const healthData = data.map(d => d.health_score);

        // Destroy stale chart instances before re-creating
        if (cpuChart)    cpuChart.destroy();
        if (memoryChart) memoryChart.destroy();
        if (diskChart)   diskChart.destroy();
        if (healthChart) healthChart.destroy();

        cpuChart = new Chart(document.getElementById("cpuChart"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "CPU Usage (%)",
                    data: cpuData,
                    borderColor: "#3498db",
                    backgroundColor: "rgba(52,152,219,0.1)",
                    tension: 0.4,
                    pointRadius: 3
                }]
            },
            options: buildChartOptions("Usage (%)")
        });

        memoryChart = new Chart(document.getElementById("memoryChart"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Memory Usage (%)",
                    data: memData,
                    borderColor: "#2ecc71",
                    backgroundColor: "rgba(46,204,113,0.1)",
                    tension: 0.4,
                    pointRadius: 3
                }]
            },
            options: buildChartOptions("Usage (%)")
        });

        diskChart = new Chart(document.getElementById("diskChart"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Disk Usage (%)",
                    data: diskData,
                    borderColor: "#f39c12",
                    backgroundColor: "rgba(243,156,18,0.1)",
                    tension: 0.4,
                    pointRadius: 3
                }]
            },
            options: buildChartOptions("Usage (%)")
        });

        healthChart = new Chart(document.getElementById("healthChart"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Health Score",
                    data: healthData,
                    borderColor: "#e74c3c",
                    backgroundColor: "rgba(231,76,60,0.1)",
                    tension: 0.4,
                    pointRadius: 3
                }]
            },
            options: buildChartOptions("Health Score", false)
        });

    } catch (err) {
        console.error("Chart render error:", err);
    }
}

// ── Navigation ─────────────────────────────────────────────────

/**
 * Shows the requested section and updates the active nav button.
 * @param {string}      sectionId  - ID of the section div to show
 * @param {HTMLElement} btn        - The nav button that was clicked
 */
function showSection(sectionId, btn) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active-section"));
    document.getElementById(sectionId).classList.add("active-section");

    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active-btn"));
    if (btn) btn.classList.add("active-btn");
}

// ── Initialise ─────────────────────────────────────────────────

fetchHealthData();
fetchMLPrediction();
fetchMetricsHistory();
renderCharts();

// Periodic refresh intervals
setInterval(fetchHealthData,     5000);   // live health every 5 s
setInterval(fetchMLPrediction,   5000);   // ML prediction every 5 s
setInterval(fetchMetricsHistory, 10000);  // table every 10 s
setInterval(renderCharts,        15000);  // charts every 15 s
