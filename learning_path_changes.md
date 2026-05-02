## 3.7 Fitur Edit — Learning Path (Per-Course Operations)

Setelah learning path di-generate, user bisa mengedit secara granular: regenerate seluruh path, replace satu course, atau add/delete course.

### 3.7.1 Screen Design — Edit Mode

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back              AI Learning Path                       │
├─────────────────────────────────────────────────────────────┤
│  📍 Machine Learning Foundations                      [🔄] │
│     ↑ Tap to regenerate entire path                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PHASE 1: Foundation in Data Science                 [✓]   │
│                                                             │
│  ┌─── Individual Course Actions ───────────────────────┐  │
│  │ 1. [📷] Data Science Methodology                    │  │
│  │      ⭐ 4.5 | Intermediate | IBM                     │  │
│  │      [Replace] [Remove] [Mark Complete]              │  │
│  │                                                       │  │
│  │ 2. [📷] Tools for Data Science                 [✓]  │  │
│  │      ⭐ 4.6 | Beginner | IBM                         │  │
│  │      [Replace] [Remove] [Undo Complete]              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  [+ Add Course]                                             │
│                                                             │
│  🔄 Transition: "With a solid understanding of DS..."      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [🔄 Regenerate Path]  [💾 Save]  [↩ Undo]                 │
└─────────────────────────────────────────────────────────────┘
```

### 3.7.2 Course Card — Edit Actions

```
┌────────────────────────────────────────────────────────────┐
│ [📷] Data Science Methodology                    [⋮ menu] │
│      ⭐ 4.5 (1,234) | Intermediate | IBM | Coursera      │
│      ⏱ 12 hours | 💰 IDR 0 (Audit)                        │
│                                                            │
│ 💡 match_reason: "Covers essential DS methodology..."    │
│                                                            │
│ ┌──────────────┐ ┌────────────┐ ┌─────────────────────┐  │
│ │ 🔄 Replace    │ │ ✕ Remove   │ │ ✓ Mark Completed    │  │
│ └──────────────┘ └────────────┘ └─────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Tap "🔄 Replace"** → opens replacement modal (see 3.7.3).
**Tap "✕ Remove"** → course removed, positions reindexed.

### 3.7.3 Replace Course Modal

```
┌─────────────────────────────────────────────────────────────┐
│  🔄 Replace Course                              [✕ Close] │
├─────────────────────────────────────────────────────────────┤
│  Replacing: "Data Science Methodology"                     │
│                                                             │
│  Kenapa mau ganti? (opsional)                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ terlalu panjang dan teori, saya mau yang lebih         │ │
│  │ practical dan hands-on                                │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [🔍 Cari Replacement...]  ← loading → results appear     │
│                                                             │
│  ── Replacement Candidates ─────────────────────────────── │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ⭐ 4.8 [Best Match]                                  │  │
│  │ Data Science Essentials                              │  │
│  │ IBM · Coursera · Intermediate · 8 hours              │  │
│  │ 💰 IDR 0 (Audit)                                     │  │
│  │                                                      │  │
│  │ 💡 AI Reason:                                        │  │
│  │ "Shorter and more practical than Data Science        │  │
│  │  Methodology — focuses on hands-on Python..."        │  │
│  │ Best for: learners who prefer practical projects    │  │
│  │ ⚠️ Concern: Less theoretical depth                  │  │
│  │                                                      │  │
│  │ [Select This Replacement]                            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ⭐ 4.6 [Good Match]                                  │  │
│  │ Python for Data Science and Machine Learning         │  │
│  │ ...                                                  │  │
│  │ [Select This Replacement]                           │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3.7.4 Add Course Flow

```
1. User tap "+ Add Course"
   → Show search input + similar course list

2. Search for course by title/keyword
   → FAISS retrieves similar courses from DB

3. User selects course from list
   → Course inserted at chosen position
   → Positions reindexed

4. Path saved automatically (positions updated)
```

### 3.7.5 Regenerate Path Modal/Sheet

```
┌─────────────────────────────────────────────────────────────┐
│  🔄 Regenerate Learning Path                    [✕ Close] │
├─────────────────────────────────────────────────────────────┤
│  Regenerate akan membuat ulang seluruh path berdasarkan     │
│  topik yang sama, dengan mempertimbangkan konteks baru.    │
│                                                             │
│  ⚠️ Catatan:                                                │
│  • Courses yang sudah ditandai "completed" akan DIPERTAHANKAN│
│  • Courses lain akan di-regenerate                          │
│  • Regen count akan naik +1                                 │
│                                                             │
│  Konteks tambahan (opsional):                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ saya mau yang lebih fokus ke hands-on practice        │ │
│  │ dan kurang teori                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [🔄 Regenerate]                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 3.8 Learning Path Edit — API Endpoints

