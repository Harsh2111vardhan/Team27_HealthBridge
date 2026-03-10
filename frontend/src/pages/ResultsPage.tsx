import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FlaskConical, ShieldAlert, Lightbulb, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConditionCard } from "@/components/ConditionCard";
import { RiskMeter } from "@/components/RiskMeter";
import { useCaseContext } from "@/hooks/useCaseContext";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { currentResult } = useCaseContext();

  if (!currentResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">No results available.</p>
        <Button variant="outline" onClick={() => navigate("/submit")} className="rounded-xl">
          Submit a Case
        </Button>
      </div>
    );
  }

  const r = currentResult;

  const recommendation =
    r.risk_level === "low"
      ? "Monitor symptoms and follow up if they persist or worsen."
      : r.risk_level === "moderate"
      ? "Schedule a consultation with a healthcare provider soon."
      : "Seek immediate medical attention. This case requires urgent evaluation.";

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
          <p className="text-sm text-muted-foreground">
            {r.date} at {r.time} · Age {r.age}, {r.sex}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/submit")} className="rounded-xl">
          <ArrowLeft className="mr-2 w-4 h-4" /> New Case
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Conditions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Possible Conditions</h3>
          <div className="divide-y divide-border/50">
            {r.conditions
              .sort((a, b) => b.probability - a.probability)
              .map((c, i) => (
                <ConditionCard key={c.name} name={c.name} probability={c.probability} severitySignal={c.severity_signal} index={i} />
              ))}
          </div>
        </motion.div>

        {/* RIGHT: Intelligence Panels */}
        <div className="space-y-6">
          {/* Lab & Image */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Lab & Image Findings</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Lab Abnormalities</p>
                {r.lab_findings.lab_abnormalities.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground py-1">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    {a}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Image Findings</p>
                {r.lab_findings.image_findings.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground py-1">
                    <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    {f}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Signal: {r.lab_findings.overall_signal}</p>
            </div>
          </motion.div>

          {/* Drug Safety */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Drug Safety</h3>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`risk-badge-${r.drug_safety.risk_level}`}>
                {r.drug_safety.risk_level} risk
              </span>
              {r.drug_safety.interaction_flag && (
                <span className="text-xs text-warning font-medium">Interaction flag raised</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{r.drug_safety.details}</p>
          </motion.div>

          {/* Risk Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">Final Risk Score</h3>
            <RiskMeter score={r.risk_score} level={r.risk_level} />
          </motion.div>

          {/* Recommendation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Recommended Action</h3>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{recommendation}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
