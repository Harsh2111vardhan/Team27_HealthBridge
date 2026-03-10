def compute_risk_score(doctor_signal, radiology_signal, drug_risk):

    drug_weight = {
        "low": 0.1,
        "moderate": 0.2,
        "high": 0.3
    }

    drug_score = drug_weight.get(drug_risk, 0.1)

    risk_score = (
        doctor_signal * 0.4
        + radiology_signal * 0.4
        + drug_score * 0.2
    )

    risk_score = min(risk_score, 1.0)

    if risk_score > 0.7:
        risk_level = "high"
    elif risk_score > 0.4:
        risk_level = "moderate"
    else:
        risk_level = "low"

    return risk_score, risk_level