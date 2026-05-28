"use client";

import { cn } from "@/lib/utils";
import type { BadgeCategory, BadgeLevel } from "@/types/badges";

// ─── Visual tokens ────────────────────────────────────────────────────────────

/** Gradient + accent colors per kategori. */
const CATEGORY_THEME: Record<
  BadgeCategory,
  { from: string; to: string; accent: string; glyphStroke: string }
> = {
  ui_ux: {
    from: "#f472b6",
    to: "#be185d",
    accent: "#fdf2f8",
    glyphStroke: "#ffffff",
  },
  frontend: {
    from: "#60a5fa",
    to: "#1d4ed8",
    accent: "#eff6ff",
    glyphStroke: "#ffffff",
  },
  backend: {
    from: "#34d399",
    to: "#047857",
    accent: "#ecfdf5",
    glyphStroke: "#ffffff",
  },
  mobile: {
    from: "#a78bfa",
    to: "#5b21b6",
    accent: "#f5f3ff",
    glyphStroke: "#ffffff",
  },
  data_science: {
    from: "#fb923c",
    to: "#c2410c",
    accent: "#fff7ed",
    glyphStroke: "#ffffff",
  },
  ml_ai: {
    from: "#22d3ee",
    to: "#0e7490",
    accent: "#ecfeff",
    glyphStroke: "#ffffff",
  },
  devops: {
    from: "#94a3b8",
    to: "#334155",
    accent: "#f8fafc",
    glyphStroke: "#ffffff",
  },
  cybersecurity: {
    from: "#f87171",
    to: "#b91c1c",
    accent: "#fef2f2",
    glyphStroke: "#ffffff",
  },
};

/** Ring/tier color per level (bronze/silver/gold). */
const LEVEL_RING: Record<BadgeLevel, { color: string; label: string }> = {
  pemula: { color: "#cd7f32", label: "Pemula" },
  menengah: { color: "#9ca3af", label: "Menengah" },
  mahir: { color: "#ffce00", label: "Mahir" },
};

// ─── Inner glyph per kategori ────────────────────────────────────────────────

function CategoryGlyph({
  category,
  stroke,
}: {
  category: BadgeCategory;
  stroke: string;
}) {
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (category) {
    case "ui_ux":
      // Palette + brush
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%" {...common}>
          <path d="M12 3a9 9 0 1 0 0 18c1.7 0 2.5-1.2 2.5-2.3 0-1-.8-1.7-.8-2.7 0-1.1.9-2 2-2H17a4 4 0 0 0 4-4 9 9 0 0 0-9-7z" />
          <circle cx="7.5" cy="11" r="1" fill={stroke} stroke="none" />
          <circle cx="12" cy="7" r="1" fill={stroke} stroke="none" />
          <circle cx="16.5" cy="11" r="1" fill={stroke} stroke="none" />
        </svg>
      );
    case "frontend":
      // Angle brackets </>
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%" {...common}>
          <polyline points="8 7 3 12 8 17" />
          <polyline points="16 7 21 12 16 17" />
          <line x1="14" y1="5" x2="10" y2="19" />
        </svg>
      );
    case "backend":
      // Server stack
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%" {...common}>
          <rect x="3" y="4" width="18" height="6" rx="1.2" />
          <rect x="3" y="14" width="18" height="6" rx="1.2" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
          <line x1="7" y1="17" x2="7.01" y2="17" />
        </svg>
      );
    case "mobile":
      // Phone
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%" {...common}>
          <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      );
    case "data_science":
      // Bar chart
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%" {...common}>
          <line x1="4" y1="20" x2="4" y2="13" />
          <line x1="10" y1="20" x2="10" y2="9" />
          <line x1="16" y1="20" x2="16" y2="5" />
          <line x1="3" y1="20" x2="20" y2="20" />
        </svg>
      );
    case "ml_ai":
      // Neural / brain
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%" {...common}>
          <circle cx="6" cy="7" r="1.6" />
          <circle cx="6" cy="17" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="18" cy="7" r="1.6" />
          <circle cx="18" cy="17" r="1.6" />
          <line x1="7.4" y1="7.6" x2="10.6" y2="11.4" />
          <line x1="7.4" y1="16.4" x2="10.6" y2="12.6" />
          <line x1="13.4" y1="11.4" x2="16.6" y2="7.6" />
          <line x1="13.4" y1="12.6" x2="16.6" y2="16.4" />
        </svg>
      );
    case "devops":
      // Infinity loop
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%" {...common}>
          <path d="M7 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" transform="translate(-3,0)" />
          <path d="M9 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" transform="translate(3,0)" />
        </svg>
      );
    case "cybersecurity":
      // Shield + lock
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%" {...common}>
          <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
          <rect x="9.5" y="11" width="5" height="4" rx="0.6" />
          <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
        </svg>
      );
  }
}

// ─── Main component ──────────────────────────────────────────────────────────

