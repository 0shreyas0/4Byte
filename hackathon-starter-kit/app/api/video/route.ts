import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    console.log('🎥 Generating Video for:', prompt);

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    // Using Pollinations Video API (Experimental but free & keyless)
    const seed = Math.floor(Math.random() * 1000000);
    // The video endpoint returns an MP4
    const videoUrl = `https://video.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}`;

    // Note: Video generation takes time. We return the URL which will be used in a <video> tag.
    return NextResponse.json({ videoUrl });
  } catch (error: any) {
    console.error('Video Generation Error:', error);
    return NextResponse.json({ message: 'Failed to generate video' }, { status: 500 });
  }
}
