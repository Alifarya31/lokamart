import { formatRupiah } from "@/lib/formatRupiah";

// Intl inserts a non-breaking space after "Rp"; normalize it for readable assertions.
const format = (value) => formatRupiah(value).replace(/ /g, " ");

describe("formatRupiah", () => {
  it("formats a number as Rupiah with dot thousand separators", () => {
    expect(format(125000)).toBe("Rp 125.000");
  });

  it("drops decimals", () => {
    expect(format(1999.6)).toBe("Rp 2.000");
  });

  it("formats zero", () => {
    expect(format(0)).toBe("Rp 0");
  });
});
