"use client";

import { cn } from "@/lib/utils";

type OptionCardProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export function OptionCard({ label, selected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start justify-center rounded border p-[21px] text-left transition",
        selected
          ? "border-gold bg-gold-light shadow-[0_0_0_1px_#ffce00]"
          : "border-border-ui bg-white hover:border-[#d1d5db]",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center">
        <div className="mr-4 flex h-5 w-9 shrink-0 items-start pr-4 pt-0.5">
          {selected ? (
            <div className="flex size-5 items-center justify-center rounded-full border border-gold p-px">
              <span className="size-2.5 rounded-full bg-gold" />
            </div>
          ) : (
            <span className="size-5 rounded-full border border-[#d1d5db]" />
          )}
        </div>
        <span className="font-body text-lg font-bold text-[#111827]">
          {label}
        </span>
      </div>
    </button>
  );
}
