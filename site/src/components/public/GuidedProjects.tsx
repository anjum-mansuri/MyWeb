import { CardSection } from "@/components/public/SectionShell";

/**
 * Student projects guided by Dr. Mansuri. The list lives in her GitHub profile repo
 * (anjum-mansuri/anjum-mansuri/projects.json), which a GitHub Action refreshes daily,
 * so the website stays in sync without admin edits.
 */
export type GuidedProject = {
  title: string;
  repo: string;
  url: string;
  student: string;
  student_url?: string;
  course: string;
  tech: string;
  description?: string;
  date: string;
};

const SOURCE = "https://raw.githubusercontent.com/anjum-mansuri/anjum-mansuri/main/projects.json";

const SUBJECTS: { course: string; label: string }[] = [
  { course: "Machine Learning", label: "Machine Learning" },
  { course: "Linux Shell Scripting", label: "Linux Shell Scripting" },
  { course: "UDP", label: "UDP (Web & App Development)" },
];

export async function getGuidedProjects(): Promise<GuidedProject[]> {
  try {
    const res = await fetch(SOURCE, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as GuidedProject[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function GuidedProjects({ projects }: { projects: GuidedProject[] }) {
  const students = new Set(projects.map((p) => p.student)).size;

  return (
    <CardSection id="guided" title="Student Projects Guided">
      <p className="mb-5 text-sm text-cream/70">
        Projects built by my students at LJ Institute of Computer Applications, LJ University, under my guidance.
        Each links to the student&apos;s own repository. This list updates automatically from{" "}
        <a
          href="https://github.com/anjum-mansuri"
          target="_blank"
          rel="noreferrer"
          className="text-gold underline hover:text-gold-light"
        >
          my GitHub profile
        </a>
        .
      </p>

      <div className="mb-6 flex flex-wrap gap-x-8 gap-y-3">
        <div>
          <div className="font-display text-3xl font-bold text-gold tabular-nums">{projects.length}</div>
          <div className="text-xs tracking-wider text-slate uppercase">Projects</div>
        </div>
        {SUBJECTS.map((s) => (
          <div key={s.course}>
            <div className="font-display text-3xl font-bold text-cream tabular-nums">
              {projects.filter((p) => p.course === s.course).length}
            </div>
            <div className="text-xs tracking-wider text-slate uppercase">{s.label.split(" (")[0]}</div>
          </div>
        ))}
        <div>
          <div className="font-display text-3xl font-bold text-cream tabular-nums">{students}</div>
          <div className="text-xs tracking-wider text-slate uppercase">Students</div>
        </div>
      </div>

      <div className="space-y-3">
        {SUBJECTS.map((s) => {
          const list = projects.filter((p) => p.course === s.course);
          if (!list.length) return null;
          return (
            <details key={s.course} className="group rounded-xl border border-cream/10 bg-ink/40 px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-cream">
                <span>
                  {s.label} <span className="text-cream/50">({list.length})</span>
                </span>
                <span className="text-gold transition-transform group-open:rotate-90">›</span>
              </summary>
              <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {list.map((p) => (
                  <li key={p.repo} className="min-w-0">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-sm text-cream hover:text-gold"
                    >
                      {p.title}
                    </a>
                    <div className="truncate text-xs text-slate">
                      @{p.student} · {p.tech}
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </CardSection>
  );
}
