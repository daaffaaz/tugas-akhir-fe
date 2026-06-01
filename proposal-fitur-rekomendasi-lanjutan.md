# Proposal Fitur: Rekomendasi Lanjutan Berbasis Riwayat Pembelajaran

**Versi:** v2.0
**Tanggal:** 2026-05-29
**Status:** Proposal (menunggu konfirmasi endpoint)

---

## 1. Latar Belakang

User ingin fitur rekomendasi course lanjutan yang:
- Menganalisis course yang sudah ditandai "selesai dipelajari" oleh user.
- Menentukan **kemungkinan karier secara eksploratif** (bukan dari field/job_title). Misalnya, dari course "Statistics Fundamentals" → AI usulkan role yang mungkin: Data Analyst, Data Scientist, Business Analyst.
- Setiap rekomendasi karier **wajib disertai penjelasan jelas** yang menyebut course spesifik yang sudah user pelajari + kenapa course tersebut relevan untuk karier tsb.
- Setiap rekomendasi karier menyertakan **beberapa saran course** yang bisa diambil untuk mengejar spesialisasi karier tersebut.
- User bisa **generate learning path baru** dari salah satu pilihan karier.
- Backend menyediakan endpoint khusus untuk fitur ini.

---

## 2. Konsep Inti

### Eksplorasi, Bukan Penentuan

Fitur ini BUKAN berarti "kamu adalah Data Analyst" — tapi **"berdasarkan course yang sudah kamu ambil, ini role yang bisa kamu pertimbangkan dan inilah yang bisa kamu pelajari selanjutnya"**.

UI menampilkan beberapa kemungkinan karier (2–4), masing-masing dengan:
1. **Penjelasan personal** — menyebut course yang sudah user selesaikan + kenapa relevan.
2. **Daftar saran course** — beberapa course yang bisa diambil untuk spesialisasi.
3. **Tombol "Buat jalur belajar ini"** — generate learning path baru berdasarkan pilihan karier.

User bebas:
- Mengeksplorasi semua kemungkinan.
- Memilih satu → generate learning path baru.
- Mengabaikan dan tetap menggunakan sistem lain.

---

## 3. Backend Contract (Asumsi — Perlu Konfirmasi)

```
GET /api/recommendations/next-steps/
Response 200:
{
  career_possibilities: CareerPossibility[];   // 2–4 kemungkinan
  based_on: {
    completed_courses: CompletedCourseSummary[];
  };
}

CareerPossibility = {
  role: string;                                // "Data Analyst"
  description: string;                         // WAJIB: penjelasan personal
  suggested_courses: SuggestedCourse[];        // WAJIB: 3–5 course saran
};

SuggestedCourse = {
  id: string;
  title: string;
  thumbnail_url: string;
  url: string;
  platform: string;
  level: string;
  duration: number;
  price: number;
  rating: number;
  tags: string[];
};

CompletedCourseSummary = {
  course_id: string;
  title: string;
  completed_at: string;
};
```

### Penting: `description` harus personal

`description` adalah **bukan generic marketing copy**, tapi kalimat yang menyebut:
- Course spesifik yang sudah user selesaikan.
- Skill/topik yang relevan untuk karier tsb.
- Alasan course tsb membuat karier ini relevan.

**Contoh BENAR** (personal):
> "Karena kamu sudah menyelesaikan **Statistics Fundamentals** dan **SQL for Beginners**, kamu punya fondasi yang kuat untuk mulai berkarier sebagai Data Analyst. Karier ini fokus mengolah data menjadi insight bisnis menggunakan SQL, Excel, dan tools visualisasi."

**Contoh SALAH** (generic):
> "Data Analyst adalah profesional yang menganalisis data untuk bisnis." ← Tidak menyebut course user.

### `suggested_courses` adalah course yang harus diambil

Bukan course yang sudah selesai — tapi course **baru** yang relevan untuk spesialisasi karier. FE render sebagai list ringkas.

---

## 4. Rekomendasi Desain (3 Keputusan Kunci)

### 4.1 Tidak Ada Confidence Score

**Rekomendasi: Tidak ada `confidence` di response.**

Alasan:
- AI-generated confidence sering misleading untuk user (angka 0.7 terasa seperti "pasti" padahal hanya probabilistik).
- Penjelasan tekstual yang menyebut course user lebih bermakna daripada angka.
- Mengurangi kompleksitas FE (tidak perlu threshold mapping).

