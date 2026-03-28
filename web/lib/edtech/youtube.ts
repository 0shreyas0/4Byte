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
    console.log(`YouTube Search Query: "${query}"`);
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
    console.log(`YouTube Fetched: ${items?.length || 0} videos`);
    if (!items || items.length === 0) return [];

    // Optional: Get more details (duration)
    const videoIds = items.map((i: any) => i.id.videoId).join(",");
    const detailsUrl = "https://www.googleapis.com/youtube/v3/videos";
    
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
    }));
  } catch (error: any) {
    // 403 = API key restricted / quota exhausted — degrade gracefully
    if (error?.response?.status === 403) {
      console.warn("YouTube API: 403 Forbidden (key restricted or quota hit). Using mock data.");
    } else {
      console.warn("YouTube fetch failed, using mock data:", error?.message || error);
    }
    return [
      {
        title: "Understanding the concept — Recommended Study",
        videoId: "mock1",
        url: "https://www.youtube.com/results?search_query=learn+programming",
        channel: "Study Resources",
      },
      {
        title: "Practice Problems and Exercises",
        videoId: "mock2",
        url: "https://www.youtube.com/results?search_query=programming+exercises",
        channel: "Code Practice",
      },
    ];
  }
}
