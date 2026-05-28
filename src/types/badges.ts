// ─── Badge Categories & Levels ────────────────────────────────────────────────

export const BADGE_CATEGORIES = [
  "ui_ux",
  "frontend",
  "backend",
  "mobile",
  "data_science",
  "ml_ai",
  "devops",
  "cybersecurity",
] as const;

export type BadgeCategory = (typeof BADGE_CATEGORIES)[number];

export const BADGE_LEVELS = ["pemula", "menengah", "mahir"] as const;

export type BadgeLevel = (typeof BADGE_LEVELS)[number];

// ─── Catalog Models ──────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  category: BadgeCategory;
  category_label: string;
  level: BadgeLevel;
  level_label: string;
  icon_url: string;
  sort_order: number;
}

export interface BadgeCatalogItem extends Badge {
  is_earned: boolean;
  earned_at: string | null;
}

// ─── User Achievement Records ────────────────────────────────────────────────

export interface UserBadgeEarnedCourse {
  id: string;
  title: string;
  platform?: {
    id: string;
    name: string;
    base_url?: string;
  };
  level?: string;
  tags?: string[];
  thumbnail_url?: string;
  url?: string;
}

export interface UserBadgeEarnedPath {
  id: string;
  title: string;
}

export interface UserBadge {
  id: string;
  badge: Badge;
  earned_via_course: UserBadgeEarnedCourse | null;
  earned_via_learning_path: UserBadgeEarnedPath | null;
  earned_at: string;
}

// ─── API Response Shapes ─────────────────────────────────────────────────────

export interface BadgeCatalogResponse {
  count: number;
  earned_count: number;
  results: BadgeCatalogItem[];
}

export interface LearningPathBadgesResponse {
  learning_path_id: string;
  count: number;
  results: UserBadge[];
}

export interface BadgeEvaluationResult {
  awarded: Badge[];
  already_owned: Badge[];
}

// ─── Updated toggle-complete response (now carries badges) ──────────────────

export interface LearningPathCourseToggleResponse {
  id: string;
  course?: unknown;
  position?: number;
  phase_number?: number | null;
  is_completed: boolean;
  completed_at: string | null;
  is_manually_added?: boolean;
  replaced_by?: string | null;
  replacement_reason?: string;
  replacement_context?: string;
  regenerate_version?: number;
  badges: BadgeEvaluationResult;
}