### 3.8.1 POST `/api/rag/learning-paths/{id}/regenerate/`

Regenerate seluruh learning path. Courses yang sudah ditandai "completed" akan dipertahankan.

**Request:**
```json
POST /api/rag/learning-paths/2555b372-.../regenerate/
Authorization: Bearer <token>
Content-Type: application/json

{
  "additional_context": "saya mau yang lebih hands-on dan kurang teori"
}
```

**Response** (HTTP 200):
```json
{
  "id": "2555b372-...",
  "title": "Machine Learning Foundations...",
  "regenerate_count": 2,
  "regenerate_context": "saya mau yang lebih hands-on dan kurang teori",
  "progress_percentage": 33.33,
  "courses": [...],
  "_rag_meta": {
    "regenerate_count": 2,
    "regenerate_context": "saya mau yang lebih hands-on dan kurang teori",
    "completed_courses_preserved": 1,
    "courses_retrieved": 20,
    "top_similarity_score": 0.478
  }
}
```

### 3.8.2 POST `/api/rag/learning-paths/{id}/courses/{course_id}/replace/`

Mendapatkan kandidat course pengganti beserta AI explanation.

**Request:**
```json
POST /api/rag/learning-paths/2555b372-.../courses/abc-.../replace/
Authorization: Bearer <token>
Content-Type: application/json

{
  "additional_context": "terlalu teori, saya mau yang hands-on",
  "count": 5
}
```

**Response** (HTTP 200):
```json
{
  "original_course_id": "abc-...",
  "original_course_title": "Data Science Methodology",
  "replacement_reason_summary": "User likely wants more practical, hands-on approach",
  "candidates": [
    {
      "course_id": "new-course-uuid",
      "title": "Data Science Essentials",
      "instructor": "IBM",
      "platform": "Coursera",
      "level": "Beginner",
      "rating": 4.8,
      "price": 0,
      "currency": "IDR",
      "duration": "4 weeks",
      "thumbnail_url": "https://...",
      "url": "https://...",
      "score": 0.92,
      "faiss_score": 0.489,
      "match_reason": "Shorter and more practical than Data Science Methodology...",
      "best_for": "Learners who prefer hands-on projects over theory",
      "potential_concerns": "Less theoretical depth than the original course"
    }
  ]
}
```

**Frontend Flow:**
1. Call replace endpoint → show loading
2. Display candidates sorted by `score` (AI evaluation)
3. User picks one → call **apply-replacement** (see 3.8.3)
4. If no candidate liked → user can cancel

### 3.8.3 PATCH `/api/rag/learning-paths/{id}/courses/{course_id}/` (Apply Replacement)

Menyatukan "find replacement" + "apply" menjadi satu endpoint. Set body `new_course_id` untuk replace, atau kosongkan untuk delete.

> **Note:** Untuk simplicity, replace dan delete di-handle oleh endpoint yang sama.

**Request (Replace):**
```json
PATCH /api/rag/learning-paths/2555b372-.../courses/abc-.../
Authorization: Bearer <token>
Content-Type: application/json

{
  "new_course_id": "new-uuid-...",
  "action": "replace",
  "replacement_reason": "saya tidak suka course yang terlalu teori"
}
```

**Response** (HTTP 200):
```json
{
  "detail": "Course replaced successfully.",
  "learning_path": { ... full LearningPathDetailSerializer ... }
}
```

**Request (Delete):**
```json
PATCH /api/rag/learning-paths/2555b372-.../courses/abc-.../
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "delete"
}
```

**Response** (HTTP 200):
```json
{
  "detail": "Course removed from learning path.",
  "deleted_position": 3
}
```

### 3.8.4 DELETE `/api/rag/learning-paths/{id}/courses/{course_id}/`

Hapus course dari learning path. Positions di-reindex otomatis.

**Request:**
```json
DELETE /api/rag/learning-paths/2555b372-.../courses/abc-.../
Authorization: Bearer <token>
```

**Response** (HTTP 200):
```json
{
  "detail": "Course removed from learning path.",
  "position": 3
}
```

### 3.8.5 POST `/api/rag/learning-paths/{id}/courses/add/`

Tambahkan course ke learning path.

