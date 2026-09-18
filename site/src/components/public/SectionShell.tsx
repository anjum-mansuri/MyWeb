export default function SectionShell({
  id,
  title,
  tone = "cream",
  children,
}: {
  id: string;
  title?: string;
  tone?: "cream" | "white";
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-16 ${tone === "white" ? "bg-white" : "bg-cream"}`}>
      <div className="mx-auto max-w-4xl px-6 py-14">
        {title && (
          <h2 className="mb-5 font-serif text-2xl font-normal text-plum sm:text-[26px]">{title}</h2>
        )}
        {children}
      </div>
    </section>
  );
}

export function CardBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(61,38,69,0.06)]">
      <h3 className="mb-3.5 font-serif text-xl font-normal text-plum">{title}</h3>
      {children}
    </div>
  );
}

/** A single card floating on the cream page background, no full-width section tint. */
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
