# Database operations module
from backend.database.db_connection import get_db_connection

def insert_metrics(data, score, status):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO system_metrics
    (cpu_usage, memory_usage, disk_usage, process_count, health_score, health_status)
    VALUES (%s, %s, %s, %s, %s, %s)
    """

    cursor.execute(query, (
        data["cpu"],
        data["memory"],
        data["disk"],
        data["process_count"],
        score,
        status
    ))

    conn.commit()
    cursor.close()
    conn.close()
