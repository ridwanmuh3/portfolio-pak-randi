import type { Metadata } from "next";
import { BookOpenCheck, Mic, Users2, BadgeCheck, MapPin, Calendar } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

// Strapi client
import { getJournalReviews, getConferenceCommittees, getTalks, getMemberships } from "@/lib/strapi";

// Static fallbacks
import { journalReviews as staticJournalReviews, conferenceCommittees as staticCommittees, talks as staticTalks, memberships as staticMemberships } from "@/data/services";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const [journalReviewsData, committeesData, talksData, membershipsData] = await Promise.all([
    getJournalReviews(),
    getConferenceCommittees(),
    getTalks(),
    getMemberships(),
  ]);

  const journalReviews = journalReviewsData
    ? journalReviewsData.map((j) => j.name)
    : staticJournalReviews;

  const conferenceCommittees = committeesData ?? staticCommittees;
  const talks = talksData ?? staticTalks;

  const memberships = membershipsData
    ? membershipsData.map((m) => m.name)
    : staticMemberships;

  return (
    <>
      <PageHeader eyebrow="Professional Services" title="Academic & Community Service"
        description="Contributions to the academic community through reviewing, committee work, invited talks and professional memberships." />

      {/* Journal Reviewing */}
      <section aria-labelledby="journals-title" className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <BookOpenCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 id="journals-title" className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">Journal Reviewer</h2>
        </div>
        <div className="section-card">
          <ul className="grid gap-2 sm:grid-cols-2">
            {journalReviews.map((j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{j}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Committees */}
      <section aria-labelledby="committees-title" className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <Users2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 id="committees-title" className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">Conference Committees</h2>
        </div>
        <div className="section-card divide-y divide-slate-200 dark:divide-slate-800">
          {conferenceCommittees.map((c) => (
            <div key={`${c.venue}-${c.year}`} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">{c.role}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.venue}</p>
              </div>
              <span className="chip shrink-0 self-start sm:self-center">{c.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Talks */}
      <section aria-labelledby="talks-title" className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <Mic className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 id="talks-title" className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">Invited Talks</h2>
        </div>
        <div className="space-y-4">
          {talks.map((t) => (
            <article key={t.title} className="section-card">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{t.title}</h3>
              <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">{t.event}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{t.location}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{t.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Memberships */}
      <section aria-labelledby="memberships-title">
        <div className="mb-6 flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 id="memberships-title" className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">Professional Memberships</h2>
        </div>
        <div className="section-card">
          <ul className="flex flex-wrap gap-2">
            {memberships.map((m) => <li key={m} className="chip">{m}</li>)}
          </ul>
        </div>
      </section>
    </>
  );
}
