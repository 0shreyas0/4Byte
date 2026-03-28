import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { selection, mode } = await req.json();
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const cleanKey = apiKey.replace(/^"|"$/g, '');

    const prompt = `
      You are an Elite AI Tutor (Level: ${mode}). 
      Context to explain: "${selection}"
      
      CORE REQUIREMENT:
      Explain exactly WHAT this is and HOW it works technically.
      Do not mention that it was highlighted. Do not be generic.
      
      STRUCTURE:
      - segment 1: The 'What' (Technical definition)
      - segment 2: The 'Why/How' (Internal mechanics)
      - segment 3: Rapid Example or Pattern.
      - segment 4: Performance or Engineering tip.

      Output JSON format: { "segments": ["...", "...", "...", "..."] }
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a world-class technical educator. You provide extremely precise and short explanations in JSON format." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Lower temp for more precision
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
       const status = response.status;
       const errorData = await response.json().catch(() => ({}));
       return NextResponse.json({ error: errorData.error?.message || "Groq API Failure" }, { status });
    }

    const data = await response.json();
    const rawContent = data.choices[0]?.message?.content;
    
    if (!rawContent) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (e) {
      return NextResponse.json({ error: "Invalid AI JSON structure" }, { status: 500 });
    }

    // Capture segments regardless of key name (robust parser)
    const segments = parsed.segments || parsed.explanation || (Array.isArray(parsed) ? parsed : Object.values(parsed).find(v => Array.isArray(v)));

    if (!segments || !Array.isArray(segments)) {
       return NextResponse.json({ error: "AI failed to generate a structured explanation" }, { status: 500 });
    }

    return NextResponse.json(segments);
  } catch (error) {
    console.error("Server API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
