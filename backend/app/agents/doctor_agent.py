import os
import joblib


# ---------------------------------------------------
# Load trained model and label encoder
# ---------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "data", "disease_model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "data", "label_encoder.pkl")

model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)


# ---------------------------------------------------
# Doctor Agent
# ---------------------------------------------------

def run_doctor_agent(data):

    """
    Input:
        data = {
            "symptoms": ["fever", "cough", "fatigue"]
        }

    Output:
        {
            "conditions": [
                {"name": "Disease1", "probability": 0.45},
                {"name": "Disease2", "probability": 0.32},
                {"name": "Disease3", "probability": 0.21}
            ],
            "severity_signal": 0.3
        }
    """

    symptoms = data.get("symptoms", [])

    if not symptoms:
        return {
            "conditions": [],
            "severity_signal": 0
        }

    # Convert symptoms list → text sentence
    symptom_text = " ".join(symptoms)

    # Predict probabilities
    probs = model.predict_proba([symptom_text])[0]

    classes = label_encoder.classes_

    # Get top 3 predictions
    top_indices = probs.argsort()[-3:][::-1]

    conditions = []

    for idx in top_indices:

        disease = classes[idx]

        conditions.append({
            "name": disease,
            "probability": float(probs[idx])
        })

    # Simple severity estimation based on symptom count
    severity_signal = min(len(symptoms) / 10, 1)

    return {
        "conditions": conditions,
        "severity_signal": severity_signal
    }