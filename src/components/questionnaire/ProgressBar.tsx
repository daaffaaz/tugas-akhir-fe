type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const fillPct = Math.min(100, Math.max(0, pct));

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <span className="font-body text-xs font-bold uppercase tracking-wide text-[#6b7280]">
          Pertanyaan {current} dari {total}
        </span>
        <span className="font-body text-xs font-bold uppercase tracking-wide text-[#e6b800]">
          {pct}% Selesai
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-grey-bg">
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-300"
          style={{ width: `${fillPct}%` }}
        />
      </div>
    </div>
  );
}
