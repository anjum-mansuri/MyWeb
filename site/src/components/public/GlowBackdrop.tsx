export default function GlowBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-glow absolute -top-32 -right-24 h-[500px] w-[500px] rounded-full opacity-40 blur-[100px]"
        style={{ background: "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full opacity-25 blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--color-gold-light) 0%, transparent 70%)" }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
        <defs>
          <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 42" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" className="text-cream" />
      </svg>
    </div>
  );
}
