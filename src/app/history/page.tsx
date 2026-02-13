"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SpecHistory {
  _id: string;
  title: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [specs, setSpecs] = useState<SpecHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        setSpecs(data);
      } catch (error) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/generate/${id}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Recent Specifications
        </h1>

        {loading ? (
          <div className="animate-pulse text-slate-600 dark:text-slate-300">
            Loading history...
          </div>
        ) : specs.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-300">
            No specifications found.
          </p>
        ) : (
          <div className="space-y-3">
            {specs.map((spec) => (
              <div
                key={spec._id}
                onClick={() => handleClick(spec._id)}
                className="cursor-pointer rounded-md border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-50">
                  {spec.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(spec.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
