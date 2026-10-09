"use client";

import { useId, useState } from "react";
import Icon from "@/components/Icon";

// `icon` is an optional Icon name shown inside the field.
// `labelAside` is shown at the right of the label row (e.g. a "Forgot password?" link).
// Password fields automatically get a show/hide toggle.
export default function Input({ label, labelAside, error, id, icon, type = "text", className = "", ...props }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label || labelAside) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label htmlFor={inputId} className="text-xs font-medium text-ink">
              {label}
            </label>
          )}
          {labelAside}
        </div>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className={`pointer-events-none absolute left-3 ${error ? "text-danger" : "text-muted"}`}>
            <Icon name={icon} />
          </span>
        )}
        <input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink placeholder:text-muted transition-shadow focus:outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted ${
            icon ? "pl-10" : ""
          } ${isPassword ? "pr-11" : ""} ${
            error
              ? "border-danger bg-danger-soft focus:ring-danger/20"
              : "border-line focus:border-primary focus:ring-primary/12"
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-controls={inputId}
            className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <Icon name={showPassword ? "visibility_off" : "visibility"} />
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
