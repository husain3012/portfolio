import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { motion } from "framer-motion";

import ContentCard from "../components/site/ContentCard";
import EmptyState from "../components/site/EmptyState";
import SiteLayout from "../components/site/SiteLayout";
import { createFadeUp, motionEase, staggerContainer, useSiteReducedMotion } from "../components/site/motion";
import { fetchGitHubStats } from "../lib/github";
import { extractLeetCodeUsername, fetchLeetCodeStats } from "../lib/leetcode";
import { sanityFetch } from "../sanity/lib/fetch";
import { HOME_PAGE_QUERY, RESOURCE_LINKS_QUERY } from "../sanity/lib/queries";
import type { GitHubStats, HomePageData, LeetCodeStats, ResourceLink } from "../sanity/lib/types";

const fallbackData: HomePageData = {
  settings: null,
  featuredProjects: [],
  featuredPapers: [],
  featuredLinks: [],
  resume: null,
};

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

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

export const getStaticProps: GetStaticProps<{
  data: HomePageData;
  github: GitHubStats | null;
  leetcode: LeetCodeStats | null;
}> = async () => {
  const [data, github, resourceLinks] = await Promise.all([
    sanityFetch(HOME_PAGE_QUERY, {}, fallbackData),
    fetchGitHubStats(),
    sanityFetch(RESOURCE_LINKS_QUERY, {}, [] as ResourceLink[]),
  ]);
  const leetcode = await fetchLeetCodeStats(extractLeetCodeUsername(resourceLinks));

  return {
    props: { data, github, leetcode },
    revalidate: 60,
  };
};

