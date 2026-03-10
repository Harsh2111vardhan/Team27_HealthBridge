import { Activity } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-16 border-b border-border/50 bg-card/60 backdrop-blur-xl flex items-center px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight gradient-text">HealthBridge</h1>
          <p className="text-[10px] text-muted-foreground leading-none -mt-0.5">AI Clinical Decision Support</p>
        </div>
      </div>
    </header>
  );
}
