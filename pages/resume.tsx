import type { GetStaticProps, InferGetStaticPropsType } from "next";

import EmptyState from "../components/site/EmptyState";
import PortableRichText from "../components/site/PortableRichText";
import SiteLayout from "../components/site/SiteLayout";
import { sanityFetch } from "../sanity/lib/fetch";
import { RESUME_QUERY } from "../sanity/lib/queries";
import type { ResumeDocument } from "../sanity/lib/types";

export const getStaticProps: GetStaticProps<{ resume: ResumeDocument | null }> = async () => {
  const resume = await sanityFetch(RESUME_QUERY, {}, null as ResumeDocument | null);

  return {
    props: { resume },
    revalidate: 60,
  };
};

export default function ResumePage({
  resume,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <SiteLayout title="Resume" description="Resume and CV.">
      {resume ? (
        <div className="space-y-8">
          <section className="panel px-7 py-8 sm:px-10 sm:py-10">
            <p className="eyebrow">Resume</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
              {resume.title || "Resume"}
            </h1>
            {resume.summary ? (
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                {resume.summary}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
              {resume.location ? <span className="chip">{resume.location}</span> : null}
              {resume.email ? <span className="chip">{resume.email}</span> : null}
              {resume.availability ? <span className="chip">{resume.availability}</span> : null}
              {resume.updatedAt ? (
                <span className="chip">
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </span>
              ) : null}
            </div>

            {resume.resumeFileUrl ? (
              <div className="mt-8">
                <a
                  href={resume.resumeFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-link"
                >
                  Download PDF
                </a>
              </div>
            ) : null}
          </section>

          {resume.skills?.length ? (
            <section className="panel px-7 py-8 sm:px-10 sm:py-10">
              <h2 className="text-2xl font-semibold text-slate-50">Skills</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span key={skill} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {resume.highlights?.length ? (
            <section className="panel px-7 py-8 sm:px-10 sm:py-10">
              <h2 className="text-2xl font-semibold text-slate-50">Highlights</h2>
              <ul className="mt-5 space-y-3 text-slate-300">
                {resume.highlights.map((highlight) => (
                  <li key={highlight} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {resume.experience?.length ? (
            <section className="panel px-7 py-8 sm:px-10 sm:py-10">
              <h2 className="mb-6 text-2xl font-semibold text-slate-50">Detailed Experience</h2>
              <PortableRichText value={resume.experience} />
            </section>
          ) : null}
        </div>
      ) : (
        <EmptyState
          title="Resume content will appear here"
          description="Add your resume in Sanity Studio and it will appear here."
        />
      )}
    </SiteLayout>
  );
}