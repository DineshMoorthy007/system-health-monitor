import joblib
import pandas as pd

LABEL_MAP = {
    0: "HEALTHY",
    1: "WARNING",
    2: "CRITICAL"
}

MODEL_PATH = "backend/ml/saved_models/random_forest_model.pkl"
SCALER_PATH = "backend/ml/saved_models/scaler.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

FEATURE_COLUMNS = [
    "cpu_usage",
    "memory_usage",
    "disk_usage",
    "process_count",
    "health_score"
]


def predict_health(metrics):
    # Step 1: Create DataFrame with feature names
    features_df = pd.DataFrame([metrics], columns=FEATURE_COLUMNS)

    # Step 2: Scale → still returns ndarray
    scaled_array = scaler.transform(features_df)

    # Step 3: Convert BACK to DataFrame with same column names
    scaled_df = pd.DataFrame(scaled_array, columns=FEATURE_COLUMNS)

    # Step 4: Predict using DataFrame (no warning)
    prediction = model.predict(scaled_df)[0]

    return LABEL_MAP[prediction]
