export default function SectionShell({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-slate-200 py-14 first:border-t-0">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
