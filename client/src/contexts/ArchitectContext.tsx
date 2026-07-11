// ArchitectContext — shares funnel answers across pages
// Persisted in sessionStorage so WorkflowMap can read the output
import React, { createContext, useContext, useState, useEffect } from "react";

export interface ArchitectAnswers {
  scope: string;   // step 1: pwa | static | dynamic | saas
  audience: string; // step 2: consumers | developers | business | internal
  complexity: string; // step 3: simple | moderate | complex | enterprise
  data: string;    // step 4: realtime | relational | document | minimal
}

interface ArchitectContextType {
  answers: ArchitectAnswers | null;
  setAnswers: (a: ArchitectAnswers) => void;
  clearAnswers: () => void;
}

const ArchitectContext = createContext<ArchitectContextType | undefined>(undefined);

const SESSION_KEY = "vibehub_architect_answers";

export function ArchitectProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswersState] = useState<ArchitectAnswers | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setAnswers = (a: ArchitectAnswers) => {
    setAnswersState(a);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(a));
  };

  const clearAnswers = () => {
    setAnswersState(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <ArchitectContext.Provider value={{ answers, setAnswers, clearAnswers }}>
      {children}
    </ArchitectContext.Provider>
  );
}

export function useArchitect() {
  const ctx = useContext(ArchitectContext);
  if (!ctx) throw new Error("useArchitect must be used within ArchitectProvider");
  return ctx;
}

