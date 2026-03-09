from pydantic import BaseModel
from typing import List, Dict


class Condition(BaseModel):
    name: str
    probability: float


class DoctorAnalysis(BaseModel):
    conditions: List[Condition]
    severity_signal: float


class RadiologyAnalysis(BaseModel):
    lab_abnormalities: List[str]
    image_findings: List[str]
    overall_signal: float


class MedicationSafety(BaseModel):
    interaction_flag: bool
    risk_level: str


class FinalAssessment(BaseModel):
    risk_score: float
    risk_level: str



class AnalysisResponse(BaseModel):

    doctor_analysis: DoctorAnalysis

    radiology_analysis: RadiologyAnalysis

    medication_safety: MedicationSafety

    final_assessment: FinalAssessment