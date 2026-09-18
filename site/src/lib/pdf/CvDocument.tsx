import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { PublicData } from "../publicData";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1e293b" },
  headerRow: { flexDirection: "row", marginBottom: 16, alignItems: "center" },
  photo: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  title: { fontSize: 11, color: "#475569", marginTop: 2 },
  contactLine: { fontSize: 9, color: "#475569", marginTop: 4 },
  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    borderBottom: "1 solid #cbd5e1",
    paddingBottom: 3,
  },
  entry: { marginBottom: 8 },
  entryTitleRow: { flexDirection: "row", justifyContent: "space-between" },
  entryTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  entryMeta: { fontSize: 9, color: "#64748b" },
  entrySubtitle: { fontSize: 9.5, color: "#334155", marginTop: 1 },
  entryBody: { fontSize: 9.5, color: "#334155", marginTop: 2, lineHeight: 1.4 },
  pillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  pill: {
    fontSize: 9,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 4,
    marginBottom: 4,
  },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function CvDocument({ data }: { data: PublicData }) {
  const { profile } = data;
  const hasContact =
    data.isContactPublic && (profile.email || profile.phone || profile.location);

  return (
    <Document title={`${profile.name || "CV"} - CV`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          {data.isHeroPublic && profile.photoBase64 ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image, not an HTML img
            <Image src={profile.photoBase64} style={styles.photo} />
          ) : null}
          <View>
            <Text style={styles.name}>{profile.name || "Untitled"}</Text>
            {profile.title ? <Text style={styles.title}>{profile.title}</Text> : null}
            {hasContact ? (
              <Text style={styles.contactLine}>
                {[profile.email, profile.phone, profile.location].filter(Boolean).join("  |  ")}
              </Text>
            ) : null}
            {data.isHeroPublic ? (
              <Text style={styles.contactLine}>
                {[profile.linkedinUrl, profile.scholarUrl, profile.orcidUrl]
                  .filter(Boolean)
                  .join("  |  ")}
              </Text>
            ) : null}
          </View>
        </View>

        {data.isAboutPublic && profile.bio ? (
          <Section title="About">
            <Text style={styles.entryBody}>{profile.bio}</Text>
          </Section>
        ) : null}

        {data.education.length > 0 && (
          <Section title="Education">
            {data.education.map((e) => (
              <View key={e.id} style={styles.entry}>
                <View style={styles.entryTitleRow}>
                  <Text style={styles.entryTitle}>{e.degree}</Text>
                  <Text style={styles.entryMeta}>{e.dateRange}</Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {[e.institution, e.result].filter(Boolean).join(" — ")}
                </Text>
              </View>
            ))}
          </Section>
        )}

        {data.experience.length > 0 && (
          <Section title="Professional Experience">
            {data.experience.map((e) => (
              <View key={e.id} style={styles.entry}>
                <View style={styles.entryTitleRow}>
                  <Text style={styles.entryTitle}>{e.role}</Text>
                  <Text style={styles.entryMeta}>{e.dateRange}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{e.organization}</Text>
                {e.description ? <Text style={styles.entryBody}>{e.description}</Text> : null}
              </View>
            ))}
          </Section>
        )}

        {data.research.length > 0 && (
          <Section title="Doctoral Research / Key Research Summary">
            {data.research.map((r) => (
              <View key={r.id} style={styles.entry}>
                <View style={styles.entryTitleRow}>
                  <Text style={styles.entryTitle}>{r.title}</Text>
                  <Text style={styles.entryMeta}>{r.dateRange}</Text>
                </View>
                {r.description ? <Text style={styles.entryBody}>{r.description}</Text> : null}
              </View>
            ))}
          </Section>
        )}

        {data.publications.length > 0 && (
          <Section title="Publications">
            {data.publications.map((p) => (
              <View key={p.id} style={styles.entry}>
                <Text style={styles.entryTitle}>{p.title}</Text>
                <Text style={styles.entrySubtitle}>
                  {[p.authors, p.venue, p.year].filter(Boolean).join(" — ")}
                </Text>
                {p.doiOrLink ? <Text style={styles.entryMeta}>{p.doiOrLink}</Text> : null}
              </View>
            ))}
          </Section>
        )}

        {data.patents.length > 0 && (
          <Section title="Intellectual Property / Patents">
            {data.patents.map((p) => (
              <View key={p.id} style={styles.entry}>
                <View style={styles.entryTitleRow}>
                  <Text style={styles.entryTitle}>{p.title}</Text>
                  <Text style={styles.entryMeta}>{p.date}</Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {[p.number, p.status].filter(Boolean).join(" — ")}
                </Text>
                {p.description ? <Text style={styles.entryBody}>{p.description}</Text> : null}
              </View>
            ))}
          </Section>
        )}

        {data.awards.length > 0 && (
          <Section title="Awards & Honors">
            {data.awards.map((a) => (
              <View key={a.id} style={styles.entry}>
                <View style={styles.entryTitleRow}>
                  <Text style={styles.entryTitle}>{a.title}</Text>
                  <Text style={styles.entryMeta}>{a.year}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{a.issuer}</Text>
                {a.description ? <Text style={styles.entryBody}>{a.description}</Text> : null}
              </View>
            ))}
          </Section>
        )}

        {data.skills.length > 0 && (
          <Section title="Skills">
            <View style={styles.pillsWrap}>
              {data.skills.map((s) => (
                <Text key={s.id} style={styles.pill}>
                  {s.name}
                </Text>
              ))}
            </View>
          </Section>
        )}

        {data.teaching.length > 0 && (
          <Section title="Teaching & Academic Service">
            {data.teaching.map((t) => (
              <View key={t.id} style={styles.entry}>
                <View style={styles.entryTitleRow}>
                  <Text style={styles.entryTitle}>{t.title}</Text>
                  <Text style={styles.entryMeta}>{t.dateRange}</Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {[t.role, t.institution].filter(Boolean).join(" — ")}
                </Text>
                {t.description ? <Text style={styles.entryBody}>{t.description}</Text> : null}
              </View>
            ))}
          </Section>
        )}

        {data.courses.length > 0 && (
          <Section title="Courses & Certifications">
            {data.courses.map((c) => (
              <View key={c.id} style={styles.entry}>
                <View style={styles.entryTitleRow}>
                  <Text style={styles.entryTitle}>{c.title}</Text>
                  <Text style={styles.entryMeta}>{c.year}</Text>
                </View>
                {c.provider ? <Text style={styles.entrySubtitle}>{c.provider}</Text> : null}
              </View>
            ))}
          </Section>
        )}

        {data.languages.length > 0 && (
          <Section title="Languages">
            <View style={styles.pillsWrap}>
              {data.languages.map((l) => (
                <Text key={l.id} style={styles.pill}>
                  {l.name}
                  {l.proficiency ? ` — ${l.proficiency}` : ""}
                </Text>
              ))}
            </View>
          </Section>
        )}

        {data.references.length > 0 && (
          <Section title="References">
            {data.references.map((r) => (
              <View key={r.id} style={styles.entry}>
                <Text style={styles.entryTitle}>{r.name}</Text>
                <Text style={styles.entrySubtitle}>
                  {[r.title, r.institution].filter(Boolean).join(" — ")}
                </Text>
                <Text style={styles.entryMeta}>
                  {[r.email, r.phone].filter(Boolean).join("  |  ")}
                </Text>
              </View>
            ))}
          </Section>
        )}
      </Page>
    </Document>
  );
}
