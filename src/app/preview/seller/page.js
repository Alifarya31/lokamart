"use client";

// TEMPORARY UI-only preview of the seller dashboard with mock data (no Firebase).
// Deleted together with src/app/preview before submission. The real page is /seller.

import { useMemo, useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import AddProductModal from "@/components/seller/AddProductModal";
import BulkBar from "@/components/seller/BulkBar";
import DeleteConfirmModal from "@/components/seller/DeleteConfirmModal";
import Pagination from "@/components/seller/Pagination";
import ProductFilters from "@/components/seller/ProductFilters";
import ProductTable from "@/components/seller/ProductTable";
import SellerSidebar from "@/components/seller/SellerSidebar";
import StatCards from "@/components/seller/StatCards";
import { MOCK_PRODUCTS, MOCK_SELLER_ID } from "./mockProducts";

const PAGE_SIZE = 10;

export default function SellerDashboardPreview() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter(
      (product) =>
        (!query || product.name.toLowerCase().includes(query)) && (!category || product.category === category)
    );
  }, [products, search, category]);

  // Clamp instead of storing: deleting the last rows of the last page moves back a page automatically.
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageProducts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pendingDeleteProducts = products.filter((product) => pendingDeleteIds.includes(product.id));

  // Changing the search or filter starts at page 1 and clears the selection, so hidden rows are never deleted.
  const changeFilters = (update) => {
    update();
    setPage(1);
    setSelectedIds(new Set());
  };

  const toggleOne = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const togglePage = (select) => {
    const next = new Set(selectedIds);
    pageProducts.forEach((product) => (select ? next.add(product.id) : next.delete(product.id)));
    setSelectedIds(next);
  };

  const saveProduct = (data) => {
    const { imageFile: _imageFile, ...fields } = data;
    const product = {
      ...fields,
      id: `local-${Date.now()}`,
      sellerId: MOCK_SELLER_ID,
      createdAt: new Date().toISOString(),
    };
    setProducts([product, ...products]);
    setAddOpen(false);
    // Show the new product: newest first, so it is the first row of page 1 with no filters.
    setSearch("");
    setCategory("");
    setPage(1);
  };

  const confirmDelete = () => {
    setProducts(products.filter((product) => !pendingDeleteIds.includes(product.id)));
    setSelectedIds(new Set([...selectedIds].filter((id) => !pendingDeleteIds.includes(id))));
    setPendingDeleteIds([]);
  };

  return (
    <div className="flex-1 bg-surface">
      <SellerSidebar productsHref="/preview/seller" onLogout={() => {}} />

      <main className="lg:pl-64">
        <div className="mx-auto flex max-w-content flex-col gap-6 px-4 pb-12 pt-8 md:px-8">
          <p className="self-start rounded-full bg-danger-soft px-3 py-1 text-xs font-medium text-danger">
            Preview with sample data. Changes are not saved.
          </p>

          <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Catalog management</p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-ink">My Products</h1>
                <span className="rounded-full bg-line px-2.5 py-1 text-xs font-semibold text-ink">
                  {products.length} total products
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">Manage your inventory, stock levels and listings.</p>
            </div>
            <Button onClick={() => setAddOpen(true)} className="self-start lg:self-auto">
              <Icon name="add" />
              Add Product
            </Button>
          </header>

          <StatCards products={products} />

          <ProductFilters
            search={search}
            onSearchChange={(value) => changeFilters(() => setSearch(value))}
            category={category}
            onCategoryChange={(value) => changeFilters(() => setCategory(value))}
          />

          <BulkBar
            count={selectedIds.size}
            onDeselectAll={() => setSelectedIds(new Set())}
            onDelete={() => setPendingDeleteIds([...selectedIds])}
          />

          <section aria-label="Products" className="overflow-hidden rounded-xl bg-white shadow-card">
            <ProductTable
              products={pageProducts}
              selectedIds={selectedIds}
              onToggle={toggleOne}
              onTogglePage={togglePage}
              onDelete={setPendingDeleteIds}
            />
            <Pagination page={currentPage} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
          </section>
        </div>
      </main>

      <AddProductModal open={addOpen} onClose={() => setAddOpen(false)} onSave={saveProduct} />
      <DeleteConfirmModal
        open={pendingDeleteIds.length > 0}
        products={pendingDeleteProducts}
        onCancel={() => setPendingDeleteIds([])}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
