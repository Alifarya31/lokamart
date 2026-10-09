"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/routes";

// "/" has no content: guests go to /login, logged-in users to their own dashboard.
export default function Home() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  // Wait for Firebase, and for the role of a freshly signed-in user.
  const ready = !loading && (!user || role);

  useEffect(() => {
    if (ready) router.replace(user ? getDashboardPath(role) : "/login");
  }, [ready, user, role, router]);

  return null;
}
