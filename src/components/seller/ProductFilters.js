"use client";

import { useId } from "react";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";

// Search by product name + category filter (section c "View product").
export default function ProductFilters({ search, onSearchChange, category, onCategoryChange }) {
  const categoryId = useId();

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-card md:flex-row md:items-center md:justify-between">
      <Input
        type="search"
        icon="search"
        aria-label="Search by product name"
        placeholder="Search by product name"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="w-full md:max-w-md"
      />
      <div className="relative">
        <label htmlFor={categoryId} className="sr-only">
          Category
        </label>
        <select
          id={categoryId}
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-line bg-white pl-3.5 pr-10 text-sm font-medium text-ink transition-shadow focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/12 md:w-56"
        >
          <option value="">All categories</option>
          {PRODUCT_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Icon name="keyboard_arrow_down" className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      </div>
    </div>
  );
}
