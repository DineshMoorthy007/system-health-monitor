# OS metrics collection module
import psutil

def collect_metrics():
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent
    process_count = len(psutil.pids())

    return {
        "cpu_usage": cpu,
        "memory_usage": memory,
        "disk_usage": disk,
        "process_count": process_count
    }
