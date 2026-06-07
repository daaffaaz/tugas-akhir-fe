# 5.X Kesesuaian dengan Microsoft Human-AI Interaction Guidelines

## Konteks Penggunaan HAI Guidelines sebagai Panduan Desain

Perancangan antarmuka aplikasi PersonaLearn tidak hanya didasarkan pada prinsip-prinsip Human-Centered AI (HCAI) yang telah diuraikan pada bagian sebelumnya, tetapi juga merujuk pada panduan desain praktis yang dikembangkan oleh Microsoft Research. Shneiderman (2020) dalam bukunya *Human-Centered Artificial Intelligence: Reliable, Safe & Trustworthy* secara eksplisit merekomendasikan *Microsoft Guidelines for Human-AI Interaction* (Amershi et al., 2019) sebagai panduan desain antarmuka resmi yang spesifik untuk sistem AI. Shneiderman menyebut panduan ini sebagai sesuatu yang *"on the right track with their emphasis on user understanding and control"*, karena memberikan kerangka kerja yang dapat langsung diterapkan dalam pengembangan antarmuka AI.

Pemilihan HAI Guidelines Microsoft sebagai rujukan didasarkan pada beberapa pertimbangan. Pertama, panduan ini merupakan prinsip desain antarmuka resmi yang dikembangkan khusus untuk sistem AI, bukan prinsip umum desain antarmuka. Kedua, framework Microsoft mencakup 18 panduan konkret yang dikelompokkan ke dalam 4 fase interaksi pengguna dengan AI: *Initial Use* (G1–G2), *Normal Use* (G3–G11), *Coping with Problems* (G12–G15), dan *Changes Over Time* (G16–G18). Ketiga, panduan ini digunakan untuk memvalidasi dan memperkuat prinsip HCAI yang telah diidentifikasi pada bagian sebelumnya, sehingga kedua kerangka kerja saling melengkapi dalam memastikan kualitas desain antarmuka berbasis AI.

Sub-bab ini akan membahas penerapan 18 panduan Microsoft HAI Guidelines pada aplikasi PersonaLearn, dengan menyertakan deskripsi implementasi, identifikasi area fitur yang relevan, serta panduan visual berupa instruksi pengambilan screenshot untuk dokumentasi skripsi. Tidak seluruh 18 panduan diuraikan secara mendalam; hanya panduan yang secara eksplisit diimplementasikan dalam fitur aplikasi yang akan dijelaskan untuk menjaga relevansi narasi dengan bukti implementasi aktual.

---

## 5.X.1 Initially: Make Clear What the System Can Do (G1)

Klarifikasi kemampuan sistem AI kepada pengguna merupakan langkah awal yang krusial untuk membangun ekspektasi yang tepat. Pada aplikasi PersonaLearn, kemampuan sistem AI disampaikan melalui beberapa mekanisme visual yang tersebar di berbagai halaman.

**Screenshot 1: Halaman Course Recommendation (sebelum generate)**
- URL: `https://ta-persona-learn.vercel.app/ai/course-recommendation`
- Bagian yang perlu di-screenshot: Halaman awal sebelum user menekan tombol generate
- Highlight: **Kotak disclaimer** yang menampilkan teks penjelasan bahwa hasil rekomendasi bersifat saran, bukan keputusan final
- Tujuan highlight: Menunjukkan bahwa sejak awal, sistem sudah mengklarifikasi apa yang dapat dan tidak dapat dilakukan oleh AI.

**Screenshot 2: Halaman Learning Path List (saat belum ada LP)**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Empty state ketika user belum memiliki learning path
- Highlight: **Kotak empty state** dengan judul "Belum Ada Jalur Belajar" dan tombol CTA "Buat Jalur Belajar"
- Tujuan highlight: Mengkomunikasikan kepada user bahwa mereka perlu membuat LP terlebih dahulu, sehingga AI belum bisa menampilkan hasil.

**Screenshot 3: Halaman Onboarding Kuesioner**
- URL: `https://ta-persona-learn.vercel.app/questionnaire`
- Bagian yang perlu di-screenshot: Halaman intro kuesioner
- Highlight: **Kotak informasi** yang menjelaskan tujuan kuesioner
- Tujuan highlight: Mengklarifikasi peran kuesioner sebagai input untuk personalisasi AI.

---

## 5.X.2 Initially: Make Clear How Well the System Can Do It (G2)

Transparansi terhadap akurasi dan keterbatasan sistem AI diwujudkan melalui tampilan confidence level dan match score yang eksplisit pada rekomendasi.

