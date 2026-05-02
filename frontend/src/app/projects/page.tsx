import type { Metadata } from "next";
import { Award, Rocket, ExternalLink, Calendar, Landmark } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

// Strapi client
import { getFundings, getShowcaseProjects } from "@/lib/strapi";

// Static fallbacks
import { fundings as staticFundings, showcaseProjects as staticShowcaseProjects } from "@/data/projects";

export const metadata: Metadata = { title: "Fundings & Projects" };

export default async function ProjectsPage() {
  const [fundingsData, showcaseData] = await Promise.all([
    getFundings(),
    getShowcaseProjects(),
  ]);

  const fundings = fundingsData ?? staticFundings;
  const showcaseProjects = showcaseData ?? staticShowcaseProjects;

  return (
    <>
      <PageHeader eyebrow="Fundings & Projects" title="Grants & Technical Projects"
        description="An overview of funded research grants and selected technical projects I have led or contributed to." />

      <section aria-labelledby="funding-title" className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 id="funding-title" className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">Research Grants</h2>
        </div>
        <div className="space-y-4">
          {fundings.map((g) => (
            <article key={g.title} className="section-card">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{g.title}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1"><Landmark className="h-3.5 w-3.5" />{g.agency}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{g.period}</span>
                  </div>
                </div>
                <span className="chip shrink-0 self-start">{g.role}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{g.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                Funding: {g.amount}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="showcase-title">
        <div className="mb-6 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 id="showcase-title" className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">Selected Projects</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {showcaseProjects.map((p) => (
            <article key={p.title}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-emerald-700">
              <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{p.type}</span>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-300">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(p.tech ?? []).map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
              {p.link && (
                <a href={p.link} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
                  Learn more <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
