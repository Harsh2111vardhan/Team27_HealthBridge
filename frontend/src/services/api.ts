// Real API service for HealthBridge — connects to FastAPI backend

const BASE_URL = "http://localhost:8000";

export interface Symptom {
  name: string;
  severity: "mild" | "moderate" | "severe";
}

export interface CaseResult {
  id: string;
  date: string;
  time: string;
  age: number;
  sex: string;
  symptoms: string[];
  medications: string[];
  conditions: { name: string; probability: number; severity_signal: number }[];
  lab_findings: { lab_abnormalities: string[]; image_findings: string[]; overall_signal: string };
  drug_safety: { interaction_flag: boolean; risk_level: "low" | "moderate" | "high"; details: string };
  risk_score: number;
  risk_level: "low" | "moderate" | "high";
}

// Static symptom list — kept client-side to avoid a round-trip for a fixed dataset
const SYMPTOM_LIST: Symptom[] = [
  { name: "Headache", severity: "mild" },
  { name: "Fever", severity: "moderate" },
  { name: "Chest Pain", severity: "severe" },
  { name: "Cough", severity: "mild" },
  { name: "Fatigue", severity: "mild" },
  { name: "Shortness of Breath", severity: "severe" },
  { name: "Nausea", severity: "moderate" },
  { name: "Dizziness", severity: "moderate" },
  { name: "Joint Pain", severity: "moderate" },
  { name: "Abdominal Pain", severity: "moderate" },
  { name: "Back Pain", severity: "mild" },
  { name: "Sore Throat", severity: "mild" },
  { name: "Muscle Weakness", severity: "moderate" },
  { name: "Blurred Vision", severity: "severe" },
  { name: "Palpitations", severity: "severe" },
  { name: "Swollen Lymph Nodes", severity: "moderate" },
  { name: "Night Sweats", severity: "moderate" },
  { name: "Weight Loss", severity: "moderate" },
  { name: "Skin Rash", severity: "mild" },
  { name: "Insomnia", severity: "mild" },
  { name: "Numbness", severity: "moderate" },
  { name: "Difficulty Swallowing", severity: "severe" },
  { name: "Frequent Urination", severity: "mild" },
  { name: "Blood in Urine", severity: "severe" },
  { name: "Wheezing", severity: "moderate" },
];

export async function fetchSymptoms(): Promise<Symptom[]> {
  return SYMPTOM_LIST.sort((a, b) => a.name.localeCompare(b.name));
}

export async function analyzeCase(data: {
  age: number;
  sex: string;
  symptoms: string[];
  medications: string[];
  labReport?: File;
  medicalImage?: File;
}): Promise<CaseResult> {
  const form = new FormData();
  form.append("age", String(data.age));
  form.append("sex", data.sex);
  form.append("symptoms", JSON.stringify(data.symptoms));
  form.append("medications", JSON.stringify(data.medications));
  form.append("conditions", JSON.stringify([]));

  if (data.labReport) {
    form.append("lab_report", data.labReport, data.labReport.name);
  }
  if (data.medicalImage) {
    form.append("medical_image", data.medicalImage, data.medicalImage.name);
  }

  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Backend error ${response.status}: ${errText}`);
  }

  const raw = await response.json();

  // Map backend response shape → CaseResult shape used by the UI
  const severitySignal: number = raw.doctor_analysis?.severity_signal ?? 0;

  const result: CaseResult = {
    id: crypto.randomUUID(),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    age: data.age,
    sex: data.sex,
    symptoms: data.symptoms,
    medications: data.medications,
    // Attach the global severity_signal to each condition (single value from doctor agent)
    conditions: (raw.doctor_analysis?.conditions ?? []).map(
      (c: { name: string; probability: number }) => ({
        name: c.name,
        probability: c.probability,
        severity_signal: severitySignal,
      })
    ),
    lab_findings: {
      lab_abnormalities:
        (raw.radiology_analysis?.lab_abnormalities ?? []).length > 0
          ? raw.radiology_analysis.lab_abnormalities
          : ["No abnormalities detected"],
      image_findings:
        (raw.radiology_analysis?.image_findings ?? []).length > 0
          ? raw.radiology_analysis.image_findings
          : data.medicalImage
          ? ["Image processed — no significant findings"]
          : ["No imaging provided"],
      overall_signal: String(raw.radiology_analysis?.overall_signal ?? "N/A"),
    },
    drug_safety: {
      interaction_flag: raw.medication_safety?.interaction_flag ?? false,
      risk_level: (raw.medication_safety?.risk_level ?? "low") as "low" | "moderate" | "high",
      details: raw.medication_safety?.details ?? "No medication data available.",
    },
    risk_score: raw.final_assessment?.risk_score ?? 0,
    risk_level: (raw.final_assessment?.risk_level ?? "low") as "low" | "moderate" | "high",
  };

  // Persist in localStorage for case history
  const cases = JSON.parse(localStorage.getItem("healthbridge_cases") || "[]");
  cases.unshift(result);
  localStorage.setItem("healthbridge_cases", JSON.stringify(cases));

  return result;
}

export function getCaseHistory(): CaseResult[] {
  return JSON.parse(localStorage.getItem("healthbridge_cases") || "[]");
}

export interface PopulationStats {
  casesToday: number;
  casesThisWeek: number;
  symptomTrends: { name: string; count: number }[];
  diseaseTrends: { name: string; count: number }[];
}

export async function fetchPopulationStats(): Promise<PopulationStats> {
  const response = await fetch(`${BASE_URL}/population/stats`);

  if (!response.ok) {
    throw new Error(`Failed to fetch population stats: ${response.status}`);
  }

  return response.json();
}
