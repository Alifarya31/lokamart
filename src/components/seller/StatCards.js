import Icon from "@/components/Icon";
import { formatRupiah } from "@/lib/formatRupiah";
import { getInventoryStats, LOW_STOCK_LIMIT } from "@/lib/stock";

export default function StatCards({ products }) {
  const { inStock, lowStock, inventoryValue } = getInventoryStats(products);

  const cards = [
    { label: "In stock", value: inStock, icon: "check_circle", tile: "bg-primary/10 text-primary" },
    {
      label: "Low stock",
      hint: `${LOW_STOCK_LIMIT} units or fewer`,
      value: lowStock,
      icon: "warning",
      tile: "bg-warning-soft text-warning",
      valueClass: lowStock > 0 ? "text-warning" : "",
    },
    { label: "Inventory value", value: formatRupiah(inventoryValue), icon: "payments", tile: "bg-[#9cf2e8] text-primary" },
  ];

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-card">
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wider text-muted">
              {card.label}
              {card.hint && <span className="sr-only"> ({card.hint})</span>}
            </dt>
            <dd className={`mt-1 truncate text-xl font-bold text-ink ${card.valueClass ?? ""}`}>{card.value}</dd>
          </div>
          <span aria-hidden="true" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.tile}`}>
            <Icon name={card.icon} />
          </span>
        </div>
      ))}
    </dl>
  );
}
