from backend.app.population.aggregator import get_all_cases
from backend.app.population.anomaly_detection import detect_symptom_spike


def generate_dashboard_data():

    cases = get_all_cases()

    total_cases = len(cases)

    spikes = detect_symptom_spike(cases)

    return {
        "total_cases": total_cases,
        "symptom_spikes": spikes
    }