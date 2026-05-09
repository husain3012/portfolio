export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  sanity: {
    apiVersion: "2025-01-01",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "k3ujyy6r",
    studioTitle: process.env.NEXT_PUBLIC_SANITY_STUDIO_TITLE || "Husain Portfolio",
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333",
  },
  github: {
    username: process.env.GITHUB_USERNAME || "husain3012",
    token: process.env.GITHUB_TOKEN || "",
  },
  leetcode: {
    username: process.env.LEETCODE_USERNAME || "husain3012",
  },
  lastfm: {
    apiKey: process.env.LASTFM_API_KEY || "",
    username: process.env.LASTFM_USERNAME || "",
  },
  steam: {
    apiKey: process.env.STEAM_API_KEY || "",
    id: process.env.STEAM_ID || "",
  },
} as const;

export const apiVersion = env.sanity.apiVersion;
export const dataset = env.sanity.dataset;
export const projectId = env.sanity.projectId;
export const studioTitle = env.sanity.studioTitle;
export const useCdn = env.nodeEnv === "production";
export const studioUrl = env.sanity.studioUrl;