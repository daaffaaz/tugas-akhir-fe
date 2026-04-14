import type {
  CatalogCourse,
  CatalogFilters,
  CoursePlatform,
  CoursesResult,
  ManualCourseDraft,
} from "@/lib/types";
import { apiFetch } from "./client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortKey = "relevance" | "rating" | "reviews";

/** Raw course object returned by GET /api/courses/ */
type RawCourse = {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  reviews_count: number;
  thumbnail_url: string;
  url: string;
  price: number | null;
  level: string;
  platform: {
    id: string;
    name: string;
    base_url: string;
  };
};

/** DRF page-number pagination envelope */
type PagedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalisePlatform(name: string): Exclude<CoursePlatform, "all"> {
  const lower = name.toLowerCase();
  if (lower === "udemy") return "udemy";
  if (lower === "coursera") return "coursera";
  if (lower === "icei") return "icei";
  if (lower === "youtube") return "youtube";
  // fall back to the raw lowercase value; CourseCatalogCard handles unknown
  return lower as Exclude<CoursePlatform, "all">;
}

function toFrontend(raw: RawCourse): CatalogCourse {
  return {
    id: raw.id,
    title: raw.title,
    instructor: raw.instructor,
    platform: normalisePlatform(raw.platform.name),
    rating: raw.rating,
    reviewCount: raw.reviews_count,
    thumbnailUrl: raw.thumbnail_url,
    url: raw.url,
    price: raw.price,
    level: raw.level,
  };
}

function buildOrdering(sort: SortKey): string | null {
  if (sort === "rating") return "-rating";
  if (sort === "reviews") return "-reviews_count";
  return null; // relevance → omit param, backend defaults to title asc
}

function buildParams(
  query: string,
  platform: CoursePlatform,
  filters: CatalogFilters,
  sort: SortKey,
  page: number,
  pageSize: number,
): URLSearchParams {
  const p = new URLSearchParams();

  p.set("page", String(page));
  p.set("page_size", String(pageSize));

  if (query.trim()) p.set("search", query.trim());

  if (platform !== "all") {
    // Backend uses iexact on platform__name; match the capitalised DB values
    const nameMap: Record<string, string> = {
      udemy: "Udemy",
      coursera: "Coursera",
      icei: "ICEI",
      youtube: "YouTube",
    };
    p.set("platform_name", nameMap[platform] ?? platform);
  }

  const ordering = buildOrdering(sort);
  if (ordering) p.set("ordering", ordering);

  // --- Price ---
  if (filters.priceFree && !filters.pricePaid) {
    p.set("max_price", "0");
  } else if (filters.pricePaid && !filters.priceFree) {
    p.set("min_price", "1");
  }
  // both or neither → no price filter

  // --- Rating (lowest selected threshold wins) ---
  if (filters.rating45 && !filters.rating40) {
    p.set("min_rating", "4.5");
  } else if (filters.rating40) {
    p.set("min_rating", "4.0");
  }

  // --- Duration (merge all selected buckets into outer min/max range) ---
  // Buckets: 0-2, 3-6, 7-16, 17+
  const durationBuckets: Array<{ min: number; max: number | null; active: boolean }> = [
    { min: 0, max: 2, active: filters.duration02 },
    { min: 3, max: 6, active: filters.duration36 },
    { min: 7, max: 16, active: filters.duration716 },
    { min: 17, max: null, active: filters.duration17plus },
  ];
  const activeBuckets = durationBuckets.filter((b) => b.active);
  if (activeBuckets.length > 0) {
    const minDur = Math.min(...activeBuckets.map((b) => b.min));
    const maxDur = activeBuckets.some((b) => b.max === null)
      ? null
      : Math.max(...activeBuckets.map((b) => b.max as number));
    p.set("min_duration", String(minDur));
    if (maxDur !== null) p.set("max_duration", String(maxDur));
  }

  // --- Difficulty (comma-separated; backend ORs them) ---
  const difficultyMap = [
    { active: filters.difficultyBeginner, value: "Beginner" },
    { active: filters.difficultyIntermediate, value: "Intermediate" },
    { active: filters.difficultyAdvanced, value: "Advanced" },
  ];
  const levels = difficultyMap.filter((d) => d.active).map((d) => d.value);
  if (levels.length > 0) p.set("difficulty_level", levels.join(","));

  return p;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getCourses(
  query: string,
  platform: CoursePlatform,
  filters: CatalogFilters,
  sort: SortKey = "relevance",
  page: number = 1,
  pageSize: number = 6,
): Promise<CoursesResult> {
  const params = buildParams(query, platform, filters, sort, page, pageSize);
  const data = await apiFetch<PagedResponse<RawCourse>>(
    `/api/courses/?${params.toString()}`,
  );
  return {
    courses: data.results.map(toFrontend),
    total: data.count,
  };
}

/** Suggestions shown in the Add Course dialog (catalog tab) — still static */
export const MOCK_DIALOG_COURSES: CatalogCourse[] = [
  {
    id: "dlg-1",
    title: "Advanced Neural Networks v2",
    instructor: "Dr. Elena Vance",
    platform: "coursera",
    rating: 4.8,
    reviewCount: 1200,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/b89e2854-dc34-4906-8a78-4cff5886ca88",
  },
  {
    id: "dlg-2",
    title: "Ethics in Artificial Intelligence",
    instructor: "Oxford AI Labs",
    platform: "coursera",
    rating: 3.2,
    reviewCount: 890,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/34b3f69c-0c0d-4aff-8130-22473c3187e9",
  },
];

export async function addCourseManual(
  pathId: string,
  draft: ManualCourseDraft,
): Promise<void> {
  if (typeof window !== "undefined") {
    console.info("[courses stub] manual add", { pathId, draft });
  }
}
