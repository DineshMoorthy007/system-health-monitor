CREATE DATABASE system_health_db;
USE system_health_db;

CREATE TABLE system_metrics (
    metric_id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME,
    cpu_usage FLOAT,
    memory_usage FLOAT,
    disk_usage FLOAT,
    process_count INT
);

CREATE TABLE health_status (
    health_status_id INT PRIMARY KEY,
    status_name VARCHAR(20)
);

INSERT INTO health_status VALUES
(1,'HEALTHY'),
(2,'WARNING'),
(3,'CRITICAL');

CREATE TABLE health_evaluations (
    evaluation_id INT AUTO_INCREMENT PRIMARY KEY,
    metric_id INT,
    health_score INT,
    health_status_id INT,
    evaluation_method ENUM('RULE','ML'),

    FOREIGN KEY(metric_id) REFERENCES system_metrics(metric_id),
    FOREIGN KEY(health_status_id) REFERENCES health_status(health_status_id)
);

INSERT INTO system_metrics
(timestamp,cpu_usage,memory_usage,disk_usage,process_count)
SELECT
timestamp,
cpu_usage,
memory_usage,
disk_usage,
process_count
FROM system_metrics_old;

INSERT INTO health_evaluations
(metric_id, health_score, health_status_id, evaluation_method)

SELECT
id,
health_score,
CASE
    WHEN health_status = 'HEALTHY' THEN 1
    WHEN health_status = 'WARNING' THEN 2
    WHEN health_status = 'CRITICAL' THEN 3
END,
'RULE'
FROM system_metrics_old;

CREATE INDEX idx_timestamp 
ON system_metrics(timestamp);

CREATE INDEX idx_metric 
ON health_evaluations(metric_id);

CREATE VIEW system_health_view AS
SELECT
m.metric_id,
m.timestamp,
m.cpu_usage,
m.memory_usage,
m.disk_usage,
m.process_count,
e.health_score,
s.status_name AS health_status
FROM system_metrics m
JOIN health_evaluations e ON m.metric_id = e.metric_id
JOIN health_status s ON e.health_status_id = s.health_status_id;

CREATE VIEW system_health_summary AS
SELECT
AVG(cpu_usage) AS avg_cpu,
MAX(cpu_usage) AS max_cpu,
AVG(memory_usage) AS avg_memory,
MAX(memory_usage) AS max_memory,
AVG(health_score) AS avg_health_score
FROM system_health_view;

SELECT COUNT(*) FROM system_metrics;
SELECT COUNT(*) FROM health_evaluations;