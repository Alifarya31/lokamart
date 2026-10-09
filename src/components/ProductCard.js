import Link from "next/link";
import { formatRupiah } from "@/lib/formatRupiah";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/images";

export default function ProductCard({ product, href = `/products/${product.id}` }) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-line bg-white p-2 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
    >
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-surface">
        {/* Plain <img>: product images are arbitrary seller URLs, which next/image would need whitelisted. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || DEFAULT_PRODUCT_IMAGE}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2 p-2">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{product.name}</h3>
        <p className="text-base font-semibold text-ink">{formatRupiah(product.price)}</p>
      </div>
    </Link>
  );
}
