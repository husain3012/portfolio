import { client } from "./client";

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T
): Promise<T> {
  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.warn("Sanity fetch failed", error);
    return fallback;
  }
}