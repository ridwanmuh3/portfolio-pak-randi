import type { Metadata } from "next";
import { GraduationCap, Briefcase, Wrench, Trophy, MapPin, Download } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

// Strapi client
import { getEducations, getExperiences, getSkillGroups, getAwards, getSiteConfig } from "@/lib/strapi";

// Static fallbacks
import { education as staticEducation, experiences as staticExperiences, skills as staticSkills, awards as staticAwards } from "@/data/experiences";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "CV & Experiences" };

export default async function ExperiencesPage() {
  const [educationsData, experiencesData, skillGroupsData, awardsData, siteConfig] = await Promise.all([
    getEducations(),
    getExperiences(),
    getSkillGroups(),
    getAwards(),
    getSiteConfig(),
  ]);

  const education = educationsData ?? staticEducation;
  const experiences = experiencesData ?? staticExperiences;
  const skills = skillGroupsData ?? staticSkills;
  const awards = awardsData ?? staticAwards;
  const cvUrl = siteConfig?.cvUrl ?? '#';

  return (
    <>
      <PageHeader eyebrow="Curriculum Vitae" title="CV & Experiences"
        description="An overview of my academic background, professional experience, technical skills and honors." />

      <div className="mb-8 flex flex-wrap gap-3">
        <a href={cvUrl}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-emerald-700">
          <Download className="h-4 w-4" /> Download CV (PDF)
        </a>
      </div>

      {/* Experience Timeline */}
      <section aria-labelledby="exp-title" className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 id="exp-title" className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">Professional Experience</h2>
        </div>
        <ol className="relative space-y-6 border-l-2 border-dashed border-emerald-200 pl-6 dark:border-emerald-900/60">
          {experiences.map((exp) => (
            <li key={`${exp.role}-${exp.period}`} className="relative">
              <span className="absolute -left-[34px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-emerald-500 bg-white dark:bg-slate-950">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <article className="section-card">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{exp.role}</h3>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{exp.organization}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><MapPin className="h-3 w-3" />{exp.location}</p>
                  </div>
                  <span className="chip shrink-0 self-start">{exp.period}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{exp.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </section>

      {/* Education */}
      <section aria-labelledby="edu-title" className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 id="edu-title" className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">Education</h2>
        </div>
        <ol className="relative space-y-6 border-l-2 border-dashed border-emerald-200 pl-6 dark:border-emerald-900/60">
          {education.map((edu) => (
            <li key={edu.degree} className="relative">
              <span className="absolute -left-[34px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-emerald-500 bg-white dark:bg-slate-950">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <article className="section-card">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{edu.degree}</h3>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{edu.institution}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><MapPin className="h-3 w-3" />{edu.location}</p>
                  </div>
                  <span className="chip shrink-0 self-start">{edu.period}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{edu.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </section>

      {/* Skills */}
      <section aria-labelledby="skills-title" className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 id="skills-title" className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">Skills & Expertise</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((group) => (
            <article key={group.category} className="section-card">
              <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-50">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {(group.items ?? []).map((item) => <span key={item} className="chip">{item}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section aria-labelledby="awards-title">
        <div className="mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 id="awards-title" className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-50">Awards & Honors</h2>
        </div>
        <div className="section-card divide-y divide-slate-200 dark:divide-slate-800">
          {awards.map((a) => (
            <div key={a.title} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">{a.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{a.issuer}</p>
              </div>
              <span className="chip shrink-0 self-start sm:self-center">{a.year}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
