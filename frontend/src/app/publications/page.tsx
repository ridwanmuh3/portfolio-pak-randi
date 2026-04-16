import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import PublicationsList from "@/components/publications/PublicationsList";

// Strapi client
import { getPublications } from "@/lib/strapi";

// Static fallback
import { publications as staticPublications } from "@/data/publications";

export const metadata: Metadata = { title: "Publications" };

export default async function PublicationsPage() {
  const strapiData = await getPublications();

  // Map Strapi response to the shape PublicationsList expects
  const publications = strapiData
    ? strapiData.map((p) => ({
        type: p.type,
        title: p.title,
        authors: p.authors,
        venue: p.venue,
        year: p.year,
        doi: p.doi,
        corresponding: p.corresponding,
      }))
    : staticPublications;

  return (
    <>
      <PageHeader eyebrow="Publications" title="Selected Publications"
        description="Peer-reviewed journal articles, conference papers and book chapters. Use the filters or search to narrow results." />
      <PublicationsList publications={publications} />
    </>
  );
}
