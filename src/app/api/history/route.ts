import { NextResponse } from "next/server";
import {connectDB} from "../../../lib/db";
import {SpecModel} from "../../../models/Spec"

export async function GET() {
  try {
    await connectDB();

    const specs = await SpecModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id title createdAt");

    return NextResponse.json(specs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
