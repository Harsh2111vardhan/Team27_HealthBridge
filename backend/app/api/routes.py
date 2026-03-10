import os
import uuid
import json
import shutil
from collections import Counter

from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import List, Optional

from backend.app.agents.doctor_agent import run_doctor_agent
from backend.app.agents.radiology_lab_agent import run_radiology_agent
from backend.app.agents.pharmacist_agent import run_pharmacist_agent
from backend.app.agents.coordinator_agent import run_coordinator

from backend.app.population.aggregator import add_case, get_all_cases

router = APIRouter()

# Temp directory for uploaded files
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_upload(file: UploadFile, ext: str) -> str:
    """Save an uploaded file to disk and return its path."""
    filename = f"{uuid.uuid4()}{ext}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return path


@router.post("/analyze")
async def analyze_patient(
    age: int = Form(...),
    sex: str = Form(...),
    symptoms: str = Form(...),       # JSON-encoded list
    medications: str = Form("[]"),   # JSON-encoded list
    conditions: str = Form("[]"),    # JSON-encoded list
    lab_report: Optional[UploadFile] = File(None),
    medical_image: Optional[UploadFile] = File(None),
):
    symptoms_list: List[str] = json.loads(symptoms)
    medications_list: List[str] = json.loads(medications)
    conditions_list: List[str] = json.loads(conditions)

    # Save uploaded files if provided
    lab_report_path = None
    xray_path = None

    if lab_report and lab_report.filename:
        lab_report_path = save_upload(lab_report, ".pdf")

    if medical_image and medical_image.filename:
        ext = os.path.splitext(medical_image.filename)[1] or ".jpg"
        xray_path = save_upload(medical_image, ext)

    patient_input = {
        "age": age,
        "sex": sex,
        "symptoms": symptoms_list,
        "medications": medications_list,
        "conditions": conditions_list,
        "lab_report_path": lab_report_path,
        "xray_path": xray_path,
    }

    doctor_output = run_doctor_agent(patient_input)

    radiology_output = run_radiology_agent(
        pdf_path=lab_report_path,
        image_path=xray_path
    )

    pharmacist_output = run_pharmacist_agent(patient_input)

    final_assessment = run_coordinator(
        doctor_output,
        radiology_output,
        pharmacist_output
    )

    # Add to population store
    add_case({
        "symptoms": symptoms_list,
        "conditions": [c["name"] for c in doctor_output.get("conditions", [])],
    })

    return {
        "doctor_analysis": doctor_output,
        "radiology_analysis": radiology_output,
        "medication_safety": pharmacist_output,
        "final_assessment": final_assessment,
        "patient_info": {"age": age, "sex": sex},
    }


@router.get("/population/stats")
def get_population_stats():
    """Return aggregated population health statistics from all submitted cases."""
    cases = get_all_cases()

    total = len(cases)

    # Count symptom frequencies
    symptom_counter: Counter = Counter()
    disease_counter: Counter = Counter()

    for case in cases:
        for s in case.get("symptoms", []):
            symptom_counter[s] += 1
        for c in case.get("conditions", []):
            disease_counter[c] += 1

    symptom_trends = [
        {"name": name, "count": count}
        for name, count in symptom_counter.most_common(10)
    ]

    disease_trends = [
        {"name": name, "count": count}
        for name, count in disease_counter.most_common(8)
    ]

    return {
        "casesToday": total,        # In-memory store; all are "today" in demo
        "casesThisWeek": total,
        "symptomTrends": symptom_trends,
        "diseaseTrends": disease_trends,
    }