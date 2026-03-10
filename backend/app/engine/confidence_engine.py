def calculate_confidence(conditions):

    if not conditions:
        return 0

    probabilities = [c["probability"] for c in conditions]

    return max(probabilities)