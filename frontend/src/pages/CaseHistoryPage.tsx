import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, ChevronRight } from "lucide-react";
import { getCaseHistory, CaseResult } from "@/services/api";
import { useCaseContext } from "@/hooks/useCaseContext";
import { useNavigate } from "react-router-dom";

export default function CaseHistoryPage() {
  const [cases, setCases] = useState<CaseResult[]>([]);
  const { setCurrentResult } = useCaseContext();
  const navigate = useNavigate();

  useEffect(() => {
    setCases(getCaseHistory());
  }, []);

  const viewCase = (c: CaseResult) => {
    setCurrentResult(c);
    navigate("/results");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <History className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Case History</h2>
      </div>

      {cases.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No cases found. Submit a case to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => viewCase(c)}
              className="w-full glass-card-hover p-5 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {c.date} at {c.time}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Age {c.age} · {c.symptoms.length} symptoms · {c.conditions[0]?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`risk-badge-${c.risk_level}`}>{c.risk_level}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
