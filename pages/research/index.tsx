import type { GetStaticProps, InferGetStaticPropsType } from "next";

import ContentCard from "../../components/site/ContentCard";
import EmptyState from "../../components/site/EmptyState";
import SiteLayout from "../../components/site/SiteLayout";
import { sanityFetch } from "../../sanity/lib/fetch";
import { RESEARCH_PAPERS_QUERY } from "../../sanity/lib/queries";
import type { ResearchPaper } from "../../sanity/lib/types";

export const getStaticProps: GetStaticProps<{ papers: ResearchPaper[] }> = async () => {
  const papers = await sanityFetch(RESEARCH_PAPERS_QUERY, {}, [] as ResearchPaper[]);

  return {
    props: { papers },
    revalidate: 60,
  };
};

export default function ResearchPage({
  papers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <SiteLayout title="Research" description="Research papers and supporting material.">
      <section className="space-y-6">
        <div>
          <p className="eyebrow">Research</p>
          <h1 className="section-heading">Papers, abstracts, and supporting material</h1>
          <p className="section-copy">
            Papers, abstracts, and links.
          </p>
        </div>

        {papers.length ? (
          <div className="panel-grid">
            {papers.map((paper) => (
              <ContentCard
                key={paper._id}
                eyebrow={paper.featured ? "Featured" : "Paper"}
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
                  <a href={paper.paperUrl} target="_blank" rel="noopener noreferrer" className="action-link">
                    Paper Link
                  </a>
                ) : paper.paperFileUrl ? (
                  <a href={paper.paperFileUrl} target="_blank" rel="noopener noreferrer" className="action-link">
                    Open PDF
                  </a>
                ) : null}
                {paper.paperUrl && paper.paperFileUrl ? (
                  <a href={paper.paperFileUrl} target="_blank" rel="noopener noreferrer" className="muted-link">
                    PDF
                  </a>
                ) : null}
                {paper.codeUrl ? (
                  <a href={paper.codeUrl} target="_blank" rel="noopener noreferrer" className="muted-link">
                    Code
                  </a>
                ) : null}
              </ContentCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Research papers will appear here"
            description="Add research entries in Sanity Studio and they will appear here."
          />
        )}
      </section>
    </SiteLayout>
  );
}