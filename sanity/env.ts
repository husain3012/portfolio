export const apiVersion = "2025-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "k3ujyy6r";
export const studioTitle =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_TITLE || "Husain Portfolio";
export const useCdn = process.env.NODE_ENV === "production";
export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";