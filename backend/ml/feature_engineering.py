import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib


def prepare_features(input_path="backend/ml/data/system_health_dataset.csv",
                     output_path="backend/ml/data/processed_dataset.csv"):
    """
    Load raw dataset, encode labels, scale features,
    and save processed dataset.
    """

    # Load dataset
    df = pd.read_csv(input_path)

    # -----------------------------
    # Label Encoding
    # -----------------------------
    label_encoder = LabelEncoder()
    df["health_status_encoded"] = label_encoder.fit_transform(df["health_status"])

    # -----------------------------
    # Feature Selection
    # -----------------------------
    feature_columns = [
        "cpu_usage",
        "memory_usage",
        "disk_usage",
        "process_count",
        "health_score"
    ]

    X = df[feature_columns]
    y = df["health_status_encoded"]

    # -----------------------------
    # Feature Scaling
    # -----------------------------
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    joblib.dump(scaler, "backend/ml/saved_models/scaler.pkl")

    processed_df = pd.DataFrame(X_scaled, columns=feature_columns)
    processed_df["label"] = y

    # Save processed dataset
    processed_df.to_csv(output_path, index=False)

    print("Feature engineering completed.")
    print("Label mapping:")
    for cls, val in zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)):
        print(f"{cls} → {val}")

    print("\nSample processed data:")
    print(processed_df.head())


if __name__ == "__main__":
    prepare_features()
