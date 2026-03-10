import fitz
import re


def parse_lab_pdf(pdf_path):

    doc = fitz.open(pdf_path)

    text = ""

    for page in doc:
        text += page.get_text()

    lab_values = {}

    patterns = {
        "hemoglobin": r"Hemoglobin\s+([\d\.]+)",
        "wbc": r"WBC\s+([\d,]+)",
        "platelets": r"Platelets\s+([\d,]+)"
    }

    for key, pattern in patterns.items():

        match = re.search(pattern, text)

        if match:
            value = match.group(1).replace(",", "")
            lab_values[key] = float(value)

    return lab_values   