import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "./TaskBoard";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

interface Props {
  task: Task;
  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function SortableTaskItem({
  task,
  editingId,
  setEditingId,
  onUpdate,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const [value, setValue] = useState(task.title);
  useEffect(() => {
    setValue(task.title);
  }, [task.title]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isEditing = editingId === task.id;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm
        ${isDragging ? "opacity-40" : ""}
        bg-white dark:bg-slate-900
        border-slate-200 dark:border-slate-700
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        ☰
      </button>

      {/* Title / Input */}
      {isEditing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            onUpdate(task.id, value.trim() || task.title);
            setEditingId(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onUpdate(task.id, value.trim() || task.title);
              setEditingId(null);
            }
            if (e.key === "Escape") {
              setValue(task.title);
              setEditingId(null);
            }
          }}
          className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
      ) : (
        <span
          className="flex-1 cursor-pointer text-slate-800 dark:text-slate-100"
          onClick={() => setEditingId(task.id)}
        >
          {task.title}
        </span>
      )}

      {/* Delete Button (hover only) */}
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 transition group-hover:opacity-100 cursor-pointer text-slate-400 hover:text-red-500"
      >
        <Trash2 size={16} />
      </button>

    </li>
  );
}
