"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageSkeleton from "@/components/PageSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/routes";

// Access control (CLAUDE.md): not logged in → /login, logged in with the wrong role → own dashboard.
// Shows a skeleton until access is confirmed (and while redirecting), so protected content never flashes.
export default function RequireRole({ role, children }) {
  const router = useRouter();
  const { user, role: userRole, loading } = useAuth();

  // Wait for Firebase, and for the role of a freshly signed-in user.
  const ready = !loading && (!user || userRole);
  const allowed = ready && user && userRole === role;

  useEffect(() => {
    if (!ready || allowed) return;
    router.replace(user ? getDashboardPath(userRole) : "/login");
  }, [ready, allowed, user, userRole, router]);

  return allowed ? children : <PageSkeleton />;
}
