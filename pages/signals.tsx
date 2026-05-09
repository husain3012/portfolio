import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { motion } from "framer-motion";

import SiteLayout from "../components/site/SiteLayout";
import { createFadeUp, useSiteReducedMotion } from "../components/site/motion";
import { fetchGitHubStats } from "../lib/github";
import { extractLastFmUsername, fetchLastFmStats } from "../lib/lastfm";
import { extractLeetCodeUsername, fetchLeetCodeStats } from "../lib/leetcode";
import { extractSteamIdentifier, fetchSteamStats } from "../lib/steam";
import { sanityFetch } from "../sanity/lib/fetch";
import { RESOURCE_LINKS_QUERY } from "../sanity/lib/queries";
import type {
  GitHubStats,
  LastFmStats,
  LeetCodeStats,
  ResourceLink,
  SteamStats,
} from "../sanity/lib/types";

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

function formatRelativeDate(dateString: string) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24))
  );

  if (days === 0) {
    return "Updated today";
  }

  if (days === 1) {
    return "Updated 1 day ago";
  }

  return `Updated ${days} days ago`;
}

function formatHours(hours: number) {
  return `${new Intl.NumberFormat("en", {
    maximumFractionDigits: hours < 10 ? 1 : 0,
  }).format(hours)}h`;
}

export const getStaticProps: GetStaticProps<{
  github: GitHubStats | null;
  leetcode: LeetCodeStats | null;
  lastfm: LastFmStats | null;
  steam: SteamStats | null;
}> = async () => {
  const [github, resourceLinks] = await Promise.all([
    fetchGitHubStats(),
    sanityFetch(RESOURCE_LINKS_QUERY, {}, [] as ResourceLink[]),
  ]);
  const [leetcode, lastfm, steam] = await Promise.all([
    fetchLeetCodeStats(extractLeetCodeUsername(resourceLinks)),
    fetchLastFmStats(extractLastFmUsername(resourceLinks)),
    fetchSteamStats(extractSteamIdentifier(resourceLinks)),
  ]);

  return {
    props: { github, leetcode, lastfm, steam },
    revalidate: 60,
  };
};

