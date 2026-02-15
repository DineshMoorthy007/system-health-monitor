# System Architecture Overview

## Architecture Description
The system follows a modular and layered architecture that integrates operating system monitoring, data persistence, algorithmic evaluation, machine learning, and visualization.

---

## High-Level Workflow

Operating System  
↓  
Metrics Collection Module  
↓  
Rule-Based Health Evaluation  
↓  
MySQL Database  
↓  
Feature Engineering  
↓  
Machine Learning Model  
↓  
REST APIs  
↓  
Web Dashboard  

---

## Component Description

### 1. OS Metrics Collector
- Collects real-time system metrics using OS-level APIs.
- Ensures low-overhead monitoring.

### 2. Rule-Based Evaluation Engine
- Applies deterministic logic to evaluate system health.
- Provides reliable baseline health assessment.

### 3. Database Layer
- Stores metrics and health results persistently.
- Supports historical queries and dataset generation.

### 4. Machine Learning Layer
- Trains predictive models using historical data.
- Predicts system health based on learned patterns.

### 5. REST API Layer
- Exposes system data and predictions to the frontend.
- Ensures loose coupling between components.

### 6. Web Dashboard
- Displays live system health.
- Shows historical metrics and trends.
- Compares rule-based and ML-based evaluations.

---

## Design Principles
- Modularity
- Separation of concerns
- Scalability
- Maintainability

---

## Outcome
The architecture supports real-time monitoring, reliable evaluation, and predictive intelligence while remaining simple and extensible.
