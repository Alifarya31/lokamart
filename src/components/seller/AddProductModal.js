"use client";

import { useId, useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";
import { validateProduct } from "@/lib/validation";

const EMPTY_FORM = { name: "", category: "", price: "", stock: "", description: "", imageFile: null, imagePreview: "" };

const fieldClass = (error) =>
  `w-full rounded-xl border bg-white px-3.5 text-sm text-ink placeholder:text-muted transition-shadow focus:outline-none focus:ring-[3px] ${
    error ? "border-danger bg-danger-soft focus:ring-danger/20" : "border-line focus:border-primary focus:ring-primary/12"
  }`;

function FieldError({ id, message }) {
  return message ? (
    <p id={id} className="text-xs text-danger">
      {message}
    </p>
  ) : null;
}

// Section c "Add new product". onSave receives { name, category, price, stock, description, imageFile, imageUrl }
// with price/stock as numbers. imageUrl is "" when no image was chosen, so the default image is shown.
export default function AddProductModal({ open, onClose, onSave }) {
  const ids = { image: useId(), category: useId(), description: useId() };
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const reset = () => {
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    setForm({ ...form, imageFile: file, imagePreview: URL.createObjectURL(file) });
  };

  const removeImage = () => {
    URL.revokeObjectURL(form.imagePreview);
    setForm({ ...form, imageFile: null, imagePreview: "" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateProduct(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSave({
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
      imageFile: form.imageFile,
      imageUrl: form.imagePreview,
    });
    // Keep the preview URL alive: the saved product now displays it.
    setForm(EMPTY_FORM);
    setErrors({});
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      icon="add"
      title="Add new product"
      description="Fill in the details below to list a product in your store."
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-product-form">
            <Icon name="check" className="h-[18px] w-[18px]" />
            Save product
          </Button>
        </>
      }
    >
      <form id="add-product-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink">Product image</span>
          {form.imagePreview ? (
            <div className="flex items-center gap-4 rounded-xl bg-surface p-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
              <img src={form.imagePreview} alt="Selected product image" className="h-16 w-16 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{form.imageFile?.name}</p>
                <button type="button" onClick={removeImage} className="text-xs font-semibold text-danger hover:underline">
                  Remove image
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor={ids.image}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl bg-surface p-6 text-center transition-colors hover:bg-line/60 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20"
            >
              <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-card">
                <Icon name="photo_camera" className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-ink">Upload product image</span>
              <span className="text-xs text-muted">Optional. Without an image, a default image is shown.</span>
              <input id={ids.image} type="file" accept="image/*" onChange={handleImage} className="sr-only" />
            </label>
          )}
        </div>

        <Input
          label="Product name"
          placeholder="e.g. Matte Stoneware Dripper"
          value={form.name}
          onChange={updateField("name")}
          error={errors.name}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor={ids.category} className="text-xs font-medium text-ink">
            Category
          </label>
          <div className="relative">
            <select
              id={ids.category}
              value={form.category}
              onChange={updateField("category")}
              aria-invalid={errors.category ? true : undefined}
              aria-describedby={errors.category ? `${ids.category}-error` : undefined}
              className={`h-11 cursor-pointer appearance-none pr-10 ${fieldClass(errors.category)}`}
            >
              <option value="">Select a category</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Icon name="keyboard_arrow_down" className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          </div>
          <FieldError id={`${ids.category}-error`} message={errors.category} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Price (Rp)"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            icon="payments"
            placeholder="125000"
            value={form.price}
            onChange={updateField("price")}
            error={errors.price}
          />
          <Input
            label="Units in stock"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            icon="inventory_2"
            placeholder="10"
            value={form.stock}
            onChange={updateField("stock")}
            error={errors.stock}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={ids.description} className="text-xs font-medium text-ink">
            Product description
          </label>
          <textarea
            id={ids.description}
            rows={4}
            placeholder="Describe materials, dimensions and care instructions"
            value={form.description}
            onChange={updateField("description")}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? `${ids.description}-error` : undefined}
            className={`resize-none py-3 ${fieldClass(errors.description)}`}
          />
          <FieldError id={`${ids.description}-error`} message={errors.description} />
        </div>
      </form>
    </Modal>
  );
}
