import { motion } from "framer-motion";
import { ArrowRight, History, ShieldCheck, Activity, Brain, Stethoscope, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const navigate = useNavigate();

  const agents = [
    { icon: Stethoscope, title: "Doctor Agent", desc: "Symptom reasoning & differential diagnosis" },
    { icon: Brain, title: "Radiology/Lab Agent", desc: "PDF & medical image analysis" },
    { icon: Pill, title: "Pharmacist Agent", desc: "Drug interaction safety checks" },
    { icon: Activity, title: "Coordinator Agent", desc: "Final risk scoring & recommendations" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-medium mb-8">
            <Activity className="w-3.5 h-3.5" />
            AI-Powered Clinical Decision Support
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
            Smarter Clinical
            <br />
            <span className="gradient-text">Decisions, Faster</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
            Multimodal AI agents analyze symptoms, labs, imaging, and medications to deliver evidence-based risk assessments in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/submit")}
              className="rounded-xl px-8 py-6 text-base gradient-primary border-0 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              Start New Health Case
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/history")}
              className="rounded-xl px-8 py-6 text-base"
            >
              <History className="mr-2 w-4 h-4" />
              View Previous Results
            </Button>
          </div>

          <button
            onClick={() => navigate("/admin")}
            className="mt-4 text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mx-auto"
          >
            <ShieldCheck className="w-3 h-3" />
            Admin Panel
          </button>
        </motion.div>
      </div>

      {/* Agents Grid */}
      <div className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card-hover p-5 flex flex-col items-center text-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <agent.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{agent.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{agent.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          For informational purposes only. Not a substitute for professional medical advice.
        </p>
      </footer>
    </div>
  );
}
