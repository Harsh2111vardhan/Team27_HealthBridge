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
    flagged_pairs = []
    contraindicated = []

    for drug in normalized_drugs:

        if drug not in rules:
            continue

        rule = rules[drug]

        # Check contraindications
        for condition in conditions:
            if condition in rule["contraindicated_conditions"]:
                interaction_flag = True
                risk_level = "high"
                contraindicated.append(f"{drug} contraindicated with {condition}")

        # Check drug interactions
        for other in normalized_drugs:
            if other in rule["interacts_with"]:
                interaction_flag = True
                flagged_pairs.append(f"{drug} ↔ {other}")

                if rule["risk_level"] == "high":
                    risk_level = "high"
                elif risk_level != "high":
                    risk_level = "moderate"

    # Build details string
    if not medications:
        details = "No medications reported."
    elif not interaction_flag:
        details = "No critical interactions detected. All reviewed medications appear safe together."
    else:
        parts = []
        if contraindicated:
            parts.append("Contraindications: " + "; ".join(contraindicated))
        if flagged_pairs:
            unique_pairs = list(dict.fromkeys(flagged_pairs))
            parts.append("Drug interactions flagged: " + ", ".join(unique_pairs))
        details = " | ".join(parts)

    return {
        "interaction_flag": interaction_flag,
        "risk_level": risk_level,
        "details": details
    }