FE render card karier sebagai teks murni + suggested courses.

### 4.2 Tidak Ada "Simpan Preferensi"

**Rekomendasi: Tidak ada tombol "Simpan sebagai preferensi".**

Alasan:
- Menyimpan preferensi = commit user ke karier tsb = mengubah behavior seluruh sistem (filter rekomendasi, learning path). Risiko tinggi kalau user klik iseng.
- Lebih ringan kalau user cukup "generate learning path" untuk commit ke karier tsb.
- Tidak perlu schema migration di `UserPreferences`.
- Effort FE lebih rendah.

### 4.3 Klik Card → Generate Learning Path Baru

**Rekomendasi: Klik "Buat jalur belajar ini" di card karier → POST endpoint untuk generate path baru → redirect ke `/learning-path/[id]`.**

Alasan:
- Lebih bermakna daripada "simpan preferensi" — langsung menghasilkan output.
- Backend `useLearningPath` / `generateLearningPath` sudah ada (dipakai di `/ai/course-recommendation`).
- Reuse yang sudah ada = effort rendah.

Action flow:
- Klik tombol → loading state ~3-5 detik → redirect ke learning path baru.

---

## 5. Penempatan UI

**Section baru "Rekomendasi Lanjutan" di `/learning-path`**, di bawah global progress card, di atas daftar learning path.

- Hidden jika `globalProgress.total_completed_courses === 0`.
- Header: "Berdasarkan course yang sudah kamu selesaikan, ini beberapa jalur karier yang bisa kamu eksplorasi:"
- Sub-section: 2–4 card `CareerPossibility` (grid `sm:grid-cols-1 lg:grid-cols-2`).

---

## 6. Struktur Card Karier

```
┌────────────────────────────────────────────────┐
│  [Icon: briefcase]                             │
│  Data Analyst                                  │
│                                                │
│  Karena kamu sudah menyelesaikan               │
│  Statistics Fundamentals dan SQL for           │
│  Beginners, kamu punya fondasi yang            │
│  kuat untuk mulai berkarier sebagai            │
│  Data Analyst...                               │
│                                                │
│  ── Course yang disarankan: ──                 │
│  [thumb] Data Visualization   ←→  platform     │
│  [thumb] Excel for Business  ←→  platform     │
│  [thumb] Power BI            ←→  platform     │
│                                                │
│  [Buat jalur belajar ini →]                    │
└────────────────────────────────────────────────┘
```

Element:
- Header: icon (bisa static) + role name (h3, font-heading, bold).
- Description: paragraph, font-body, leading-relaxed, max 4-5 baris (line-clamp-5 dengan tooltip "Baca selengkapnya" jika perlu, atau tampil full).
- Suggested courses: list ringkas 3-5 course (compact card, clickable → buka URL eksternal di tab baru).
- CTA button: "Buat jalur belajar ini" → POST generate path → loading → redirect.

---

## 7. File yang Akan Dibuat/Diubah

### New files (3 file)

| File | Purpose |
|---|---|
| `src/lib/api/recommendations.ts` | API: `getNextStepRecommendations()`, types, `generateLearningPathFromCareer()` |
| `src/components/learning-path/NextStepSection.tsx` | Section component untuk render di `/learning-path` |
| `src/components/learning-path/CareerPossibilityCard.tsx` | Card untuk setiap kemungkinan karier |

### Modified (1 file)

| File | Change |
|---|---|
| `src/app/learning-path/learning-path-view.tsx` | Tambah `<NextStepSection />` di bawah global progress card, conditional render |

### Reuse (tidak diubah)

- `useLearningPath` / `generateLearningPath` di `@/lib/api/career-path.ts` — untuk "Buat jalur" action.
- `AppBar`, `primaryGoldCtaClass`, `apiFetch`, `useAuth`, `cn` — UI helpers.
- `CourseCatalogCard` styling pattern (compact mode) — untuk suggested courses.
- Loading/skeleton pattern yang sudah ada di `learning-path-view.tsx`.

### Dihapus dari plan sebelumnya

- `NextStepCourseCard.tsx` — tidak perlu file terpisah, inline di `CareerPossibilityCard`.
- Confidence helpers & color mapping.
- "Saya tertarik" button + PATCH logic.
- Field `preferred_career_path` di preferences.
- Schema `UserPreferences` migration.

