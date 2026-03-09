def run_coordinator(doc, rad, pharm):

    risk_score = (
        doc["severity_signal"] * 0.4 +
        rad["overall_signal"] * 0.4
    )

    if risk_score > 0.7:
        risk_level = "high"
    elif risk_score > 0.4:
        risk_level = "moderate"
    else:
        risk_level = "low"

    return {
        "risk_score": risk_score,
        "risk_level": risk_level
    }