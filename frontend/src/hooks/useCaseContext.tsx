import { useState, useCallback, ReactNode, createContext, useContext } from "react";
import { CaseResult } from "@/services/api";

interface CaseContextType {
  currentResult: CaseResult | null;
  setCurrentResult: (r: CaseResult | null) => void;
}

const CaseContext = createContext<CaseContextType>({
  currentResult: null,
  setCurrentResult: () => {},
});

export function CaseProvider({ children }: { children: ReactNode }) {
  const [currentResult, setCurrentResult] = useState<CaseResult | null>(null);
  return (
    <CaseContext.Provider value={{ currentResult, setCurrentResult }}>
      {children}
    </CaseContext.Provider>
  );
}

export const useCaseContext = () => useContext(CaseContext);
