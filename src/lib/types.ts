/** Platform source for catalog / filters */
export type CoursePlatform =
  | "all"
  | "udemy"
  | "coursera"
  | "youtube"
  | "icei";

export type PathDifficulty =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "EXPERT";

export type ModuleStatus =
  | "completed"
  | "in_progress"
  | "locked"
  | "pending";

export type LearningPathModule = {
  id: string;
  title: string;
  status: ModuleStatus;
  progressPercent?: number;
  coursesRemaining?: number;
  badge?: string;
};

export type LearningPathSummary = {
  id: string;
  title: string;
  difficulty: PathDifficulty;
  progressPercent: number;
  lastActivityLabel?: string;
  subtitle?: string;
  /** Visual hint for card icon */
  iconKey: "monitor" | "shield" | "brain";
  description?: string;
  completionTarget?: string;
  modules: LearningPathModule[];
};

export type LearningPathStats = {
  activePaths: number;
  overallProgressPercent: number;
};

export type LearningPathCourseItem = {
  id: string;
  order: number;
  title: string;
  level: string;
  duration: string;
};

export type LearningPathDetail = {
  id: string;
  title: string;
  courseCount: number;
  courses: LearningPathCourseItem[];
};

export type CatalogCourse = {
  id: string;
  title: string;
  instructor: string;
  platform: Exclude<CoursePlatform, "all">;
  rating: number;
  reviewCount: number;
  thumbnailUrl: string;
  /** Course page URL on the source platform */
  url?: string;
  price?: number | null;
  level?: string;
};

export type CoursesResult = {
  courses: CatalogCourse[];
  total: number;
};

export type CatalogFilters = {
  /** When empty, treated as "all" */
  priceFree: boolean;
  pricePaid: boolean;
  rating45: boolean;
  rating40: boolean;
  duration02: boolean;
  duration36: boolean;
  duration716: boolean;
  duration17plus: boolean;
  difficultyBeginner: boolean;
  difficultyIntermediate: boolean;
  difficultyAdvanced: boolean;
};

export const defaultCatalogFilters: CatalogFilters = {
  priceFree: false,
  pricePaid: false,
  rating45: false,
  rating40: false,
  duration02: false,
  duration36: false,
  duration716: false,
  duration17plus: false,
  difficultyBeginner: false,
  difficultyIntermediate: false,
  difficultyAdvanced: false,
};

/** Manual course row for Add Course dialog */
export type ManualCourseDraft = {
  title: string;
  url: string;
  durationLabel: string;
  level: string;
};
