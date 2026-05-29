type LevelIndicatorProps = {
  label: string;
  color: string;
  loading?: boolean;
};

export function LevelIndicator({ label, color, loading }: LevelIndicatorProps) {
  const width =
    label === "Beginner"
      ? "20%"
      : label === "Lower Intermediate"
        ? "40%"
        : label === "Intermediate"
          ? "65%"
          : "90%";

  return (
    <div
      className="flex flex-col gap-2 rounded border p-4"
      style={{ borderColor: color, backgroundColor: `${color}08` }}
    >
      <div className="flex items-center gap-3">
        <div
          className={loading ? "animate-pulse rounded-full" : "size-3 shrink-0 rounded-full"}
          style={{ backgroundColor: loading ? "#d1d5db" : color }}
        />
        {loading ? (
          <span className="font-heading text-sm font-semibold text-[#9ca3af]">
            Menghitung level...
          </span>
        ) : (
          <span className="font-heading text-sm font-semibold" style={{ color }}>
            Level Anda: {label}
          </span>
        )}
      </div>
      {!loading && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ backgroundColor: color, width }}
          />
        </div>
      )}
    </div>
  );
}
