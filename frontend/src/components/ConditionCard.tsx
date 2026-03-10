import { motion } from "framer-motion";

interface ConditionCardProps {
  name: string;
  probability: number;
  severitySignal: number;
  index: number;
}

export function ConditionCard({ name, probability, severitySignal, index }: ConditionCardProps) {
  const pct = Math.round(probability * 100);

  const barColor =
    probability >= 0.7
      ? "bg-danger"
      : probability >= 0.4
      ? "bg-warning"
      : "bg-success";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col gap-2 py-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Severity: {Math.round(severitySignal * 100)}%</span>
          <span className="text-sm font-semibold text-foreground">{pct}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 + index * 0.1 }}
        />
      </div>
    </motion.div>
  );
}
