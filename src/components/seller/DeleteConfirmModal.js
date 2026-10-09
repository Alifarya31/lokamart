"use client";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import { stockLabel } from "@/components/seller/StockBadge";
import { formatRupiah } from "@/lib/formatRupiah";

// Confirmation before deleting one or more products (section c "Delete product").
export default function DeleteConfirmModal({ open, products, onCancel, onConfirm }) {
  const count = products.length;
  const noun = count === 1 ? "product" : "products";

  return (
    <Modal
      open={open}
      onClose={onCancel}
      icon="delete_forever"
      tone="danger"
      title={`Delete ${count} ${noun}?`}
      description={`This cannot be undone. The ${noun} will be removed from your store.`}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            <Icon name="delete" className="h-[18px] w-[18px]" />
            Delete {count} {noun}
          </Button>
        </>
      }
    >
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Selected {noun}</p>
      <ul className="flex max-h-56 flex-col gap-2 overflow-y-auto rounded-xl bg-surface p-3">
        {products.map((product) => (
          <li key={product.id} className="flex items-center justify-between gap-4 rounded-lg bg-white p-2 shadow-card">
            <span className="truncate font-semibold text-ink">{product.name}</span>
            <span className="shrink-0 text-xs text-muted">
              {formatRupiah(product.price)} · {stockLabel(product.stock)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center gap-2 rounded-xl bg-surface p-3 text-xs text-muted">
        <Icon name="info" className="h-5 w-5 text-primary" />
        Orders that customers already placed keep their copy of these products.
      </p>
    </Modal>
  );
}
