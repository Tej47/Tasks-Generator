import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { generateSpec } from "../../../lib/ai"

export async function GET() {
  const status = {
    backend: "ok",
    database: "unknown",
    llm: "unknown",
  };

  // 1️⃣ Database Health Check
  try {
    await connectDB();
    status.database = "ok";
  } catch (error) {
    console.error("Database health check failed:", error);
    status.database = "error";
  }

  // 2️⃣ LLM Health Check (lightweight test)
  try {
    await generateSpec(
      "Return strictly valid JSON: {\"ping\":\"pong\"}",
      "ping"
    );
    status.llm = "ok";
  } catch (error) {
    console.error("LLM health check failed:", error);
    status.llm = "error";
  }

  // Always return 200 if the health check route executed successfully.
  // Individual service failures (DB/LLM) are reflected inside the JSON body,
  // while 500 will only occur if the route itself crashes unexpectedly.
  return NextResponse.json(status, { status: 200 });

}
