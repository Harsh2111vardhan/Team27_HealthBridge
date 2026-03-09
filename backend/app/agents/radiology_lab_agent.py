import json
import os

from app.utils.pdf_parser import parse_lab_pdf
from app.utils.image_preprocessing import analyze_xray


class RadiologyLabAgent:

    def __init__(self):

        base_dir = os.path.dirname(os.path.dirname(__file__))

        ref_path = os.path.join(base_dir, "data", "reference_ranges.json")

        with open(ref_path) as f:
            self.reference_ranges = json.load(f)


    def analyze_lab_report(self, pdf_path):

        lab_values = parse_lab_pdf(pdf_path)

        abnormalities = []

        for test, value in lab_values.items():

            if test not in self.reference_ranges:
                continue

            ref = self.reference_ranges[test]

            if value < ref["low"]:
                abnormalities.append(f"low_{test}")

            elif value > ref["high"]:
                abnormalities.append(f"high_{test}")

        return abnormalities


    def analyze_image(self, image_path):

        findings, confidence = analyze_xray(image_path)

        return findings, confidence


    def run(self, pdf=None, image=None):

        lab_abnormalities = []
        image_findings = []
        signal = 0.0

        if pdf:
            lab_abnormalities = self.analyze_lab_report(pdf)

        if image:
            image_findings, signal = self.analyze_image(image)

        if lab_abnormalities:
            signal = max(signal, 0.6)

        return {
            "lab_abnormalities": lab_abnormalities,
            "image_findings": image_findings,
            "overall_signal": signal
        }


def run_radiology_agent(pdf_path=None, image_path=None):

    agent = RadiologyLabAgent()

    return agent.run(
        pdf=pdf_path,
        image=image_path
    )