export default function SignalsPage({
  github,
  leetcode,
  lastfm,
  steam,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const shouldReduceMotion = useSiteReducedMotion();
  const summaryMetrics = [
    github
      ? { label: "GitHub Followers", value: String(github.followers) }
      : null,
    leetcode
      ? { label: "Problems Solved", value: String(leetcode.solvedTotal) }
      : null,
    lastfm
      ? { label: "Last.fm Scrobbles", value: formatCompactNumber(lastfm.playcount) }
      : null,
    steam
      ? { label: "Steam Library", value: formatCompactNumber(steam.gameCount) }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <SiteLayout title="Signals" description="GitHub, LeetCode, music, and gaming stats.">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <motion.div
          className="panel px-7 py-8 sm:px-10 sm:py-10"
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          variants={shouldReduceMotion ? undefined : createFadeUp(18)}
        >
          <p className="eyebrow">Signals</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl">
            Code, music, and gaming stats
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            GitHub and LeetCode, plus monthly Last.fm and basic Steam stats.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="muted-link">
              Back to Overview
            </Link>
            {github ? (
              <a href={github.profileUrl} target="_blank" rel="noopener noreferrer" className="action-link">
                GitHub Profile
              </a>
            ) : null}
            {leetcode ? (
              <a href={leetcode.profileUrl} target="_blank" rel="noopener noreferrer" className="muted-link">
                LeetCode Profile
              </a>
            ) : null}
            {lastfm ? (
              <a href={lastfm.profileUrl} target="_blank" rel="noopener noreferrer" className="muted-link">
                Last.fm Profile
              </a>
            ) : null}
            {steam ? (
              <a href={steam.profileUrl} target="_blank" rel="noopener noreferrer" className="muted-link">
                Steam Profile
              </a>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          className="panel flex flex-col gap-5 px-7 py-8"
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          variants={shouldReduceMotion ? undefined : createFadeUp(24, 0.05)}
        >
          <div>
            <p className="eyebrow">Summary</p>
            <h2 className="text-2xl font-semibold text-slate-50">Quick summary</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {summaryMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{metric.value}</p>
              </div>
            ))}
            {github ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Stars</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{github.totalStars}</p>
              </div>
            ) : null}
            {leetcode ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Global Rank</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">#{formatCompactNumber(leetcode.ranking)}</p>
              </div>
            ) : null}
          </div>
        </motion.div>
      </section>

      {github ? (
        <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <motion.div
            className="panel px-7 py-8 sm:px-10 sm:py-10"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            variants={shouldReduceMotion ? undefined : createFadeUp(18)}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">GitHub Heatmap</p>
                <h2 className="section-heading">Contribution cadence</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  A visual heatmap of recent public GitHub contribution activity for @{github.username}.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                {github.publicRepos} public repositories
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <img
                src={`https://ghchart.rshah.org/7dd3fc/${github.username}`}
                alt={`GitHub contribution heatmap for ${github.username}`}
                className="w-full rounded-2xl"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            className="panel px-7 py-8 sm:px-10 sm:py-10"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            variants={shouldReduceMotion ? undefined : createFadeUp(24, 0.05)}
          >
            <p className="eyebrow">GitHub Summary</p>
            <h2 className="text-3xl font-semibold text-slate-50">Open-source footprint</h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Followers", value: github.followers },
                { label: "Following", value: github.following },
                { label: "Total Stars", value: github.totalStars },
                { label: "Total Forks", value: github.totalForks },
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">{metric.value}</p>
                </div>
              ))}
            </div>

            {github.topLanguages.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {github.topLanguages.map((language) => (
                  <span key={language} className="chip">{language}</span>
                ))}
              </div>
            ) : null}
          </motion.div>
        </section>
      ) : null}

      {github ? (
        <section className="mt-16 space-y-6">
          <div>
            <p className="eyebrow">Recent GitHub Activity</p>
            <h2 className="section-heading">Recently worked on</h2>
            <p className="section-copy">Fresh repository movement and top-level metadata from the most recently pushed codebases.</p>
          </div>

          <div className="panel-grid">
            {github.recentRepositories.map((repository) => (
              <a
                key={repository.url}
                href={repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="panel block p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-50">{repository.name}</h3>
                    <p className="mt-2 text-sm text-slate-400">{formatRelativeDate(repository.pushedAt)}</p>
                  </div>
                  <span className="chip">{repository.stars} stars</span>
                </div>
                {repository.language ? (
                  <div className="mt-4">
                    <span className="chip">{repository.language}</span>
                  </div>
                ) : null}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {leetcode ? (
        <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <motion.div
            className="panel px-7 py-8 sm:px-10 sm:py-10"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            variants={shouldReduceMotion ? undefined : createFadeUp(18)}
          >
            <p className="eyebrow">LeetCode</p>
            <h2 className="section-heading">Problem-solving profile</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Live stats from the public LeetCode GraphQL endpoint for @{leetcode.username}.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Solved", value: leetcode.solvedTotal },
                { label: "Total Submissions", value: leetcode.totalSubmissions },
                { label: "Star Rating", value: leetcode.starRating },
                { label: "Reputation", value: leetcode.reputation },
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">{metric.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="panel px-7 py-8 sm:px-10 sm:py-10"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            variants={shouldReduceMotion ? undefined : createFadeUp(24, 0.05)}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Difficulty Breakdown</p>
                <h2 className="text-3xl font-semibold text-slate-50">Solved by tier</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                Global rank #{formatCompactNumber(leetcode.ranking)}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {[
                { label: "Easy", value: leetcode.easySolved, meterClass: "difficulty-meter--easy" },
                { label: "Medium", value: leetcode.mediumSolved, meterClass: "difficulty-meter--medium" },
                { label: "Hard", value: leetcode.hardSolved, meterClass: "difficulty-meter--hard" },
              ].map((bucket) => (
                <div key={bucket.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-medium text-slate-100">{bucket.label}</p>
                    <p className="text-sm text-slate-400">{bucket.value} solved</p>
                  </div>
                  <progress
                    className={`difficulty-meter ${bucket.meterClass} mt-3`}
                    value={bucket.value}
                    max={Math.max(leetcode.solvedTotal, 1)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      ) : null}

      {lastfm ? (
        <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <motion.div
            className="panel px-7 py-8 sm:px-10 sm:py-10"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            variants={shouldReduceMotion ? undefined : createFadeUp(18)}
          >
            <p className="eyebrow">Last.fm</p>
            <h2 className="section-heading">Monthly listening snapshot</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Top artists and tracks from @{lastfm.username}. No live listening status.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Scrobbles</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{formatCompactNumber(lastfm.playcount)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Monthly Artists</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{lastfm.topArtists.length}</p>
              </div>
            </div>

            <div className="mt-8">
              <a href={lastfm.profileUrl} target="_blank" rel="noopener noreferrer" className="action-link">
                Open Last.fm
              </a>
            </div>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            variants={shouldReduceMotion ? undefined : createFadeUp(24, 0.05)}
          >
            <div className="panel px-7 py-8">
              <p className="eyebrow">Top Artists</p>
              <div className="mt-6 space-y-4">
                {lastfm.topArtists.length ? (
                  lastfm.topArtists.map((artist, index) => (
                    <a
                      key={artist.url}
                      href={artist.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">#{index + 1}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-50">{artist.name}</p>
                      </div>
                      <p className="text-sm text-slate-300">{artist.playcount} plays</p>
                    </a>
                  ))
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-400">
                    No artist data available.
                  </p>
                )}
              </div>
            </div>

            <div className="panel px-7 py-8">
              <p className="eyebrow">Top Tracks</p>
              <div className="mt-6 space-y-4">
                {lastfm.topTracks.length ? (
                  lastfm.topTracks.map((track, index) => (
                    <a
                      key={track.url}
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">#{index + 1}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-50">{track.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{track.artist}</p>
                      </div>
                      <p className="text-sm text-slate-300">{track.playcount} plays</p>
                    </a>
                  ))
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-400">
                    No track data available.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      ) : null}

      {steam ? (
        <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <motion.div
            className="panel px-7 py-8 sm:px-10 sm:py-10"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            variants={shouldReduceMotion ? undefined : createFadeUp(18)}
          >
            <p className="eyebrow">Steam</p>
            <h2 className="section-heading">Gaming snapshot</h2>

            <div className="mt-6 flex items-center gap-4">
              {steam.avatarUrl ? (
                <img
                  src={steam.avatarUrl}
                  alt={`${steam.personaName} avatar`}
                  className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
                  loading="lazy"
                />
              ) : null}
              <div>
                <p className="text-xl font-semibold text-slate-50">{steam.personaName}</p>
                <p className="mt-1 text-sm text-slate-400">{steam.gameCount} games in the public library</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recent Games</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{steam.recentGames.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total Play Hours</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">
                  {formatHours(steam.totalPlaytimeHours)}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <a href={steam.profileUrl} target="_blank" rel="noopener noreferrer" className="action-link">
                Open Steam
              </a>
            </div>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            variants={shouldReduceMotion ? undefined : createFadeUp(24, 0.05)}
          >
            <div className="panel px-7 py-8">
              <p className="eyebrow">Recent Play</p>
              <div className="mt-6 space-y-4">
                {steam.recentGames.length ? (
                  steam.recentGames.map((game) => (
                    <div
                      key={game.appId}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      {game.iconUrl ? (
                        <img
                          src={game.iconUrl}
                          alt={`${game.name} icon`}
                          className="h-12 w-12 rounded-xl border border-white/10 object-cover"
                          loading="lazy"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-semibold text-slate-50">{game.name}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {game.playtimeTwoWeeksHours
                            ? `${formatHours(game.playtimeTwoWeeksHours)} in the last 2 weeks`
                            : "Played recently"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-400">
                    No recent public playtime.
                  </p>
                )}
              </div>
            </div>

            <div className="panel px-7 py-8">
              <p className="eyebrow">Top Games</p>
              <div className="mt-6 space-y-4">
                {steam.topGames.length ? (
                  steam.topGames.map((game) => (
                    <div
                      key={game.appId}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <div className="min-w-0 flex items-center gap-4">
                        {game.iconUrl ? (
                          <img
                            src={game.iconUrl}
                            alt={`${game.name} icon`}
                            className="h-12 w-12 rounded-xl border border-white/10 object-cover"
                            loading="lazy"
                          />
                        ) : null}
                        <p className="truncate text-lg font-semibold text-slate-50">{game.name}</p>
                      </div>
                      <p className="text-sm text-slate-300">{formatHours(game.playtimeForeverHours)}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-400">
                    No public library data available.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      ) : null}
    </SiteLayout>
  );
}





