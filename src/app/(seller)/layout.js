"use client";

import Header from "@/components/Header";
import RequireRole from "@/components/RequireRole";
import { useAuth } from "@/contexts/AuthContext";

// Every page in this folder is seller only: /seller.
export default function SellerLayout({ children }) {
  const { logout } = useAuth();

  return (
    <RequireRole role="seller">
      <Header role="seller" onLogout={logout} />
      {children}
    </RequireRole>
  );
}
