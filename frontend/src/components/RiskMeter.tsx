import { motion } from "framer-motion";

interface RiskMeterProps {
  score: number; // 0-1
  level: "low" | "moderate" | "high";
}

export function RiskMeter({ score, level }: RiskMeterProps) {
  const percentage = Math.round(score * 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score * circumference);

  const colorMap = {
    low: "stroke-success",
    moderate: "stroke-warning",
    high: "stroke-danger",
  };

  const bgColorMap = {
    low: "text-success",
    moderate: "text-warning",
    high: "text-danger",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className="stroke-muted" />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={colorMap[level]}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-2xl font-bold ${bgColorMap[level]}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {percentage}%
          </motion.span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Risk</span>
        </div>
      </div>
      <span className={`risk-badge-${level} capitalize`}>{level} Risk</span>
    </div>
  );
}
