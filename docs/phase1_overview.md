# Phase 1: System Monitoring and Rule-Based Health Evaluation

## Objective
The objective of Phase 1 is to continuously monitor operating system-level metrics and evaluate system health using deterministic rule-based logic. This phase establishes the foundation for data collection and reliable health assessment.

---

## OS Metrics Collected
The system collects the following operating system metrics in real time:

- CPU usage percentage
- Memory usage percentage
- Disk usage percentage
- Number of active processes

These metrics represent core operating system resource management concepts.

---

## Rule-Based Health Evaluation (DAA)
A rule-based scoring algorithm is used to evaluate system health.

### Health Scoring Logic
- Thresholds are defined for each metric.
- Penalty points are assigned when thresholds are exceeded.
- The final score determines the health state:
  - HEALTHY
  - WARNING
  - CRITICAL

This approach ensures deterministic and explainable system behavior.

---

## Database Integration
- All collected metrics and evaluation results are stored in a MySQL database.
- Enables historical analysis and machine learning dataset generation.

---

## Technologies Used
- Python
- psutil (OS-level monitoring)
- MySQL
- Flask (backend services)

---

## Outcome
Phase 1 successfully provides reliable system monitoring and health evaluation, forming the data backbone for visualization and machine learning in later phases.
