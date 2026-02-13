"use client";

import { useEffect, useState } from "react";

type Status = {
  backend: string;
  database: string;
  llm: string;
};

export default function StatusPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/status");
        if (!res.ok) throw new Error("Health check failed");
        const data = await res.json();
        setStatus(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  // Updated colors to match a more refined palette (Emerald/Rose/Amber)
  const getColor = (value: string) => {
    if (value === "ok") return "text-emerald-600 dark:text-emerald-400 font-medium";
    if (value === "error") return "text-rose-600 dark:text-rose-400 font-medium";
    return "text-amber-600 dark:text-amber-400 font-medium";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-900 dark:to-slate-950">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        
        {/* Header with Back Button */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            System Status
          </h1>
        </header>

        {/* Status Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Checking system health...</p>
            </div>
          ) : error ? (
            <div className="rounded-md bg-rose-50 p-4 text-center dark:bg-rose-950/30">
              <p className="text-sm text-rose-800 dark:text-rose-200">{error}</p>
            </div>
          ) : status && (
            <div className="space-y-6">
              {[
                { label: "Backend", value: status.backend },
                { label: "Database", value: status.database },
                { label: "LLM Connection", value: status.llm },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {item.label}
                  </span>
                  <span className={`text-sm uppercase tracking-wider ${getColor(item.value)}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-500">
          Last checked: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </main>
  );
}