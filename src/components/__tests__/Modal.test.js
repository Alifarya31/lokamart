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
