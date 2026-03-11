import time
import threading
from flask import Flask, jsonify
from flask_cors import CORS

from backend.collectors.os_metrics import collect_metrics
from backend.algorithms.rule_engine import evaluate_system_health
from backend.database.db_operations import insert_metrics, insert_evaluation
from backend.database.db_connection import get_db_connection
from backend.utils.logger import log_status
from backend.ml.predict import predict_health

app = Flask(__name__)
CORS(app)

def run_monitor():
    print("Monitoring thread started")
    while True:
        metrics = collect_metrics()
        score, status = evaluate_system_health(metrics)

        metric_id = insert_metrics(metrics)
        insert_evaluation(metric_id, score, status)
        log_status(metrics, score, status)

        time.sleep(3)

@app.route("/api/health/latest", methods=["GET"])
def get_latest_health():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM system_health_view
        ORDER BY timestamp DESC
        LIMIT 1
    """)

    result = cursor.fetchone()
    cursor.close()
    conn.close()

    return jsonify(result)


@app.route("/api/metrics/recent", methods=["GET"])
def get_recent_metrics():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM system_health_view
        ORDER BY timestamp DESC
        LIMIT 10
    """)

    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(results)

@app.route("/api/metrics/history", methods=["GET"])
def get_metrics_history():
    limit = 50  # default window size (Phase 2)

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM system_health_view
        ORDER BY timestamp DESC
        LIMIT %s
    """, (limit,))

    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(results)

@app.route("/api/health/summary", methods=["GET"])
def get_health_summary():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            AVG(cpu_usage) AS avg_cpu,
            MAX(cpu_usage) AS max_cpu,
            AVG(memory_usage) AS avg_memory,
            MAX(memory_usage) AS max_memory,
            AVG(health_score) AS avg_health_score
        FROM system_health_view
    """)

    summary = cursor.fetchone()
    cursor.close()
    conn.close()

    return jsonify(summary)

@app.route("/api/health/predict", methods=["GET"])
def predict_system_health():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            cpu_usage,
            memory_usage,
            disk_usage,
            process_count,
            health_score
        FROM system_health_view
        ORDER BY timestamp DESC
        LIMIT 1
    """)

    metrics = cursor.fetchone()
    cursor.close()
    conn.close()

    if not metrics:
        return jsonify({"error": "No data available"}), 404

    predicted_status = predict_health(metrics)

    return jsonify({
        "predicted_health_status": predicted_status,
        "input_metrics": metrics
    })


if __name__ == "__main__":
    threading.Thread(target=run_monitor, daemon=True).start()
    app.run(host="127.0.0.1", port=5000, debug=True)