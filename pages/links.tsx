import type { GetStaticProps, InferGetStaticPropsType } from "next";

import ContentCard from "../components/site/ContentCard";
import EmptyState from "../components/site/EmptyState";
import SiteLayout from "../components/site/SiteLayout";
import { sanityFetch } from "../sanity/lib/fetch";
import { RESOURCE_LINKS_QUERY } from "../sanity/lib/queries";
import type { ResourceLink } from "../sanity/lib/types";

export const getStaticProps: GetStaticProps<{ links: ResourceLink[] }> = async () => {
  const links = await sanityFetch(RESOURCE_LINKS_QUERY, {}, [] as ResourceLink[]);

  return {
    props: { links },
    revalidate: 60,
  };
};

export default function LinksPage({
  links,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const groupedLinks = links.reduce<Record<string, ResourceLink[]>>((accumulator, link) => {
    const category = link.category || "General";

    if (!accumulator[category]) {
      accumulator[category] = [];
    }

    accumulator[category].push(link);
    return accumulator;
  }, {});

  return (
    <SiteLayout title="Links" description="Curated links managed with Sanity CMS.">
      <section className="space-y-6">
        <div>
          <p className="eyebrow">Links</p>
          <h1 className="section-heading">Profiles, references, and public writing</h1>
          <p className="section-copy">
            Resource links are stored as structured documents so categories and featured placement stay easy to manage in the CMS.
          </p>
        </div>

        {links.length ? (
          <div className="space-y-10">
            {Object.entries(groupedLinks).map(([category, items]) => (
              <section key={category} className="space-y-4">
                <h2 className="text-2xl font-semibold text-slate-50">{category}</h2>
                <div className="panel-grid">
                  {items.map((item) => (
                    <ContentCard
                      key={item._id}
                      eyebrow={item.featured ? "Featured Link" : "Resource Link"}
                      title={item.title}
                      description={item.description}
                      href={item.url}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Links will appear here"
            description="Publish resourceLink documents in Sanity Studio to build your public link index."
          />
        )}
      </section>
    </SiteLayout>
  );
}