export default function HomePage({
  data,
  github,
  leetcode,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const settings = data.settings;
  const shouldReduceMotion = useSiteReducedMotion();

  return (
    <SiteLayout description="Portfolio with projects, research, links, and resume content.">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <motion.div
          className="panel px-7 py-8 sm:px-10 sm:py-10"
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          variants={shouldReduceMotion ? undefined : createFadeUp(18)}
        >
          <p className="eyebrow">Portfolio</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl">
            {settings?.siteTitle || "Portfolio and selected work."}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {settings?.intro ||
              "Projects, research, links, and resume content live here."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <motion.div whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}>
              <Link href="/projects" className="action-link">
                Browse Projects
              </Link>
            </motion.div>
            <motion.div whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}>
              <Link href="/research" className="muted-link">
                Read Research
              </Link>
            </motion.div>
            {data.resume?.resumeFileUrl ? (
              <motion.a
                href={data.resume.resumeFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="muted-link"
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              >
                Download Resume
              </motion.a>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          className="panel flex flex-col gap-5 px-7 py-8"
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          variants={shouldReduceMotion ? undefined : createFadeUp(26, 0.08)}
        >
          <div>
            <p className="eyebrow">Profile</p>
            <h2 className="text-2xl font-semibold text-slate-50">
              {settings?.role || "Engineer, researcher, and systems-minded builder"}
            </h2>
          </div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            variants={shouldReduceMotion ? undefined : staggerContainer}
            initial={shouldReduceMotion ? false : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
          >
            <motion.div className="rounded-2xl border border-white/10 bg-white/5 p-4" variants={shouldReduceMotion ? undefined : createFadeUp(16, 0.05)} whileHover={shouldReduceMotion ? undefined : { y: -4, backgroundColor: "rgba(255,255,255,0.08)" }} transition={{ duration: 0.24, ease: motionEase }}>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Location
              </p>
              <p className="mt-2 text-lg text-slate-100">
                {settings?.location || "New Delhi, India"}
              </p>
            </motion.div>
            <motion.div className="rounded-2xl border border-white/10 bg-white/5 p-4" variants={shouldReduceMotion ? undefined : createFadeUp(16, 0.1)} whileHover={shouldReduceMotion ? undefined : { y: -4, backgroundColor: "rgba(255,255,255,0.08)" }} transition={{ duration: 0.24, ease: motionEase }}>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Availability
              </p>
              <p className="mt-2 text-lg text-slate-100">
                {settings?.availability || "Open to research and engineering roles"}
              </p>
            </motion.div>
          </motion.div>

          {settings?.heroMetrics?.length ? (
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              variants={shouldReduceMotion ? undefined : staggerContainer}
              initial={shouldReduceMotion ? false : "hidden"}
              animate={shouldReduceMotion ? undefined : "visible"}
            >
              {settings.heroMetrics.map((metric) => (
                <motion.div
                  key={`${metric.label}-${metric.value}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  variants={shouldReduceMotion ? undefined : createFadeUp(14)}
                  whileHover={shouldReduceMotion ? undefined : { y: -4, backgroundColor: "rgba(255,255,255,0.08)" }}
                  transition={{ duration: 0.24, ease: motionEase }}
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-50">
                    {metric.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : null}

          {settings?.email ? (
            <motion.a
              href={`mailto:${settings.email}`}
              className="text-sm font-medium text-amber-300 hover:text-amber-200"
              whileHover={shouldReduceMotion ? undefined : { x: 3 }}
            >
              {settings.email}
            </motion.a>
          ) : null}
        </motion.div>
      </section>

      <section className="mt-16 space-y-6">
        <div>
          <p className="eyebrow">Links</p>
          <h2 className="section-heading">Profiles, references, and live destinations</h2>
          <p className="section-copy">
            Key profiles and public links, all in one place.
          </p>
        </div>

        {data.featuredLinks.length ? (
          <div className="panel-grid">
            {data.featuredLinks.map((resource) => (
              <ContentCard
                key={resource._id}
                eyebrow={resource.category || "Link"}
                title={resource.title}
                description={resource.description}
                href={resource.url}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No links yet"
            description="Add a few links in Sanity Studio and they will show up here."
          />
        )}
      </section>

      <section className="mt-16 space-y-6">
        <div>
          <p className="eyebrow">Projects</p>
          <h2 className="section-heading">Project showcases</h2>
          <p className="section-copy">
            Selected projects with context, links, and notes.
          </p>
        </div>

        {data.featuredProjects.length ? (
          <div className="panel-grid">
            {data.featuredProjects.map((project) => (
              <ContentCard
                key={project._id}
                eyebrow="Project"
                title={project.title}
                description={project.summary}
                meta={[project.role, project.year].filter(Boolean).join(" · ")}
                tags={project.technologies}
                image={project.coverImage}
                href={project.slug ? `/projects/${project.slug}` : undefined}
              >
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-link"
                  >
                    Live Demo
                  </a>
                ) : null}
                {project.repositoryUrl ? (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="muted-link"
                  >
                    Repository
                  </a>
                ) : null}
              </ContentCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No projects yet"
            description="Add project entries in Sanity Studio and they will appear here."
          />
        )}
      </section>

      <section className="mt-16 space-y-6">
        <div>
          <p className="eyebrow">Publications</p>
          <h2 className="section-heading">Research papers</h2>
          <p className="section-copy">
            Papers, abstracts, and supporting links.
          </p>
        </div>

        {data.featuredPapers.length ? (
          <div className="panel-grid">
            {data.featuredPapers.map((paper) => (
              <ContentCard
                key={paper._id}
                eyebrow="Research"
                title={paper.title}
                description={paper.abstract}
                meta={
                  [
                    paper.venue,
                    paper.publishedAt
                      ? new Date(paper.publishedAt).toLocaleDateString()
                      : undefined,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                }
                tags={paper.tags}
                image={paper.coverImage}
                href={paper.slug ? `/research/${paper.slug}` : undefined}
              >
                {paper.paperUrl ? (
                  <a
                    href={paper.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-link"
                  >
                    Read Paper
                  </a>
                ) : paper.paperFileUrl ? (
                  <a
                    href={paper.paperFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-link"
                  >
                    Open PDF
                  </a>
                ) : null}
                {paper.paperUrl && paper.paperFileUrl ? (
                  <a
                    href={paper.paperFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="muted-link"
                  >
                    PDF
                  </a>
                ) : null}
                {paper.codeUrl ? (
                  <a
                    href={paper.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="muted-link"
                  >
                    Code
                  </a>
                ) : null}
              </ContentCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No papers yet"
            description="Add research entries in Sanity Studio and they will appear here."
          />
        )}
      </section>

      <section className="mt-16">
        <div className="panel px-7 py-8">
          <p className="eyebrow">Resume</p>
          <h2 className="text-3xl font-semibold text-slate-50">
            {data.resume?.title || "Resume and CV"}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            {data.resume?.summary ||
              "A short summary, key highlights, experience, and a PDF resume can live here."}
          </p>

          {data.resume?.skills?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {data.resume.skills.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/resume" className="action-link">
              View Resume Page
            </Link>
            {data.resume?.resumeFileUrl ? (
              <a
                href={data.resume.resumeFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="muted-link"
              >
                Download PDF
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {(github || leetcode) ? (
        <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <motion.div
            className="panel px-7 py-8 sm:px-10 sm:py-10"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            variants={shouldReduceMotion ? undefined : createFadeUp(18)}
          >
            <p className="eyebrow">Stats</p>
            <h2 className="section-heading">Overview stats</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              A short summary lives here. The full GitHub and LeetCode stats are on Signals.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {([
                github
                  ? { label: "GitHub Followers", value: formatCompactNumber(github.followers) }
                  : null,
                github
                  ? { label: "GitHub Stars", value: formatCompactNumber(github.totalStars) }
                  : null,
                leetcode
                  ? { label: "LeetCode Solved", value: formatCompactNumber(leetcode.solvedTotal) }
                  : null,
                leetcode
                  ? { label: "LeetCode Rank", value: `#${formatCompactNumber(leetcode.ranking)}` }
                  : null,
              ].filter(
                (metric): metric is { label: string; value: string } => metric !== null
              )).map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    initial={shouldReduceMotion ? false : "hidden"}
                    whileInView={shouldReduceMotion ? undefined : "visible"}
                    viewport={{ once: true, amount: 0.4 }}
                    variants={shouldReduceMotion ? undefined : createFadeUp(14, index * 0.04)}
                    whileHover={shouldReduceMotion ? undefined : { y: -4, backgroundColor: "rgba(255,255,255,0.08)" }}
                    transition={{ duration: 0.24, ease: motionEase }}
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-50">
                      {metric.value}
                    </p>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          <motion.div
            className="panel px-7 py-8 sm:px-10 sm:py-10"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.3 }}
            variants={shouldReduceMotion ? undefined : createFadeUp(22, 0.05)}
          >
            <p className="eyebrow">Signals</p>
            <h2 className="text-3xl font-semibold text-slate-50">Open the Signals page</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              See GitHub activity, the contribution heatmap, and LeetCode stats.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-400">
              {github ? <p>GitHub activity for @{github.username}</p> : null}
              {leetcode ? <p>LeetCode profile for @{leetcode.username}</p> : null}
              {github?.recentRepositories[0] ? (
                <p>{formatRelativeDate(github.recentRepositories[0].pushedAt)} on {github.recentRepositories[0].name}</p>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signals" className="action-link">
                Open Signals
              </Link>
              {github ? (
                <a href={github.profileUrl} target="_blank" rel="noopener noreferrer" className="muted-link">
                  GitHub Profile
                </a>
              ) : null}
            </div>
          </motion.div>
        </section>
      ) : null}
    </SiteLayout>
  );
}
