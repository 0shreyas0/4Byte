import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/openai';

export async function POST(req: Request) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    // You can extend this to include history in the prompt if needed
    const contextualPrompt = history && history.length > 0 
      ? `Previous conversation:\n${history.map((m: any) => `${m.role}: ${m.content}`).join('\n')}\n\nUser: ${prompt}`
      : prompt;

    const response = await generateAIResponse(contextualPrompt);

    return NextResponse.json({ message: response });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