**Screenshot 4: Halaman Learning Path (Career Recommendation Section)**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Bagian "Rekomendasi Karier" di bawah daftar learning path
- Highlight: **Badge confidence level** pada setiap CareerPossibilityCard — badge berwarna hijau (Tinggi), kuning (Sedang), atau merah (Rendah)
- Tujuan highlight: Menunjukkan bahwa sistem secara eksplisit menampilkan tingkat kepercayaan AI terhadap setiap rekomendasi karier.

**Screenshot 5: Halaman Course Recommendation (setelah generate)**
- URL: `https://ta-persona-learn.vercel.app/ai/course-recommendation`
- Bagian yang perlu di-screenshot: Setiap kartu rekomendasi kursus
- Highlight: **AIExplanationBadge** yang menampilkan match score dalam bentuk progress bar (misalnya "85%") berwarna emas, beserta label eksplisit "Match Score"
- Tujuan highlight: Menunjukkan bahwa AI menampilkan skor kecocokan numerik untuk setiap rekomendasi kursus.

---

## 5.X.3 During Interaction: Time Services Based on Context (G3)

Ketersediaan fitur AI harus disesuaikan dengan konteks dan kesiapan pengguna. Pada PersonaLearn, AI Recommendation Guard memastikan bahwa fitur AI hanya dapat diakses setelah user menyelesaikan kuesioner.

**Screenshot 6: Halaman AI Course Recommendation (sebelum kuesioner)**
- URL: `https://ta-persona-learn.vercel.app/ai/course-recommendation`
- Bagian yang perlu di-screenshot: Tampilan ketika user mencoba mengakses halaman AI sebelum mengisi kuesioner
- Highlight: **Kotak peringatan** dengan judul "Lengkapi Kuesioner Dahulu" beserta tombol CTA "Mulai Kuesioner"
- Tujuan highlight: Menunjukkan bahwa sistem mencegah akses ke fitur AI ketika konteks (profil user) belum siap.

**Screenshot 7: Halaman Learning Path (NextStepSection)**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Empty state dari NextStepSection
- Highlight: **Bagian "Rekomendasi Karier"** yang auto-hide ketika user belum menyelesaikan kursus
- Tujuan highlight: Menunjukkan bahwa AI memberikan rekomendasi karier hanya ketika konteks (course completion) sudah memadai.

---

## 5.X.4 During Interaction: Show Context Relevant Information (G4)

Informasi yang ditampilkan oleh AI harus relevan dengan konteks dan kebutuhan spesifik pengguna pada saat itu.

**Screenshot 8: Halaman Course Recommendation (Context Input)**
- URL: `https://ta-persona-learn.vercel.app/ai/course-recommendation`
- Bagian yang perlu di-screenshot: Form input konteks tambahan
- Highlight: **Textarea** dengan placeholder "Tambahkan konteks tambahan seperti: transisi karier, anggaran, waktu belajar..." dan label "Konteks Tambahan (opsional)"
- Tujuan highlight: Menunjukkan bahwa AI menyediakan ruang bagi user untuk memberikan konteks tambahan yang akan mempengaruhi rekomendasi.

**Screenshot 9: Halaman Learning Path (Badges)**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Strip badge di halaman Learning Path List
- Highlight: **Badge strip** yang menampilkan badge yang telah diperoleh user
- Tujuan highlight: Menunjukkan bahwa informasi badge muncul di tempat yang relevan dengan pencapaian user.

---

## 5.X.5 During Interaction: Match Relevant Social Norms (G5)

Antarmuka harus mengikuti norma sosial dan bahasa yang sesuai dengan konteks pengguna. Pada PersonaLearn, seluruh konten menggunakan bahasa Indonesia formal dengan tone edukatif.

**Screenshot 10: Contoh Tampilan Halaman Manapun (Bahasa)**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Seluruh UI aplikasi
- Highlight: **Heading, body text, button labels** — seluruhnya menggunakan bahasa Indonesia yang konsisten
- Tujuan highlight: Mendemonstrasikan konsistensi bahasa yang sesuai dengan norma lokal pengguna target.

---

## 5.X.6 During Interaction: Mitigate Social Biases (G6)

Sistem AI harus mengurangi bias sosial dalam rekomendasi. Pada PersonaLearn, hal ini dilakukan melalui filter level dan preferensi yang eksplisit.

