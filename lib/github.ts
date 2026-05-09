type GitHubUserResponse = {
  login: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
};

import { env } from "../sanity/env";

type GitHubRepoResponse = {
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
};

export type GitHubRepoSummary = {
  name: string;
  url: string;
  stars: number;
  language?: string;
  pushedAt: string;
};

export type GitHubStats = {
  username: string;
  profileUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguages: string[];
  recentRepositories: GitHubRepoSummary[];
};

const githubApiBase = "https://api.github.com";
const defaultUsername = env.github.username;
const githubToken = env.github.token || undefined;

async function fetchGitHubJson<T>(path: string): Promise<T | null> {
  const response = await fetch(`${githubApiBase}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "husain-portfolio",
      ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
    },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

async function fetchAllRepositories(username: string): Promise<GitHubRepoResponse[]> {
  const repositories: GitHubRepoResponse[] = [];

  for (let page = 1; page <= 3; page += 1) {
    const batch = await fetchGitHubJson<GitHubRepoResponse[]>(
      `/users/${username}/repos?per_page=100&sort=updated&page=${page}`
    );

    if (!batch?.length) {
      break;
    }

    repositories.push(...batch);

    if (batch.length < 100) {
      break;
    }
  }

  return repositories;
}

export async function fetchGitHubStats(username = defaultUsername): Promise<GitHubStats | null> {
  try {
    const [user, repositories] = await Promise.all([
      fetchGitHubJson<GitHubUserResponse>(`/users/${username}`),
      fetchAllRepositories(username),
    ]);

    if (!user) {
      return null;
    }

    const ownedRepositories = repositories.filter((repository) => !repository.fork);
    const sourceRepositories = ownedRepositories.length ? ownedRepositories : repositories;
    const languageUsage = new Map<string, number>();

    for (const repository of sourceRepositories) {
      if (!repository.language) {
        continue;
      }

      languageUsage.set(
        repository.language,
        (languageUsage.get(repository.language) || 0) + 1
      );
    }

    const topLanguages = [...languageUsage.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([language]) => language);

    const recentRepositories = [...sourceRepositories]
      .sort(
        (left, right) =>
          new Date(right.pushed_at).getTime() - new Date(left.pushed_at).getTime()
      )
      .slice(0, 3)
      .map((repository) => ({
        name: repository.name,
        url: repository.html_url,
        stars: repository.stargazers_count,
        language: repository.language || undefined,
        pushedAt: repository.pushed_at,
      }));

    return {
      username: user.login,
      profileUrl: user.html_url,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      totalStars: sourceRepositories.reduce(
        (total, repository) => total + repository.stargazers_count,
        0
      ),
      totalForks: sourceRepositories.reduce(
        (total, repository) => total + repository.forks_count,
        0
      ),
      topLanguages,
      recentRepositories,
    };
  } catch (error) {
    console.warn("GitHub stats fetch failed", error);
    return null;
  }
}