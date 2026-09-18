import { cookies } from "next/headers";
import { getPublicData } from "@/lib/publicData";
import { SECTIONS } from "@/lib/sections";
import Nav from "@/components/public/Nav";
import SectionShell from "@/components/public/SectionShell";
import VisitorGate from "@/components/public/VisitorGate";
import ContactForm from "@/components/public/ContactForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPublicData();
  const cookieStore = await cookies();
  const visitorOk = cookieStore.get("visitor_ok")?.value === "1";

  if (data.settings.visitorGateEnabled && !visitorOk) {
    return <VisitorGate siteName={data.profile.name} />;
  }

  const { profile } = data;
  const hasContactInfo = profile.email || profile.phone || profile.location;
  const hasSocialLinks = profile.linkedinUrl || profile.scholarUrl || profile.orcidUrl;

  const sectionHasContent: Record<string, boolean> = {
    about: data.isAboutPublic && Boolean(profile.bio),
    education: data.education.length > 0,
    experience: data.experience.length > 0,
    research: data.research.length > 0,
    publications: data.publications.length > 0,
    patents: data.patents.length > 0,
    awards: data.awards.length > 0,
    skills: data.skills.length > 0,
    teaching: data.teaching.length > 0,
    courses: data.courses.length > 0,
    languages: data.languages.length > 0,
    references: data.references.length > 0,
    contact: data.isContactPublic,
  };

  const navItems = SECTIONS.filter(
    (s) => s.key !== "hero" && sectionHasContent[s.key],
  ).map((s) => ({ key: s.key, label: s.navLabel }));

  return (
    <div id="top">
      <Nav items={navItems} siteName={profile.name} />

      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center sm:flex-row sm:text-left">
          {profile.photoBase64 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photoBase64}
              alt={profile.name}
              className="h-36 w-36 shrink-0 rounded-full object-cover shadow-md"
            />
          )}
          <div>
            <h1 className="font-serif text-3xl font-semibold text-slate-900 sm:text-4xl">
              {profile.name || "Your Name"}
            </h1>
            {profile.title && <p className="mt-2 text-lg text-slate-600">{profile.title}</p>}
            {profile.tagline && <p className="mt-3 max-w-xl text-slate-500">{profile.tagline}</p>}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <a
                href="/api/cv"
                className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
              >
                Download CV
              </a>
              {hasSocialLinks && (
                <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} className="hover:text-slate-900" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  )}
                  {profile.scholarUrl && (
                    <a href={profile.scholarUrl} className="hover:text-slate-900" target="_blank" rel="noopener noreferrer">
                      Google Scholar
                    </a>
                  )}
                  {profile.orcidUrl && (
                    <a href={profile.orcidUrl} className="hover:text-slate-900" target="_blank" rel="noopener noreferrer">
                      ORCID
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {sectionHasContent.about && (
        <SectionShell id="about" title="About Me">
          <p className="max-w-3xl whitespace-pre-line leading-relaxed text-slate-700">{profile.bio}</p>
        </SectionShell>
      )}

      {sectionHasContent.education && (
        <SectionShell id="education" title="Education">
          <div className="space-y-6">
            {data.education.map((e) => (
              <div key={e.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-serif text-lg font-semibold text-slate-900">{e.degree}</h3>
                  <span className="text-sm text-slate-500">{e.dateRange}</span>
                </div>
                <p className="text-slate-600">{[e.institution, e.result].filter(Boolean).join(" — ")}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {sectionHasContent.experience && (
        <SectionShell id="experience" title="Professional Experience">
          <div className="space-y-6">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-serif text-lg font-semibold text-slate-900">{e.role}</h3>
                  <span className="text-sm text-slate-500">{e.dateRange}</span>
                </div>
                <p className="text-slate-600">{e.organization}</p>
                {e.description && <p className="mt-1 whitespace-pre-line text-slate-600">{e.description}</p>}
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {sectionHasContent.research && (
        <SectionShell id="research" title="Doctoral Research / Key Research Summary">
          <div className="space-y-6">
            {data.research.map((r) => (
              <div key={r.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-serif text-lg font-semibold text-slate-900">{r.title}</h3>
                  <span className="text-sm text-slate-500">{r.dateRange}</span>
                </div>
                {r.description && <p className="mt-1 whitespace-pre-line text-slate-600">{r.description}</p>}
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {sectionHasContent.publications && (
        <SectionShell id="publications" title="Publications">
          <div className="space-y-5">
            {data.publications.map((p) => (
              <div key={p.id}>
                <h3 className="font-medium text-slate-900">{p.title}</h3>
                <p className="text-sm text-slate-600">
                  {[p.authors, p.venue, p.year].filter(Boolean).join(" — ")}
                </p>
                {p.doiOrLink && (
                  <a href={p.doiOrLink} className="text-sm text-slate-500 underline hover:text-slate-900" target="_blank" rel="noopener noreferrer">
                    {p.doiOrLink}
                  </a>
                )}
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {sectionHasContent.patents && (
        <SectionShell id="patents" title="Intellectual Property / Patents">
          <div className="space-y-6">
            {data.patents.map((p) => (
              <div key={p.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-serif text-lg font-semibold text-slate-900">{p.title}</h3>
                  <span className="text-sm text-slate-500">{p.date}</span>
                </div>
                <p className="text-slate-600">{[p.number, p.status].filter(Boolean).join(" — ")}</p>
                {p.description && <p className="mt-1 whitespace-pre-line text-slate-600">{p.description}</p>}
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {sectionHasContent.awards && (
        <SectionShell id="awards" title="Awards & Honors">
          <div className="space-y-6">
            {data.awards.map((a) => (
              <div key={a.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-serif text-lg font-semibold text-slate-900">{a.title}</h3>
                  <span className="text-sm text-slate-500">{a.year}</span>
                </div>
                <p className="text-slate-600">{a.issuer}</p>
                {a.description && <p className="mt-1 whitespace-pre-line text-slate-600">{a.description}</p>}
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {sectionHasContent.skills && (
        <SectionShell id="skills" title="Skills">
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span
                key={s.id}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
              >
                {s.name}
              </span>
            ))}
          </div>
        </SectionShell>
      )}

      {sectionHasContent.teaching && (
        <SectionShell id="teaching" title="Teaching & Academic Service">
          <div className="space-y-6">
            {data.teaching.map((t) => (
              <div key={t.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-serif text-lg font-semibold text-slate-900">{t.title}</h3>
                  <span className="text-sm text-slate-500">{t.dateRange}</span>
                </div>
                <p className="text-slate-600">{[t.role, t.institution].filter(Boolean).join(" — ")}</p>
                {t.description && <p className="mt-1 whitespace-pre-line text-slate-600">{t.description}</p>}
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {sectionHasContent.courses && (
        <SectionShell id="courses" title="Courses & Certifications">
          <div className="grid gap-4 sm:grid-cols-2">
            {data.courses.map((c) => (
              <div key={c.id} className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-medium text-slate-900">{c.title}</h3>
                <p className="text-sm text-slate-500">{[c.provider, c.year].filter(Boolean).join(" — ")}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {sectionHasContent.languages && (
        <SectionShell id="languages" title="Languages">
          <div className="flex flex-wrap gap-2">
            {data.languages.map((l) => (
              <span
                key={l.id}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
              >
                {l.name}
                {l.proficiency ? ` — ${l.proficiency}` : ""}
              </span>
            ))}
          </div>
        </SectionShell>
      )}

      {sectionHasContent.references && (
        <SectionShell id="references" title="References">
          <div className="grid gap-4 sm:grid-cols-2">
            {data.references.map((r) => (
              <div key={r.id} className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-medium text-slate-900">{r.name}</h3>
                <p className="text-sm text-slate-600">{[r.title, r.institution].filter(Boolean).join(" — ")}</p>
                <p className="mt-1 text-sm text-slate-500">{[r.email, r.phone].filter(Boolean).join("  |  ")}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {sectionHasContent.contact && (
        <SectionShell id="contact" title="Contact">
          <div className="grid gap-10 sm:grid-cols-2">
            {hasContactInfo && (
              <div className="space-y-2 text-slate-700">
                {profile.email && <p>{profile.email}</p>}
                {profile.phone && <p>{profile.phone}</p>}
                {profile.location && <p>{profile.location}</p>}
              </div>
            )}
            <ContactForm />
          </div>
        </SectionShell>
      )}

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} {profile.name || "Portfolio"}
      </footer>
    </div>
  );
}
