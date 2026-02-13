import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import mongoose from "mongoose";

const SpecSchema = new mongoose.Schema({
  title: String,
  goal: String,
  userStories: [String],
  tasks: [
    {
      id: String,
      title: String,
      group: String,
    },
  ],
  risks: [String],
});

const Spec =
  mongoose.models.Spec || mongoose.model("Spec", SpecSchema);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();

  const spec = await Spec.findById(id);

  if (!spec) {
    return NextResponse.json(
      { error: "Spec not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(spec);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();

  const body = await req.json();

  const updated = await Spec.findByIdAndUpdate(
    id,
    body,
    { new: true }
  );
  if (!updated) {
    return NextResponse.json(
      { error: "Spec not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}
