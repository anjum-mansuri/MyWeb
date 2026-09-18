const BARS = Array.from({ length: 60 }, (_, i) =>
  Math.round(8 + 28 * Math.abs(Math.sin(i * 0.7)) + 12 * Math.abs(Math.sin(i * 0.5))),
);
const DOUBLED = [...BARS, ...BARS];

export default function WaveformRibbon() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60px] overflow-hidden opacity-35">
      <div className="animate-wave flex w-[200%] items-end gap-[5px]">
        {DOUBLED.map((h, i) => (
          <div key={i} className="w-[3px] shrink-0 rounded-sm bg-coral" style={{ height: h }} />
        ))}
      </div>
    </div>
  );
}
