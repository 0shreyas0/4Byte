import axios from "axios";

export interface YouTubeVideo {
  title: string;
  videoId: string;
  url: string;
  channel: string;
}

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export async function fetchYouTubeVideos(query: string): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === "YOUR_API_KEY_HERE") {
    console.warn("YouTube API Key missing. Returning mock data.");
    return [
      {
        title: "Mock: Understanding Nested Loops in JavaScript",
        videoId: "mock1",
        url: "https://www.youtube.com/watch?v=mock1",
        channel: "Mock School",
      },
      {
        title: "Mock: Array Traversal and Logic",
        videoId: "mock2",
        url: "https://www.youtube.com/watch?v=mock2",
        channel: "Code Mock",
      },
    ];
  }

  const url = "https://www.googleapis.com/youtube/v3/search";

  try {
    const res = await axios.get(url, {
      params: {
        part: "snippet",
        q: query,
        key: YOUTUBE_API_KEY,
        maxResults: 10,
        type: "video",
      },
    });

    const items = res.data.items;
    if (!items || items.length === 0) return [];

    // Optional: Get more details (duration)
    const videoIds = items.map((i: any) => i.id.videoId).join(",");
    const detailsUrl = "https://www.googleapis.com/youtube/v3/videos";
    
    // FETCH DURATION FILTER (Next level)
    const detailsRes = await axios.get(detailsUrl, {
      params: {
        part: "contentDetails",
        id: videoIds,
        key: YOUTUBE_API_KEY,
      },
    });

    const durations: Record<string, string> = {};
    detailsRes.data.items.forEach((item: any) => {
      durations[item.id] = item.contentDetails.duration;
    });

    return items.map((item: any) => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      channel: item.snippet.channelTitle,
      duration: durations[item.id.videoId],
    })).filter((v: any) => {
      // Filter out long videos if needed (e.g. over 30 mins)
      // Duration is in ISO 8601 (e.g. PT15M10S). Simple check for H (hours)
      return !v.duration.includes("H");
    });
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}

export function constructSearchQuery(concept: string, mistake: string, difficulty: string): string {
  return `${concept} ${mistake} ${difficulty} explanation`;
}
