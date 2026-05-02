"use client";

import { cn } from "@/lib/utils";

interface ContextTextareaProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

export function ContextTextarea({
  value,
  onChange,
  disabled,
  placeholder = "saya mau career switch ke data analyst, budget Rp 500rb...",
  error,
}: ContextTextareaProps) {
  return (
    <div className="space-y-1.5">
      <label className="font-heading text-sm font-bold text-[#1c1c1c]">
        Ada konteks tambahan?{" "}
        <span className="font-normal text-[#9ca3af]">(opsional)</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={500}
        rows={3}
        className={cn(
          "w-full resize-none rounded border bg-white px-4 py-3 font-body text-[#1c1c1c] placeholder-[#9ca3af]",
          "focus:outline-none focus:ring-2 focus:ring-gold/50",
          disabled && "cursor-not-allowed opacity-60",
          error
            ? "border-red-400"
            : "border-[#e5e7eb] focus:border-gold",
        )}
      />
      <div className="flex justify-between">
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : (
          <span />
        )}
        <span className="text-xs text-[#9ca3af]">{value.length}/500</span>
      </div>
    </div>
  );
}