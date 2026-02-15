# Phase 2: Visualization and System Health Trends

## Objective
The objective of Phase 2 is to present system health data in a clear, structured, and user-friendly manner. This phase focuses on transforming raw and stored system metrics into meaningful visual insights to support monitoring and analysis.

---

## Key Features Implemented

### 1. Live System Health View
- Displays the latest system health status.
- Shows key metrics such as CPU usage, memory usage, disk usage, and process count.
- Presents real-time evaluation results from the rule-based health algorithm.

---

### 2. Historical System Metrics
- Retrieves previously stored system metrics from the database.
- Displays data in a structured table format.
- Allows users to observe past system behavior without overwhelming the interface.

---

### 3. System Health Trends
- Visualizes system metrics over time using charts.
- Includes trends for CPU usage, memory usage, and health score.
- Helps identify performance patterns and anomalies.

---

### 4. Section-Based Dashboard Navigation
- Introduced top-level navigation buttons:
  - Live System Health Status
  - System Metrics History
  - System Health Trends
- Only one section is visible at a time to reduce cognitive overload.
- Improves clarity, usability, and demo presentation.

---

## Technologies Used
- HTML5 for structure
- CSS3 for layout and styling
- JavaScript for dynamic behavior
- Chart.js for data visualization
- Flask REST APIs for data retrieval

---

## Design Considerations
- Avoided full-width charts to improve readability.
- Separated tables and graphs into different sections.
- Ensured minimal scrolling and clean visual hierarchy.

---

## Outcome
Phase 2 successfully converts raw system data into an intuitive dashboard, enabling users to monitor real-time status and analyze historical trends efficiently.
