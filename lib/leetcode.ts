import type { ResourceLink } from "../sanity/lib/types";
import { env } from "../sanity/env";

type LeetCodeProfileResponse = {
  ranking: number;
  reputation: number;
  starRating: number;
};

type LeetCodeSubmissionBucket = {
  difficulty: string;
  count: number;
  submissions: number;
};

type LeetCodeGraphResponse = {
  data?: {
    matchedUser?: {
      username: string;
      profile: LeetCodeProfileResponse;
      submitStatsGlobal: {
        acSubmissionNum: LeetCodeSubmissionBucket[];
      };
    } | null;
  };
};

export type LeetCodeStats = {
  username: string;
  profileUrl: string;
  ranking: number;
  reputation: number;
  starRating: number;
  solvedTotal: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
};

const defaultLeetCodeUsername = env.leetcode.username;

function getBucket(
  buckets: LeetCodeSubmissionBucket[],
  difficulty: string
): LeetCodeSubmissionBucket {
  return (
    buckets.find((bucket) => bucket.difficulty === difficulty) || {
      difficulty,
      count: 0,
      submissions: 0,
    }
  );
}

export function extractLeetCodeUsername(links: ResourceLink[] = []): string {
  for (const link of links) {
    try {
      const parsedUrl = new URL(link.url);

      if (!parsedUrl.hostname.includes("leetcode.com")) {
        continue;
      }

      const segments = parsedUrl.pathname.split("/").filter(Boolean);

      if (segments[0] === "u" && segments[1]) {
        return segments[1];
      }

      if (segments[0]) {
        return segments[0];
      }
    } catch {
      continue;
    }
  }

  return defaultLeetCodeUsername;
}

export async function fetchLeetCodeStats(
  username = defaultLeetCodeUsername
): Promise<LeetCodeStats | null> {
  try {
    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query userPublicProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                ranking
                reputation
                starRating
              }
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
            }
          }
        `,
        variables: { username },
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as LeetCodeGraphResponse;
    const matchedUser = payload.data?.matchedUser;

    if (!matchedUser) {
      return null;
    }

    const all = getBucket(matchedUser.submitStatsGlobal.acSubmissionNum, "All");
    const easy = getBucket(matchedUser.submitStatsGlobal.acSubmissionNum, "Easy");
    const medium = getBucket(matchedUser.submitStatsGlobal.acSubmissionNum, "Medium");
    const hard = getBucket(matchedUser.submitStatsGlobal.acSubmissionNum, "Hard");

    return {
      username: matchedUser.username,
      profileUrl: `https://leetcode.com/u/${matchedUser.username}/`,
      ranking: matchedUser.profile.ranking,
      reputation: matchedUser.profile.reputation,
      starRating: matchedUser.profile.starRating,
      solvedTotal: all.count,
      easySolved: easy.count,
      mediumSolved: medium.count,
      hardSolved: hard.count,
      totalSubmissions: all.submissions,
    };
  } catch (error) {
    console.warn("LeetCode stats fetch failed", error);
    return null;
  }
}