import type { Task, TaskGroup } from "./TaskBoard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTaskItem } from "./SortableTaskItem";
import { useDroppable } from "@dnd-kit/core";

interface TaskColumnProps {
  group: TaskGroup;
  tasks: Task[];
  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function TaskColumn({
  group,
  tasks,
  editingId,
  setEditingId,
  onUpdate,
  onDelete,
}: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: group,
  });

  return (
    <div
      ref={setNodeRef}
      className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40"
    >
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {group}
      </h4>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-200">
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              editingId={editingId}
              setEditingId={setEditingId}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />

          ))}
        </ul>
      </SortableContext>
    </div>
  );
}
