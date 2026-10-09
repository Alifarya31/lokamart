"use client";

// TEMPORARY: visual review of shared components. Delete the whole src/app/preview folder before submission.

import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";

// Inline sample image so the preview works offline and needs no extra files.
const SAMPLE_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#d6e9e6"/><circle cx="200" cy="210" r="90" fill="#0f766e"/><rect x="150" y="90" width="100" height="40" rx="12" fill="#115e59"/></svg>'
  );

const PRODUCTS = [
  { id: "p1", name: "Matte Stoneware Dripper", price: 125000, imageUrl: SAMPLE_IMAGE },
  { id: "p2", name: "No image uploaded (default image)", price: 89000, imageUrl: "" },
  {
    id: "p3",
    name: "Very long product name that should be clamped to two lines so the grid stays aligned",
    price: 2450000,
    imageUrl: SAMPLE_IMAGE,
  },
  { id: "p4", name: "Linen Napkin Set", price: 1500, imageUrl: SAMPLE_IMAGE },
];

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="rounded-xl border border-line bg-white p-6">{children}</div>
    </section>
  );
}

function Label({ children }) {
  return <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{children}</p>;
}

export default function PreviewPage() {
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState(null);
  const closeModal = () => setModal(null);

  return (
    <div className="flex-1 bg-surface pb-16">
      <div className="bg-danger-soft px-4 py-2 text-center text-xs font-medium text-danger">
        Temporary component preview, delete before submission
      </div>

      <div className="mx-auto flex max-w-content flex-col gap-10 px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Shared components</h1>

        <Section title="Header">
          <div className="flex flex-col gap-6">
            {[
              ["Customer, 3 items in cart", { role: "customer", cartCount: 3 }],
              ["Customer, empty cart", { role: "customer", cartCount: 0 }],
              ["Seller", { role: "seller" }],
            ].map(([label, props]) => (
              <div key={label}>
                <Label>{label}</Label>
                {/* Wrapper keeps the sticky header inside its demo box. */}
                <div className="overflow-hidden rounded-xl border border-line">
                  <Header {...props} onLogout={() => {}} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Button">
          <div className="flex flex-col gap-6">
            <div>
              <Label>Variants</Label>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
            <div>
              <Label>Disabled</Label>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Primary</Button>
                <Button variant="secondary" disabled>Secondary</Button>
                <Button variant="ghost" disabled>Ghost</Button>
                <Button variant="danger" disabled>Danger</Button>
              </div>
            </div>
            <div>
              <Label>Full width (className)</Label>
              <Button className="w-full max-w-sm">Log in</Button>
            </div>
          </div>
        </Section>

        <Section title="Input">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Default (type to try focus)"
              placeholder="name@domain.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input label="Filled" defaultValue="customer@lokamart.id" />
            <Input label="Error" defaultValue="user@invalid" error="Invalid email format" />
            <Input label="Disabled" defaultValue="Can't edit" disabled />
            <Input label="Password" type="password" defaultValue="secret123" />
            <Input placeholder="Without label" aria-label="Without label" />
          </div>
        </Section>

        <Section title="Modal">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setModal("basic")}>
              Open basic modal
            </Button>
            <Button variant="danger" onClick={() => setModal("delete")}>
              Open delete confirmation
            </Button>
            <Button variant="secondary" onClick={() => setModal("long")}>
              Open long content
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted">Close with ×, Escape, or a click on the backdrop.</p>
        </Section>

        <Section title="ProductCard">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} href="/preview" />
            ))}
          </div>
        </Section>
      </div>

      <Modal open={modal === "basic"} onClose={closeModal} title="Basic modal">
        A modal with a title and body, without a footer.
      </Modal>

      <Modal
        open={modal === "delete"}
        onClose={closeModal}
        title="Delete 3 products?"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={closeModal}>
              Delete 3 products
            </Button>
          </>
        }
      >
        This action cannot be undone. The selected products will be removed from your store.
      </Modal>

      <Modal
        open={modal === "long"}
        onClose={closeModal}
        title="Long content"
        footer={<Button onClick={closeModal}>Done</Button>}
      >
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className="mb-3">
            Paragraph {i + 1}. The body scrolls while the title and footer stay in place.
          </p>
        ))}
      </Modal>
    </div>
  );
}
