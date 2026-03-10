import json
import os


def load_brand_map():
    path = os.path.join(os.path.dirname(__file__), "../data/drug_brand_map.json")

    with open(path, "r") as f:
        return json.load(f)


def normalize_drugs(drug_list):
    """
    Converts brand names into generic drug names
    """

    brand_map = load_brand_map()
    normalized = []

    for drug in drug_list:
        drug = drug.lower().strip()

        if drug in brand_map:
            normalized.extend(brand_map[drug])
        else:
            normalized.append(drug)

    return list(set(normalized))