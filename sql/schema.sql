-- Database schema
CREATE DATABASE system_health_db;

USE system_health_db;

CREATE TABLE system_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    cpu_usage FLOAT,
    memory_usage FLOAT,
    disk_usage FLOAT,
    process_count INT
);

ALTER TABLE system_metrics
ADD health_score INT,
ADD health_status VARCHAR(20);

SELECT timestamp, cpu_usage, memory_usage, health_score, health_status
FROM system_metrics
ORDER BY timestamp DESC
LIMIT 5;

select * from system_metrics;