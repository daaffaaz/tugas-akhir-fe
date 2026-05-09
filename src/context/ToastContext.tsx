"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number; // ms
  undoAction?: () => void;
}

interface ToastContextValue {
  toasts: Toast[];
  success: (message: string, opts?: ToastOptions) => void;
  error: (message: string, opts?: ToastOptions) => void;
  info: (message: string, opts?: ToastOptions) => void;
  warning: (message: string, opts?: ToastOptions) => void;
  dismiss: (id: string) => void;
}

interface ToastOptions {
  duration?: number;
  undoAction?: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

let globalDismiss: ((id: string) => void) | null = null;

export function toast(message: string, opts?: ToastOptions & { variant?: ToastVariant }) {
  // These are registered by the provider on mount
  const variant = opts?.variant ?? "info";
  const id = `toast-${Date.now()}-${Math.random()}`;
  // We dispatch a custom event; the provider listens
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("toast:add", { detail: { id, message, variant, ...opts } }),
    );
  }
  return id;
}

toast.success = (msg: string, opts?: ToastOptions) =>
  toast(msg, { ...opts, variant: "success" });
toast.error = (msg: string, opts?: ToastOptions) =>
  toast(msg, { ...opts, variant: "error" });
toast.info = (msg: string, opts?: ToastOptions) =>
  toast(msg, { ...opts, variant: "info" });
toast.warning = (msg: string, opts?: ToastOptions) =>
  toast(msg, { ...opts, variant: "warning" });
toast.dismiss = (id: string) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("toast:dismiss", { detail: { id } }));
  }
};

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  // Listen to custom events from the toast() helper
  useEffect(() => {
    const addHandler = (e: Event) => {
      const { id, message, variant, duration = 3500, undoAction } = (
        e as CustomEvent
      ).detail as Toast & { duration?: number };
      setToasts((prev) => [...prev, { id, message, variant, duration, undoAction }]);
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    };

    const dismissHandler = (e: Event) => {
      const { id } = (e as CustomEvent).detail as { id: string };
      dismiss(id);
    };

    window.addEventListener("toast:add", addHandler);
    window.addEventListener("toast:dismiss", dismissHandler);
    return () => {
      window.removeEventListener("toast:add", addHandler);
      window.removeEventListener("toast:dismiss", dismissHandler);
    };
  }, [dismiss]);

  const success = useCallback((msg: string, opts?: ToastOptions) => toast.success(msg, opts), []);
  const error = useCallback((msg: string, opts?: ToastOptions) => toast.error(msg, opts), []);
  const info = useCallback((msg: string, opts?: ToastOptions) => toast.info(msg, opts), []);
  const warning = useCallback((msg: string, opts?: ToastOptions) => toast.warning(msg, opts), []);

  return (
    <ToastContext.Provider value={{ toasts, success, error, info, warning, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Toast Container ──────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<ToastVariant, { bg: string; border: string; icon: string; dot: string }> = {
  success: {
    bg: "bg-white",
    border: "border-l-4 border-green-500",
    icon: "text-green-500",
    dot: "bg-green-500",
  },
  error: {
    bg: "bg-white",
    border: "border-l-4 border-red-500",
    icon: "text-red-500",
    dot: "bg-red-500",
  },
  warning: {
    bg: "bg-white",
    border: "border-l-4 border-amber-500",
    icon: "text-amber-500",
    dot: "bg-amber-500",
  },
  info: {
    bg: "bg-white",
    border: "border-l-4 border-gold",
    icon: "text-gold",
    dot: "bg-gold",
  },
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  if (variant === "success") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (variant === "error") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  if (variant === "warning") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const styles = VARIANT_STYLES[t.variant];
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mount animation
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    if (t.duration <= 0) return;
    const interval = setInterval(() => {
      setProgress((p) => Math.max(0, p - (100 / (t.duration / 100))));
    }, 100);
    return () => clearInterval(interval);
  }, [t.duration]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-lg transition-all duration-300",
        styles.border,
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <span className={cn("mt-0.5 shrink-0", styles.icon)}>
          <ToastIcon variant={t.variant} />
        </span>
        <p className="flex-1 font-body text-sm font-medium text-[#1c1c1c]">
          {t.message}
        </p>
        {t.undoAction && (
          <button
            type="button"
            onClick={() => { t.undoAction?.(); onDismiss(t.id); }}
            className="shrink-0 rounded px-2 py-0.5 font-body text-xs font-bold text-gold hover:bg-gold/10"
          >
            Undo
          </button>
        )}
        <button
          type="button"
          onClick={() => onDismiss(t.id)}
          className="ml-1 shrink-0 text-[#9ca3af] hover:text-[#1c1c1c]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-[#f3f4f6]">
        <div
          className={cn("h-full transition-all duration-100", styles.dot)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
