export const generateAIResponse = async (prompt: string, model: string = 'llama-3.3-70b-versatile') => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API Error Response:', data);
      throw new Error(data.error?.message || `Groq API error: ${response.statusText}`);
    }

    if (!data.choices || data.choices.length === 0) {
      console.error('Unexpected Groq API Response Structure:', data);
      throw new Error('Unexpected response format from Groq API');
    }

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('AI Response Error:', error);
    throw error;
  }
};

export const streamAIResponse = async (prompt: string, model: string = 'llama-3.3-70b-versatile') => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  return response.body;
};
