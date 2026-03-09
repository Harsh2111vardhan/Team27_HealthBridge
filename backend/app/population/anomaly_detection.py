from collections import Counter


def detect_symptom_spike(cases):

    symptom_list = []

    for case in cases:
        symptom_list.extend(case.get("symptoms", []))

    counter = Counter(symptom_list)

    spikes = {
        symptom: count
        for symptom, count in counter.items()
        if count > 5
    }

    return spikes