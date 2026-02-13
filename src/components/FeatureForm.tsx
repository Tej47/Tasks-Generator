"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type TemplateType = "web app" | "mobile app" | "internal tool";

interface FormState {
  goal: string;
  users: string;
  constraints: string;
  templateType: TemplateType;
}

export function FeatureForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    goal: "",
    users: "",
    constraints: "",
    templateType: "web app",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: keyof FormState) =>
      (event: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => {
          const updated = { ...prev, [field]: event.target.value };
          return updated;
        });
      };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const { goal, users, constraints, templateType } = form;

    if (!goal.trim() || !users.trim() || !constraints.trim()) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          users,
          constraints,
          templateType,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message =
          data?.error || "Something went wrong while generating the spec.";
        throw new Error(message);
      }

      const data = await response.json();

      // Persist result for the /generate page to consume
      router.push(`/generate/${data._id}`);


    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unexpected error while generating the spec."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
        Feature Planning
      </h2>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="goal"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Goal
        </label>
        <textarea
          id="goal"
          required
          rows={3}
          value={form.goal}
          onChange={handleChange("goal")}
          className="min-h-[96px] resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
          placeholder="Describe the main goal of this feature..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="users"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Target users
        </label>
        <textarea
          id="users"
          required
          rows={3}
          value={form.users}
          onChange={handleChange("users")}
          className="min-h-[96px] resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
          placeholder="Who is this feature for? What are their needs?"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="constraints"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Constraints
        </label>
        <textarea
          id="constraints"
          required
          rows={3}
          value={form.constraints}
          onChange={handleChange("constraints")}
          className="min-h-[96px] resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
          placeholder="List any technical, timeline, or business constraints..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="templateType"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Template type
        </label>
        <select
          id="templateType"
          required
          value={form.templateType}
          onChange={handleChange("templateType")}
          className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
        >
          <option value="web app">Web app</option>
          <option value="mobile app">Mobile app</option>
          <option value="internal tool">Internal tool</option>
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {isSubmitting && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
        <span>{isSubmitting ? "Generating..." : "Generate plan"}</span>
      </button>
    </form>
  );
}

