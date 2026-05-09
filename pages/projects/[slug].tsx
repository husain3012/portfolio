import Image from "next/image";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

import PortableRichText from "../../components/site/PortableRichText";
import SiteLayout from "../../components/site/SiteLayout";
import { sanityFetch } from "../../sanity/lib/fetch";
import { urlFor } from "../../sanity/lib/image";
import { PROJECT_QUERY, PROJECT_SLUGS_QUERY } from "../../sanity/lib/queries";
import type { Project } from "../../sanity/lib/types";

type Params = {
  slug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const slugs = await sanityFetch<{ slug: string }[]>(PROJECT_SLUGS_QUERY, {}, []);

  return {
    paths: slugs.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ project: Project | null }, Params> = async (
  context
) => {
  const slug = context.params?.slug;
  const project = slug
    ? await sanityFetch(PROJECT_QUERY, { slug }, null as Project | null)
    : null;

  if (!project) {
    return { notFound: true };
  }

  return {
    props: { project },
    revalidate: 60,
  };
};

export default function ProjectDetailPage({
  project,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!project) {
    return null;
  }

  const coverImageUrl = project.coverImage
    ? urlFor(project.coverImage).width(1800).height(1080).fit("crop").url()
    : null;

  return (
    <SiteLayout title={project.title} description={project.summary}>
      <div className="space-y-8">
        <Link href="/projects" className="muted-link">
          Back to projects
        </Link>

        <section className="panel px-7 py-8 sm:px-10 sm:py-10">
          <p className="eyebrow">Project</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {project.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
            {project.role ? <span className="chip">{project.role}</span> : null}
            {project.year ? <span className="chip">{project.year}</span> : null}
            {project.technologies?.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.demoUrl ? (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="action-link">
                Visit Demo
              </a>
            ) : null}
            {project.repositoryUrl ? (
              <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="muted-link">
                View Repository
              </a>
            ) : null}
          </div>
        </section>

        {coverImageUrl ? (
          <div className="panel relative aspect-[16/9] overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={project.coverImage?.alt || project.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <section className="panel px-7 py-8 sm:px-10 sm:py-10">
          <PortableRichText value={project.body} />
        </section>
      </div>
    </SiteLayout>
  );
}