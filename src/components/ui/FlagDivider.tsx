/** A thin rule in the three colours of the logo. */
export default function FlagDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-1.5 ${className}`} aria-hidden="true">
      <i className="h-1 flex-1 rounded-full bg-brand-sky" />
      <i className="h-1 flex-1 rounded-full bg-brand-red" />
      <i className="h-1 flex-1 rounded-full bg-brand-green" />
    </div>
  );
}
