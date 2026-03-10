def escalation_decision(risk_level):

    if risk_level == "high":
        return {
            "action": "Immediate medical attention required",
            "escalation": True
        }

    if risk_level == "moderate":
        return {
            "action": "Consult doctor within 24 hours",
            "escalation": False
        }

    return {
        "action": "Monitor symptoms",
        "escalation": False
    }