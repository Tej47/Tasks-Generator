"use client";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TaskColumn } from "./TaskColumn";
import { useState } from "react";
import { DragOverlay } from "@dnd-kit/core";
import { useRouter } from "next/navigation";

export type TaskGroup = "Frontend" | "Backend" | "Database" | "DevOps";

export interface Task {
  id: string;
  title: string;
  group: TaskGroup;
}

export interface SpecSummary {
  title: string;
  goal: string;
  userStories: string[];
  risks: string[];
}

interface TaskBoardProps {
  spec: SpecSummary | null;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isLoading: boolean;
  error: string | null;
  onSave: () => void;
  isSaving: boolean;
  saveStatus: "idle" | "saving" | "saved";

}

const taskGroups: TaskGroup[] = ["Frontend", "Backend", "Database", "DevOps"];
function generateMarkdown(spec: SpecSummary, tasks: Task[]) {
  const groupedTasks = taskGroups
    .map(group => {
      const groupTasks = tasks.filter(t => t.group === group);
      if (!groupTasks.length) return "";
      return `## ${group}\n\n${groupTasks.map(t => `- ${t.title}`).join("\n")}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return `# ${spec.title}

## Goal
${spec.goal}

## User Stories
${spec.userStories.map(s => `- ${s}`).join("\n")}

${groupedTasks}

## Risks
${spec.risks.map(r => `- ${r}`).join("\n")}
`;
}

export function TaskBoard({
  spec,
  tasks,
  setTasks,
  isLoading,
  error,
  onSave,
  isSaving,
  saveStatus
}: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const router = useRouter();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    setTasks((prev) => {
      const activeIndex = prev.findIndex(t => t.id === active.id);
      if (activeIndex === -1) return prev;
      const overIndex = prev.findIndex(t => t.id === over.id);

      const activeTask = prev[activeIndex];
      const overTask = prev[overIndex];

      // Dropped on column (empty space)
      if (taskGroups.includes(over.id as TaskGroup)) {
        const newGroup = over.id as TaskGroup;
        const updated = { ...activeTask, group: newGroup };

        const withoutActive = prev.filter(t => t.id !== active.id);
        return [...withoutActive, updated];
      }

      if (!overTask) return prev;

      // Same group → use arrayMove
      if (activeTask.group === overTask.group) {
        return arrayMove(prev, activeIndex, overIndex);
      }

      // Different group → change group + reposition
      const updated = { ...activeTask, group: overTask.group };

      const withoutActive = prev.filter(t => t.id !== active.id);
      const newOverIndex = withoutActive.findIndex(t => t.id === over.id);

      const newTasks = [...withoutActive];
      newTasks.splice(newOverIndex, 0, updated);

      return newTasks;
    });

    setActiveTask(null);
  };

  const updateTaskTitle = (id: string, newTitle: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleCopy = async () => {
    if (!spec) return;

    const markdown = generateMarkdown(spec, tasks);
    await navigator.clipboard.writeText(markdown);

    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("idle"), 1500);
  };

  const handleDownload = () => {
    if (!spec) return;

    const markdown = generateMarkdown(spec, tasks);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${spec.title.replace(/\s+/g, "_")}.md`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-900 dark:to-slate-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Generated Specification
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Review the generated plan for your feature, including user stories,
              tasks, and risks.
            </p>
          </div>

          <div className="flex items-center gap-2">

            {/* Copy */}
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm transition
        ${copyStatus === "copied"
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                }`}
            >
              {copyStatus === "copied" ? "Copied ✓" : "Copy"}
            </button>

            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Download
            </button>

            {/* Save */}
            <button
              type="button"
              onClick={onSave}
              disabled={saveStatus === "saving"}
              className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium shadow-sm transition
        ${saveStatus === "saved"
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }
        disabled:opacity-50`}
            >
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                  ? "Saved ✓"
                  : "Save"}
            </button>

          </div>
        </header>


        <DndContext
          collisionDetection={closestCenter}
          onDragStart={(event) => {
            const task = tasks.find(t => t.id === event.active.id);
            if (task) setActiveTask(task);
          }}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveTask(null)}
        >
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-700/60 dark:bg-red-950/40">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="self-start rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700"
              >
                Go back and create a spec
              </button>
            </div>
          ) : spec ? (
            <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  {spec.title}
                </h2>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {spec.goal}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    User Stories
                  </h3>
                  {spec.userStories.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      No user stories were generated.
                    </p>
                  ) : (
                    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                      {spec.userStories.map((story, index) => (
                        <li key={index}>{story}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Risks
                  </h3>
                  {spec.risks.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      No risks were identified.
                    </p>
                  ) : (
                    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                      {spec.risks.map((risk, index) => (
                        <li key={index}>{risk}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Tasks by area
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  {taskGroups.map((group) => {
                    const groupTasks = tasks.filter(
                      (task) => task.group === group
                    );

                    // if (groupTasks.length === 0) {
                    //   return null;
                    // }

                    return (
                      <TaskColumn
                        key={group}
                        group={group}
                        tasks={groupTasks}
                        editingId={editingId}
                        setEditingId={setEditingId}
                        onUpdate={updateTaskTitle}
                        onDelete={deleteTask}
                      />

                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}
          <DragOverlay>
            {activeTask ? (
              <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {activeTask.title}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
