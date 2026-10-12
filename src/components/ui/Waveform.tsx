/** A decorative waveform in the logo colours. It is not a player; screen readers skip it. */
export default function Waveform({ className = "" }: { className?: string }) {
  const bars = Array.from({ length: 36 }, (_, i) => 0.22 + 0.78 * Math.abs(Math.sin(i * 0.72) * Math.cos(i * 0.27)));
  const colour = (i: number) => (i < 12 ? "#6ea2e6" : i < 24 ? "#ee6a60" : "#6fbf80");
  return (
    <div className={`flex h-16 items-center gap-[3px] ${className}`} aria-hidden="true">
      {bars.map((h, i) => (
        <i key={i} className="min-w-[2px] flex-1 rounded-[3px]" style={{ height: `${h * 100}%`, background: colour(i), opacity: 0.85 }} />
      ))}
    </div>
  );
}
