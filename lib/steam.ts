import type { ResourceLink, SteamGameSummary, SteamStats } from "../sanity/lib/types";
import { env } from "../sanity/env";

type SteamPlayerSummary = {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatarfull?: string;
};

type SteamPlayerSummariesResponse = {
  response?: {
    players?: SteamPlayerSummary[];
  };
};

type SteamGameResponse = {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  img_icon_url?: string;
};

type SteamOwnedGamesResponse = {
  response?: {
    game_count?: number;
    games?: SteamGameResponse[];
  };
};

type SteamRecentlyPlayedResponse = {
  response?: {
    total_count?: number;
    games?: SteamGameResponse[];
  };
};

type SteamResolveVanityResponse = {
  response?: {
    success?: number;
    steamid?: string;
  };
};

const steamApiKey = env.steam.apiKey || undefined;
const defaultSteamIdentifier = env.steam.id;
const steamApiBase = "https://api.steampowered.com";

function minutesToHours(minutes: number | undefined): number {
  if (!minutes) {
    return 0;
  }

  return Math.round((minutes / 60) * 10) / 10;
}

function buildSteamIconUrl(appId: number, hash?: string): string | undefined {
  if (!hash) {
    return undefined;
  }

  return `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${hash}.jpg`;
}

async function fetchSteamJson<T>(path: string, params: Record<string, string>): Promise<T | null> {
  if (!steamApiKey) {
    return null;
  }

  const searchParams = new URLSearchParams({
    key: steamApiKey,
    format: "json",
    ...params,
  });

  const response = await fetch(`${steamApiBase}${path}?${searchParams.toString()}`);

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

async function resolveSteamId(identifier: string): Promise<string | null> {
  if (!identifier) {
    return null;
  }

  if (/^\d{17}$/.test(identifier)) {
    return identifier;
  }

  const payload = await fetchSteamJson<SteamResolveVanityResponse>(
    "/ISteamUser/ResolveVanityURL/v0001/",
    { vanityurl: identifier }
  );

  if (payload?.response?.success === 1 && payload.response.steamid) {
    return payload.response.steamid;
  }

  return null;
}

function toGameSummary(game: SteamGameResponse): SteamGameSummary {
  return {
    appId: game.appid,
    name: game.name,
    playtimeForeverHours: minutesToHours(game.playtime_forever),
    ...(game.playtime_2weeks ? { playtimeTwoWeeksHours: minutesToHours(game.playtime_2weeks) } : {}),
    ...(game.img_icon_url ? { iconUrl: buildSteamIconUrl(game.appid, game.img_icon_url) } : {}),
  };
}

export function extractSteamIdentifier(links: ResourceLink[] = []): string {
  for (const link of links) {
    try {
      const parsedUrl = new URL(link.url);

      if (!parsedUrl.hostname.includes("steamcommunity.com")) {
        continue;
      }

      const segments = parsedUrl.pathname.split("/").filter(Boolean);

      if ((segments[0] === "profiles" || segments[0] === "id") && segments[1]) {
        return segments[1];
      }
    } catch {
      continue;
    }
  }

  return defaultSteamIdentifier;
}

export async function fetchSteamStats(identifier = defaultSteamIdentifier): Promise<SteamStats | null> {
  if (!identifier) {
    return null;
  }

  try {
    const steamId = await resolveSteamId(identifier);

    if (!steamId) {
      return null;
    }

    const [profile, ownedGames, recentGames] = await Promise.all([
      fetchSteamJson<SteamPlayerSummariesResponse>("/ISteamUser/GetPlayerSummaries/v0002/", {
        steamids: steamId,
      }),
      fetchSteamJson<SteamOwnedGamesResponse>("/IPlayerService/GetOwnedGames/v0001/", {
        steamid: steamId,
        include_appinfo: "1",
        include_played_free_games: "1",
      }),
      fetchSteamJson<SteamRecentlyPlayedResponse>("/IPlayerService/GetRecentlyPlayedGames/v0001/", {
        steamid: steamId,
      }),
    ]);

    const player = profile?.response?.players?.[0];

    if (!player) {
      return null;
    }

    const allGames = ownedGames?.response?.games || [];

    const topGames = (ownedGames?.response?.games || [])
      .slice()
      .sort((left, right) => right.playtime_forever - left.playtime_forever)
      .slice(0, 5)
      .map(toGameSummary);

    const totalPlaytimeHours = allGames.reduce(
      (sum, game) => sum + minutesToHours(game.playtime_forever),
      0
    );

    const recent = (recentGames?.response?.games || []).slice(0, 4).map(toGameSummary);

    return {
      steamId: player.steamid,
      personaName: player.personaname,
      profileUrl: player.profileurl,
      avatarUrl: player.avatarfull,
      gameCount: ownedGames?.response?.game_count || 0,
      totalPlaytimeHours,
      recentGames: recent,
      topGames,
    };
  } catch (error) {
    console.warn("Steam stats fetch failed", error);
    return null;
  }
}
