"use client";

import { useRouter } from "next/navigation";
import { FeatureForm } from "../components/FeatureForm";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-900 dark:to-slate-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8">
        <header className="text-center space-y-3 relative w-full">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.push("/history")}
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              History
            </button>
            <button
              type="button"
              onClick={() => router.push("/status")}
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Status
            </button>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Tasks Generator
          </h1>

          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base mx-auto">
            Turn rough product ideas into structured, actionable engineering plans powered by AI.
          </p>
        </header>

        <FeatureForm />
      </div>
    </main>
  );
}


