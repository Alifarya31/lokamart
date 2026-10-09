"use client";

import Header from "@/components/Header";
import RequireRole from "@/components/RequireRole";
import { useAuth } from "@/contexts/AuthContext";

// Every page in this folder is customer only: /dashboard, /products/[id], /cart, /orders.
export default function CustomerLayout({ children }) {
  const { logout } = useAuth();

  return (
    <RequireRole role="customer">
      <Header role="customer" onLogout={logout} />
      {children}
    </RequireRole>
  );
}
