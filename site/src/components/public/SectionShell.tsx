export default function SectionShell({
  id,
  title,
  tone = "ink",
  children,
}: {
  id: string;
  title?: string;
  tone?: "ink" | "surface";
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-16 ${tone === "surface" ? "bg-surface" : "bg-ink"}`}>
      <div className="mx-auto max-w-4xl px-6 py-16">
        {title && (
          <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-cream sm:text-[28px]">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

export function CardBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-cream/10 bg-surface p-6">
      <h3 className="mb-4 font-display text-xl font-bold text-cream">{title}</h3>
      {children}
    </div>
  );
}

/** A single card floating on the page background, no full-width section tint. */
export function CardSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 mx-auto max-w-4xl px-6 pb-10">
      <CardBlock title={title}>{children}</CardBlock>
    </section>
  );
}
