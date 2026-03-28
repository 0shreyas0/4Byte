import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    console.log('🖼️ Generating Image for:', prompt);

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    const seed = Math.floor(Math.random() * 1000000);
    
    // Fallback 1: AI Force (Very stable, Flux model)
    try {
      const airForceUrl = `https://api.airforce/v1/imagine?prompt=${encodeURIComponent(prompt)}&model=flux&width=1024&height=1024`;
      const response = await fetch(airForceUrl);
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength > 0) {
          const buffer = Buffer.from(arrayBuffer);
          return NextResponse.json({ imageUrl: `data:image/jpeg;base64,${buffer.toString('base64')}` });
        }
      }
    } catch (e) {
      console.warn('⚠️ AI Force failed, trying Pollinations...');
    }

    // Fallback 2: Pollinations (Stable Flux)
    try {
      const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&nologo=true&model=flux`;
      const response = await fetch(pollUrl);
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength > 0) {
          const buffer = Buffer.from(arrayBuffer);
          return NextResponse.json({ imageUrl: `data:image/jpeg;base64,${buffer.toString('base64')}` });
        }
      }
    } catch (e) {
      console.warn('⚠️ Pollinations failed, trying MagicStudio...');
    }

    // Fallback 3: MagicStudio (Direct Preview)
    const finalFallback = `https://api.magicstudio.com/v1/ai-art-generator/preview?prompt=${encodeURIComponent(prompt)}`;
    return NextResponse.json({ imageUrl: finalFallback });

  } catch (error: any) {
    console.error('🔴 Image Generation Detail Error:', error);
    return NextResponse.json({ 
      message: error.message || 'Failed to generate image',
      details: error.toString() 
    }, { status: 500 });
  }
}
