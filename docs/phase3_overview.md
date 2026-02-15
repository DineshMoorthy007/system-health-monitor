# Phase 3: Machine Learning-Based Prediction and Analysis

## Objective
The objective of Phase 3 is to enhance the system health monitoring platform with predictive intelligence using Machine Learning. This phase introduces data-driven prediction while preserving the reliability of rule-based evaluation.

---

## Machine Learning Pipeline

### 1. Dataset Preparation
- Extracted system metrics from the database.
- Constructed a labeled dataset using rule-based health status.
- Ensured consistent feature ordering and data integrity.

---

### 2. Feature Engineering
- Selected relevant features:
  - CPU usage
  - Memory usage
  - Disk usage
  - Process count
  - Health score
- Applied feature scaling using StandardScaler.
- Used fixed label mapping for stable class interpretation.

---

### 3. Baseline Model
- Logistic Regression was trained as a baseline model.
- Used to validate feature relevance and data separability.
- Provided an interpretable reference for comparison.

---

### 4. Final Model Selection
- Random Forest Classifier selected as the final model.
- Capable of handling non-linear relationships and class imbalance.
- Provided improved accuracy and recall for warning and critical states.

---

### 5. Model Evaluation
- Compared Logistic Regression and Random Forest models.
- Metrics used:
  - Accuracy
  - Precision
  - Recall
  - F1-score
- Random Forest consistently outperformed the baseline model.

---

### 6. Prediction API Integration
- Integrated the trained Random Forest model into the backend.
- Created a REST API to predict system health based on latest metrics.
- Ensured training–inference consistency by reusing the same scaler.
- ML predictions are advisory and do not override rule-based decisions.

---

### 7. Rule-Based vs ML-Based Comparison
- Displayed rule-based evaluation and ML prediction side-by-side in the dashboard.
- Highlighted differences between deterministic logic and learned patterns.
- Demonstrated the complementary nature of both approaches.

---

## Key Challenges Addressed
- Class imbalance in system health data
- Label encoding consistency
- Feature scaling mismatch between training and inference
- Feature name consistency during prediction

---

## Outcome
Phase 3 successfully adds predictive intelligence to the system, transforming it from a monitoring tool into an intelligent decision-support system while maintaining reliability and transparency.

---

## Final Remark
The integration of Machine Learning with OS-level monitoring provides early warning capabilities and enhances overall system observability.
