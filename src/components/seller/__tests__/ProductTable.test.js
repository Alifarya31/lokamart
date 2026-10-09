import { fireEvent, render, screen, within } from "@testing-library/react";
import ProductFilters from "@/components/seller/ProductFilters";
import ProductTable from "@/components/seller/ProductTable";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/images";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";

const products = [
  { id: "a", name: "Matte Stoneware Dripper", category: "Tableware", price: 185000, stock: 42, imageUrl: "/a.jpg" },
  { id: "b", name: "Rattan Pendant Shade", category: "Home & Living", price: 610000, stock: 0, imageUrl: "" },
];

const renderTable = (props = {}) => {
  const handlers = { onToggle: jest.fn(), onTogglePage: jest.fn(), onDelete: jest.fn() };
  render(<ProductTable products={products} selectedIds={new Set()} {...handlers} {...props} />);
  return handlers;
};

describe("ProductTable", () => {
  it("shows image, name, category, price in Rupiah and stock badge for each product", () => {
    renderTable();
    const row = screen.getByRole("row", { name: /Matte Stoneware Dripper/ });
    expect(within(row).getByText("Tableware")).toBeInTheDocument();
    expect(within(row).getByText(/Rp\s185\.000/)).toBeInTheDocument();
    expect(within(row).getByText("42 in stock")).toBeInTheDocument();
    expect(row.querySelector("img")).toHaveAttribute("src", "/a.jpg");
  });

  it("shows the default image for a product without an image", () => {
    renderTable();
    const row = screen.getByRole("row", { name: /Rattan Pendant Shade/ });
    expect(row.querySelector("img")).toHaveAttribute("src", DEFAULT_PRODUCT_IMAGE);
    expect(within(row).getByText("Out of stock")).toBeInTheDocument();
  });

  it("toggles a single row", () => {
    const { onToggle } = renderTable();
    fireEvent.click(screen.getByRole("checkbox", { name: "Select Rattan Pendant Shade" }));
    expect(onToggle).toHaveBeenCalledWith("b");
  });

  it("reflects selection and selects or deselects the whole page from the header checkbox", () => {
    const { onTogglePage } = renderTable({ selectedIds: new Set(["a"]) });
    const header = screen.getByRole("checkbox", { name: "Select all products on this page" });

    expect(screen.getByRole("checkbox", { name: "Select Matte Stoneware Dripper" })).toBeChecked();
    expect(header).not.toBeChecked();
    expect(header).toHaveProperty("indeterminate", true);

    fireEvent.click(header);
    expect(onTogglePage).toHaveBeenCalledWith(true);
  });

  it("deselects the page when every row on it is selected", () => {
    const { onTogglePage } = renderTable({ selectedIds: new Set(["a", "b"]) });
    const header = screen.getByRole("checkbox", { name: "Select all products on this page" });
    expect(header).toBeChecked();

    fireEvent.click(header);
    expect(onTogglePage).toHaveBeenCalledWith(false);
  });

  it("asks to delete a single product from its row icon", () => {
    const { onDelete } = renderTable();
    fireEvent.click(screen.getByRole("button", { name: "Delete Matte Stoneware Dripper" }));
    expect(onDelete).toHaveBeenCalledWith(["a"]);
  });

  it("shows an empty state when no products match", () => {
    renderTable({ products: [] });
    expect(screen.getByText("No products match your search.")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Select all products on this page" })).toBeDisabled();
  });
});

describe("ProductFilters", () => {
  it("reports search text and category changes, with every shared category as an option", () => {
    const onSearchChange = jest.fn();
    const onCategoryChange = jest.fn();
    render(
      <ProductFilters search="" onSearchChange={onSearchChange} category="" onCategoryChange={onCategoryChange} />
    );

    fireEvent.change(screen.getByRole("searchbox", { name: "Search by product name" }), { target: { value: "linen" } });
    expect(onSearchChange).toHaveBeenCalledWith("linen");

    const select = screen.getByRole("combobox", { name: "Category" });
    expect(within(select).getAllByRole("option").map((o) => o.textContent)).toEqual([
      "All categories",
      ...PRODUCT_CATEGORIES,
    ]);
    fireEvent.change(select, { target: { value: "Textiles" } });
    expect(onCategoryChange).toHaveBeenCalledWith("Textiles");
  });
});
