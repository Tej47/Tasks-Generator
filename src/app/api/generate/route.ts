import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { generateSpec } from "../../../lib/ai";
import { SYSTEM_PROMPT, buildUserPrompt } from "../../../lib/prompts";
import SpecModel from "../../../models/Spec";

interface GenerateRequestBody {
    goal: string;
    users: string;
    constraints: string;
    templateType?: string;
}

function extractJSON(raw: string): string {
    const trimmed = raw.trim();
  
    // Remove ```json ... ``` wrapping if present
    if (trimmed.startsWith("```")) {
      return trimmed
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();
    }
  
    return trimmed;
  }

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as Partial<GenerateRequestBody>;
        const goal = body.goal?.trim();
        const users = body.users?.trim();
        const constraints = body.constraints?.trim();
        const templateType = body.templateType?.trim() || "default";

        if (!goal || !users || !constraints) {
            return NextResponse.json(
                { error: "goal, users and constraints are required" },
                { status: 400 }
            );
        }

        await connectDB();

        const userPrompt = buildUserPrompt(goal, users, constraints, templateType);
        const raw = await generateSpec(SYSTEM_PROMPT, userPrompt);

        let parsed: any;
        try {
            const cleaned = extractJSON(raw);
            parsed = JSON.parse(cleaned);
        } catch {
            return NextResponse.json(
                { error: "Failed to parse model response as JSON" },
                { status: 502 }
            );
        }

        if (
            typeof parsed.title !== "string" ||
            !Array.isArray(parsed.userStories) ||
            !Array.isArray(parsed.tasks) ||
            !Array.isArray(parsed.risks)
          ) {
            return NextResponse.json(
              { error: "Invalid structure from model" },
              { status: 502 }
            );
          }
          
          const validGroups = ["Frontend", "Backend", "Database", "DevOps"];
          
          const tasks = parsed.tasks.filter(
            (t: any) =>
              t &&
              typeof t.id === "string" &&
              typeof t.title === "string" &&
              validGroups.includes(t.group)
          );

        if (tasks.length < 5) {
            return NextResponse.json(
                { error: "Model returned insufficient valid tasks" },
                { status: 502 }
            );
        }

        const spec = await SpecModel.create({
            goal,
            users,
            constraints,
            title: parsed.title,
            userStories: parsed.userStories,
            tasks,
            risks: parsed.risks,
        });

        // Keep only the last 5 specs (newest first)

        const oldSpecs = await SpecModel.find({})
            .sort({ createdAt: -1 })
            .skip(5)
            .select("_id");

        if (oldSpecs.length > 0) {
            await SpecModel.deleteMany({
                _id: { $in: oldSpecs.map((doc: any) => doc._id) },
            });
        }


        return NextResponse.json(spec, { status: 201 });

    } catch (error) {
        console.error("Error in /api/generate:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

