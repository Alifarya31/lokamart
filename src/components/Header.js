"use client";

import Link from "next/link";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import { getDashboardPath } from "@/lib/routes";

const navLinkClass =
  "flex h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-ink";

export default function Header({ role, cartCount = 0, onLogout }) {
  const homeHref = getDashboardPath(role);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white shadow-card">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-6 px-4 md:h-20 md:px-6">
        <Link href={homeHref} aria-label="LokaMart home" className="rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
          <Logo />
        </Link>

        <nav className="flex items-center gap-2">
          {role === "customer" && (
            <>
              <Link href="/orders" className={navLinkClass}>
                Orders
              </Link>
              <Link href="/cart" className={`${navLinkClass} border border-line text-ink`}>
                <Icon name="shopping_bag" />
                Cart
                {cartCount > 0 && (
                  <span
                    aria-label={`${cartCount} items in cart`}
                    className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}
          <Button variant="ghost" onClick={onLogout}>
            Log out
          </Button>
        </nav>
      </div>
    </header>
  );
}
