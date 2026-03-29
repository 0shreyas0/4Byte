import axios from "axios";

export interface YouTubeVideo {
  title: string;
  videoId: string;
  url: string;
  channel: string;
  duration?: string;
}

export async function fetchYouTubeVideos(query: string): Promise<YouTubeVideo[]> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    console.warn("YouTube API Key missing. Returning fallback search links.");
    return getFallbackVideos(query);
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=8&type=video`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
       const errBody = await res.json().catch(() => ({}));
       throw new Error(errBody.error?.message || `YouTube API responded with ${res.status}`);
    }
    
    const data = await res.json();
    const items = data.items;
    
    if (!items || items.length === 0) return [];

    // Optional: Get more details (duration)
    const videoIds = items.map((i: any) => i.id.videoId).join(",");
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`;
    
    let durations: Record<string, string> = {};
    try {
      const detailsRes = await fetch(detailsUrl);
      if (detailsRes.ok) {
        const detailsData = await detailsRes.json();
        detailsData.items.forEach((item: any) => {
          durations[item.id] = item.contentDetails.duration;
        });
      }
    } catch (e) {
      console.warn("Could not fetch video durations:", e);
    }

    return items.map((item: any) => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      channel: item.snippet.channelTitle,
      duration: durations[item.id.videoId],
    }));
  } catch (error: any) {
    console.error("YouTube API Failure:", error.message || error);
    return getFallbackVideos(query);
  }
}

function getFallbackVideos(query: string): YouTubeVideo[] {
  const searchQuery = encodeURIComponent(query);
  return [
    {
      title: `Watch tutorials on ${query}`,
      videoId: "mock1",
      url: `https://www.youtube.com/results?search_query=${searchQuery}`,
      channel: "YouTube Search",
    },
    {
      title: `Master ${query} concepts`,
      videoId: "mock2",
      url: `https://www.youtube.com/results?search_query=${searchQuery}+advanced`,
      channel: "YouTube Search",
    },
  ];
}
