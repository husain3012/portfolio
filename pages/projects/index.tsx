import type { GetStaticProps, InferGetStaticPropsType } from "next";

import ContentCard from "../../components/site/ContentCard";
import EmptyState from "../../components/site/EmptyState";
import SiteLayout from "../../components/site/SiteLayout";
import { sanityFetch } from "../../sanity/lib/fetch";
import { PROJECTS_QUERY } from "../../sanity/lib/queries";
import type { Project } from "../../sanity/lib/types";

export const getStaticProps: GetStaticProps<{ projects: Project[] }> = async () => {
  const projects = await sanityFetch(PROJECTS_QUERY, {}, [] as Project[]);

  return {
    props: { projects },
    revalidate: 60,
  };
};

export default function ProjectsPage({
  projects,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <SiteLayout title="Projects" description="Project showcase powered by Sanity CMS.">
      <section className="space-y-6">
        <div>
          <p className="eyebrow">Projects</p>
          <h1 className="section-heading">Shipped work and technical case studies</h1>
          <p className="section-copy">
            Every project card is sourced from Sanity so content, imagery, links, and long-form technical notes stay editable.
          </p>
        </div>

        {projects.length ? (
          <div className="panel-grid">
            {projects.map((project) => (
              <ContentCard
                key={project._id}
                eyebrow={project.featured ? "Featured Project" : "Project"}
                title={project.title}
                description={project.summary}
                meta={[project.role, project.year].filter(Boolean).join(" · ")}
                tags={project.technologies}
                image={project.coverImage}
                href={project.slug ? `/projects/${project.slug}` : undefined}
              >
                {project.demoUrl ? (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="action-link">
                    Live Demo
                  </a>
                ) : null}
                {project.repositoryUrl ? (
                  <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="muted-link">
                    Repository
                  </a>
                ) : null}
              </ContentCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Projects will appear here"
            description="Publish project documents in Sanity Studio to populate this page."
          />
        )}
      </section>
    </SiteLayout>
  );
}