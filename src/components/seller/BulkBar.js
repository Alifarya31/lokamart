import Icon from "@/components/Icon";

// Appears when at least one product is selected (multi-delete, section c "Delete product").
export default function BulkBar({ count, onDeselectAll, onDelete }) {
  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-label="Bulk actions"
      className="flex items-center justify-between gap-4 rounded-xl bg-ink px-6 py-3 text-white shadow-modal"
    >
      <span className="flex items-center gap-2 text-sm font-bold">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#9cf2e8]" />
        {count} selected
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDeselectAll}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Deselect all
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 rounded-lg bg-danger px-3.5 py-1.5 text-xs font-semibold text-white shadow-card transition-colors hover:bg-danger/90"
        >
          <Icon name="delete" className="h-[18px] w-[18px]" />
          Delete ({count})
        </button>
      </div>
    </div>
  );
}
