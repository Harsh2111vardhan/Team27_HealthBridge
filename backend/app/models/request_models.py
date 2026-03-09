from pydantic import BaseModel, Field
from typing import List, Optional


class PatientRequest(BaseModel):

    symptoms: List[str] = Field(
        ...,
        description="List of symptoms reported by patient"
    )

    medications: Optional[List[str]] = Field(
        default=[],
        description="Current medications patient is taking"
    )

    conditions: Optional[List[str]] = Field(
        default=[],
        description="Existing medical conditions"
    )

    lab_report_path: Optional[str] = Field(
        default=None,
        description="Path to uploaded lab report PDF"
    )

    xray_path: Optional[str] = Field(
        default=None,
        description="Path to uploaded X-ray image"
    )