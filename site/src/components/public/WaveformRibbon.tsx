const BARS = Array.from({ length: 70 }, (_, i) =>
  Math.round(10 + 46 * Math.abs(Math.sin(i * 0.7)) + 18 * Math.abs(Math.sin(i * 0.5))),
);
const DOUBLED = [...BARS, ...BARS];

export default function WaveformRibbon({ tall = false }: { tall?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden opacity-60 ${tall ? "h-[140px]" : "h-[60px]"}`}
    >
      <div className="animate-wave flex w-[200%] items-end gap-[6px]">
        {DOUBLED.map((h, i) => (
          <div
            key={i}
            className="w-[3px] shrink-0 rounded-sm bg-gradient-to-t from-gold to-gold-light"
            style={{ height: h }}
          />
        ))}
      </div>
    </div>
  );
}
