import { fireEvent, render, screen, within } from "@testing-library/react";
import AddProductModal from "@/components/seller/AddProductModal";
import DeleteConfirmModal from "@/components/seller/DeleteConfirmModal";

beforeAll(() => {
  // jsdom has no object URLs.
  URL.createObjectURL = jest.fn(() => "blob:preview-image");
  URL.revokeObjectURL = jest.fn();
});

const fillValid = () => {
  fireEvent.change(screen.getByLabelText("Product name"), { target: { value: " Linen Tote Bag " } });
  fireEvent.change(screen.getByLabelText("Category"), { target: { value: "Textiles" } });
  fireEvent.change(screen.getByLabelText("Price (Rp)"), { target: { value: "159000" } });
  fireEvent.change(screen.getByLabelText("Units in stock"), { target: { value: "7" } });
  fireEvent.change(screen.getByLabelText("Product description"), { target: { value: "Washed linen tote." } });
};

const save = () => fireEvent.click(screen.getByRole("button", { name: "Save product" }));

describe("AddProductModal", () => {
  it("renders nothing when closed", () => {
    render(<AddProductModal open={false} onClose={() => {}} onSave={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows every validation error and does not save an empty form", () => {
    const onSave = jest.fn();
    render(<AddProductModal open onClose={() => {}} onSave={onSave} />);
    save();

    expect(screen.getByLabelText("Product name")).toHaveAccessibleDescription(/more than 5 characters/);
    expect(screen.getByLabelText("Category")).toHaveAccessibleDescription("Select a category");
    expect(screen.getByLabelText("Price (Rp)")).toHaveAccessibleDescription("Price must be greater than 0");
    expect(screen.getByLabelText("Units in stock")).toHaveAccessibleDescription(/greater than 0/);
    expect(screen.getByLabelText("Product description")).toHaveAccessibleDescription("Enter a product description");
    expect(onSave).not.toHaveBeenCalled();
  });

  it("saves a valid product with numbers and an empty imageUrl when no image was chosen", () => {
    const onSave = jest.fn();
    render(<AddProductModal open onClose={() => {}} onSave={onSave} />);
    fillValid();
    save();

    expect(onSave).toHaveBeenCalledWith({
      name: "Linen Tote Bag",
      category: "Textiles",
      price: 159000,
      stock: 7,
      description: "Washed linen tote.",
      imageFile: null,
      imageUrl: "",
    });
  });

  it("previews a chosen image, saves it, and can remove it", () => {
    const onSave = jest.fn();
    render(<AddProductModal open onClose={() => {}} onSave={onSave} />);
    const file = new File(["img"], "tote.jpg", { type: "image/jpeg" });

    fireEvent.change(screen.getByLabelText(/Upload product image/), { target: { files: [file] } });
    expect(screen.getByRole("img", { name: "Selected product image" })).toHaveAttribute("src", "blob:preview-image");
    expect(screen.getByText("tote.jpg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remove image" }));
    expect(screen.queryByRole("img", { name: "Selected product image" })).not.toBeInTheDocument();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview-image");

    fireEvent.change(screen.getByLabelText(/Upload product image/), { target: { files: [file] } });
    fillValid();
    save();
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ imageFile: file, imageUrl: "blob:preview-image" }));
  });

  it("clears the form when cancelled", () => {
    const onClose = jest.fn();
    const { rerender } = render(<AddProductModal open onClose={onClose} onSave={() => {}} />);
    fillValid();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(<AddProductModal open onClose={onClose} onSave={() => {}} />);
    expect(screen.getByLabelText("Product name")).toHaveValue("");
  });

  it("offers every shared category", () => {
    render(<AddProductModal open onClose={() => {}} onSave={() => {}} />);
    expect(within(screen.getByLabelText("Category")).getAllByRole("option")).toHaveLength(7);
  });
});

describe("DeleteConfirmModal", () => {
  const products = [
    { id: "a", name: "Matte Stoneware Dripper", price: 185000, stock: 42 },
    { id: "b", name: "Organic Linen Overshirt", price: 465000, stock: 3 },
  ];

  it("lists the products to delete with price and stock", () => {
    render(<DeleteConfirmModal open products={products} onCancel={() => {}} onConfirm={() => {}} />);
    const dialog = screen.getByRole("dialog", { name: "Delete 2 products?" });
    expect(within(dialog).getByText("Matte Stoneware Dripper")).toBeInTheDocument();
    expect(within(dialog).getByText(/Rp\s465\.000 · 3 left/)).toBeInTheDocument();
  });

  it("uses singular wording for one product", () => {
    render(<DeleteConfirmModal open products={[products[0]]} onCancel={() => {}} onConfirm={() => {}} />);
    expect(screen.getByRole("dialog", { name: "Delete 1 product?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete 1 product" })).toBeInTheDocument();
  });

  it("confirms or cancels", () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    render(<DeleteConfirmModal open products={products} onCancel={onCancel} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: "Delete 2 products" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
