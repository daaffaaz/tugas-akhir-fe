type LevelIndicatorProps = {
  label: string;
  color: string;
};

export function LevelIndicator({ label, color }: LevelIndicatorProps) {
  return (
    <div
      className="flex flex-col gap-2 rounded border p-4"
      style={{ borderColor: color, backgroundColor: `${color}08` }}
    >
      <div className="flex items-center gap-3">
        <div className="size-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-heading text-sm font-semibold" style={{ color }}>
          Level Anda: {label}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            backgroundColor: color,
            width:
              label === "Beginner"
                ? "20%"
                : label === "Lower Intermediate"
                  ? "40%"
                  : label === "Intermediate"
                    ? "65%"
                    : "90%",
          }}
        />
      </div>
    </div>
  );
}