**Screenshot 11: Halaman Course Recommendation (Filter Level di Kuesioner)**
- URL: `https://ta-persona-learn.vercel.app/questionnaire`
- Bagian yang perlu di-screenshot: Pertanyaan level (Qa1–Qa3) di kuesioner
- Highlight: **Opsi jawaban** yang mencakup level Beginner, Intermediate, dan Advanced — serta **LevelIndicator** yang menampilkan badge level user
- Tujuan highlight: Menunjukkan bahwa sistem secara eksplisit mengumpulkan data level untuk mencegah rekomendasi yang bias terhadap kelompok tertentu.

**Screenshot 12: CourseRecommendationCard dengan Tag Level**
- URL: `https://ta-persona-learn.vercel.app/ai/course-recommendation`
- Bagian yang perlu di-screenshot: Kartu rekomendasi kursus
- Highlight: **Badge level** (Pemula/Menengah/Mahir) pada setiap kartu, konsisten dengan level user
- Tujuan highlight: Menunjukkan bahwa rekomendasi disesuaikan dengan level, sehingga mengurangi bias asumsi kemampuan.

---

## 5.X.7 During Interaction: Support Efficient Invocation (G7)

Pengguna harus dapat dengan mudah dan cepat memanggil fitur AI yang dibutuhkan.

**Screenshot 13: Navbar Aplikasi**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Navigation bar di header aplikasi
- Highlight: **Menu navigasi** yang mencakup link "Rekomendasi Kursus" dan "Jalur Belajar" — selalu tersedia di setiap halaman
- Tujuan highlight: Menunjukkan bahwa fitur AI dapat diakses dengan satu klik dari mana saja.

**Screenshot 14: Halaman Learning Path (Quick Access)**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Halaman Learning Path List
- Highlight: **Tombol "Lihat Rekomendasi Karier"** atau section quick-access ke AI Recommendation
- Tujuan highlight: Menunjukkan jalur pintas untuk memanggil AI dari konteks yang relevan.

**Screenshot 15: Course Catalog (Search)**
- URL: `https://ta-persona-learn.vercel.app/course-catalog`
- Bagian yang perlu di-screenshot: Search bar di katalog
- Highlight: **Input search** di bagian atas katalog untuk mencari kursus dengan cepat
- Tujuan highlight: Mendemonstrasikan efisiensi pemanggilan fitur pencarian kursus.

---

## 5.X.8 During Interaction: Support Efficient Dismissal (G8)

Pengguna harus dapat dengan mudah menutup atau mengabaikan rekomendasi AI yang tidak diinginkan.

**Screenshot 16: Course Recommendation Card (Aksi)**
- URL: `https://ta-persona-learn.vercel.app/ai/course-recommendation`
- Bagian yang perlu di-screenshot: Bagian bawah kartu rekomendasi
- Highlight: **Tombol "Simpan"** dan **"Lihat di Platform"** pada kartu kursus rekomendasi
- Tujuan highlight: Menunjukkan opsi dismissal yang mudah bagi user.

**Screenshot 17: NextStepSection (Hide Recommendation)**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Bagian "Rekomendasi Karier" di Learning Path
- Highlight: **Tombol "Sembunyikan"** atau opsi untuk menutup section rekomendasi
- Tujuan highlight: Menunjukkan bahwa user dapat dengan mudah mengabaikan rekomendasi karier.

**Screenshot 18: Modal Close Button (ReplaceCourseModal)**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Modal replace course (buka melalui tombol "Ganti Kursus" di Learning Path)
- Highlight: **Tombol X (close)** di pojok kanan atas modal
- Tujuan highlight: Mendemonstrasikan cara dismiss modal dengan standar yang sudah dikenal user.

---

## 5.X.9 During Interaction: Support Efficient Correction (G9)

Pengguna harus dapat mengoreksi rekomendasi AI dengan mudah.

**Screenshot 19: Halaman Learning Path List (Aksi Modifikasi)**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Tombol aksi pada kartu learning path
- Highlight: **Tombol "Ganti Kursus", "Tambah Kursus", "Hapus"** untuk memodifikasi LP
- Tujuan highlight: Menunjukkan berbagai cara user dapat mengoreksi rekomendasi AI.

**Screenshot 20: Replace Course Modal**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Modal yang muncul saat user memilih "Ganti Kursus"
- Highlight: **Daftar kursus alternatif** yang dapat dipilih user untuk menggantikan kursus existing
- Tujuan highlight: Mendemonstrasikan mekanisme koreksi rekomendasi kursus.

**Screenshot 21: Profile Edit (Edit Preferensi)**
- URL: `https://ta-persona-learn.vercel.app/profile`
- Bagian yang perlu di-screenshot: Halaman profile/settings
- Highlight: **Field-field preferensi** (level, topik, dll) yang dapat diedit user, dengan tombol "Simpan Perubahan"
- Tujuan highlight: Menunjukkan cara user mengoreksi input yang menjadi dasar rekomendasi AI.

