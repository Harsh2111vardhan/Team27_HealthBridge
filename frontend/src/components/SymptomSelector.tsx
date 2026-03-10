import { useState, useEffect, useMemo } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { fetchSymptoms, Symptom } from "@/services/api";
import { cn } from "@/lib/utils";

interface SymptomSelectorProps {
  selected: string[];
  onChange: (symptoms: string[]) => void;
}

export function SymptomSelector({ selected, onChange }: SymptomSelectorProps) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "severity">("name");

  useEffect(() => {
    fetchSymptoms().then((s) => {
      setSymptoms(s);
      setLoading(false);
    });
  }, []);

  const severityOrder = { severe: 0, moderate: 1, mild: 2 };

  const filtered = useMemo(() => {
    let list = symptoms.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "severity") {
      list = [...list].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    }
    return list;
  }, [symptoms, search, sortBy]);

  const toggle = (name: string) => {
    onChange(selected.includes(name) ? selected.filter((s) => s !== name) : [...selected, name]);
  };

  const severityDot = (severity: string) => {
    const cls = severity === "mild" ? "severity-dot-mild" : severity === "moderate" ? "severity-dot-moderate" : "severity-dot-severe";
    return <span className={cls} />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Select Symptoms</label>
        <div className="flex gap-1">
          <button
            onClick={() => setSortBy("name")}
            className={cn("text-xs px-2 py-1 rounded-lg transition-colors", sortBy === "name" ? "bg-primary/10 text-primary" : "text-muted-foreground")}
          >
            A-Z
          </button>
          <button
            onClick={() => setSortBy("severity")}
            className={cn("text-xs px-2 py-1 rounded-lg transition-colors", sortBy === "severity" ? "bg-primary/10 text-primary" : "text-muted-foreground")}
          >
            Severity
          </button>
        </div>
      </div>

      {/* Selected pills */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((s) => {
            const sym = symptoms.find((x) => x.name === s);
            return (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
              >
                {sym && severityDot(sym.severity)}
                {s}
                <button onClick={() => toggle(s)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search symptoms..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      {/* List */}
      <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-muted animate-pulse" />
            ))
          : filtered.map((s) => (
              <button
                key={s.name}
                onClick={() => toggle(s.name)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                  selected.includes(s.name)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {severityDot(s.severity)}
                <span>{s.name}</span>
                <span className="ml-auto text-[10px] text-muted-foreground capitalize">{s.severity}</span>
              </button>
            ))}
      </div>
    </div>
  );
}
