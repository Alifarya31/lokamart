"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/AuthContext";
import { validateLogin } from "@/lib/validation";
import { getDashboardPath } from "@/lib/routes";

const NOT_REGISTERED = {
  title: "Incorrect email or password",
  message: "Check your details, or register for a new account.",
};

// Firebase returns invalid-credential for both unknown emails and wrong passwords.
const FIREBASE_ERRORS = {
  "auth/invalid-credential": NOT_REGISTERED,
  "auth/user-not-found": NOT_REGISTERED,
  "auth/wrong-password": NOT_REGISTERED,
  "auth/invalid-email": NOT_REGISTERED,
  "auth/too-many-requests": {
    title: "Too many attempts",
    message: "Your account is temporarily locked. Try again in a few minutes.",
  },
  "auth/network-request-failed": {
    title: "Network error",
    message: "Check your connection and try again.",
  },
};

const UNKNOWN_ERROR = { title: "Something went wrong", message: "Please try again." };

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Editing a field clears its error; the full form is validated again on submit.
  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    const validationErrors = validateLogin(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const role = await login(form);
      router.replace(getDashboardPath(role));
    } catch (error) {
      setSubmitError(FIREBASE_ERRORS[error.code] ?? UNKNOWN_ERROR);
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Curated autumn edition"
      badgeAside="Est. 2024"
      eyebrow="Intentional craft"
      headline="Elevated goods for intentional spaces."
      text="Discover responsibly made objects, handcrafted ceramics, and timeless essentials shaped by local ateliers worldwide."
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
    >
      {submitError && (
        <div role="alert" className="flex items-start gap-3 rounded-xl bg-danger-soft p-3.5">
          <Icon name="error" className="mt-0.5 h-5 w-5 text-danger" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-ink">{submitError.title}</p>
            <p className="mt-0.5 text-xs text-muted">{submitError.message}</p>
          </div>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setSubmitError(null)}
            className="-mr-1 -mt-1 rounded-lg p-1 text-muted transition-colors hover:text-ink"
          >
            <Icon name="close" className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          icon="mail"
          autoComplete="email"
          placeholder="name@domain.com"
          value={form.email}
          onChange={updateField("email")}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          icon="lock"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={form.password}
          onChange={updateField("password")}
          error={errors.password}
          labelAside={
            <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-hover">
              Forgot password?
            </Link>
          }
        />

        <label className="flex cursor-pointer select-none items-center gap-2 self-start">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(event) => setForm({ ...form, remember: event.target.checked })}
            className="h-4 w-4 cursor-pointer rounded accent-primary"
          />
          <span className="text-xs text-muted">Keep me signed in</span>
        </label>

        <Button type="submit" disabled={submitting} className="group mt-2 w-full">
          {submitting ? "Logging in..." : "Log in"}
          {!submitting && (
            <Icon name="arrow_forward" className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="inline-flex items-center gap-0.5 font-semibold text-primary hover:text-primary-hover"
        >
          Register
          <Icon name="north_east" className="h-3.5 w-3.5" />
        </Link>
      </p>
    </AuthLayout>
  );
}