---

## 8. Per-Component Detail

### `recommendations.ts`

```typescript
export type SuggestedCourse = {
  id: string;
  title: string;
  thumbnail_url: string;
  url: string;
  platform: string;
  level: string;
  duration: number;
  price: number;
  rating: number;
  tags: string[];
};

export type CareerPossibility = {
  role: string;
  description: string; // WAJIB: menyebut course user
  suggested_courses: SuggestedCourse[];
};

export type NextStepsResponse = {
  career_possibilities: CareerPossibility[];
  based_on: {
    completed_courses: {
      course_id: string;
      title: string;
      completed_at: string;
    }[];
  };
};

export async function getNextStepRecommendations(): Promise<NextStepsResponse> {
  return apiFetch("/api/recommendations/next-steps/", { method: "GET" });
}

export async function generateLearningPathFromCareer(role: string): Promise<{
  learning_path_id: string;
}> {
  // Reuse existing endpoint atau endpoint baru
  return apiFetch("/api/learning-paths/generate-from-career/", {
    method: "POST",
    body: JSON.stringify({ career_focus: role }),
  });
}
```

### `NextStepSection.tsx`

```typescript
type Props = { globalProgress: GlobalProgressResponse };

export function NextStepSection({ globalProgress }: Props) {
  const [data, setData] = useState<NextStepsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (globalProgress.total_completed_courses === 0) return;
    getNextStepRecommendations()
      .then(setData)
      .catch(() => { /* silent fail */ })
      .finally(() => setLoading(false));
  }, [globalProgress.total_completed_courses]);

  if (globalProgress.total_completed_courses === 0) return null;
  if (loading) return <SectionSkeleton />;
  if (!data || data.career_possibilities.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-2xl font-bold text-dark">
          Rekomendasi Lanjutan
        </h2>
        <p className="font-body text-sm text-[#6b7280]">
          Berdasarkan {data.based_on.completed_courses.length} course yang sudah
          kamu selesaikan, ini beberapa jalur karier yang bisa kamu eksplorasi:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {data.career_possibilities.map((cp) => (
          <CareerPossibilityCard key={cp.role} career={cp} />
        ))}
      </div>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded bg-[#e5e7eb]" />
      <div className="h-4 w-72 rounded bg-[#f3f4f6]" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-64 rounded bg-[#e5e7eb]" />
        <div className="h-64 rounded bg-[#e5e7eb]" />
      </div>
    </div>
  );
}
```

### `CareerPossibilityCard.tsx`

```typescript
type Props = { career: CareerPossibility };

export function CareerPossibilityCard({ career }: Props) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useToast();

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const { learning_path_id } = await generateLearningPathFromCareer(
        career.role,
      );
      router.push(`/learning-path/${learning_path_id}`);
    } catch {
      showToast({
        type: "error",
        message: "Gagal membuat jalur belajar. Silakan coba lagi.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="rounded border border-[#e0e0e0] bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <BriefcaseIcon />
        <h3 className="font-heading text-xl font-bold text-dark">
          {career.role}
        </h3>
      </div>

      <p className="mb-4 font-body text-sm leading-relaxed text-[#374151]">
        {career.description}
      </p>

      {career.suggested_courses.length > 0 && (
        <>
          <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9ca3af]">
            Course yang disarankan
          </p>
          <div className="mb-4 space-y-2">
            {career.suggested_courses.map((c) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded border border-[#f0f0f0] p-2 transition hover:border-gold/40 hover:bg-gold-soft/30"
              >
                <img
                  src={c.thumbnail_url}
                  alt=""
                  className="size-12 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-body text-sm font-semibold text-dark">
                    {c.title}
                  </p>
                  <p className="font-body text-xs text-[#6b7280]">
                    {c.platform} · {c.level}
                  </p>
                </div>
                <ExternalLinkIcon />
              </a>
            ))}
          </div>
        </>
      )}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className={primaryGoldCtaClass(
          "flex w-full items-center justify-center gap-2 rounded px-6 py-3 font-heading text-sm font-bold",
        )}
      >
        {isGenerating ? (
          <>
            <Spinner /> Membuat jalur belajar...
          </>
        ) : (
          <>
            Buat jalur belajar ini →
          </>
        )}
      </button>
    </div>
  );
}
```

