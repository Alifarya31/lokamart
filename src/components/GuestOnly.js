"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/routes";

// For /login and /register: a logged-in user is sent to their own dashboard.
// Guests see the page right away, even while Firebase is still checking the session.
export default function GuestOnly({ children }) {
  const router = useRouter();
  const { user, role } = useAuth();
  const loggedIn = Boolean(user && role);

  useEffect(() => {
    if (loggedIn) router.replace(getDashboardPath(role));
  }, [loggedIn, role, router]);

  return loggedIn ? null : children;
}
