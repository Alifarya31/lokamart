import { render, screen, fireEvent } from "@testing-library/react";
import Input from "@/components/Input";

describe("Input", () => {
  it("links the label to the input", () => {
    render(<Input label="Email address" type="email" />);
    expect(screen.getByLabelText("Email address")).toHaveAttribute("type", "email");
  });

  it("calls onChange with the typed value", () => {
    const onChange = jest.fn();
    render(<Input label="Email address" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "user@lokamart.id" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe("user@lokamart.id");
  });

  it("shows an error message and marks the input invalid", () => {
    render(<Input label="Email address" error="Email is required" />);
    const input = screen.getByLabelText("Email address");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Email is required");
  });

  it("is not marked invalid without an error", () => {
    render(<Input label="Email address" />);
    expect(screen.getByLabelText("Email address")).not.toHaveAttribute("aria-invalid");
  });
});

describe("Input icon and password toggle", () => {
  it("shows the given icon inside the field", () => {
    const { container } = render(<Input label="Email address" icon="mail" />);
    expect(container.querySelector('[data-icon="mail"]')).toBeInTheDocument();
  });

  it("shows no toggle on non-password fields", () => {
    render(<Input label="Email address" type="email" />);
    expect(screen.queryByRole("button", { name: /password/i })).not.toBeInTheDocument();
  });

  it("toggles a password field between hidden and visible", () => {
    render(<Input label="Password" type="password" defaultValue="secret123" />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveValue("secret123");

    fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("does not submit the form when the toggle is clicked", () => {
    const onSubmit = jest.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Input label="Password" type="password" />
      </form>
    );
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("Input labelAside", () => {
  it("shows extra content on the label row without changing the label", () => {
    render(<Input label="Password" type="password" labelAside={<a href="/forgot-password">Forgot password?</a>} />);
    expect(screen.getByRole("link", { name: "Forgot password?" })).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });
});
