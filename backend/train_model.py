import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder

from xgboost import XGBClassifier


print("Loading dataset...")

df = pd.read_csv("app/data/symptom2disease.csv")

# drop useless column if present
if "Unnamed: 0" in df.columns:
    df = df.drop(columns=["Unnamed: 0"])


print("Columns:", df.columns)
print("Dataset size:", df.shape)


X = df["text"]
y = df["label"]


# encode disease labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)


# split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42
)


# build pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        stop_words="english",
        max_features=5000
    )),
    ("xgb", XGBClassifier(
        n_estimators=400,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        eval_metric="mlogloss"
    ))
])


print("Training model...")

model.fit(X_train, y_train)


print("Evaluating model...")

pred = model.predict(X_test)

accuracy = accuracy_score(y_test, pred)

print("Accuracy:", accuracy)


print("Saving model...")

joblib.dump(model, "app/data/disease_model.pkl")
joblib.dump(label_encoder, "app/data/label_encoder.pkl")

print("Model saved successfully.")