import { fireEvent, render, screen, within } from "@testing-library/react";
import BulkBar from "@/components/seller/BulkBar";
import Pagination from "@/components/seller/Pagination";
import SellerSidebar from "@/components/seller/SellerSidebar";
import StatCards from "@/components/seller/StatCards";
import StockBadge from "@/components/seller/StockBadge";

describe("StockBadge", () => {
  it.each([
    [42, "42 in stock", "text-primary"],
    [10, "10 left", "text-warning"],
    [1, "1 left", "text-warning"],
    [0, "Out of stock", "text-danger"],
  ])("stock %p shows %p", (stock, label, colorClass) => {
    render(<StockBadge stock={stock} />);
    expect(screen.getByText(label)).toHaveClass(colorClass);
  });
});

describe("SellerSidebar", () => {
  it("shows the logo, Products as the current page and a Log out button", () => {
    const onLogout = jest.fn();
    render(<SellerSidebar productsHref="/preview/seller" onLogout={onLogout} />);

    const nav = screen.getByRole("navigation", { name: "Seller" });
    expect(within(nav).getByRole("link", { name: "Products" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Products" })).toHaveAttribute("href", "/preview/seller");
    expect(screen.getAllByTestId("logo-mark").length).toBeGreaterThan(0);

    // Desktop sidebar and mobile top bar each have a Log out button.
    fireEvent.click(screen.getAllByRole("button", { name: "Log out" })[0]);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("links Products to /seller by default and shows no other menu items", () => {
    render(<SellerSidebar onLogout={() => {}} />);
    const nav = screen.getByRole("navigation", { name: "Seller" });
    expect(within(nav).getAllByRole("link")).toHaveLength(1);
    expect(within(nav).getByRole("link")).toHaveAttribute("href", "/seller");
  });
});

describe("StatCards", () => {
  it("shows in stock, low stock and inventory value in Rupiah computed from the products", () => {
    render(
      <StatCards
        products={[
          { price: 100000, stock: 20 },
          { price: 50000, stock: 4 },
          { price: 25000, stock: 0 },
        ]}
      />
    );
    const value = (label) => screen.getByText(label, { exact: false }).closest("div").querySelector("dd");
    expect(value("In stock")).toHaveTextContent("1");
    expect(value("Low stock")).toHaveTextContent("2");
    expect(value("Inventory value").textContent.replace(/ /g, " ")).toBe("Rp 2.200.000");
  });
});

describe("BulkBar", () => {
  it("is hidden when nothing is selected", () => {
    render(<BulkBar count={0} onDeselectAll={() => {}} onDelete={() => {}} />);
    expect(screen.queryByRole("region", { name: "Bulk actions" })).not.toBeInTheDocument();
  });

  it("shows the count and wires Deselect all and Delete (N)", () => {
    const onDeselectAll = jest.fn();
    const onDelete = jest.fn();
    render(<BulkBar count={3} onDeselectAll={onDeselectAll} onDelete={onDelete} />);

    expect(screen.getByText("3 selected")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Deselect all" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete (3)" }));
    expect(onDeselectAll).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});

describe("Pagination", () => {
  it("shows the visible range and marks the current page", () => {
    render(<Pagination page={2} pageSize={10} total={24} onPageChange={() => {}} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveTextContent("Showing 11 to 20 of 24 products");
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByRole("button", { name: /^Page \d$/ })).toHaveLength(3);
  });

  it("disables Previous on the first page and Next on the last page", () => {
    const { rerender } = render(<Pagination page={1} pageSize={10} total={24} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();

    rerender(<Pagination page={3} pageSize={10} total={24} onPageChange={() => {}} />);
    expect(screen.getByRole("navigation")).toHaveTextContent("Showing 21 to 24 of 24 products");
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("requests the clicked, previous and next page", () => {
    const onPageChange = jest.fn();
    render(<Pagination page={2} pageSize={10} total={24} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Page 3" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange.mock.calls).toEqual([[3], [1], [3]]);
  });

  it("handles an empty result", () => {
    render(<Pagination page={1} pageSize={10} total={0} onPageChange={() => {}} />);
    expect(screen.getByRole("navigation")).toHaveTextContent("Showing 0 to 0 of 0 products");
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });
});
