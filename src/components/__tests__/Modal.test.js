import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "@/components/Modal";

const renderModal = (props = {}) => {
  const onClose = jest.fn();
  render(
    <Modal open onClose={onClose} title="Delete 3 products?" footer={<button>Confirm</button>} {...props}>
      This action cannot be undone.
    </Modal>
  );
  return { onClose };
};

describe("Modal", () => {
  it("renders nothing when closed", () => {
    renderModal({ open: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an accessible dialog with title, content and footer when open", () => {
    renderModal();
    const dialog = screen.getByRole("dialog", { name: "Delete 3 products?" });
    expect(dialog).toHaveTextContent("This action cannot be undone.");
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("closes from the close button", () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", () => {
    const { onClose } = renderModal();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on a backdrop click but not on a click inside the dialog", () => {
    const { onClose } = renderModal();
    const dialog = screen.getByRole("dialog");

    fireEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(dialog.parentElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("Modal header options", () => {
  it("shows a description that describes the dialog, and an icon tile", () => {
    const { container } = render(
      <Modal open onClose={() => {}} title="Delete 2 products?" description="This cannot be undone." icon="delete_forever" tone="danger">
        Body
      </Modal>
    );
    expect(screen.getByRole("dialog", { name: "Delete 2 products?" })).toHaveAccessibleDescription("This cannot be undone.");
    expect(container.querySelector('[data-icon="delete_forever"]').parentElement).toHaveClass("bg-danger");
  });

  it("uses the wide size for forms", () => {
    render(
      <Modal open onClose={() => {}} title="Add new product" size="lg">
        Body
      </Modal>
    );
    expect(screen.getByRole("dialog")).toHaveClass("max-w-2xl");
  });
});
