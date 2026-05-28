"use client";

import { cn } from "@/lib/utils";
import type { Badge, BadgeCatalogItem, UserBadge } from "@/types/badges";
import { BadgeIcon } from "./BadgeIcon";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatEarnedDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── BadgeCard (compact tile for grid) ───────────────────────────────────────

type CommonProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

type BadgeCardProps = CommonProps & {
  badge: Badge;
  locked?: boolean;
  earnedAt?: string | null;
  /** Optional subtitle line override (e.g. course title, learning path title). */
  subtitle?: string;
  onClick?: () => void;
};

export function BadgeCard({
  badge,
  locked = false,
  earnedAt,
  subtitle,
  size = "md",
  className,
  onClick,
}: BadgeCardProps) {
  const iconSize = size === "sm" ? 48 : size === "lg" ? 96 : 72;
  const Tag: "button" | "div" = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white p-4 text-center transition-all",
        onClick &&
          "cursor-pointer hover:-translate-y-0.5 hover:border-gold hover:shadow-md",
        !onClick && "cursor-default",
        locked && "bg-[#fafafa]",
        className,
      )}
      title={badge.description}
    >
      <BadgeIcon
        category={badge.category}
        level={badge.level}
        iconUrl={badge.icon_url}
        locked={locked}
        size={iconSize}
        shine={!locked && size === "lg"}
      />
      <div className="flex flex-col items-center gap-0.5">
        <p
          className={cn(
            "font-heading text-[12px] font-extrabold leading-tight text-[#1c1c1c]",
            locked && "text-[#9ca3af]",
          )}
        >
          {badge.name}
        </p>
        <p
          className={cn(
            "font-body text-[10px] font-bold uppercase tracking-[0.5px] text-[#9ca3af]",
          )}
        >
          {badge.level_label}
        </p>
        {subtitle && (
          <p className="line-clamp-2 max-w-[160px] pt-0.5 font-body text-[10px] leading-tight text-[#6b7280]">
            {subtitle}
          </p>
        )}
        {earnedAt && (
          <p className="pt-0.5 font-body text-[9px] font-medium uppercase tracking-wide text-[#9ca3af]">
            {formatEarnedDate(earnedAt)}
          </p>
        )}
      </div>
    </Tag>
  );
}

// ─── UserBadgeCard (wrap that pulls fields from a UserBadge record) ──────────

export function UserBadgeCard({
  userBadge,
  size = "md",
  className,
  onClick,
}: CommonProps & {
  userBadge: UserBadge;
  onClick?: () => void;
}) {
  const subtitle = userBadge.earned_via_learning_path?.title
    ? `dari ${userBadge.earned_via_learning_path.title}`
    : userBadge.earned_via_course?.title
      ? `via ${userBadge.earned_via_course.title}`
      : "Sumber tidak tersedia";

  return (
    <BadgeCard
      badge={userBadge.badge}
      subtitle={subtitle}
      earnedAt={userBadge.earned_at}
      size={size}
      className={className}
      onClick={onClick}
    />
  );
}

// ─── CatalogBadgeCard (wrap untuk BadgeCatalogItem dgn locked state) ─────────

export function CatalogBadgeCard({
  item,
  size = "md",
  className,
  onClick,
}: CommonProps & {
  item: BadgeCatalogItem;
  onClick?: () => void;
}) {
  return (
    <BadgeCard
      badge={item}
      locked={!item.is_earned}
      earnedAt={item.earned_at}
      size={size}
      className={className}
      onClick={onClick}
    />
  );
}
