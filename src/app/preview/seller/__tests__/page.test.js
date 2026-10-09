import { fireEvent, render, screen, within } from "@testing-library/react";
import SellerDashboardPreview from "@/app/preview/seller/page";
import { MOCK_PRODUCTS } from "@/app/preview/seller/mockProducts";

const rows = () => within(screen.getByRole("region", { name: "Products" })).getAllByRole("row").slice(1);
const rowNames = () => rows().map((row) => row.cells[2].textContent);
const total = () => screen.getByText(/total products$/).textContent;

beforeEach(() => render(<SellerDashboardPreview />));

describe("Seller dashboard preview (mock data)", () => {
  it("uses 24 mock products and shows the first 10", () => {
    expect(MOCK_PRODUCTS).toHaveLength(24);
    expect(total()).toBe("24 total products");
    expect(rows()).toHaveLength(10);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveTextContent("Showing 1 to 10 of 24 products");
  });

  it("paginates 10 per page", () => {
    fireEvent.click(screen.getByRole("button", { name: "Page 3" }));
    expect(rows()).toHaveLength(4);
    expect(rowNames()[0]).toBe(MOCK_PRODUCTS[20].name);
  });

  it("searches by product name (case-insensitive) and returns to page 1", () => {
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search by product name" }), { target: { value: "LINEN" } });

    expect(rowNames()).toEqual(["Organic Linen Overshirt", "Stonewashed Linen Duvet"]);
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
  });

  it("filters by category", () => {
    fireEvent.change(screen.getByRole("combobox", { name: "Category" }), { target: { value: "Workspace" } });
    expect(rowNames()).toEqual(MOCK_PRODUCTS.filter((p) => p.category === "Workspace").map((p) => p.name));
  });

  it("shows the empty state when nothing matches", () => {
    fireEvent.change(screen.getByRole("searchbox", { name: "Search by product name" }), { target: { value: "zzz" } });
    expect(screen.getByText("No products match your search.")).toBeInTheDocument();
  });

  it("shows the bulk bar for selected rows and deselects all", () => {
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all products on this page" }));
    expect(screen.getByText("10 selected")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Deselect all" }));
    expect(screen.queryByRole("region", { name: "Bulk actions" })).not.toBeInTheDocument();
  });

  it("deletes several selected products after confirmation, without reloading", () => {
    fireEvent.click(screen.getByRole("checkbox", { name: `Select ${MOCK_PRODUCTS[0].name}` }));
    fireEvent.click(screen.getByRole("checkbox", { name: `Select ${MOCK_PRODUCTS[1].name}` }));
    fireEvent.click(screen.getByRole("button", { name: "Delete (2)" }));

    const dialog = screen.getByRole("dialog", { name: "Delete 2 products?" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete 2 products" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(total()).toBe("22 total products");
    expect(screen.queryByText(MOCK_PRODUCTS[0].name)).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Bulk actions" })).not.toBeInTheDocument();
  });

  it("keeps products when deletion is cancelled", () => {
    fireEvent.click(screen.getByRole("button", { name: `Delete ${MOCK_PRODUCTS[0].name}` }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Cancel" }));
    expect(total()).toBe("24 total products");
    expect(screen.getByText(MOCK_PRODUCTS[0].name)).toBeInTheDocument();
  });

  it("moves back a page when the last product on the last page is deleted", () => {
    fireEvent.click(screen.getByRole("button", { name: "Page 3" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all products on this page" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete (4)" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Delete 4 products" }));

    expect(screen.queryByRole("button", { name: "Page 3" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
    expect(rows()).toHaveLength(10);
  });

  it("adds a product to the top of the list with the default image and updated stats", () => {
    fireEvent.change(screen.getByRole("searchbox", { name: "Search by product name" }), { target: { value: "linen" } });
    fireEvent.click(screen.getByRole("button", { name: "Add Product" }));

    // The filter bar also has a "Category" control, so query inside the dialog.
    const dialog = within(screen.getByRole("dialog", { name: "Add new product" }));
    fireEvent.change(dialog.getByLabelText("Product name"), { target: { value: "Linen Tote Bag" } });
    fireEvent.change(dialog.getByLabelText("Category"), { target: { value: "Textiles" } });
    fireEvent.change(dialog.getByLabelText("Price (Rp)"), { target: { value: "159000" } });
    fireEvent.change(dialog.getByLabelText("Units in stock"), { target: { value: "7" } });
    fireEvent.change(dialog.getByLabelText("Product description"), { target: { value: "Washed linen tote." } });
    fireEvent.click(dialog.getByRole("button", { name: "Save product" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(total()).toBe("25 total products");
    // Filters are cleared so the new product is visible as the first row.
    expect(screen.getByRole("searchbox", { name: "Search by product name" })).toHaveValue("");
    expect(rowNames()[0]).toBe("Linen Tote Bag");
    expect(rows()[0].querySelector("img")).toHaveAttribute("src", "/images/default-product.svg");
    expect(within(rows()[0]).getByText("7 left")).toBeInTheDocument();
  });
});
