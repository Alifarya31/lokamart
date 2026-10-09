"use client";

import { useEffect, useId, useRef } from "react";
import Icon from "@/components/Icon";

const SIZES = { md: "max-w-lg", lg: "max-w-2xl" };
const ICON_TONES = { primary: "bg-primary text-white", danger: "bg-danger text-white" };

// Optional `icon` + `tone` add the icon tile next to the title (Stitch modal header); `size="lg"` for forms.
export default function Modal({ open, onClose, title, description, icon, tone = "primary", size = "md", children, footer }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    dialogRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        // Clicks inside the dialog must not reach the backdrop's onClose.
        onClick={(event) => event.stopPropagation()}
        className={`flex max-h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-modal focus:outline-none ${SIZES[size]}`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div className="flex items-start gap-3">
            {icon && (
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ICON_TONES[tone]}`}>
                <Icon name={icon} />
              </span>
            )}
            <div>
              <h2 id={titleId} className="text-xl font-semibold text-ink">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="mt-1 text-sm text-muted">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-4 text-sm text-muted">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 bg-surface px-6 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
