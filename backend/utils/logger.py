import logging
import os

LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, "system_health.log")

# Ensure logs directory exists
os.makedirs(LOG_DIR, exist_ok=True)

# Create a dedicated logger
logger = logging.getLogger("system_health_logger")
logger.setLevel(logging.INFO)

# Prevent duplicate handlers
if not logger.handlers:
    file_handler = logging.FileHandler(LOG_FILE)

    formatter = logging.Formatter(
        "%(asctime)s | CPU: %(cpu)s%% | RAM: %(memory)s%% | "
        "Disk: %(disk)s%% | Processes: %(process_count)s | "
        "Score: %(score)s | Status: %(status)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)


def log_status(metrics, score, status):
    # Console output (unchanged)
    print(
        f"CPU: {metrics['cpu']}% | "
        f"RAM: {metrics['memory']}% | "
        f"Disk: {metrics['disk']}% | "
        f"Processes: {metrics['process_count']} | "
        f"Score: {score} | "
        f"Status: {status}"
    )

    # File logging (safe)
    logger.info(
        "SYSTEM_STATUS",
        extra={
            "cpu": metrics["cpu"],
            "memory": metrics["memory"],
            "disk": metrics["disk"],
            "process_count": metrics["process_count"],
            "score": score,
            "status": status
        }
    )