---

## 5.X.10 During Interaction: Scope Services When in Doubt (G10)

Ketika AI tidak yakin, sistem harus menampilkan confidence dan membatasi over-claim.

**Screenshot 22: CareerPossibilityCard dengan Confidence**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Kartu rekomendasi karier
- Highlight: **Badge confidence level** (Tinggi/Sedang/Rendah) — sistem membatasi ekspektasi user dengan menampilkan level keyakinan AI
- Tujuan highlight: Menunjukkan bahwa sistem tidak over-claim, melainkan secara eksplisit menyatakan keyakinannya.

**Screenshot 23: AIExplanationBadge dengan Match Score**
- URL: `https://ta-persona-learn.vercel.app/ai/course-recommendation`
- Bagian yang perlu di-screenshot: Badge penjelasan AI pada rekomendasi kursus
- Highlight: **Match score progress bar** dengan label "Match Score" dan skor eksplisit (misalnya 72%)
- Tujuan highlight: Mendemonstrasikan scope layanan yang sesuai dengan keyakinan model.

---

## 5.X.11 During Interaction: Make Clear Why the System Did What It Did (G11)

AI harus memberikan alasan di balik output yang dihasilkannya.

**Screenshot 24: AIExplanationBadge (Best For + Potential Gaps)**
- URL: `https://ta-persona-learn.vercel.app/ai/course-recommendation`
- Bagian yang perlu di-screenshot: Badge AI lengkap pada kartu rekomendasi
- Highlight: **Section "Best For"** (pengguna yang paling cocok) dan **section "Potential Gaps"** (kekurangan/keterbatasan)
- Tujuan highlight: Menunjukkan bahwa AI tidak hanya menampilkan skor, tetapi juga menjelaskan siapa yang cocok dan apa yang mungkin kurang.

**Screenshot 25: AIExplanationBadge (Match Score)**
- URL: `https://ta-persona-learn.vercel.app/ai/course-recommendation`
- Bagian yang perlu di-screenshot: Baris match score dalam badge
- Highlight: **Progress bar match score** berwarna emas dengan label "Match Score" dan angka persentase
- Tujuan highlight: Menunjukkan visualisasi numerik sebagai dasar pengambilan keputusan.

**Screenshot 26: PhaseCard (Why this phase exists)**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Kartu fase dalam learning path
- Highlight: **Bagian penjelasan fase** yang menjelaskan tujuan fase tersebut
- Tujuan highlight: Mendemonstrasikan explainability pada level struktur learning path.

---

## 5.X.12 Over Time: Convey the Consequences of User Actions (G16)

Sistem harus menyampaikan konsekuensi dari tindakan pengguna, terutama yang bersifat destruktif atau signifikan.

**Screenshot 27: DeleteConfirmDialog**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Dialog konfirmasi hapus learning path
- Highlight: **Pesan konfirmasi** yang menyebutkan nama learning path dan jumlah fase/kursus yang akan dihapus, serta **tombol "Hapus" berwarna merah** yang menandakan aksi destruktif
- Tujuan highlight: Menampilkan cara sistem memberi tahu user tentang konsekuensi sebelum tindakan destruktif dijalankan.

**Screenshot 28: RegeneratePathModal**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Modal regenerate (buka melalui aksi pada LP yang ada)
- Highlight: **Peringatan** "Jalur belajar saat ini akan diganti" sebelum konfirmasi
- Tujuan highlight: Menunjukkan bahwa user diberi tahu tentang dampak regenerate terhadap LP yang ada.

---

## 5.X.13 Over Time: Provide Global Controls (G17)

Pengguna harus memiliki akses ke kontrol global yang memungkinkan mereka mengelola seluruh pengalaman AI dari satu tempat.

**Screenshot 29: Halaman Profile**
- URL: `https://ta-persona-learn.vercel.app/profile`
- Bagian yang perlu di-screenshot: Halaman profile/settings
- Highlight: **Section "Edit Preferensi"** yang mencakup level, topik, dan preferensi lain — semua dalam satu halaman terpusat
- Tujuan highlight: Mendemonstrasikan pusat kontrol global untuk personalisasi AI.

**Screenshot 30: Navbar (Akses Global)**
- URL: `https://ta-persona-learn.vercel.app/learning-path`
- Bagian yang perlu di-screenshot: Navbar aplikasi
- Highlight: **Link "Profil"** atau ikon pengaturan di navbar — selalu tersedia dari setiap halaman
- Tujuan highlight: Menunjukkan bahwa akses ke global controls selalu tersedia.