**Request:**
```json
POST /api/rag/learning-paths/2555b372-.../courses/add/
Authorization: Bearer <token>
Content-Type: application/json

{
  "course_id": "new-course-uuid",
  "position": 3  // optional, omit to append at end
}
```

**Response** (HTTP 200):
```json
{
  ...full LearningPathDetailSerializer...
}
```

### 3.8.6 GET `/api/rag/learning-paths/{id}/courses/{course_id}/similar/`

Dapatkan daftar course serupa (dari FAISS) — untuk Add Course atau browsing alternatif.

**Request:**
```
GET /api/rag/learning-paths/2555b372-.../courses/abc-.../similar/?limit=10
Authorization: Bearer <token>
```

**Response** (HTTP 200):
```json
{
  "original_course_id": "abc-...",
  "original_course_title": "Data Science Methodology",
  "topic": "data science",
  "courses": [
    {
      "course_id": "similar-uuid-1",
      "title": "Data Science Essentials",
      "instructor": "IBM",
      "platform": "Coursera",
      "level": "Beginner",
      "rating": 4.8,
      "reviews_count": 2341,
      "price": 0,
      "currency": "IDR",
      "duration": "4 weeks",
      "thumbnail_url": "https://...",
      "url": "https://...",
      "relevance_score": 0.478,
      "faiss_score": 0.478
    }
  ]
}
```

### 3.8.7 GET `/api/rag/learning-paths/` — List All User Paths

**Request:**
```
GET /api/rag/learning-paths/
Authorization: Bearer <token>
```

**Response** (HTTP 200):
```json
{
  "results": [
    {
      "id": "2555b372-...",
      "title": "Machine Learning Foundations...",
      "topic_input": "machine learning",
      "is_saved": true,
      "total_courses": 5,
      "completed_courses": 1,
      "progress_percentage": 20.0,
      "regenerate_count": 2,
      "created_at": "2026-05-02T12:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "page_size": 10
}
```

---

## 3.9 Learning Path — TypeScript Interfaces

```typescript
// ─── Request Types ───────────────────────────────────────────────

interface RegeneratePathRequest {
  additional_context?: string;
  keep_courses?: boolean;
}

interface ReplaceCourseRequest {
  additional_context?: string;
  count?: number;  // default 5
}

interface ApplyReplacementRequest {
  new_course_id: string;
  replacement_reason?: string;
}

interface DeleteCourseRequest {
  action: 'delete';
}

interface AddCourseRequest {
  course_id: string;
  position?: number;  // omit = append at end
}

// ─── Response Types ───────────────────────────────────────────────

interface ReplacementCandidate {
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
  score: number;       // AI evaluation score (0-1)
  faiss_score: number; // Vector search score (0-1)
  match_reason: string;
  best_for: string;
  potential_concerns: string;
}

interface ReplaceCourseResponse {
  original_course_id: string;
  original_course_title: string;
  replacement_reason_summary: string;
  candidates: ReplacementCandidate[];
}

interface SimilarCourse {
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

interface SimilarCoursesResponse {
  original_course_id: string;
  original_course_title: string;
  topic: string;
  courses: SimilarCourse[];
}

interface LearningPathListItem {
  id: string;
  title: string;
  topic_input: string;
  is_saved: boolean;
  total_courses: number;
  completed_courses: number;
  progress_percentage: number;
  regenerate_count: number;
  created_at: string;
  updated_at: string;
}
```

---

## 3.10 Complete URL Reference — Learning Path Edit Feature

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rag/learning-paths/` | List all user's learning paths |
| `GET` | `/api/rag/learning-paths/{id}/` | Get single learning path detail |
| `POST` | `/api/rag/generate-roadmap/` | Generate new learning path |
| `POST` | `/api/rag/learning-paths/{id}/regenerate/` | **Regenerate entire path** |
| `POST` | `/api/rag/learning-paths/{id}/courses/{course_id}/replace/` | **Get replacement candidates** |
| `POST` | `/api/rag/learning-paths/{id}/courses/{course_id}/apply/` | **Apply selected replacement** |
| `DELETE` | `/api/rag/learning-paths/{id}/courses/{course_id}/` | **Delete a course** |
| `POST` | `/api/rag/learning-paths/{id}/courses/add/` | **Add course to path** |
| `GET` | `/api/rag/learning-paths/{id}/courses/{course_id}/similar/` | Get similar course recommendations |
| `PATCH` | `/api/rag/learning-paths/{id}/courses/{course_id}/toggle-complete/` | Toggle course completion |