# Database operations module
from backend.database.db_connection import get_db_connection

# Central mapping for rule-engine labels to seeded health_status IDs.
STATUS_MAP = {
    "HEALTHY": 1,
    "WARNING": 2,
    "CRITICAL": 3,
}

def insert_metrics(metrics):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO system_metrics
    (timestamp, cpu_usage, memory_usage, disk_usage, process_count)
    VALUES (NOW(), %s, %s, %s, %s)
    """

    values = (
        metrics["cpu_usage"],
        metrics["memory_usage"],
        metrics["disk_usage"],
        metrics["process_count"],
    )

    try:
        cursor.execute(query, values)
        conn.commit()

        # return generated metric_id
        return cursor.lastrowid

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()

def insert_evaluation(metric_id, score, status):
    conn = get_db_connection()
    cursor = conn.cursor()

    status_id = STATUS_MAP.get(status)

    if status_id is None:
        cursor.close()
        conn.close()
        raise ValueError(f"Unknown health status: {status}")

    query = """
    INSERT INTO health_evaluations
    (metric_id, health_score, health_status_id, evaluation_method)
    VALUES (%s, %s, %s, 'RULE')
    """

    values = (
        metric_id,
        score,
        status_id,
    )

    try:
        cursor.execute(query, values)
        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        cursor.close()
        conn.close()

def get_latest_health():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT 
        m.timestamp,
        m.cpu_usage,
        m.memory_usage,
        m.disk_usage,
        m.process_count,
        e.health_score,
        s.status_name AS health_status
    FROM system_metrics m
    JOIN health_evaluations e ON m.metric_id = e.metric_id
    JOIN health_status s ON e.health_status_id = s.health_status_id
    ORDER BY m.timestamp DESC
    LIMIT 1
    """

    cursor.execute(query)
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return result

def get_recent_metrics(limit=10):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT 
        m.timestamp,
        m.cpu_usage,
        m.memory_usage,
        m.disk_usage,
        m.process_count,
        e.health_score,
        s.status_name AS health_status
    FROM system_metrics m
    JOIN health_evaluations e ON m.metric_id = e.metric_id
    JOIN health_status s ON e.health_status_id = s.health_status_id
    ORDER BY m.timestamp DESC
    LIMIT %s
    """

    cursor.execute(query, (limit,))
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return results