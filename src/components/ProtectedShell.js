"use client";

import Header from "@/components/Header";
import RequireRole from "@/components/RequireRole";
import { useAuth } from "@/contexts/AuthContext";

// Client part of the (customer) and (seller) layouts: role check + Header.
// Kept separate so the layouts themselves stay Server Components (needed for `export const instant`).
export default function ProtectedShell({ role, children }) {
  const { logout } = useAuth();

  return (
    <RequireRole role={role}>
      <Header role={role} onLogout={logout} />
      {children}
    </RequireRole>
  );
}
