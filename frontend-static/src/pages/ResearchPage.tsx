import { FlaskConical, Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

// Static fallbacks
import {
  researchProjects as staticProjects,
  collaborators as staticCollaborators,
} from "@/data/research";

export default function ResearchPage() {
  const researchProjects = staticProjects;
  const collaborators = staticCollaborators;

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Research Projects"
        description="Selected research initiatives focused on information security, cryptography, artificial intelligence, ethical hacking, and digital forensics."
      />

      <section aria-labelledby="projects-title" className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2
            id="projects-title"
            className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50"
          >
            Ongoing & Recent Work
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {researchProjects.map((project) => (
            <article
              key={project.title}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-emerald-700"
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    project.status === "Ongoing"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {project.status}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {project.period}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-slate-50 dark:group-hover:text-emerald-400">
                {project.title}
              </h3>
              {/* <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-300">
                {project.description}
              </p> */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(project.tags ?? []).map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="collab-title">
        <div className="mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2
            id="collab-title"
            className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50"
          >
            Collaborators
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {collaborators.map((c, i) => (
            <div
              key={c.name}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 overflow-hidden">
                <img src={c.picture} alt={`collaborator ${i} picture`} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  {c.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {c.affiliation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
