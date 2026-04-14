"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Max width Tailwind class, e.g. max-w-lg */
  className?: string;
  /** Panel inner class */
  panelClassName?: string;
  /** Hide built-in title row */
  hideTitleRow?: boolean;
};

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
  panelClassName,
  hideTitleRow,
}: DialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Tutup dialog"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title && !hideTitleRow ? titleId : undefined}
        className={cn(
          "relative z-[101] flex max-h-[90vh] w-full flex-col overflow-hidden rounded border border-[#d1d5db] bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]",
          className ?? "max-w-lg",
        )}
      >
        {!hideTitleRow && title ? (
          <div className="flex shrink-0 items-center justify-between px-8 pb-4 pt-8">
            <h2
              id={titleId}
              className="font-heading text-2xl font-extrabold tracking-tight text-[#1f2937]"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-2 text-[#1f2937] hover:bg-grey-bg"
              aria-label="Tutup"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ) : null}
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto",
            panelClassName,
            !hideTitleRow && title ? "px-0 pb-0 pt-0" : "",
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
