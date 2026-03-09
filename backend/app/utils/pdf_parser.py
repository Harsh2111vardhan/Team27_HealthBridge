import fitz
import re


def extract_text_from_pdf(file_path):

    doc = fitz.open(file_path)

    text = ""

    for page in doc:
        text += page.get_text()

    return text


def extract_lab_values(text):

    patterns = {
        "hemoglobin": r"hemoglobin\s*[:\-]?\s*(\d+\.?\d*)",
        "platelets": r"platelets\s*[:\-]?\s*(\d+\.?\d*)",
        "wbc": r"wbc\s*[:\-]?\s*(\d+\.?\d*)",
        "glucose_fasting": r"glucose\s*[:\-]?\s*(\d+\.?\d*)",
        "creatinine": r"creatinine\s*[:\-]?\s*(\d+\.?\d*)",
        "crp": r"crp\s*[:\-]?\s*(\d+\.?\d*)"
    }

    results = {}

    for test, pattern in patterns.items():

        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            results[test] = float(match.group(1))

    return results


def parse_lab_pdf(file_path):

    text = extract_text_from_pdf(file_path)

    return extract_lab_values(text)