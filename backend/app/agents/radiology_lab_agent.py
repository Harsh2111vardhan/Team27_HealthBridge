import json
import os

from backend.app.utils.pdf_parser import parse_lab_pdf
from backend.app.utils.image_preprocessing import analyze_xray


class RadiologyLabAgent:

    def __init__(self):

        base_dir = os.path.dirname(os.path.dirname(__file__))
        ref_path = os.path.join(base_dir, "data", "reference_ranges.json")

        with open(ref_path, "r") as f:
            self.reference_ranges = json.load(f)

    def analyze(self, pdf_path=None, image_path=None):

        lab_abnormalities = []
        image_findings = []
        overall_signal = 0.0

        # ---------- LAB REPORT ----------
        if pdf_path:

            values = parse_lab_pdf(pdf_path)

            for test, value in values.items():

                if test in self.reference_ranges:

                    ref = self.reference_ranges[test]
                    low = ref["low"]
                    high = ref["high"]

                    if value < low:
                        lab_abnormalities.append("low_" + test)

                    elif value > high:
                        lab_abnormalities.append("high_" + test)

        # ---------- XRAY ----------
        if image_path:

            result = analyze_xray(image_path)

            image_findings = result["image_findings"]
            overall_signal = result["overall_signal"]

        return {
            "lab_abnormalities": lab_abnormalities,
            "image_findings": image_findings,
            "overall_signal": overall_signal
        }


def run_radiology_agent(pdf_path=None, image_path=None):

    agent = RadiologyLabAgent()

    return agent.analyze(
        pdf_path=pdf_path,
        image_path=image_path
    )