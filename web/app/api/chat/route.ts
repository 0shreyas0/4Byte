import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const normalized: ChatMessage[] = messages
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m: any) => ({ role: m.role, content: m.content.trim() }))
      .filter((m: ChatMessage) => m.content.length > 0)
      .slice(-12);

    if (normalized.length === 0) {
      return NextResponse.json({ error: "No valid messages" }, { status: 400 });
    }

    const cleanKey = String(apiKey).replace(/^"|"$/g, "");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cleanKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are an elite AI tutor. Keep explanations clear, technical, and concise. Adapt detail to the user's question and give practical examples. Return plain text only. Do not use markdown symbols like **, *, _, #, or code fences.",
          },
          ...normalized,
        ],
        temperature: 0.4,
        max_tokens: 700,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const err = await response.json().catch(() => ({}));
      return NextResponse.json({ error: err.error?.message || "Groq API Failure" }, { status });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply || typeof reply !== "string") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
