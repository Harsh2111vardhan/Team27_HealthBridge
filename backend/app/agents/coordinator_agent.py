def run_coordinator(doc, rad, pharm):

    pharm_score = 0.2 if pharm.get("interaction_flag") else 0

    risk_score = (
        doc["severity_signal"] * 0.4 +
        rad["overall_signal"] * 0.4 +
        pharm_score
    )

    if risk_score > 0.7:
        risk_level = "high"
    elif risk_score > 0.4:
        risk_level = "moderate"
    else:
        risk_level = "low"

    return {
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level
    }