---

## 9. Edge States

| State | Behavior |
|---|---|
| `total_completed_courses === 0` | Section hidden (user belum belajar) |
| Fetch error | Section hidden, no error UI (best-effort feature) |
| Fetch in progress | Skeleton 2-card grid |
| `career_possibilities` kosong | Section hidden |
| `career_possibilities` 1 item | Render 1 card, tidak ada layout empty |
| `suggested_courses` kosong per karier | Section "Course yang disarankan" di-skip, langsung tampilkan CTA |
| Klik "Buat jalur" loading | Button disabled, spinner, text "Membuat jalur belajar..." |
| Klik "Buat jalur" error | Toast error, button re-enabled |
| Klik "Buat jalur" success | Redirect ke `/learning-path/[id]` |

---

## 10. Implementation Order

1. `src/lib/api/recommendations.ts` — types + API functions.
2. `src/components/learning-path/CareerPossibilityCard.tsx` — butuh API functions.
3. `src/components/learning-path/NextStepSection.tsx` — composite, butuh card.
4. `src/app/learning-path/learning-path-view.tsx` — wire in.

Total: **3 file baru, 1 file modified**.

---

## 11. Effort Estimate

| Step | LOC | Effort |
|---|---|---|
| `recommendations.ts` (API + types, no confidence/preference) | ~40 | 30 min |
| `CareerPossibilityCard.tsx` (description, suggested courses, generate button) | ~120 | 1.5 jam |
| `NextStepSection.tsx` (fetch + grid + skeleton) | ~70 | 1 jam |
| Wire in `learning-path-view.tsx` | ~10 | 10 min |
| **Total** | **~240 LOC** | **~3.5 jam** |

Effort: **low-medium** (~setengah hari kerja).

---

## 12. Verification (End-to-End)

1. Login, punya minimal 1 learning path dengan 1+ course ditandai selesai.
2. Buka `/learning-path` → section "Rekomendasi Lanjutan" muncul.
3. Tampilkan 2–4 card kemungkinan karier.
4. **Setiap card punya deskripsi yang menyebut course spesifik yang sudah user selesaikan** (cek manual).
5. Setiap card punya 3-5 saran course (clickable, buka di tab baru).
6. Klik "Buat jalur belajar ini" → loading state → redirect ke learning path baru.
7. Empty state: user dengan 0 completed course → section hidden.
8. Error state: backend down → section hidden, no error UI.

---

## 13. Pertanyaan Terbuka — Rekomendasi Saya untuk BE

Berikut 5 pertanyaan dengan saran jawaban yang sebaiknya dipakai, lengkap dengan reasoning. Tinggal ACC atau ubah sebelum diserahkan ke BE.

### 1. Endpoint "Buat Jalur Belajar"

**Pilihan yang saya sarankan: Opsi B — Reuse `POST /api/learning-paths/generate/` yang existing.**

**Reasoning:**
- Endpoint `generate` di `career-path.ts` sudah menangani logika RAG + generate learning path. Tinggal tambahkan field `career_focus` (string) di payload.
- FE yang reuse endpoint ini juga sudah battle-tested (dipakai di `/ai/course-recommendation`).
- Effort BE: tambah 1 field di serializer + handling `career_focus` di service (estimasi 1-2 jam). Tidak perlu endpoint baru, tidak perlu router baru, tidak perlu dokumentasi OpenAPI baru.
- Effort FE: 0 (tinggal passing `career_focus` di body).

**Payload yang akan dikirim FE:**
```json
POST /api/learning-paths/generate/
{
  "career_focus": "Data Analyst"
}
```

**Atau kalau BE butuh lebih banyak konteks** (mis. list completed courses untuk weight rekomendasi): tambahkan `based_on_courses: string[]` (course_id) opsional di payload.

---

### 2. Format `description` Karier

**Pilihan yang saya sarankan: Opsi A — Plain string (1 paragraf).**

**Reasoning:**
- Output dari LLM natural dalam bentuk naratif. Kalau dipecah jadi structured, BE perlu prompt engineering tambahan untuk generate output terstruktur (JSON mode), yang bisa menurunkan kualitas penjelasan.
- FE render plain string sudah cukup informatif — paragraf dengan `line-clamp` + hover untuk expand, atau tampil full karena biasanya 2-4 kalimat saja.
- Tidak ada benefit UX dari pemecahan struktural untuk card ringkas.

