import { render, screen } from "@testing-library/react";
import Logo from "@/components/Logo";

describe("Logo", () => {
  it("shows the logo mark next to the LokaMart wordmark", () => {
    const { container } = render(<Logo />);
    expect(screen.getByTestId("logo-mark")).toHaveAttribute("aria-hidden", "true");
    expect(container).toHaveTextContent("LokaMart");
  });
});
