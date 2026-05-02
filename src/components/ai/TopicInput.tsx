"use client";

import { cn } from "@/lib/utils";

interface TopicInputProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

export function TopicInput({
  value,
  onChange,
  disabled,
  placeholder = "machine learning untuk data science",
  error,
}: TopicInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="font-heading text-sm font-bold text-[#1c1c1c]">
        Mau belajar apa?
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={500}
        className={cn(
          "w-full rounded border bg-white px-4 py-3 font-body text-[#1c1c1c] placeholder-[#9ca3af]",
          "focus:outline-none focus:ring-2 focus:ring-gold/50",
          disabled && "cursor-not-allowed opacity-60",
          error
            ? "border-red-400"
            : "border-[#e5e7eb] focus:border-gold",
        )}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}