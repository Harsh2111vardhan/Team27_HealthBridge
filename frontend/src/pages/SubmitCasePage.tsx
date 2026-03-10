import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SymptomSelector } from "@/components/SymptomSelector";
import { MedicationInput } from "@/components/MedicationInput";
import { FileUpload } from "@/components/FileUpload";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { analyzeCase } from "@/services/api";
import { useCaseContext } from "@/hooks/useCaseContext";

const steps = ["Patient Info", "Symptoms", "Additional Data"];

export default function SubmitCasePage() {
  const navigate = useNavigate();
  const { setCurrentResult } = useCaseContext();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");

  // Step 2
  const [symptoms, setSymptoms] = useState<string[]>([]);

  // Step 3
  const [medications, setMedications] = useState<string[]>([]);
  const [labReport, setLabReport] = useState<File | null>(null);
  const [medicalImage, setMedicalImage] = useState<File | null>(null);

  const canContinueStep0 = age && parseInt(age) > 0 && sex;
  const canContinueStep1 = symptoms.length > 0;

  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await analyzeCase({
        age: parseInt(age),
        sex,
        symptoms,
        medications,
        labReport: labReport || undefined,
        medicalImage: medicalImage || undefined,
      });
      setCurrentResult(result);
      navigate("/results");
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : "An unknown error occurred.";
      setErrorMsg(msg);
    }
  };


  const pageVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <>
      <AnimatePresence>{loading && <LoadingOverlay />}</AnimatePresence>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                {s}
              </span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 rounded-full ${i < step ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Start Your Health Analysis</h2>
                <p className="text-sm text-muted-foreground mt-1">Enter basic patient information to begin.</p>
              </div>

              <div className="glass-card p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age"
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Sex</label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-warning/10 text-warning">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs">For informational purposes only. Not a medical diagnosis.</p>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(1)} disabled={!canContinueStep0} className="rounded-xl px-6 gradient-primary text-primary-foreground border-0">
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Symptom Selection</h2>
                <p className="text-sm text-muted-foreground mt-1">Select all symptoms the patient is experiencing.</p>
              </div>

              <div className="glass-card p-6">
                <SymptomSelector selected={symptoms} onChange={setSymptoms} />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)} className="rounded-xl">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button onClick={() => setStep(2)} disabled={!canContinueStep1} className="rounded-xl px-6 gradient-primary text-primary-foreground border-0">
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Additional Information</h2>
                <p className="text-sm text-muted-foreground mt-1">Add medications, lab reports, and medical images for deeper analysis.</p>
              </div>

              <div className="glass-card p-6 space-y-6">
                <MedicationInput medications={medications} onChange={setMedications} />
                <FileUpload accept=".pdf" label="Lab Report" icon="pdf" file={labReport} onFileChange={setLabReport} />
                <FileUpload accept=".jpg,.jpeg,.png" label="Medical Image" icon="image" file={medicalImage} onFileChange={setMedicalImage} />
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Analysis Failed</p>
                    <p>{errorMsg}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button onClick={handleAnalyze} className="rounded-xl px-8 gradient-primary text-primary-foreground border-0 shadow-lg">
                  <Sparkles className="mr-2 w-4 h-4" /> Analyze Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

