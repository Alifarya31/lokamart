// Shown by RequireRole while auth is loading or a redirect is on its way, instead of a blank screen.
// Mirrors the Header and a page heading + card grid; purely decorative except for the status label.
export default function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="flex flex-1 flex-col">
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 md:h-20 md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-surface" />
            <div className="h-5 w-24 animate-pulse rounded-md bg-surface" />
          </div>
          <div className="h-9 w-24 animate-pulse rounded-xl bg-surface" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-content flex-1 px-4 py-10 md:px-6">
        <div className="h-7 w-56 animate-pulse rounded-md bg-surface" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-md bg-surface" />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}
