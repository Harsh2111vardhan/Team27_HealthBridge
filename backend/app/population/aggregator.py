cases = []


def add_case(case):

    record = {
        "symptoms": case.get("symptoms", []),
        "conditions": case.get("conditions", [])
    }

    cases.append(record)


def get_all_cases():

    return cases