import Icon from "@/components/Icon";

const pageButtonClass = "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs transition-colors";

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-4 border-t border-line bg-white px-6 py-4 sm:flex-row"
    >
      <p className="text-sm text-muted">
        Showing <span className="font-semibold text-ink">{first}</span> to{" "}
        <span className="font-semibold text-ink">{last}</span> of{" "}
        <span className="font-semibold text-ink">{total}</span> products
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={`${pageButtonClass} text-muted hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-40`}
        >
          <Icon name="chevron_left" className="h-[18px] w-[18px]" />
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            type="button"
            aria-label={`Page ${number}`}
            aria-current={number === page ? "page" : undefined}
            onClick={() => onPageChange(number)}
            className={`${pageButtonClass} ${
              number === page ? "bg-primary font-bold text-white shadow-card" : "text-muted hover:bg-surface hover:text-ink"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className={`${pageButtonClass} text-muted hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-40`}
        >
          <Icon name="chevron_right" className="h-[18px] w-[18px]" />
        </button>
      </div>
    </nav>
  );
}
