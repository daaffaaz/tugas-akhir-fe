// ─── Career Recommendation (Rekomendasi Lanjutan) ───────────────────────────
// Types untuk response BE di endpoint /api/recommendations/next-steps/.
// Field name divergences dari spec awal:
//   - `price_idr` → `price` (number) + `currency` ("IDR")
//   - `duration_hours` (number) → `duration` (string "18 hours") + `video_hours` (number)

export type SuggestedCourse = {
  id: string;
  title: string;
  thumbnail_url: string;
  url: string;
  platform: string; // "Coursera" (string, bukan object)
  level: string; // "Beginner" | "Intermediate" | "Advanced" | ""
  duration: string | null; // "18 hours" (text) — bukan number
  video_hours: number | null; // field tambahan supaya FE bisa parse jam
  price: number | null; // bukan price_idr
  currency: string; // field tambahan, default "IDR"
  rating: number | null; // 0.0 – 5.0
  tags: string[]; // dari M2M Tag.name
};

export type CareerPossibility = {
  role: string; // "Data Analyst", "Backend Engineer"
  confidence: number; // 0.0 – 1.0
  description: string; // plain string paragraf naratif
  suggested_courses: SuggestedCourse[]; // 3-5 items
};

export type CompletedCourseSummary = {
  course_id: string; // UUID
  title: string;
  completed_at: string | null; // ISO 8601, bisa null
};

export type NextStepsResponse = {
  career_possibilities: CareerPossibility[]; // 2-4 items, urut confidence desc
  based_on: {
    completed_courses: CompletedCourseSummary[]; // bisa kosong
    reasoning: string; // 1 kalimat summary dari LLM, bisa ""
  };
};
