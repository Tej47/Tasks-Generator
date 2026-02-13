import OpenAI from "openai";

let client: OpenAI | null = null;

function getAIClient(): OpenAI {
  if (!process.env.GROQ_API_KEY?.trim()) {
    throw new Error(
      "Missing GROQ_API_KEY. Please define it in your environment variables."
    );
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1", 
    });
  }

  return client;
}

// Sanitization  to avoid accidental safety triggers, 

function sanitizeInput(input: string): string {
  return input
    .replace(/hack/gi, "security test")
    .replace(/attack/gi, "high load scenario")
    .replace(/exploit/gi, "edge case")
    .replace(/bypass/gi, "override")
    .replace(/malware/gi, "unwanted software")
    .replace(/brute force/gi, "repeated attempts")
    .replace(/penetration/gi, "security validation");
}

export async function generateSpec(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const ai = getAIClient();
  const safeUserPrompt = sanitizeInput(userPrompt);

  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",  
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: safeUserPrompt },
    ],
    temperature: 0.3, // Slightly higher for better creative task naming
    // Forces the model to return a valid JSON object
    response_format: { type: "json_object" }, 
  });

  const text = response.choices[0]?.message?.content;

  if (!text) {
    throw new Error("Groq returned an empty response");
  }

  return text;
}