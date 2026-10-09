import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";

describe("Header", () => {
  it("shows Cart and Orders links for a customer, with the logo linking to the customer dashboard", () => {
    render(<Header role="customer" />);
    expect(screen.getByRole("link", { name: "LokaMart home" })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: /Cart/ })).toHaveAttribute("href", "/cart");
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute("href", "/orders");
  });

  it("shows the cart item count when the cart is not empty", () => {
    render(<Header role="customer" cartCount={3} />);
    expect(screen.getByLabelText("3 items in cart")).toHaveTextContent("3");
  });

  it("hides the cart count when the cart is empty", () => {
    render(<Header role="customer" cartCount={0} />);
    expect(screen.queryByLabelText(/items in cart/)).not.toBeInTheDocument();
  });

  it("hides customer links for a seller and links the logo to the seller dashboard", () => {
    render(<Header role="seller" />);
    expect(screen.getByRole("link", { name: "LokaMart home" })).toHaveAttribute("href", "/seller");
    expect(screen.queryByRole("link", { name: /Cart/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Orders" })).not.toBeInTheDocument();
  });

  it("calls onLogout when Log out is clicked", () => {
    const onLogout = jest.fn();
    render(<Header role="seller" onLogout={onLogout} />);
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});

describe("Header visuals", () => {
  it("shows the logo mark and a cart icon", () => {
    const { container } = render(<Header role="customer" />);
    expect(screen.getByTestId("logo-mark")).toBeInTheDocument();
    expect(container.querySelector('a[href="/cart"] [data-icon="shopping_bag"]')).toBeInTheDocument();
  });
});
