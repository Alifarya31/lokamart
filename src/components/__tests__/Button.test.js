import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/Button";

describe("Button", () => {
  it("renders its label and defaults to type=button", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("uses the primary style by default and the danger style for destructive actions", () => {
    render(
      <>
        <Button>Save</Button>
        <Button variant="danger">Delete</Button>
      </>
    );
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("bg-primary");
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("bg-danger");
  });

  it("supports type=submit for forms", () => {
    render(<Button type="submit">Log in</Button>);
    expect(screen.getByRole("button", { name: "Log in" })).toHaveAttribute("type", "submit");
  });
});
