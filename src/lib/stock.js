// 1–10 units counts as low stock (matches the Stitch seller dashboard badges).
export const LOW_STOCK_LIMIT = 10;

export const getStockStatus = (stock) => {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK_LIMIT) return "low";
  return "in";
};

// Numbers for the seller dashboard stat cards. Out-of-stock products count as low stock.
export const getInventoryStats = (products) => ({
  inStock: products.filter((product) => getStockStatus(product.stock) === "in").length,
  lowStock: products.filter((product) => getStockStatus(product.stock) !== "in").length,
  inventoryValue: products.reduce((total, product) => total + product.price * product.stock, 0),
});
