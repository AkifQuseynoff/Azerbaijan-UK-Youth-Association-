/** "Happening now": a red dot with a calm glow, and the words for anyone who cannot see the dot. */
export default function LiveBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-brand-red/10 px-3 py-1 font-label text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-red-dark ${className}`}>
      <i className="live-dot" aria-hidden="true" />
      Happening now
    </span>
  );
}
