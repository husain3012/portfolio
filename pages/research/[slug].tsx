import Image from "next/image";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

import PortableRichText from "../../components/site/PortableRichText";
import SiteLayout from "../../components/site/SiteLayout";
import { sanityFetch } from "../../sanity/lib/fetch";
import { urlFor } from "../../sanity/lib/image";
import {
  RESEARCH_PAPER_QUERY,
  RESEARCH_SLUGS_QUERY,
} from "../../sanity/lib/queries";
import type { ResearchPaper } from "../../sanity/lib/types";

type Params = {
  slug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const slugs = await sanityFetch<{ slug: string }[]>(RESEARCH_SLUGS_QUERY, {}, []);

  return {
    paths: slugs.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ paper: ResearchPaper | null }, Params> = async (
  context
) => {
  const slug = context.params?.slug;
  const paper = slug
    ? await sanityFetch(RESEARCH_PAPER_QUERY, { slug }, null as ResearchPaper | null)
    : null;

  if (!paper) {
    return { notFound: true };
  }

  return {
    props: { paper },
    revalidate: 60,
  };
};

export default function ResearchDetailPage({
  paper,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!paper) {
    return null;
  }

  const coverImageUrl = paper.coverImage
    ? urlFor(paper.coverImage).width(1800).height(1080).fit("crop").url()
    : null;

  return (
    <SiteLayout title={paper.title} description={paper.abstract}>
      <div className="space-y-8">
        <Link href="/research" className="muted-link">
          Back to research
        </Link>

        <section className="panel px-7 py-8 sm:px-10 sm:py-10">
          <p className="eyebrow">Paper</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            {paper.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {paper.abstract}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
            {paper.venue ? <span className="chip">{paper.venue}</span> : null}
            {paper.publishedAt ? (
              <span className="chip">
                {new Date(paper.publishedAt).toLocaleDateString()}
              </span>
            ) : null}
            {paper.authors?.map((author) => (
              <span key={author} className="chip">
                {author}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {paper.paperUrl ? (
              <a href={paper.paperUrl} target="_blank" rel="noopener noreferrer" className="action-link">
                Read paper
              </a>
            ) : null}
            {paper.paperFileUrl ? (
              <a href={paper.paperFileUrl} target="_blank" rel="noopener noreferrer" className={paper.paperUrl ? "muted-link" : "action-link"}>
                {paper.paperUrl ? "Download PDF" : "Open PDF"}
              </a>
            ) : null}
            {paper.codeUrl ? (
              <a href={paper.codeUrl} target="_blank" rel="noopener noreferrer" className="muted-link">
                Code
              </a>
            ) : null}
          </div>
        </section>

        {coverImageUrl ? (
          <div className="panel relative aspect-[16/9] overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={paper.coverImage?.alt || paper.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <section className="panel px-7 py-8 sm:px-10 sm:py-10">
          <PortableRichText value={paper.body} />
        </section>
      </div>
    </SiteLayout>
  );
}