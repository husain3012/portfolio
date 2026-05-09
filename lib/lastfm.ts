import type { LastFmArtistSummary, LastFmStats, LastFmTrackSummary, ResourceLink } from "../sanity/lib/types";
import { env } from "../sanity/env";

type LastFmImage = {
  "#text": string;
  size: string;
};

type LastFmUserInfoResponse = {
  user?: {
    name: string;
    url: string;
    playcount: string;
  };
};

type LastFmArtistResponse = {
  name: string;
  url: string;
  playcount: string;
  image?: LastFmImage[];
};

type LastFmTrackResponse = {
  name: string;
  url: string;
  playcount: string;
  artist: {
    name: string;
  };
};

type LastFmTopArtistsResponse = {
  topartists?: {
    artist?: LastFmArtistResponse[];
  };
};

type LastFmTopTracksResponse = {
  toptracks?: {
    track?: LastFmTrackResponse[];
  };
};

const lastFmApiKey = env.lastfm.apiKey || undefined;
const defaultLastFmUsername = env.lastfm.username;
const lastFmApiBase = "https://ws.audioscrobbler.com/2.0/";

function toNumber(value: string | number | undefined): number {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function fetchLastFmJson<T>(params: Record<string, string>): Promise<T | null> {
  if (!lastFmApiKey) {
    return null;
  }

  const searchParams = new URLSearchParams({
    api_key: lastFmApiKey,
    format: "json",
    ...params,
  });

  const response = await fetch(`${lastFmApiBase}?${searchParams.toString()}`);

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

export function extractLastFmUsername(links: ResourceLink[] = []): string {
  for (const link of links) {
    try {
      const parsedUrl = new URL(link.url);

      if (!parsedUrl.hostname.includes("last.fm")) {
        continue;
      }

      const segments = parsedUrl.pathname.split("/").filter(Boolean);

      if (segments[0] === "user" && segments[1]) {
        return segments[1];
      }
    } catch {
      continue;
    }
  }

  return defaultLastFmUsername;
}

export async function fetchLastFmStats(username = defaultLastFmUsername): Promise<LastFmStats | null> {
  if (!username) {
    return null;
  }

  try {
    const [userInfo, topArtists, topTracks] = await Promise.all([
      fetchLastFmJson<LastFmUserInfoResponse>({ method: "user.getinfo", user: username }),
      fetchLastFmJson<LastFmTopArtistsResponse>({
        method: "user.gettopartists",
        user: username,
        period: "1month",
        limit: "5",
      }),
      fetchLastFmJson<LastFmTopTracksResponse>({
        method: "user.gettoptracks",
        user: username,
        period: "1month",
        limit: "5",
      }),
    ]);

    if (!userInfo?.user) {
      return null;
    }

    const artists: LastFmArtistSummary[] = (topArtists?.topartists?.artist || []).map((artist) => ({
      name: artist.name,
      url: artist.url,
      playcount: toNumber(artist.playcount),
    }));

    const tracks: LastFmTrackSummary[] = (topTracks?.toptracks?.track || []).map((track) => ({
      name: track.name,
      artist: track.artist.name,
      url: track.url,
      playcount: toNumber(track.playcount),
    }));

    return {
      username: userInfo.user.name,
      profileUrl: userInfo.user.url,
      playcount: toNumber(userInfo.user.playcount),
      topArtists: artists,
      topTracks: tracks,
    };
  } catch (error) {
    console.warn("Last.fm stats fetch failed", error);
    return null;
  }
}