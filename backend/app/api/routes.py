from fastapi import APIRouter

from backend.app.models.request_models import PatientRequest
from backend.app.models.response_models import AnalysisResponse

from backend.app.agents.doctor_agent import run_doctor_agent
from backend.app.agents.radiology_lab_agent import run_radiology_agent
from backend.app.agents.pharmacist_agent import run_pharmacist_agent
from backend.app.agents.coordinator_agent import run_coordinator

from backend.app.population.aggregator import add_case

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
def analyze_patient(data: PatientRequest):

    patient_input = data.dict()

    doctor_output = run_doctor_agent(patient_input)

    radiology_output = run_radiology_agent(
        pdf_path=patient_input.get("lab_report_path"),
        image_path=patient_input.get("xray_path")
    )

    pharmacist_output = run_pharmacist_agent(patient_input)

    final_assessment = run_coordinator(
        doctor_output,
        radiology_output,
        pharmacist_output
    )

    add_case(patient_input)

    return {
        "doctor_analysis": doctor_output,
        "radiology_analysis": radiology_output,
        "medication_safety": pharmacist_output,
        "final_assessment": final_assessment
    }