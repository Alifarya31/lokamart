import Link from "next/link";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";

const navItemClass = "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors";

// Seller navigation from the Stitch dashboard. Only "Products" exists in the requirements.
// On small screens it collapses into a top bar.
export default function SellerSidebar({ productsHref = "/seller", onLogout }) {
  const logoutButton = (
    <button
      type="button"
      onClick={onLogout}
      className={`${navItemClass} w-full text-muted hover:bg-danger-soft hover:text-danger`}
    >
      <Icon name="logout" />
      Log out
    </button>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between bg-white py-6 shadow-card lg:flex">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1 px-6">
            <Logo />
            <span className="pl-10 text-xs font-medium text-muted">Seller Hub</span>
          </div>
          <nav aria-label="Seller" className="flex flex-col gap-1 px-3">
            <Link href={productsHref} aria-current="page" className={`${navItemClass} bg-primary text-white shadow-card`}>
              <Icon name="inventory_2" />
              Products
            </Link>
          </nav>
        </div>
        <div className="px-3">{logoutButton}</div>
      </aside>

      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
        <Logo />
        <div>{logoutButton}</div>
      </div>
    </>
  );
}
