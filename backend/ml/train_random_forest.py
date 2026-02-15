import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


def train_random_forest(data_path="backend/ml/data/processed_dataset.csv"):
    # Load dataset
    df = pd.read_csv(data_path)

    X = df.drop("label", axis=1)
    y = df["label"]

    # Train-test split (no stratify due to imbalance)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Random Forest Model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=None,
        random_state=42,
        class_weight="balanced"
    )

    model.fit(X_train, y_train)

    # Predictions
    y_pred = model.predict(X_test)

    # Evaluation
    accuracy = accuracy_score(y_test, y_pred)

    print("\nRandom Forest Results")
    print("---------------------")
    print(f"Accuracy: {accuracy:.4f}\n")

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save model
    joblib.dump(model, "backend/ml/saved_models/random_forest_model.pkl")
    print("\nModel saved to backend/ml/saved_models/random_forest_model.pkl")


if __name__ == "__main__":
    train_random_forest()
