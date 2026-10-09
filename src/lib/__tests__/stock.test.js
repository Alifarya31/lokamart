import { getInventoryStats, getStockStatus, LOW_STOCK_LIMIT } from "@/lib/stock";

describe("stock helpers", () => {
  it("treats 1–10 units as low stock, 0 as out of stock and more as in stock", () => {
    expect(LOW_STOCK_LIMIT).toBe(10);
    expect(getStockStatus(0)).toBe("out");
    expect(getStockStatus(1)).toBe("low");
    expect(getStockStatus(10)).toBe("low");
    expect(getStockStatus(11)).toBe("in");
  });

  it("computes the dashboard stats, counting out-of-stock products as low stock", () => {
    const products = [
      { price: 100000, stock: 20 },
      { price: 50000, stock: 5 },
      { price: 75000, stock: 0 },
      { price: 10000, stock: 11 },
    ];
    expect(getInventoryStats(products)).toEqual({
      inStock: 2,
      lowStock: 2,
      inventoryValue: 100000 * 20 + 50000 * 5 + 10000 * 11,
    });
  });

  it("handles an empty product list", () => {
    expect(getInventoryStats([])).toEqual({ inStock: 0, lowStock: 0, inventoryValue: 0 });
  });
});
