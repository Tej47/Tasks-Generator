import { Schema, model, models, type Document, type Model } from "mongoose";

export type TaskGroup = "Frontend" | "Backend" | "Database" | "DevOps";

export interface ITask {
  id: string;
  title: string;
  group: TaskGroup;
}

export interface ISpec extends Document {
  goal: string;
  users: string;
  constraints: string;
  title: string;
  userStories: string[];
  tasks: ITask[];
  risks: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    group: {
      type: String,
      enum: ["Frontend", "Backend", "Database", "DevOps"],
      required: true,
    },
  },
  {
    _id: false,
  }
);

const SpecSchema = new Schema<ISpec>(
  {
    goal: { type: String, required: true },
    users: { type: String, required: true },
    constraints: { type: String, required: true },
    title: { type: String, required: true },
    userStories: {
      type: [String],
      default: [],
    },
    tasks: {
      type: [TaskSchema],
      default: [],
    },
    risks: {
        type: [String],
        default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Avoid OverwriteModelError in Next.js (hot reloading)
export const SpecModel: Model<ISpec> =
  (models.Spec as Model<ISpec>) || model<ISpec>("Spec", SpecSchema);

export default SpecModel;

