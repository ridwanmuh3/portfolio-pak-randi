import PageHeader from "@/components/ui/PageHeader";
import PublicationsList from "@/components/publications/PublicationsList";

// Static fallback
import { publications as staticPublications } from "@/data/publications";

export default function PublicationsPage() {
  const publications = staticPublications;

  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Selected Publications"
        description="Peer-reviewed journal articles, conference papers and book chapters. Use the filters or search to narrow results."
      />
      <PublicationsList publications={publications} />
    </>
  );
}
