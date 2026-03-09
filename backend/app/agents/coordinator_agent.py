def run_coordinator(doc, rad=None, pharm=None):
    """
    Combines outputs from doctor, radiology and pharmacist agents
    and produces a final medical risk report.
    """

    # Extract signals safely
    doc_signal = doc.get("severity_signal", 0)
    rad_signal = rad.get("overall_signal", 0) if rad else 0

    # Calculate combined risk score
    risk_score = (doc_signal * 0.5) + (rad_signal * 0.5)

    # Determine risk level
    if risk_score > 0.7:
        risk_level = "high"
    elif risk_score > 0.4:
        risk_level = "moderate"
    else:
        risk_level = "low"

    # Final combined response
    return {
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "doctor_analysis": doc,
        "radiology_analysis": rad,
        "medications": pharm
    }


# ----------------------------
# Test block (runs only if file is executed directly)
# ----------------------------

if __name__ == "__main__":

    # Simulated doctor agent output
    doctor_output = {
        "disease": "Pneumonia",
        "severity_signal": 0.6
    }

    # Simulated radiology agent output
    radiology_output = {
        "finding": "lung opacity",
        "overall_signal": 0.7
    }

    # Simulated pharmacist agent output
    pharmacist_output = {
        "drugs": ["Azithromycin", "Paracetamol"]
    }

    # Run coordinator
    result = run_coordinator(doctor_output, radiology_output, pharmacist_output)

    # Print result
    print("\nFinal Medical Report:")
    print(result)