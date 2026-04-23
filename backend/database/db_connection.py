import os
import logging
from dotenv import load_dotenv
import mysql.connector

# Load .env file for local development (safe in production - won't break if file doesn't exist)
load_dotenv(override=False)

logger = logging.getLogger(__name__)

def get_db_connection():
    """Establish database connection using environment variables."""
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            port=int(os.getenv("DB_PORT", 3306))
        )
        return conn
    except mysql.connector.Error as e:
        logger.error(f"Database connection failed: {str(e)}")
        raise
