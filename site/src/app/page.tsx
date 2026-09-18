import { cookies } from "next/headers";
import type { Course } from "@prisma/client";
import { getPublicData } from "@/lib/publicData";
import { SECTIONS } from "@/lib/sections";
import Nav from "@/components/public/Nav";
import SectionShell, { CardSection } from "@/components/public/SectionShell";
import VisitorGate from "@/components/public/VisitorGate";
import ContactForm from "@/components/public/ContactForm";
import WaveformRibbon from "@/components/public/WaveformRibbon";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPublicData();
  const cookieStore = await cookies();
  const visitorOk = cookieStore.get("visitor_ok")?.value === "1";

  if (data.settings.visitorGateEnabled && !visitorOk) {
    return <VisitorGate name={data.profile.name} title={data.profile.title} photoBase64={data.profile.photoBase64} />;
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

  const coursesByYear: Record<string, Course[]> = {};
  for (const c of data.courses) {
    const year = c.year || "Undated";
    if (!coursesByYear[year]) coursesByYear[year] = [];
    coursesByYear[year].push(c);
  }
  const courseYears = Object.keys(coursesByYear).sort();

  const whatsappNumber = profile.phone ? profile.phone.replace(/[^0-9]/g, "") : null;

  return (
    <div id="top">
      <Nav items={navItems} siteName={profile.name} />

      {/* HERO */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-plum px-6 py-16 text-white">
        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-coral/15" />
        <WaveformRibbon />
        <div className="relative mx-auto flex w-full max-w-4xl flex-wrap items-center gap-12">
          <div className="min-w-[320px] flex-1">
            {profile.title && (
              <div className="mb-2 text-sm font-bold text-coral">Hello, I am</div>
            )}
            <h1 className="font-serif text-4xl leading-tight font-normal sm:text-5xl">
              {profile.name || "Your Name"}
            </h1>
            {profile.title && <div className="mt-1.5 mb-5 text-lg text-white/80">{profile.title}</div>}
            {profile.tagline && <p className="mb-5 max-w-md text-white/70">{profile.tagline}</p>}
            <div className="flex flex-wrap items-center gap-3">
              {sectionHasContent.contact && (
                <a
                  href="#contact"
                  className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Get in Touch
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                  aria-label="LinkedIn"
                >
                  in
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                  aria-label="Email"
                >
                  @
                </a>
              )}
            </div>
          </div>
          {profile.photoBase64 && (
            <div
              className="mx-auto h-52 w-52 shrink-0 rounded-full p-1.5 shadow-2xl"
              style={{ background: "linear-gradient(135deg, var(--color-coral), var(--color-coral-light))" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photoBase64}
                alt={profile.name}
                className="h-full w-full rounded-full border-[3px] border-white/40 object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* ABOUT + QUICK INFO */}
      {sectionHasContent.about && (
        <SectionShell id="about" tone="cream">
          <div className="flex flex-wrap gap-10">
            <div className="min-w-[300px] flex-[2]">
              <h2 className="mb-3.5 font-serif text-2xl font-normal text-plum">About Me</h2>
              <p className="leading-relaxed whitespace-pre-line text-[15px] text-ink/90">{profile.bio}</p>
            </div>
            {(hasSocialLinks || (sectionHasContent.contact && hasContactInfo)) && (
              <div className="min-w-[240px] flex-1 self-start rounded-2xl bg-white p-6 shadow-[0_4px_16px_rgba(61,38,69,0.08)]">
                <h4 className="mb-3 font-serif text-base font-normal text-plum">Quick Info</h4>
                <div className="space-y-2 text-[13.5px] leading-relaxed text-ink">
                  {sectionHasContent.contact && profile.location && (
                    <div><strong>Location</strong> — {profile.location}</div>
                  )}
                  {sectionHasContent.contact && profile.email && (
                    <div><strong>Email</strong> — {profile.email}</div>
                  )}
                  {sectionHasContent.contact && profile.phone && (
                    <div><strong>Phone</strong> — {profile.phone}</div>
                  )}
                  {profile.linkedinUrl && <div><strong>LinkedIn</strong> — {profile.linkedinUrl}</div>}
                  {profile.scholarUrl && <div><strong>Scholar</strong> — {profile.scholarUrl}</div>}
                  {profile.orcidUrl && <div><strong>ORCID</strong> — {profile.orcidUrl}</div>}
                </div>
              </div>
            )}
          </div>
        </SectionShell>
      )}

      {/* SKILLS */}
      {sectionHasContent.skills && (
        <SectionShell id="skills" title="Skills & Info" tone="white">
          <div className="flex flex-wrap gap-2.5">
            {data.skills.map((s) => (
              <span
                key={s.id}
                className="rounded-full border-[1.5px] border-plum/15 bg-cream px-4 py-2 text-sm font-semibold text-plum"
              >
                {s.name}
              </span>
            ))}
          </div>
        </SectionShell>
      )}

      {/* EXPERIENCE + EDUCATION */}
      {(sectionHasContent.experience || sectionHasContent.education) && (
        <SectionShell id="experience" title="Work Experience" tone="cream">
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id} className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(61,38,69,0.06)]">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <strong className="text-base text-plum">{e.role}</strong>
                  <span className="text-xs text-slate">{e.dateRange}</span>
                </div>
                <div className="mt-0.5 text-[13.5px] text-ink/70 italic">{e.organization}</div>
                {e.description && (
                  <p className="mt-3 text-sm whitespace-pre-line text-ink/80">{e.description}</p>
                )}
              </div>
            ))}
          </div>

          {sectionHasContent.education && (
            <>
              <h3 className="mt-9 mb-3.5 font-serif text-xl font-normal text-plum">Education</h3>
              <div className="divide-y divide-plum/10">
                {data.education.map((e) => (
                  <div key={e.id} className="py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <strong className="text-[14.5px] text-ink">{e.degree}</strong>
                      <span className="text-xs text-slate">{e.dateRange}</span>
                    </div>
                    {e.institution && (
                      <div className="text-[13.5px] text-ink/70 italic">{e.institution}</div>
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
                  <strong className="text-ink">{r.title}</strong>
                  <span className="text-xs text-slate">{r.dateRange}</span>
                </div>
                {r.description && (
                  <p className="mt-1 text-sm whitespace-pre-line text-ink/80">{r.description}</p>
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
              <li key={p.id} className="text-sm leading-relaxed text-ink/90">
                <span className="font-medium text-ink">{p.title}.</span>{" "}
                {[p.authors, p.venue, p.year].filter(Boolean).join(" — ")}
                {p.doiOrLink && (
                  <>
                    {" "}
                    <a
                      href={p.doiOrLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-coral underline"
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
                  <strong className="text-ink">{p.title}</strong>
                  <span className="text-xs text-slate">{p.date}</span>
                </div>
                <div className="text-sm text-ink/70">{[p.number, p.status].filter(Boolean).join(" — ")}</div>
                {p.description && (
                  <p className="mt-1 text-sm whitespace-pre-line text-ink/80">{p.description}</p>
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
                  <strong className="text-ink">{a.title}</strong>
                  <span className="text-xs text-slate">{a.year}</span>
                </div>
                {a.issuer && <div className="text-sm text-ink/70">{a.issuer}</div>}
                {a.description && (
                  <p className="mt-1 text-sm whitespace-pre-line text-ink/80">{a.description}</p>
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
                  <strong className="text-ink">{t.title}</strong>
                  <span className="text-xs text-slate">{t.dateRange}</span>
                </div>
                <div className="text-sm text-ink/70">{[t.role, t.institution].filter(Boolean).join(" — ")}</div>
                {t.description && (
                  <p className="mt-1 text-sm whitespace-pre-line text-ink/80">{t.description}</p>
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
                className="rounded-full border-[1.5px] border-plum/15 bg-cream px-4 py-1.5 text-sm font-medium text-plum"
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
        <SectionShell id="courses" title="Courses & Certifications" tone="white">
          <div className="space-y-6">
            {courseYears.map((year) => (
              <div key={year}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-coral" />
                  <strong className="text-plum">Year — {year}</strong>
                </div>
                <ul className="list-disc space-y-1 pl-8 text-[13.5px] text-ink/85">
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
                <strong className="text-ink">{r.name}</strong>
                <div className="text-sm text-ink/70">{[r.title, r.institution].filter(Boolean).join(" — ")}</div>
                <div className="mt-0.5 text-sm text-slate">{[r.email, r.phone].filter(Boolean).join("  |  ")}</div>
              </div>
            ))}
          </div>
        </CardSection>
      )}

      {/* CONTACT */}
      {sectionHasContent.contact && (
        <section id="contact" className="mx-auto max-w-4xl px-6 pb-16">
          <div className="flex flex-wrap gap-10 rounded-2xl bg-plum p-9 text-white">
            <div className="min-w-[240px] flex-1">
              <h3 className="mb-2.5 font-serif text-2xl font-normal">Get in Touch</h3>
              <p className="mb-4 text-sm text-white/75">
                Feel free to reach out about collaborations, opportunities, or research questions.
              </p>
              <div className="space-y-2 text-[13.5px]">
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

      <footer className="bg-cream py-8 text-center text-xs text-slate">
        © {new Date().getFullYear()} {profile.name || "Portfolio"}
      </footer>
    </div>
  );
}
