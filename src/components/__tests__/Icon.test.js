import { render } from "@testing-library/react";
import Icon from "@/components/Icon";

describe("Icon", () => {
  it("renders the named Material Symbol as a decorative svg", () => {
    const { container } = render(<Icon name="mail" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("data-icon", "mail");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg.querySelector("path").getAttribute("d")).toMatch(/^M140-160/);
  });

  it("uses currentColor so text color classes apply", () => {
    const { container } = render(<Icon name="check" className="h-4 w-4 text-primary" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("fill", "currentColor");
    expect(svg).toHaveClass("h-4", "w-4", "text-primary");
  });
});
