// Logo mark redrawn from the Stitch header logo (teal tile, white "L", mint dot) so it stays sharp at any size.
export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" data-testid="logo-mark" className="h-8 w-8 shrink-0">
        <rect width="40" height="40" rx="10" className="fill-primary" />
        <path d="M13 11h5v13h10v5H13z" fill="#ffffff" />
        <circle cx="27" cy="14" r="3.5" fill="#9cf2e8" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-ink">
        Loka<span className="text-primary">Mart</span>
      </span>
    </span>
  );
}