---

## 5.X.14 Ringkasan Pedoman yang Diimplementasikan

Tabel berikut merangkum 13 pedoman Microsoft HAI Guidelines yang telah diimplementasikan pada aplikasi PersonaLearn, dengan referensi ke file kode utama:

| Pedoman | Status | Fitur Utama | File Referensi |
|---------|:------:|-------------|----------------|
| G1: Make clear what the system can do | ✓ | Disclaimer di AI Recommendation, Empty State LP, Intro Kuesioner | [src/app/ai/course-recommendation/page.tsx](src/app/ai/course-recommendation/page.tsx), [src/app/learning-path/learning-path-view.tsx](src/app/learning-path/learning-path-view.tsx) |
| G2: Make clear how well the system can do it | ✓ | Confidence level karier, match score kursus | [src/components/learning-path/CareerPossibilityCard.tsx](src/components/learning-path/CareerPossibilityCard.tsx), [src/components/ai/AIExplanationBadge.tsx](src/components/ai/AIExplanationBadge.tsx) |
| G3: Time services based on context | ✓ | QuestionnaireGuard, NextStepSection auto-hide | [src/components/ai/QuestionnaireGuard.tsx](src/components/ai/QuestionnaireGuard.tsx), [src/components/learning-path/NextStepSection.tsx](src/components/learning-path/NextStepSection.tsx) |
| G4: Show context relevant information | ✓ | Context textarea, badge strip | [src/components/ai/ContextTextarea.tsx](src/components/ai/ContextTextarea.tsx), [src/components/badges/BadgeStrip.tsx](src/components/badges/BadgeStrip.tsx) |
| G5: Match relevant social norms | ✓ | Bahasa Indonesia, tone edukatif | Seluruh halaman aplikasi |
| G6: Mitigate social biases | ✓ | Filter level di kuesioner dan kartu | [src/components/questionnaire/LevelQuestionnaireClient.tsx](src/components/questionnaire/LevelQuestionnaireClient.tsx), [src/components/ai/CourseRecommendationCard.tsx](src/components/ai/CourseRecommendationCard.tsx) |
| G7: Support efficient invocation | ✓ | Navbar, quick-access AI, search | [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx), [src/app/course-catalog/course-catalog-view.tsx](src/app/course-catalog/course-catalog-view.tsx) |
| G8: Support efficient dismissal | ✓ | Close button modal, hide recommendation | [src/components/ui/Dialog.tsx](src/components/ui/Dialog.tsx), [src/components/learning-path/NextStepSection.tsx](src/components/learning-path/NextStepSection.tsx) |
| G9: Support efficient correction | ✓ | Modifikasi LP, edit preferensi | [src/components/learning-path/ReplaceCourseModal.tsx](src/components/learning-path/ReplaceCourseModal.tsx), [src/app/profile/profile-form.tsx](src/app/profile/profile-form.tsx) |
| G10: Scope services when in doubt | ✓ | Match score, confidence bucket | [src/components/ai/AIExplanationBadge.tsx](src/components/ai/AIExplanationBadge.tsx), [src/components/learning-path/CareerPossibilityCard.tsx](src/components/learning-path/CareerPossibilityCard.tsx) |
| G11: Make clear why the system did what it did | ✓ | AIExplanationBadge (Best For, Potential Gaps), PhaseCard "Why this phase exists" | [src/components/ai/AIExplanationBadge.tsx](src/components/ai/AIExplanationBadge.tsx), [src/components/learning-path/PhaseCard.tsx](src/components/learning-path/PhaseCard.tsx) |
| G16: Convey the consequences of user actions | ✓ | DeleteConfirmDialog, RegeneratePathModal warning | [src/components/learning-path/DeleteConfirmDialog.tsx](src/components/learning-path/DeleteConfirmDialog.tsx), [src/components/learning-path/RegeneratePathModal.tsx](src/components/learning-path/RegeneratePathModal.tsx) |
| G17: Provide global controls | ✓ | Halaman Profile, Navbar | [src/app/profile/profile-form.tsx](src/app/profile/profile-form.tsx), [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx) |

Pedoman G12, G14, G15, dan G18 tidak diuraikan mendalam karena implementasinya belum sepenuhnya eksplisit pada antarmuka atau belum relevan dengan fitur utama yang menjadi fokus skripsi ini. Pedoman-pedoman tersebut tetap diidentifikasi sebagai *future work* untuk pengembangan selanjutnya.
