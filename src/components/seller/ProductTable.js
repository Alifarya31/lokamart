"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/Icon";
import StockBadge from "@/components/seller/StockBadge";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/images";
import { formatRupiah } from "@/lib/formatRupiah";

// `products` is the current page. The header checkbox selects/deselects every product on this page.
export default function ProductTable({ products, selectedIds, onToggle, onTogglePage, onDelete }) {
  const headerCheckboxRef = useRef(null);
  const selectedOnPage = products.filter((product) => selectedIds.has(product.id)).length;
  const allSelected = products.length > 0 && selectedOnPage === products.length;

  useEffect(() => {
    // "Some selected" state has no HTML attribute; it can only be set on the DOM node.
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = selectedOnPage > 0 && !allSelected;
    }
  }, [selectedOnPage, allSelected]);

  return (
    // `relative` keeps the absolutely positioned sr-only header labels inside the scroll area;
    // without it they escape the clipping and make the whole page scroll sideways on phones.
    <div className="relative overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-surface text-xs font-medium uppercase tracking-wider text-muted">
            <th scope="col" className="w-12 px-6 py-3.5 text-center">
              <input
                ref={headerCheckboxRef}
                type="checkbox"
                aria-label="Select all products on this page"
                checked={allSelected}
                disabled={products.length === 0}
                onChange={() => onTogglePage(!allSelected)}
                className="h-4 w-4 cursor-pointer rounded accent-primary"
              />
            </th>
            <th scope="col" className="w-16 px-2 py-3.5">
              <span className="sr-only">Image</span>
            </th>
            <th scope="col" className="px-4 py-3.5">Product name</th>
            <th scope="col" className="px-4 py-3.5">Category</th>
            <th scope="col" className="px-4 py-3.5">Price</th>
            <th scope="col" className="px-4 py-3.5">Stock</th>
            <th scope="col" className="px-6 py-3.5 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-muted">
                No products match your search.
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const selected = selectedIds.has(product.id);
              return (
                <tr
                  key={product.id}
                  className={`border-t border-line transition-colors ${selected ? "bg-primary/5" : "hover:bg-surface"}`}
                >
                  <td className="px-6 py-3.5 text-center">
                    <input
                      type="checkbox"
                      aria-label={`Select ${product.name}`}
                      checked={selected}
                      onChange={() => onToggle(product.id)}
                      className="h-4 w-4 cursor-pointer rounded accent-primary"
                    />
                  </td>
                  <td className="px-2 py-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element -- seller image URLs are arbitrary */}
                    <img
                      src={product.imageUrl || DEFAULT_PRODUCT_IMAGE}
                      alt=""
                      className="h-12 w-12 rounded-lg bg-surface object-cover shadow-card"
                    />
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-ink">{product.name}</td>
                  <td className="px-4 py-3.5">
                    <span className="whitespace-nowrap rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted">
                      {product.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 font-bold text-ink">{formatRupiah(product.price)}</td>
                  <td className="px-4 py-3.5">
                    <StockBadge stock={product.stock} />
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      type="button"
                      aria-label={`Delete ${product.name}`}
                      onClick={() => onDelete([product.id])}
                      className="rounded-lg p-1.5 text-muted transition-colors hover:bg-danger-soft hover:text-danger"
                    >
                      <Icon name="delete" className="h-[18px] w-[18px]" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
