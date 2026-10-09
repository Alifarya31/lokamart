import { render, screen } from "@testing-library/react";
import ProductCard from "@/components/ProductCard";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/images";

const product = {
  id: "abc123",
  name: "Matte Stoneware Dripper",
  price: 125000,
  imageUrl: "https://example.com/dripper.jpg",
};

describe("ProductCard", () => {
  it("shows the product name, image and price in Rupiah", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole("heading", { name: product.name })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: product.name })).toHaveAttribute("src", product.imageUrl);
    expect(screen.getByText(/Rp\s125\.000/)).toBeInTheDocument();
  });

  it("links to the product detail page", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/products/abc123");
  });

  it("accepts a custom link target", () => {
    render(<ProductCard product={product} href="/seller" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/seller");
  });

  it("falls back to the default image when the product has no image", () => {
    render(<ProductCard product={{ ...product, imageUrl: "" }} />);
    expect(screen.getByRole("img", { name: product.name })).toHaveAttribute("src", DEFAULT_PRODUCT_IMAGE);
  });
});
