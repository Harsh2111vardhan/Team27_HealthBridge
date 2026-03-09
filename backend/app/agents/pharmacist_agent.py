import json
import os
from backend.app.utils.drug_normalizer import normalize_drugs


def load_drug_rules():

    path = os.path.join(os.path.dirname(__file__), "../data/drug_rules.json")

    with open(path, "r") as f:
        return json.load(f)


def run_pharmacist_agent(data):

    rules = load_drug_rules()

    medications = data.get("medications", [])
    conditions = data.get("conditions", [])

    normalized_drugs = normalize_drugs(medications)

    interaction_flag = False
    risk_level = "low"

    for drug in normalized_drugs:

        if drug not in rules:
            continue

        rule = rules[drug]

        # Check contraindications
        for condition in conditions:
            if condition in rule["contraindicated_conditions"]:
                interaction_flag = True
                risk_level = "high"

        # Check drug interactions
        for other in normalized_drugs:
            if other in rule["interacts_with"]:
                interaction_flag = True

                if rule["risk_level"] == "high":
                    risk_level = "high"
                else:
                    risk_level = "moderate"

    return {
        "interaction_flag": interaction_flag,
        "risk_level": risk_level
    }