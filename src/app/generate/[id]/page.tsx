"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TaskBoard, type Task } from "../components/TaskBoard";

interface Spec {
  _id: string;
  title: string;
  goal: string;
  userStories: string[];
  tasks: Task[];
  risks: string[];
}

export default function GeneratePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [spec, setSpec] = useState<Spec | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    async function fetchSpec() {
      try {
        const res = await fetch(`/api/spec/${id}`);

        if (!res.ok) throw new Error("Failed to fetch spec");

        const data = await res.json();

        setSpec(data);
        setTasks(data.tasks);
      } catch (err) {
        setError("Could not load specification.");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchSpec();
  }, [id]);

  const handleSave = async () => {
    if (!spec) return;

    setSaveStatus("saving");

    try {
      const res = await fetch(`/api/spec/${spec._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...spec,
          tasks,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      setSaveStatus("saved");

      // Show "Saved ✓" for 2 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);

    } catch (error) {
      console.error(error);
      setSaveStatus("idle");
    }
  };

  return (
    <TaskBoard
      spec={
        spec
          ? {
            title: spec.title,
            goal: spec.goal,
            userStories: spec.userStories,
            risks: spec.risks,
          }
          : null
      }
      tasks={tasks}
      setTasks={setTasks}
      isLoading={isLoading}
      error={error}
      onSave={handleSave}
      isSaving={saveStatus === "saving"}
      saveStatus={saveStatus}

    />
  );
}
