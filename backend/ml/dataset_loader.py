import pandas as pd
from backend.database.db_connection import get_db_connection


def load_dataset(limit=None):
    """
    Load system health data from MySQL into a Pandas DataFrame.
    Optionally limit number of rows.
    """

    conn = get_db_connection()

    query = """
        SELECT
            cpu_usage,
            memory_usage,
            disk_usage,
            process_count,
            health_score,
            health_status
        FROM system_metrics
        ORDER BY timestamp ASC
    """

    if limit:
        query += f" LIMIT {limit}"

    df = pd.read_sql(query, conn)
    conn.close()

    return df


def save_dataset_to_csv(filepath="backend/ml/data/system_health_dataset.csv"):
    df = load_dataset()
    df.to_csv(filepath, index=False)
    print(f"Dataset saved to {filepath}")
    print(df.head())


if __name__ == "__main__":
    save_dataset_to_csv()
