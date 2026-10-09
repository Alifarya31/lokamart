import { getStockStatus } from "@/lib/stock";

const STYLES = {
  in: { badge: "bg-primary/10 text-primary", dot: "bg-primary" },
  low: { badge: "bg-warning-soft text-warning", dot: "bg-warning" },
  out: { badge: "bg-danger-soft text-danger", dot: "bg-danger" },
};

export const stockLabel = (stock) => {
  const status = getStockStatus(stock);
  if (status === "out") return "Out of stock";
  if (status === "low") return `${stock} left`;
  return `${stock} in stock`;
};

export default function StockBadge({ stock }) {
  const style = STYLES[getStockStatus(stock)];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {stockLabel(stock)}
    </span>
  );
}