export interface BadgeIconProps {
  category: BadgeCategory;
  level: BadgeLevel;
  /** Backend may supply a custom icon URL; if non-empty we render an <img>
   *  on top of the generated medal. */
  iconUrl?: string;
  /** Pixel size — applied to the outer square. */
  size?: number;
  /** Locked state (grayscale + reduced opacity). */
  locked?: boolean;
  /** Subtle outer glow halo (untuk emphasis di celebration). */
  glow?: boolean;
  /** Shine sweep animation (once on mount). */
  shine?: boolean;
  className?: string;
  /** Aria label override. */
  label?: string;
}

export function BadgeIcon({
  category,
  level,
  iconUrl,
  size = 64,
  locked = false,
  glow = false,
  shine = false,
  className,
  label,
}: BadgeIconProps) {
  const theme = CATEGORY_THEME[category];
  const ring = LEVEL_RING[level];

  // Unique gradient id per (category, instance) — random suffix safe untuk SSR
  // karena hanya dipakai sebagai DOM id, dan reactive content tetap deterministic.
  const gradientId = `badge-grad-${category}-${level}`;
  const ringId = `badge-ring-${level}`;

  return (
    <div
      role="img"
      aria-label={label ?? `${theme ? "" : ""}${ring.label} badge`}
      className={cn(
        "relative inline-block shrink-0",
        locked && "grayscale opacity-50",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* Soft outer glow halo */}
      {glow && !locked && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full blur-md"
          style={{
            background: `radial-gradient(circle, ${theme.from}66 0%, transparent 70%)`,
            transform: "scale(1.15)",
          }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative"
        aria-hidden
      >
        <defs>
          <radialGradient id={gradientId} cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor={theme.from} />
            <stop offset="100%" stopColor={theme.to} />
          </radialGradient>
          <linearGradient id={ringId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ring.color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={ring.color} stopOpacity="0.65" />
          </linearGradient>
        </defs>

        {/* Outer tier ring */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke={`url(#${ringId})`}
          strokeWidth="3.5"
        />

        {/* Tier notches: 1 untuk pemula, 2 menengah, 3 mahir.
            Posisi 12 o'clock, dimiringkan symetris. */}
        <TierNotches level={level} color={ring.color} />

        {/* Inner medal */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill={`url(#${gradientId})`}
          stroke="#ffffff"
          strokeOpacity="0.25"
          strokeWidth="1"
        />

        {/* Subtle inner highlight (top-left arc) */}
        <path
          d="M 22 38 A 36 36 0 0 1 50 14"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Glyph */}
        <foreignObject x="28" y="28" width="44" height="44">
          <div
            style={{ width: "100%", height: "100%" }}
            aria-hidden
          >
            <CategoryGlyph category={category} stroke={theme.glyphStroke} />
          </div>
        </foreignObject>

        {/* Shine sweep overlay */}
        {shine && !locked && (
          <>
            <defs>
              <linearGradient id={`shine-${gradientId}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <clipPath id={`clip-${gradientId}`}>
                <circle cx="50" cy="50" r="40" />
              </clipPath>
            </defs>
            <g clipPath={`url(#clip-${gradientId})`}>
              <rect
                className="badge-shine-sweep"
                x="-60"
                y="0"
                width="40"
                height="100"
                fill={`url(#shine-${gradientId})`}
                transform="skewX(-25)"
              />
            </g>
          </>
        )}

        {/* Lock overlay glyph */}
        {locked && (
          <g>
            <circle cx="50" cy="50" r="40" fill="#1c1c1c" fillOpacity="0.55" />
            <path
              d="M 44 48 v -3 a 6 6 0 0 1 12 0 v 3"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect
              x="42"
              y="48"
              width="16"
              height="13"
              rx="2"
              fill="#ffffff"
            />
          </g>
        )}
      </svg>

      {/* Custom icon from backend (if provided) layered on top of medal */}
      {iconUrl && !locked && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconUrl}
          alt=""
          className="pointer-events-none absolute inset-0 m-auto"
          style={{ width: size * 0.55, height: size * 0.55 }}
        />
      )}
    </div>
  );
}

// ─── Tier notches (small marks at top of the ring) ───────────────────────────

function TierNotches({ level, color }: { level: BadgeLevel; color: string }) {
  const count = level === "pemula" ? 1 : level === "menengah" ? 2 : 3;
  // Spread the notches evenly around the 12 o'clock arc (±15° span)
  const angles =
    count === 1
      ? [0]
      : count === 2
        ? [-12, 12]
        : [-22, 0, 22];

  return (
    <g>
      {angles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const r1 = 48;
        const r2 = 53;
        const x1 = 50 + Math.sin(rad) * r1;
        const y1 = 50 - Math.cos(rad) * r1;
        const x2 = 50 + Math.sin(rad) * r2;
        const y2 = 50 - Math.cos(rad) * r2;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}