**Contoh output yang diharapkan dari LLM BE:**
```
"Karena kamu sudah menyelesaikan Statistics Fundamentals dan SQL for
Beginners, kamu punya fondasi yang kuat untuk mulai berkarier sebagai
Data Analyst. Karier ini fokus mengolah data menjadi insight bisnis
menggunakan SQL, Excel, dan tools visualisasi."
```

---

### 3. Suggested Courses — Filter yang Sudah Diambil User

**Pilihan yang saya sarankan: BE yang filter. `suggested_courses` WAJIB tidak termasuk course yang sudah user selesaikan.**

**Reasoning:**
- Logika "course mana yang sudah diambil" ada di sisi BE (join `UserCompletedCourse` + `CourseCatalog`). FE tidak boleh replicate logika bisnis ini.
- Course yang sudah selesai **tidak berguna** sebagai saran — user ingin tahu "apa yang harus dipelajari SELANJUTNYA", bukan "review materi lama".
- Effort BE: filter list sebelum return (1 line tambahan di serializer/service).
- Effort FE: 0 (trust the response).

**Kalau BE tidak sempat filter**: fallback FE filter manual dengan `set difference` — exclude course yang `id` ada di `based_on.completed_courses[].course_id`. Effort tambahan FE: 3 baris, tapi TIDAK ideal karena duplicate business logic.

---

### 4. Batas Maksimum `suggested_courses` per Karier

**Pilihan yang saya sarankan: 3-5 course per karier. BE yang tentukan, FE render apa adanya.**

**Reasoning:**
- Lebih dari 5 course = card terlalu panjang, scroll berlebihan, overwhelms user.
- Kurang dari 3 = karier terasa kurang berbobot (tidak cukup "opsi").
- Sweet spot dari UX adalah 3-5.

**Rekomendasi angka**: **5 course** sebagai maximum per karier. BE truncate kalau lebih.

**Tentang UI**: card ini bukan list panjang — render dengan `space-y-2` dan `line-clamp-1` di title. 5 course masih muat dalam 1 card dengan height yang wajar (~80px per item = ~400px total card).

**Effort FE**: render semua dari response. Tidak perlu truncate logic di FE karena BE sudah enforce.

---

### 5. Section untuk User yang Sudah Punya `target_role`

**Pilihan yang saya sarankan: Section tetap muncul untuk SEMUA user yang sudah menyelesaikan minimal 1 course, regardless of `target_role`.**

**Reasoning:**
- Section ini adalah **eksplorasi** — tujuannya adalah membuka opsi, bukan "menentukan ulang".
- User yang `target_role = "Data Analyst"` di profile mungkin penasaran dengan karier lain yang bisa dijangkau dari skill yang sama (mis. Business Analyst, Product Analyst). Feature ini justru LEBIH berguna untuk user yang sudah punya preferensi.
- User dengan `target_role` di-set biasanya sudah lebih engaged dengan platform, sehingga feature ini menambah value, bukan redundan.
- Logika conditional: section hidden hanya jika `total_completed_courses === 0` (sudah ada di spec). Tidak ada logika tambahan berdasarkan `target_role`.

**Konsistensi dengan existing behavior**: feature rekomendasi di `/ai/course-recommendation` juga tidak peduli dengan `target_role` — dia kasih rekomendasi berdasarkan learning path aktif + course yang sudah selesai. Feature baru ini konsisten dengan pola itu.

---

## 14. Rekomendasi Final untuk BE (TL;DR)

| # | Pertanyaan | Jawaban yang Saya Sarankan |
|---|---|---|
| 1 | Endpoint "Buat jalur" | **Reuse** `POST /api/learning-paths/generate/` + tambah field `career_focus` di body |
| 2 | Format `description` | **Plain string** (1 paragraf naratif dari LLM) |
| 3 | Filter course yang sudah selesai | **BE yang filter** — `suggested_courses` dijamin exclude completed |
| 4 | Batas suggested_courses | **Max 5** per karier, BE truncate |
| 5 | Tampil untuk user dengan `target_role` | **Ya, tetap tampil** untuk semua user dengan ≥1 completed course |

Setelah BE konfirmasi 5 poin di atas, FE bisa langsung eksekusi tanpa menunggu tambahan diskusi.
