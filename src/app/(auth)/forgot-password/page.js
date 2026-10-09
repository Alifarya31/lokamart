"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/AuthContext";
import { validateEmail } from "@/lib/validation";

// Approved extra (CLAUDE.md). The success message is the same whether or not the email is registered,
// so this page never reveals which emails have an account.
const SENT_MESSAGE = "If an account exists for this email, a reset link has been sent.";

// "No such account" must look exactly like success, or the page would reveal which emails are registered.
const ACCOUNT_NOT_FOUND = ["auth/user-not-found", "auth/invalid-email"];

// Other errors say nothing about the account, so they are safe to show; the user should retry.
const RETRY_ERRORS = {
  "auth/too-many-requests": "Too many attempts. Try again in a few minutes.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};
const UNKNOWN_ERROR = "Something went wrong. Please try again.";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const validationError = validateEmail(email);
    setError(validationError);
    if (validationError) return;

    setSending(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      if (ACCOUNT_NOT_FOUND.includes(err.code)) setSent(true);
      else setSubmitError(RETRY_ERRORS[err.code] ?? UNKNOWN_ERROR);
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthLayout
      badge="Curated autumn edition"
      badgeAside="Est. 2024"
      eyebrow="Intentional craft"
      headline="Elevated goods for intentional spaces."
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to reset your password"
    >
      {sent ? (
        <div role="status" className="flex items-start gap-3 rounded-xl bg-primary/5 p-3.5">
          <Icon name="mark_email_read" className="mt-0.5 h-5 w-5 text-primary" />
          <p className="text-sm text-ink">{SENT_MESSAGE}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Email address"
            type="email"
            icon="mail"
            autoComplete="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError("");
            }}
            error={error}
          />

          {submitError && (
            <p role="alert" className="rounded-xl border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
              {submitError}
            </p>
          )}

          <Button type="submit" disabled={sending} className="mt-2 w-full">
            {sending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      )}

      <Link
        href="/login"
        className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
      >
        <Icon name="arrow_back" className="h-4 w-4" />
        Back to log in
      </Link>
    </AuthLayout>
  );
}
