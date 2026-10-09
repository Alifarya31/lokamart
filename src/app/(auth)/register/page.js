"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/AuthContext";
import { validateRegister } from "@/lib/validation";
import { getDashboardPath } from "@/lib/routes";

const ROLE_OPTIONS = [
  { value: "customer", title: "Customer", description: "Shop products and track your orders", icon: "shopping_bag" },
  { value: "seller", title: "Seller", description: "Open your store and sell products", icon: "storefront" },
];

const FIREBASE_ERRORS = {
  "auth/email-already-in-use": "This email is already registered. Log in instead.",
  "auth/invalid-email": "Enter a valid email address",
  "auth/weak-password": "Password must be at least 6 characters",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ role: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Editing a field clears its error; the full form is validated again on submit.
  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const validationErrors = validateRegister(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const role = await register(form);
      router.replace(getDashboardPath(role));
    } catch (error) {
      setSubmitError(FIREBASE_ERRORS[error.code] ?? "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Join the collective"
      eyebrow="Fair exchange · Authentic origin"
      headline="Crafted for conscious buyers and independent makers."
      title="Create your account"
      subtitle="Choose your account type and enter your details below"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <fieldset>
          <legend className="sr-only">Account type</legend>
          <div className="grid grid-cols-2 gap-4">
            {ROLE_OPTIONS.map((option) => {
              const selected = form.role === option.value;
              return (
                <label
                  key={option.value}
                  className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20 ${
                    selected
                      ? "border-primary bg-primary/5"
                      : errors.role
                        ? "border-danger hover:bg-surface"
                        : "border-line hover:bg-surface"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={selected}
                    onChange={updateField("role")}
                    aria-describedby={errors.role ? "role-error" : undefined}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full ${
                      selected ? "bg-primary text-white" : "border border-line text-transparent"
                    }`}
                  >
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  <span
                    className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg ${
                      selected ? "bg-white text-primary shadow-card" : "bg-surface text-muted"
                    }`}
                  >
                    <Icon name={option.icon} />
                  </span>
                  <span className="text-base font-semibold text-ink">{option.title}</span>
                  <span className="mt-0.5 text-xs leading-snug text-muted">{option.description}</span>
                </label>
              );
            })}
          </div>
          {errors.role && (
            <p id="role-error" className="mt-1.5 text-xs text-danger">
              {errors.role}
            </p>
          )}
        </fieldset>

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
          autoComplete="new-password"
          placeholder="Create a password"
          value={form.password}
          onChange={updateField("password")}
          error={errors.password}
        />
        <Input
          label="Confirm password"
          type="password"
          icon="lock_reset"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={updateField("confirmPassword")}
          error={errors.confirmPassword}
        />

        {submitError && (
          <p role="alert" className="rounded-xl border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
            {submitError}
          </p>
        )}

        <Button type="submit" disabled={submitting} className="group mt-2 w-full">
          {submitting ? "Creating account..." : "Create account"}
          {!submitting && (
            <Icon name="arrow_forward" className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
