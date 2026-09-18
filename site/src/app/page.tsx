import { cookies } from "next/headers";
import type { Course } from "@prisma/client";
import { getPublicData } from "@/lib/publicData";
import { SECTIONS } from "@/lib/sections";
import Nav from "@/components/public/Nav";
import SectionShell, { CardSection } from "@/components/public/SectionShell";
import VisitorGate from "@/components/public/VisitorGate";
import ContactForm from "@/components/public/ContactForm";
import WaveformRibbon from "@/components/public/WaveformRibbon";
import GlowBackdrop from "@/components/public/GlowBackdrop";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPublicData();
  const cookieStore = await cookies();
  const visitorOk = cookieStore.get("visitor_ok")?.value === "1";

  if (data.settings.visitorGateEnabled && !visitorOk) {
    return <VisitorGate name={data.profile.name} title={data.profile.title} photoBase64={data.profile.photoBase64} />;
  }

  const { profile } = data;

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

  const coursesByYear: Record<string, Course[]> = {};
  for (const c of data.courses) {
    const year = c.year || "Undated";
    if (!coursesByYear[year]) coursesByYear[year] = [];
    coursesByYear[year].push(c);
  }
  const courseYears = Object.keys(coursesByYear).sort();

  const whatsappNumber = profile.phone ? profile.phone.replace(/[^0-9]/g, "") : null;

  const infoRows: { label: string; value: string }[] = [];
  if (sectionHasContent.contact && profile.location) infoRows.push({ label: "Location", value: profile.location });
  if (sectionHasContent.contact && profile.email) infoRows.push({ label: "Email", value: profile.email });
  if (sectionHasContent.contact && profile.phone) infoRows.push({ label: "Phone", value: profile.phone });
  if (profile.linkedinUrl) infoRows.push({ label: "LinkedIn", value: profile.linkedinUrl });
  if (profile.githubUrl) infoRows.push({ label: "GitHub", value: profile.githubUrl });
  if (profile.scholarUrl) infoRows.push({ label: "Scholar", value: profile.scholarUrl });
  if (profile.orcidUrl) infoRows.push({ label: "ORCID", value: profile.orcidUrl });
  if (profile.researchGateUrl) infoRows.push({ label: "ResearchGate", value: profile.researchGateUrl });

  return (
    <div id="top">
      <Nav items={navItems} siteName={profile.name} />

      {/* HERO */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-ink px-6 py-20 text-cream">
        <GlowBackdrop />
        <WaveformRibbon tall />
        <div className="relative mx-auto w-full max-w-4xl text-center">
          <div className="mb-4 text-xs font-bold tracking-[0.3em] text-gold uppercase">Welcome</div>
          <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-7xl">
            I Am {profile.name || "Your Name"}
          </h1>
          {profile.title && (
            <div className="mt-5 text-lg text-cream/70 sm:text-xl">{profile.title}</div>
          )}
          {profile.tagline && (
            <p className="mx-auto mt-4 max-w-lg text-cream/60">{profile.tagline}</p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {sectionHasContent.contact && (
              <a
                href="#contact"
                className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
              >
                Get in Touch
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream hover:border-gold hover:text-gold"
                aria-label="LinkedIn"
              >
                in
              </a>
            )}
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream hover:border-gold hover:text-gold"
                aria-label="GitHub"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.73 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                </svg>
              </a>
            )}
            {profile.scholarUrl && (
              <a
                href={profile.scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream hover:border-gold hover:text-gold"
                aria-label="Google Scholar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1 0 9l12 8 10-6.67V17h2V9L12 1Zm0 10.67L3.26 6 12 3.33 20.74 6 12 11.67ZM5 12.5V17c0 2.21 3.13 4 7 4s7-1.79 7-4v-4.5l-7 4.67-7-4.67Z" />
                </svg>
              </a>
            )}
            {profile.orcidUrl && (
              <a
                href={profile.orcidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream hover:border-gold hover:text-gold"
                aria-label="ORCID"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0ZM7.37 4.68a1.32 1.32 0 1 1 0 2.63 1.32 1.32 0 0 1 0-2.63Zm-1.17 3.98h2.35v11.3H6.2V8.66Zm4.4 0h4.55c4.33 0 6.24 3.1 6.24 5.66 0 2.8-2.19 5.66-6.21 5.66h-4.58V8.66Zm2.35 2.03v7.23h2.03c3.03 0 4.17-2.24 4.17-3.62 0-1.96-1.25-3.61-4.24-3.61h-1.96Z" />
                </svg>
              </a>
            )}
            {profile.researchGateUrl && (
              <a
                href={profile.researchGateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-[11px] font-bold text-cream hover:border-gold hover:text-gold"
                aria-label="ResearchGate"
              >
                RG
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream hover:border-gold hover:text-gold"
                aria-label="Email"
              >
                @
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT + PHOTO */}
      {sectionHasContent.about && (
        <SectionShell id="about" tone="ink">
          <div className="flex flex-wrap gap-12">
            <div className="min-w-[280px] flex-1">
              {profile.photoBase64 && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.photoBase64}
                  alt={profile.name}
                  className="aspect-[4/5] w-full max-w-sm rounded-2xl border border-gold/20 object-cover shadow-[0_0_60px_-15px_rgba(217,169,79,0.35)]"
                />
              )}
            </div>
            <div className="min-w-[300px] flex-[2]">
              <h2 className="mb-4 font-display text-2xl font-bold text-cream">About Me</h2>
              <p className="leading-relaxed whitespace-pre-line text-cream/75">{profile.bio}</p>

              {infoRows.length > 0 && (
                <div className="mt-8 divide-y divide-cream/10 border-t border-cream/10">
                  {infoRows.map((row) => (
                    <div key={row.label} className="flex flex-wrap gap-x-4 gap-y-1 py-2.5 text-sm">
                      <span className="w-28 shrink-0 font-bold tracking-wide text-cream/50 uppercase">
                        {row.label}
                      </span>
                      <span className="text-gold">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionShell>
      )}

      {/* SKILLS */}
      {sectionHasContent.skills && (
        <SectionShell id="skills" title="Skills & Info" tone="surface">
          <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {data.skills.map((s) => (
              <div key={s.id}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-cream">{s.name}</span>
                  <span className="text-cream/40">{s.level}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                    style={{ width: `${Math.min(100, Math.max(0, s.level))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {/* EXPERIENCE + EDUCATION */}
      {(sectionHasContent.experience || sectionHasContent.education) && (
        <SectionShell id="experience" title="Work Experience" tone="ink">
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id} className="rounded-2xl border border-cream/10 bg-surface p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <strong className="text-base text-cream">{e.role}</strong>
                  <span className="text-xs text-slate">{e.dateRange}</span>
                </div>
                <div className="mt-0.5 text-[13.5px] text-cream/60 italic">{e.organization}</div>
                {e.description && (
                  <p className="mt-3 text-sm whitespace-pre-line text-cream/70">{e.description}</p>
                )}
              </div>
            ))}
          </div>

          {sectionHasContent.education && (
            <>
              <h3 className="mt-9 mb-3.5 font-display text-xl font-bold text-cream">Education</h3>
              <div className="divide-y divide-cream/10">
                {data.education.map((e) => (
                  <div key={e.id} className="py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <strong className="text-[14.5px] text-cream">{e.degree}</strong>
                      <span className="text-xs text-slate">{e.dateRange}</span>
                    </div>
                    {e.institution && (
                      <div className="text-[13.5px] text-cream/60 italic">{e.institution}</div>
                    )}
                    {e.result && <div className="mt-0.5 text-sm text-slate">{e.result}</div>}
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionShell>
      )}

      {/* RESEARCH */}
      {sectionHasContent.research && (
        <CardSection id="research" title="Doctoral Research / Key Research Summary">
          <div className="space-y-4">
            {data.research.map((r) => (
              <div key={r.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <strong className="text-cream">{r.title}</strong>
                  <span className="text-xs text-slate">{r.dateRange}</span>
                </div>
                {r.description && (
                  <p className="mt-1 text-sm whitespace-pre-line text-cream/70">{r.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardSection>
      )}

      {/* PUBLICATIONS */}
      {sectionHasContent.publications && (
        <CardSection id="publications" title="Publications">
          <ul className="space-y-3">
            {data.publications.map((p) => (
              <li key={p.id} className="text-sm leading-relaxed text-cream/80">
                <span className="font-medium text-cream">{p.title}.</span>{" "}
                {[p.authors, p.venue, p.year].filter(Boolean).join(" — ")}
                {p.doiOrLink && (
                  <>
                    {" "}
                    <a
                      href={p.doiOrLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold underline"
                    >
                      {p.doiOrLink}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </CardSection>
      )}

      {/* PATENTS */}
      {sectionHasContent.patents && (
        <CardSection id="patents" title="Intellectual Property / Patents">
          <div className="space-y-4">
            {data.patents.map((p) => (
              <div key={p.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <strong className="text-cream">{p.title}</strong>
                  <span className="text-xs text-slate">{p.date}</span>
                </div>
                <div className="text-sm text-cream/60">{[p.number, p.status].filter(Boolean).join(" — ")}</div>
                {p.description && (
                  <p className="mt-1 text-sm whitespace-pre-line text-cream/70">{p.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardSection>
      )}

      {/* AWARDS */}
      {sectionHasContent.awards && (
        <CardSection id="awards" title="Awards & Honors">
          <div className="space-y-4">
            {data.awards.map((a) => (
              <div key={a.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <strong className="text-cream">{a.title}</strong>
                  <span className="text-xs text-slate">{a.year}</span>
                </div>
                {a.issuer && <div className="text-sm text-cream/60">{a.issuer}</div>}
                {a.description && (
                  <p className="mt-1 text-sm whitespace-pre-line text-cream/70">{a.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardSection>
      )}

      {/* TEACHING */}
      {sectionHasContent.teaching && (
        <CardSection id="teaching" title="Teaching & Academic Service">
          <div className="space-y-4">
            {data.teaching.map((t) => (
              <div key={t.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <strong className="text-cream">{t.title}</strong>
                  <span className="text-xs text-slate">{t.dateRange}</span>
                </div>
                <div className="text-sm text-cream/60">{[t.role, t.institution].filter(Boolean).join(" — ")}</div>
                {t.description && (
                  <p className="mt-1 text-sm whitespace-pre-line text-cream/70">{t.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardSection>
      )}

      {/* LANGUAGES */}
      {sectionHasContent.languages && (
        <CardSection id="languages" title="Languages">
          <div className="flex flex-wrap gap-2">
            {data.languages.map((l) => (
              <span
                key={l.id}
                className="rounded-full border border-gold/25 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold-light"
              >
                {l.name}
                {l.proficiency ? ` — ${l.proficiency}` : ""}
              </span>
            ))}
          </div>
        </CardSection>
      )}

      {/* COURSES */}
      {sectionHasContent.courses && (
        <SectionShell id="courses" title="Courses & Certifications" tone="surface">
          <div className="space-y-6">
            {courseYears.map((year) => (
              <div key={year}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  <strong className="text-cream">Year — {year}</strong>
                </div>
                <ul className="list-disc space-y-1 pl-8 text-[13.5px] text-cream/70">
                  {coursesByYear[year].map((c) => (
                    <li key={c.id}>{[c.title, c.provider].filter(Boolean).join(" — ")}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionShell>
      )}

      {/* REFERENCES */}
      {sectionHasContent.references && (
        <CardSection id="references" title="References">
          <div className="grid gap-4 sm:grid-cols-2">
            {data.references.map((r) => (
              <div key={r.id}>
                <strong className="text-cream">{r.name}</strong>
                <div className="text-sm text-cream/60">{[r.title, r.institution].filter(Boolean).join(" — ")}</div>
                <div className="mt-0.5 text-sm text-slate">{[r.email, r.phone].filter(Boolean).join("  |  ")}</div>
              </div>
            ))}
          </div>
        </CardSection>
      )}

      {/* CONTACT */}
      {sectionHasContent.contact && (
        <section id="contact" className="mx-auto max-w-4xl px-6 pb-20">
          <div className="flex flex-wrap gap-10 rounded-2xl border border-gold/20 bg-surface p-9">
            <div className="min-w-[240px] flex-1">
              <h3 className="mb-2.5 font-display text-2xl font-bold text-cream">Get in Touch</h3>
              <p className="mb-4 text-sm text-cream/60">
                Feel free to reach out about collaborations, opportunities, or research questions.
              </p>
              <div className="space-y-2 text-[13.5px] text-cream/80">
                {profile.phone && <div>{profile.phone}</div>}
                {profile.email && <div>{profile.email}</div>}
                {profile.location && <div>{profile.location}</div>}
              </div>
            </div>
            <div className="min-w-[280px] flex-1">
              <ContactForm />
            </div>
          </div>
        </section>
      )}

      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-30 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
          aria-label="WhatsApp"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.85 1h.01a7.94 7.94 0 0 0 5.54-13.58ZM12.06 18.4h-.01a6.56 6.56 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.6 6.6 0 1 1 12.24-3.5 6.56 6.56 0 0 1-6.64 6.6Zm3.6-4.93c-.2-.1-1.16-.57-1.34-.64-.18-.07-.31-.1-.44.1-.13.2-.5.63-.62.77-.11.13-.23.15-.42.05a5.4 5.4 0 0 1-2.7-2.36c-.2-.35.2-.32.58-1.08.06-.13.03-.24-.02-.34-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.33h-.38c-.13 0-.34.05-.52.24-.18.2-.68.67-.68 1.62 0 .96.7 1.88.8 2.01.1.13 1.37 2.1 3.33 2.94.47.2.83.32 1.11.42.47.15.9.13 1.24.08.38-.06 1.16-.47 1.32-.93.16-.45.16-.84.11-.93-.05-.09-.18-.14-.38-.24Z" />
          </svg>
        </a>
      )}

      <footer className="bg-ink py-8 text-center text-xs text-slate">
        © {new Date().getFullYear()} {profile.name || "Portfolio"}
      </footer>
    </div>
  );
}
