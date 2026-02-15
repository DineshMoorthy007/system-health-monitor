import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


def train_logistic_model(data_path="backend/ml/data/processed_dataset.csv"):
    # Load processed dataset
    df = pd.read_csv(data_path)

    X = df.drop("label", axis=1)
    y = df["label"]

    if y.value_counts().min() < 2:
        print("⚠️ Some classes have too few samples for stratification.")
        print(y.value_counts())
        stratify_option = None
    else:
        stratify_option = y

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=stratify_option
    )

    # Train Logistic Regression
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)

    # Predictions
    y_pred = model.predict(X_test)

    # Evaluation
    accuracy = accuracy_score(y_test, y_pred)
    print("\nLogistic Regression Results")
    print("---------------------------")
    print(f"Accuracy: {accuracy:.4f}\n")
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))


if __name__ == "__main__":
    train_logistic_model()
