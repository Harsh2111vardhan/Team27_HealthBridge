import { useState } from "react";
import { X, Plus } from "lucide-react";

interface MedicationInputProps {
  medications: string[];
  onChange: (meds: string[]) => void;
}

export function MedicationInput({ medications, onChange }: MedicationInputProps) {
  const [input, setInput] = useState("");

  const addMed = () => {
    const val = input.trim();
    if (val && !medications.includes(val)) {
      onChange([...medications, val]);
      setInput("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Current Medications</label>

      {medications.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {medications.map((med) => (
            <span key={med} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
              {med}
              <button onClick={() => onChange(medications.filter((m) => m !== med))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMed())}
          placeholder="Enter medication name..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
        <button onClick={addMed} className="px-3 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
