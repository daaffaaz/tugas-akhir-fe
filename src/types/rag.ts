// ─── Course Recommendation ────────────────────────────────────────────────

export interface CourseRecommendationCourse {
  id: string;
  title: string;
  instructor: string;
  rating: string;
  reviews_count: number;
  price: string;
  currency: string;
  level: string;
  duration: string;
  video_hours: string;
  thumbnail_url: string;
  url: string;
  platform?: {
    id: string;
    name: string;
  };
}

export interface CourseRecommendation {
  id: string;
  course_obj: CourseRecommendationCourse;
  relevance_score: number;
  ai_explanation: string;
  match_score: number; // 0–1
  best_for: string;
  potential_gaps: string;
  is_saved: boolean;
  regenerate_count: number;
  created_at: string;
}

export interface RagRecommendResponse {
  recommendations: CourseRecommendation[];
  topic: string;
  total_retrieved: number;
  top_similarity_score: number;
  regenerate: boolean;
  regenerate_count: number;
}

// ─── Learning Path ─────────────────────────────────────────────────────────

export interface LearningPathCourse {
  id: string;
  course: {
    id: string;
    title: string;
    instructor: string;
    rating: string;
    level: string;
    video_hours: string;
    price: string;
    currency: string;
    url: string;
    thumbnail_url: string;
  };
  position: number;
  is_completed: boolean;
  completed_at: string | null;
  is_manually_added: boolean;
}

export interface PhaseCourse {
  course_id: string;
  title: string;
  match_reason: string;
}

export interface SkillProgress {
  skills_gained: string[];
  skill_coverage: number; // 0–1
}

export interface LearningPathPhase {
  phase_number: number;
  phase_name: string;
  phase_reason: string; // "WHY this phase exists"
  duration_weeks: number;
  learning_objectives: string[];
  courses: PhaseCourse[];
  milestones: string[];
  practice_projects: string[];
  skill_progress: SkillProgress;
  transition_to_next: string | null; // null for last phase
}

export interface QuestionnaireSnapshot {
  roadmap_title: string;
  total_duration_weeks: number;
  total_hours_estimated: number;
  difficulty_curve: string;
  overview: string;
  target_skills: string[];
  phases: LearningPathPhase[];
  tips_for_success: string[];
  next_steps_after_roadmap: string[];
}

export interface RagMeta {
  courses_retrieved: number;
  top_similarity_score: number;
  retrieval_method: string;
}

export interface RagLearningPathResponse {
  id: string;
  title: string;
  topic_input: string;
  description?: string;
  is_saved: boolean;
  progress_percentage: number;
  courses: LearningPathCourse[];
  created_at: string;
  updated_at?: string;
  _rag_meta: RagMeta;
  questionnaire_snapshot: QuestionnaireSnapshot;
}

// ─── Error ──────────────────────────────────────────────────────────────────

/** Thrown when API returns 403 and user has not completed questionnaire */
export class QuestionnaireRequiredError extends Error {
  constructor() {
    super("Complete the onboarding questionnaire before accessing this resource.");
    this.name = "QuestionnaireRequiredError";
  }
}

// ─── Local UI state ─────────────────────────────────────────────────────────

export interface CourseRecommendationState {
  topic: string;
  additionalContext: string;
  count: number;
  recommendations: CourseRecommendation[];
  isLoading: boolean;
  error: string | null;
  regenerateCount: number;
  topSimilarityScore: number;
}

export interface LearningPathState {
  topic: string;
  learningPath: RagLearningPathResponse | null;
  isLoading: boolean;
  error: string | null;
}

// ─── Learning Path Edit — Request Types ───────────────────────────────────────

export interface RegeneratePathRequest {
  additional_context?: string;
  keep_courses?: boolean;
}

export interface ReplaceCourseRequest {
  additional_context?: string;
  count?: number;
}

export interface ApplyReplacementRequest {
  new_course_id: string;
  replacement_reason?: string;
}

export interface AddCourseToPathRequest {
  course_id: string;
  position?: number;
}

// ─── Learning Path Edit — Response Types ─────────────────────────────────────

export interface ReplacementCandidate {
  course_id: string;
  title: string;
  instructor: string;
  platform: string;
  level: string;
  rating: number | null;
  price: number | null;
  currency: string;
  duration: string;
  thumbnail_url: string;
  url: string;
  score: number; // AI evaluation score 0–1
  faiss_score: number; // Vector search score 0–1
  match_reason: string;
  best_for: string;
  potential_concerns: string;
}

export interface ReplaceCourseResponse {
  original_course_id: string;
  original_course_title: string;
  replacement_reason_summary: string;
  candidates: ReplacementCandidate[];
}

export interface SimilarCourse {
  course_id: string;
  title: string;
  instructor: string | null;
  platform: string;
  level: string;
  rating: number | null;
  reviews_count: number | null;
  price: number | null;
  currency: string;
  duration: string;
  thumbnail_url: string;
  url: string;
  relevance_score: number;
  faiss_score: number;
}

export interface SimilarCoursesResponse {
  original_course_id: string;
  original_course_title: string;
  topic: string;
  courses: SimilarCourse[];
}

export interface LearningPathListItem {
  id: string;
  title: string;
  topic_input: string;
  description?: string;
  is_saved: boolean;
  total_courses: number;
  completed_courses: number;
  progress_percentage: number;
  difficulty?: string;
  total_duration_weeks?: number;
  target_skills?: string[];
  regenerate_count: number;
  created_at: string;
  updated_at: string;
}

export interface RegeneratePathResponse extends RagLearningPathResponse {
  _rag_meta: RagMeta & {
    completed_courses_preserved?: number;
  };
}