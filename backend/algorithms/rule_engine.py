def evaluate_system_health(metrics):
    """
    Rule-based system health evaluation using weighted scoring.
    Time Complexity: O(1)
    """

    score = 0

    cpu = metrics["cpu_usage"]
    memory = metrics["memory_usage"]
    disk = metrics["disk_usage"]
    process_count = metrics["process_count"]

    # CPU rules
    if cpu >= 90:
        score += 3
    elif cpu >= 80:
        score += 2

    # Memory rules
    if memory >= 90:
        score += 3
    elif memory >= 80:
        score += 2

    # Disk rules
    if disk >= 95:
        score += 2
    elif disk >= 85:
        score += 1

    # Process count rules
    if process_count > 350:
        score += 2
    elif process_count > 250:
        score += 1

    # Final status decision
    if score >= 7:
        status = "CRITICAL"
    elif score >= 4:
        status = "WARNING"
    else:
        status = "HEALTHY"

    return score, status