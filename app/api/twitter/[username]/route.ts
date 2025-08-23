import { NextResponse } from "next/server";
import axios from "axios";

const TWITTER_URL = "https://api.twitter.com/2/users/by/username/";
const CACHE_TTL_MS = 60 * 1000; // 60s cache
const MAX_RETRIES = 2;

// In-memory caches
const cache = new Map<string, { data: unknown; expiresAt: number }>();
const inflight = new Map<string, Promise<TwitterUserResponse>>();

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function toHighResImageUrl(url: string) {
  try {
    // Most Twitter profile images include a size suffix like _normal.jpg
    // Replace _normal with _400x400 to request a higher-resolution avatar.
    return url.replace(/_normal(\.(jpg|jpeg|png))/i, '_400x400$1');
  } catch (err) {
    return url;
  }
}

type TwitterUserResponse = {
  data: {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
    description?: string;
    location?: string;
    public_metrics?: {
      followers_count: number;
      following_count: number;
      tweet_count: number;
      listed_count: number;
    };
  };
  errors?: unknown;
};

async function fetchTwitterUser(username: string, token: string, attempt = 0): Promise<TwitterUserResponse> {
  try {
    const res = await axios.get(
      `${TWITTER_URL}${username}?user.fields=profile_image_url,description,location,public_metrics`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 429 && attempt < MAX_RETRIES) {
        const wait = 500 * Math.pow(2, attempt);
        await sleep(wait);
        return fetchTwitterUser(username, token, attempt + 1);
      }
      throw err;
    }
    throw err;
  }
}

// ✅ Correct App Router signature: /api/twitter/[username]/route.ts
export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const token = process.env.TWITTER_API_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "TWITTER_API_TOKEN is not set in environment" },
      { status: 500 }
    );
  }

  // Serve from cache if fresh
  const cached = cache.get(username);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    let data: TwitterUserResponse;
    if (inflight.has(username)) {
      data = await inflight.get(username)!;
    } else {
      const p = fetchTwitterUser(username, token);
      inflight.set(username, p);
      try {
        data = await p;
      } finally {
        inflight.delete(username);
      }
    }

    // Convert profile image URL to higher-resolution variant when present
    if (data && data.data && data.data.profile_image_url) {
      try {
        // mutate a shallow copy to avoid surprising callers
        const copied = { ...data, data: { ...data.data, profile_image_url: toHighResImageUrl(data.data.profile_image_url) } };
        data = copied as TwitterUserResponse;
      } catch {
        // ignore transformation errors and keep original URL
      }
    }

    // Cache success
    cache.set(username, { data, expiresAt: Date.now() + CACHE_TTL_MS });

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const retryAfter = error.response?.headers?.["retry-after"] || null;

      if (status === 429) {
        return NextResponse.json(
          { error: "Rate limited by Twitter API", retryAfter },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: error.response?.data || "Failed to fetch Twitter data" },
        { status }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch Twitter data" },
      { status: 500 }
    );
  }
}
