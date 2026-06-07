# Daftar Fitur, Kesesuaian Microsoft HAI Guidelines, dan Penerapan Persona pada Platform e-Learning Berbasis AI PersonaLearn

## Bagian 1 — Pendahuluan

Implementasi AI pada aplikasi web semakin berkembang untuk memberikan pengalaman belajar yang lebih personal, adaptif, dan efisien. Platform e-Learning yang dibangun menggunakan teknologi Artificial Intelligence, khususnya Large Language Model (LLM), menjadi salah satu pilihan yang tepat untuk memenuhi kebutuhan pembelajaran personal yang adaptif serta mendukung efektivitas pembelajaran. Platform PersonaLearn yang dikembangkan ini mengintegrasikan AI dalam berbagai fitur utama untuk menghasilkan rekomendasi yang dipersonalisasi bagi para pengguna, khususnya dalam konteks rekomendasi jalur belajar dan kursus yang sesuai dengan minat, level keahlian, dan tujuan karier pengguna.

Namun, kegunaan dan kepercayaan pengguna terhadap AI sangat bergantung pada transparansi, keadilan, serta tanggung jawab dalam proses desain dan pengembangan. Platform e-Learning berbasis AI yang menerapkan prinsip-prinsip Human Centered AI akan memberikan manfaat bagi pengguna dan menghindari risiko penyalahgunaan atau hasil AI yang kurang sesuai.

Microsoft Research telah merumuskan seruan untuk Human Centered AI (HAI) yang mencakup berbagai pedoman untuk memastikan AI dapat memberikan manfaat maksimal kepada pengguna. Pedoman ini menjadi landasan penting dalam merancang fitur-fitur AI pada platform e-Learning PersonaLearn, di mana setiap rekomendasi yang dihasilkan haruslah transparan, dapat dijelaskan, dan memberdayakan pengguna.

Pada bagian ini, akan diuraikan secara mendalam mengenai 12 fitur utama yang diimplementasikan pada PersonaLearn, diikuti dengan analisis kesesuaian antara setiap fitur dengan 18 pedoman HAI dari Microsoft Research, serta penerapan dua persona pengguna utama yang menjadi representasi target pengguna platform.

---

## Bagian 2 — Daftar Fitur

### 2.1 Kuesioner Penentuan Level dan Preferensi

Fitur ini terdiri atas dua bagian utama: kuesioner penentuan level keahlian (beginner, intermediate, advanced) dan kuesioner penentuan preferensi pembelajaran. Pengguna diarahkan untuk menyelesaikan kuesioner ini pada tahap onboarding atau kapan pun melalui menu pengaturan. Fitur ini merupakan fondasi dari sistem rekomendasi di PersonaLearn, karena hasil dari kuesioner ini digunakan oleh AI untuk mempersonalisasi seluruh rekomendasi kursus dan jalur belajar yang ditampilkan kepada pengguna.

### 2.2 Rekomendasi Kursus

Halaman ini menampilkan daftar kursus yang direkomendasikan secara spesifik untuk pengguna berdasarkan hasil kuesioner level dan preferensi mereka. Setiap kursus dilengkapi dengan badge penjelasan AI yang mencakup skor kecocokan (match score), alasan rekomendasi, pengguna yang paling cocok (best for), dan potensi kesenjangan (potential gaps).

### 2.3 Jalur Belajar

Fitur ini menampilkan jalur belajar yang telah direkomendasikan oleh AI, terstruktur dalam beberapa fase berurutan yang membentuk peta kompetensi dari level pemula hingga mahir. Pengguna dapat melihat overview jalur belajar, progress penyelesaian per fase, dan durasi total yang diperkirakan.

### 2.4 Modifikasi Jalur Belajar

Fitur ini memungkinkan pengguna untuk memodifikasi jalur belajar yang direkomendasikan AI dengan melakukan tindakan seperti mengganti kursus (replace), menambahkan kursus baru, mengurutkan ulang fase, atau menghapus kursus tertentu dari jalur belajar. Pengguna memiliki kontrol penuh atas jalur belajar mereka sendiri.

### 2.5 Rekomendasi Karier

Halaman ini menampilkan rekomendasi karier yang sesuai dengan level keahlian dan preferensi pengguna. Setiap kemungkinan karier dilengkapi dengan indikator tingkat kepercayaan (confidence level), deskripsi peran, dan langkah-langkah selanjutnya yang direkomendasikan untuk mencapai karier tersebut.

### 2.6 Katalog Kursus

Halaman ini menyediakan katalog lengkap semua kursus yang tersedia dengan kemampuan pencarian, penyaringan (filter) berdasarkan kategori, level, dan platform, serta pengurutan (sort) berdasarkan berbagai metrik. Pengguna dapat menjelajahi kursus tanpa batasan rekomendasi AI.

### 2.7 Pengaturan Pengguna

Halaman ini memungkinkan pengguna untuk melihat dan mengedit informasi profil, preferensi pembelajaran, serta hasil kuesioner yang telah diisi sebelumnya. Pengguna dapat mengubah level keahlian, preferensi topik, dan data lainnya kapan saja.

### 2.8 Sertifikat Belajar

Fitur ini menyimpan dan menampilkan sertifikat yang telah dicapai pengguna dari kursus-kursus yang telah diselesaikan. Sertifikat tersedia dalam format yang dapat diunduh sebagai bukti pencapaian belajar.

### 2.9 Sistem Badge

Sistem badge memberikan insentif dan pengakuan atas pencapaian belajar pengguna. Badge dikategorikan berdasarkan jenis (misalnya: konsistensi, eksplorasi, penyelesaian) dan level (misalnya: bronze, silver, gold). Badge ditampilkan pada profil pengguna dan muncul sebagai notifikasi toast saat baru diperoleh.

### 2.10 Pengingat Belajar

Fitur pengingat belajar mengirimkan notifikasi kepada pengguna untuk menjaga konsistensi aktivitas belajar. Pengingat dapat dikonfigurasi oleh pengguna melalui pengaturan profil.

### 2.11 Onboarding & Intro Kuesioner

Halaman onboarding menyediakan tampilan pengenalan awal bagi pengguna baru yang baru pertama kali mengakses platform. Pengguna diarahkan untuk menyelesaikan kuesioner level dan preferensi sebelum dapat mengakses fitur-fitur AI utama.

### 2.12 Integrasi SSO (Single Sign-On)

Fitur ini memungkinkan pengguna untuk masuk ke platform menggunakan akun Google mereka melalui OAuth 2.0. Sistem ini memastikan keamanan data pengguna dan kemudahan akses tanpa perlu mengingat kredensial tambahan.

---

## Bagian 3 — Penjelasan Detail Pedoman HAI Microsoft Research

Bagian ini menjelaskan secara mendalam setiap satu dari 18 pedoman Human Centered AI (HAI) dari Microsoft Research, mencakup definisi, tujuan, relevansi dengan platform PersonaLearn, dan cara penerapan konkret pada fitur-fitur yang ada. Penjelasan ini dirancang untuk memberikan pemahaman komprehensif tentang bagaimana setiap prinsip HAI diterjemahkan ke dalam praktik pengembangan produk AI yang konkret.

### 3.1 Pedoman 1: Support Human Performance

**Definisi & Tujuan**

Pedoman ini menekankan bahwa AI harus dirancang untuk mendukung dan meningkatkan kemampuan manusia, bukan menggantikan peran manusia dalam pengambilan keputusan. Sistem AI harus memberikan informasi yang cukup dan tepat agar pengguna dapat melakukan tugas mereka dengan lebih efektif.

**Relevansi untuk PersonaLearn**

Dalam konteks e-Learning, pengguna (peserta didik) adalah agen utama yang menentukan arah belajar mereka. AI berperan sebagai pembantu yang menyediakan rekomendasi berdasarkan data preferensi dan level keahlian, namun keputusan akhir tetap ada di tangan pengguna.

**Cara Implementasi di PersonaLearn**

Seluruh fitur rekomendasi di PersonaLearn dirancang sebagai saran yang dapat diterima atau ditolak oleh pengguna. Pada halaman [Course Recommendation](src/app/ai/course-recommendation/page.tsx), kursus yang direkomendasikan ditampilkan sebagai daftar yang dapat disimpan, dilihat detailnya, atau diabaikan sepenuhnya. Pada [Learning Path](src/app/learning-path/page.tsx), pengguna memiliki kemampuan penuh untuk memodifikasi jalur belajar: menambah kursus, menghapus fase, mengganti kursus, atau mengabaikan rekomendasi AI sama sekali. Sistem tidak pernah memaksakan satu jalur belajar tertentu kepada pengguna.

**Status: Implemented**

---

### 3.2 Pedoman 2: Show Accuracy of AI

**Definisi & Tujuan**

AI harus menampilkan tingkat akurasi atau kepercayaan dari output yang dihasilkannya secara eksplisit dan mudah dipahami oleh pengguna. Informasi akurasi harus diberikan dalam format yang relevan dengan konteks dan dapat ditindaklanjuti oleh pengguna untuk membuat keputusan yang tepat.

**Relevansi untuk PersonaLearn**

Dalam konteks rekomendasi karier dan kursus, pengguna perlu mengetahui seberapa yakin AI dalam merekomendasikan sesuatu. Tanpa informasi akurasi, pengguna mungkin terlalu percaya atau terlalu ragu terhadap rekomendasi yang diberikan. Tampilan confidence level yang jelas membantu pengguna menimbang rekomendasi dengan mempertimbangkan konteks diri mereka sendiri.

**Cara Implementasi di PersonaLearn**

Platform menerapkan dua mekanisme tampilan akurasi:

1. **Confidence Level (Tinggi/Sedang/Rendah)** pada [CareerPossibilityCard](src/components/learning-path/CareerPossibilityCard.tsx) — setiap rekomendasi karier menampilkan badge berwarna hijau (tinggi), kuning (sedang), atau merah (rendah) yang menunjukkan tingkat kepercayaan AI terhadap kemungkinan pengguna berhasil dalam karier tersebut. Badge ini dilengkapi dengan label teks eksplisit untuk memastikan keterbacaan.

2. **Match Score (0–1)** pada [AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx) — setiap rekomendasi kursus menampilkan skor kecocokan numerik dalam bentuk progress bar persentase (misalnya 85%) bersama dengan penjelasan teks AI yang merinci mengapa kursus tersebut direkomendasikan.

Kedua mekanisme ini bekerja secara komplementer: confidence level memberikan gambaran kualitatif untuk konteks karier, sedangkan match score memberikan gambaran kuantitatif untuk konteks kursus.

**Status: Implemented**

---

### 3.3 Pedoman 3: Define AI "Person"

**Definisi & Tujuan**

Desainer harus menentukan persona dan karakter AI secara eksplisit. Persona AI yang jelas membantu pengguna memahami kemampuan, batasan, dan nada interaksi yang diharapkan dari sistem. Persona yang baik mencakup identitas, kepribadian, dan area keahlian yang spesifik.

**Relevansi untuk PersonaLearn**

PersonaLearn memiliki persona AI yang jelas: asisten pembelajaran berbasis preferensi individu yang membantu peserta didik menemukan jalur belajar yang sesuai dengan profil mereka. Persona ini tercermin dari seluruh interaksi AI di platform — dari kuesioner awal hingga rekomendasi yang dihasilkan.

**Cara Implementasi di PersonaLearn**

Persona AI PersonaLearn termanifestasi melalui:

1. **Tampilan "AI Reason"** pada badge penjelasan kursus ([AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:47-51)) yang menampilkan ikon bohlam dan label eksplisit "AI Reason" untuk mengidentifikasi bahwa penjelasan tersebut berasal dari AI.

2. **Teks penjelasan AI** ([AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:54-57)) yang menggunakan gaya bahasa informatif dan ramah dalam bahasa Indonesia, sesuai dengan konteks pengguna lokal.

3. **Nada rekomendasi** yang konsisten di seluruh halaman: kursus, jalur belajar, dan karier — semuanya menggunakan format "AI Reason" yang sama.

**Status: Implemented**

---

### 3.4 Pedoman 4: Display Appropriate Confidence

**Definisi & Tujuan**

Sistem AI harus menampilkan tingkat kepercayaan yang sesuai dengan keyakinan sebenarnya. AI tidak boleh tampak lebih percaya diri daripada yang sebenarnya (overconfident) atau terlalu ragu (underconfident). Tampilan confidence harus mencerminkan ketidakpastian yang ada dalam model dan relevan dengan konteks pengguna.

**Relevansi untuk PersonaLearn**

Ketika merekomendasikan karier atau kursus, penting untuk menampilkan tingkat kepercayaan yang jujur. Rekomendasi karier yang direkomendasikan AI mungkin memiliki tingkat keyakinan yang berbeda-beda tergantung pada seberapa banyak data yang tersedia tentang pengguna (hasil kuesioner, preferensi, dll).

**Cara Implementasi di PersonaLearn**

Platform menggunakan dua cara untuk menampilkan confidence yang tepat:

1. **Confidence Bucket** pada [CareerPossibilityCard](src/components/learning-path/CareerPossibilityCard.tsx) — tiga tingkat: Tinggi (hijau), Sedang (kuning), Rendah (merah). Setiap level memiliki warna yang berbeda untuk memudahkan identifikasi visual.

2. **Match Score dengan progress bar** pada [AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:12-28) — skor numerik 0–1 yang ditampilkan sebagai progress bar berwarna emas dengan label persentase eksplisit. Bar ini memberikan visualisasi bertahap yang intuitif.

Kedua tampilan ini memastikan pengguna memahami tingkat kepastian rekomendasi tanpa perlu memahami detail teknis model AI di baliknya.

**Status: Implemented**

---

### 3.5 Pedoman 5: Explain AI Assumptions

**Definisi & Tujuan**

Sistem AI harus secara eksplisit menyatakan asumsi-asumsi yang digunakan dalam menghasilkan outputnya. Dengan mengetahui asumsi apa yang digunakan, pengguna dapat mengevaluasi apakah rekomendasi relevan dengan konteks mereka sendiri dan memahami mengapa AI tidak memberikan hasil yang diharapkan.

**Relevansi untuk PersonaLearn**

AI PersonaLearn membuat beberapa asumsi dasar: (1) hasil kuesioner pengguna mencerminkan preferensi dan level keahlian mereka yang sebenarnya; (2) preferensi yang dinyatakan dalam kuesioner dapat digunakan untuk memprediksi kursus dan karier yang cocok; (3) rekomendasi dibuat berdasarkan profil pengguna saat ini, bukan riwayat belajar masa lalu (karena data riwayat belum tersedia).

**Cara Implementasi di PersonaLearn**

Asumsi-asumsi ini diekspresikan melalui:

1. **Potential Gaps** pada [AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:71-81) — section khusus yang menampilkan potensi kesenjangan antara rekomendasi dan kebutuhan pengguna, dengan ikon peringatan dan warna yang berbeda. Misalnya, jika seorang pengguna level beginner direkomendasikan kursus intermediate, potential gaps akan menjelaskan bahwa kursus tersebut mungkin terlalu sulit.

2. **Best For** pada [AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:63-67) — penjelasan spesifik tentang jenis pengguna yang paling cocok dengan rekomendasi tersebut (misalnya: "cocok untuk yang ingin beralih karier ke data science").

3. **Teks penjelasan AI** ([AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:54-57)) yang secara eksplisit menyebutkan mengapa kursus/karier direkomendasikan berdasarkan data kuesioner pengguna.

**Status: Implemented**

---

### 3.6 Pedoman 6: Encourage User Evaluation of AI

**Definisi & Tujuan**

Sistem harus mendorong pengguna untuk mengevaluasi dan menguji output AI secara aktif. Ini termasuk memberikan mekanisme untuk memberikan umpan balik, menandai rekomendasi yang tidak relevan, atau mengoreksi rekomendasi. Tujuannya adalah membangun siklus feedback yang memungkinkan pengguna dan sistem belajar satu sama lain.

**Relevansi untuk PersonaLearn**

Pengguna harus aktif mengevaluasi rekomendasi AI — apakah kursus yang direkomendasikan relevan, apakah level yang disarankan tepat, apakah karier yang direkomendasikan sesuai dengan minat mereka. Evaluasi ini tidak hanya bermanfaat bagi pengguna pribadi, tetapi juga dapat digunakan untuk meningkatkan model AI di masa depan.

**Cara Implementasi di PersonaLearn**

Evaluasi pengguna dilakukan melalui beberapa mekanisme:

1. **Simpan/Tidak Simpan** pada [CourseRecommendationCard](src/components/ai/CourseRecommendationCard.tsx:146-158) — setiap kursus memiliki tombol simpan yang menunjukkan apakah pengguna tertarik atau tidak dengan rekomendasi.

2. **Regenerate** pada [RegenerateSection](src/components/ai/RegenerateSection.tsx:12-21) — pengguna dapat meminta AI menghasilkan rekomendasi baru dengan konteks yang berbeda, menandakan bahwa rekomendasi sebelumnya tidak memuaskan.

3. **Modifikasi jalur belajar** ([ReplaceCourseModal](src/components/learning-path/ReplaceCourseModal.tsx), [AddCourseDialog](src/components/learning-path/AddCourseDialog.tsx), [AddCourseToPathModal](src/components/learning-path/AddCourseToPathModal.tsx)) — pengguna secara aktif mengoreksi jalur belajar yang direkomendasikan AI.

**Status: Implemented**

---

### 3.7 Pedoman 7: Clarify Search Results

**Definisi & Tujuan**

Ketika sistem menampilkan hasil pencarian atau rekomendasi, hasil tersebut harus diklarifikasi sebagai hasil AI (bukan hasil faktual mutlak) dan pengguna harus diberitahu mana yang merupakan hasil kecocokan berbasis preferensi versus informasi objektif. Klarifikasi ini membantu pengguna membedakan antara opini AI dan fakta.

**Relevansi untuk PersonaLearn**

Halaman [Course Catalog](src/app/course-catalog/page.tsx) menampilkan hasil pencarian dan filter kursus. Pengguna perlu memahami bahwa beberapa hasil mungkin merupakan hasil pencarian umum (berdasarkan kata kunci), sementara yang lain adalah hasil rekomendasi AI (berdasarkan profil pribadi).

**Cara Implementasi di PersonaLearn**

1. **Label "AI Reason"** pada setiap kartu rekomendasi ([AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:47-51)) membedakan rekomendasi AI dari informasi kursus objektif (rating, harga, durasi).

2. **Pemisahan halaman** antara [Course Catalog](src/app/course-catalog/page.tsx) (pencarian umum) dan [Course Recommendation](src/app/ai/course-recommendation/page.tsx) (rekomendasi personal) — pengguna selalu tahu konteks hasil yang dilihat.

3. **Level badge** ([CourseRecommendationCard](src/components/ai/CourseRecommendationCard.tsx:24-36)) menampilkan level kursus (Beginner/Intermediate/Advanced) sebagai informasi faktual, sedangkan AI Reason menampilkan interpretasi AI.

**Status: Implemented**

---

### 3.8 Pedoman 8: Display Purpose and Intent

**Definisi & Tujuan**

Sistem AI harus secara jelas menyatakan tujuan dan maksud dari output yang dihasilkannya. Pengguna harus memahami mengapa AI menampilkan informasi tertentu, apa yang ingin dicapai oleh AI, dan bagaimana output tersebut bermanfaat bagi pengguna.

**Relevansi untuk PersonaLearn**

Setiap rekomendasi di PersonaLearn memiliki tujuan yang spesifik: membantu pengguna menemukan kursus yang sesuai dengan level mereka, menemukan jalur belajar yang efisien untuk mencapai tujuan karier, atau mengidentifikasi kemungkinan karier yang cocok dengan keahlian mereka. Menampilkan tujuan ini membantu pengguna memahami nilai dari setiap rekomendasi.

**Cara Implementasi di Persona琳earn**

1. **Why this phase exists** pada [PhaseCard](src/components/ai/PhaseCard.tsx:113-117) — setiap fase dalam jalur belajar memiliki penjelasan eksplisit tentang mengapa fase tersebut ada dan apa yang akan dicapai pengguna setelah menyelesaikan fase tersebut.

2. **AI Reason** ([AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:54-57)) — setiap rekomendasi kursus/karier dilengkapi dengan penjelasan teks yang menyatakan tujuan rekomendasi tersebut.

3. **Label eksplisit** pada setiap section: "Match Score", "Best For", "Potential Gaps", "Why this phase exists" — semua label menggunakan bahasa Indonesia yang jelas dan langsung dapat dipahami pengguna.

**Status: Implemented**

---

### 3.9 Pedoman 9: Distinguish AI Roles

**Definisi & Tujuan**

Sistem harus membedakan dengan jelas antara peran AI (yang memberikan saran berbasis data dan model) dan peran manusia (yang membuat keputusan akhir). Pengguna harus selalu tahu kapan mereka berinteraksi dengan AI versus informasi statis yang disediakan oleh developer.

**Relevansi untuk PersonaLearn**

Pengguna perlu memahami perbedaan antara: (1) informasi statis yang dimasukkan oleh developer (nama kursus, harga, durasi, rating), (2) interpretasi AI yang dihasilkan secara dinamis (alasan rekomendasi, score kecocokan), dan (3) keputusan pengguna (menyimpan kursus, memodifikasi jalur belajar).

**Cara Implementasi di Persona琳earn**

1. **Pembedaan visual** — informasi statis kursus (harga, durasi, rating) ditampilkan sebagai teks biasa, sedangkan informasi AI (AI Reason, match score, best for, potential gaps) dikelompokkan dalam badge berwarna emas dengan ikon bohlam yang unik ([AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:45-46)).

2. **Label eksplisit** — badge AI memiliki header "AI REASON" yang terpisah dari informasi kursus lainnya.

3. **Tombol aksi berbeda** — tombol "Simpan" (tindakan pengguna) dan "Lihat di Platform" (link eksternal) dipisahkan secara visual dari badge AI.

**Status: Implemented**

---

### 3.10 Pedoman 10: Define AI Capabilities and Limitations

**Definisi & Tujuan**

Sistem harus secara eksplisit menjelaskan apa yang dapat dan tidak dapat dilakukan oleh AI. Batasan AI harus dijelaskan dengan bahasa yang dapat dipahami pengguna awam, termasuk area di mana AI mungkin salah atau tidak memiliki data yang cukup.

**Relevansi untuk PersonaLearn**

AI PersonaLearn memiliki kemampuan terbatas: rekomendasi hanya berdasarkan data kuesioner (bukan riwayat belajar), tidak dapat menjamin hasil akhir pengguna, dan hanya merekomendasikan kursus yang tersedia di database. Pengguna perlu memahami batasan ini agar tidak memiliki ekspektasi yang tidak realistis.

**Cara Implementasi di Persona琳earn**

1. **Potential Gaps** pada [AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:71-81) — secara eksplisit menyebutkan apa yang mungkin tidak tercakup dalam rekomendasi. Ini berfungsi sebagai pernyataan keterbatasan AI untuk setiap rekomendasi spesifik.

2. **Label "(opsional)"** pada [ContextTextarea](src/components/ai/ContextTextarea.tsx:23-24) — menjelaskan bahwa konteks tambahan bersifat opsional, mengisyaratkan bahwa rekomendasi tanpa konteks tambahan mungkin tidak optimal.

3. **Disclaimer teks** di halaman [Course Recommendation](src/app/ai/course-recommendation/page.tsx) — memberikan konteks umum tentang bagaimana rekomendasi dihasilkan dan bahwa rekomendasi bersifat personal.

4. **Level badge** ([CourseRecommendationCard](src/components/ai/CourseRecommendationCard.tsx:24-36)) — menampilkan level kursus sebagai informasi faktual dari database, bukan interpretasi AI. Ini membantu pengguna membedakan informasi statis dari rekomendasi AI.

**Status: Implemented**

---

### 3.11 Pedoman 11: Make Explanations Easy to Understand

**Definisi & Tujuan**

Penjelasan yang diberikan oleh AI harus menggunakan bahasa yang sederhana dan mudah dipahami oleh pengguna awam. Hindari jargon teknis, gunakan format visual yang intuitif, dan pastikan penjelasan langsung relevan dengan konteks pengguna saat ini.

**Relevansi untuk PersonaLearn**

Pengguna PersonaLearn berasal dari berbagai latar belakang pendidikan dan keahlian. Penjelasan AI harus dapat dipahami oleh pemula yang baru mengenal dunia TI maupun oleh pengguna yang lebih berpengalaman.

**Cara Implementasi di Persona琳earn**

1. **Bahasa Indonesia** — seluruh penjelasan AI menggunakan bahasa Indonesia yang sederhana dan tidak menggunakan istilah teknis yang tidak perlu.

2. **Match Score Bar** ([AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:12-28)) — skor kecocokan ditampilkan sebagai progress bar visual yang intuitif (bukan hanya angka mentah), sehingga pengguna dari semua tingkat literasi data dapat memahaminya.

3. **Iconografi** — ikon bohlam untuk AI Reason dan ikon peringatan untuk Potential Gaps memberikan konteks visual yang memperkuat pemahaman.

4. **Badge berwarna** untuk confidence level — hijau (tinggi), kuning (sedang), merah (rendah) — menggunakan konvensi warna universal yang langsung dipahami tanpa penjelasan.

**Status: Implemented**

---

### 3.12 Pedoman 12: Provide Time Controls

**Definisi & Tujuan**

Pengguna harus memiliki kontrol atas durasi dan frekuensi interaksi dengan AI. Ini termasuk kemampuan untuk mengubah pengaturan notifikasi, menyesuaikan interval pengingat, dan mengontrol berapa sering AI berinteraksi dengan mereka.

**Relevansi untuk PersonaLearn**

Fitur pengingat belajar memerlukan kontrol waktu yang dapat dikonfigurasi oleh pengguna. Pengguna perlu dapat mengatur kapan mereka ingin menerima pengingat, seberapa sering, dan melalui saluran mana.

**Cara Implementasi di Persona琳earn**

1. **Edit preferensi** pada halaman [Profile](src/app/profile/profile-form.tsx) — pengguna dapat mengubah preferensi pembelajaran mereka kapan saja, termasuk pengaturan yang terkait dengan frekuensi rekomendasi.

2. **Regenerate** pada [RegenerateSection](src/components/ai/RegenerateSection.tsx:12-21) — pengguna dapat meminta rekomendasi baru kapan pun mereka mau, memberikan kontrol penuh atas kapan AI harus menghasilkan output baru.

**Status: Partially Implemented** (kontrol waktu pengaturan ada, tetapi notifikasi/pengingat belum terimplementasi sepenuhnya)

---

### 3.13 Pedoman 13: Allow User Customization

**Definisi & Tujuan**

Sistem harus memungkinkan pengguna untuk menyesuaikan AI sesuai dengan preferensi mereka. Ini mencakup kemampuan untuk mengubah parameter rekomendasi, memilih format output yang diinginkan, dan menyesuaikan bagaimana AI berinteraksi dengan mereka.

**Relevansi untuk PersonaLearn**

Pengguna harus dapat menyesuaikan cara AI merekomendasikan kursus dan jalur belajar. Misalnya, pengguna mungkin ingin memfilter rekomendasi berdasarkan level tertentu, memprioritaskan biaya rendah, atau memilih kursus dalam bahasa Indonesia.

**Cara Implementasi di Persona琳earn**

1. **Edit preferensi** pada halaman [Profile](src/app/profile/profile-form.tsx) — pengguna dapat mengubah level keahlian, preferensi topik, dan data profil lainnya.

2. **Context Input** pada [Course Recommendation](src/app/ai/course-recommendation/page.tsx) — pengguna dapat menambahkan konteks tambahan dalam bidang teks opsional untuk mempersonalisasi rekomendasi lebih lanjut.

3. **Kontrol penuh atas jalur belajar** — pengguna dapat menambah, menghapus, mengganti, atau mengurungkan ulang fase dalam jalur belajar ([ReplaceCourseModal](src/components/learning-path/ReplaceCourseModal.tsx), [AddCourseDialog](src/components/learning-path/AddCourseDialog.tsx), [DeleteConfirmDialog](src/components/learning-path/DeleteConfirmDialog.tsx)).

4. **Filter dan sort** pada [Course Catalog](src/app/course-catalog/course-catalog-view.tsx) — pengguna dapat menyesuaikan tampilan katalog berdasarkan level, kategori, dan platform.

**Status: Implemented**

---

### 3.14 Pedoman 14: Update and Adapt Cautiously

**Definisi & Tujuan**

Ketika AI melakukan perubahan signifikan pada output atau hasil rekomendasi, sistem harus melakukan adaptasi secara hati-hati dengan memberi tahu pengguna, menunjukkan perbandingan antara versi lama dan baru, dan memberikan kesempatan bagi pengguna untuk meninjau perubahan sebelum diterapkan.

**Relevansi untuk PersonaLearn**

Ketika pengguna meregenerasi rekomendasi atau jalur belajar, perubahan yang dihasilkan bisa sangat berbeda dari versi sebelumnya. Pengguna perlu memahami apa yang berubah dan mengapa, agar mereka dapat membuat keputusan yang tepat mengenai perubahan tersebut.

**Cara Implementasi di Persona琳earn**

1. **Regenerate Path Modal** ([RegeneratePathModal](src/components/learning-path/RegeneratePathModal.tsx)) — menampilkan perbandingan antara jalur belajar lama dan baru, sehingga pengguna dapat melihat perbedaan sebelum mengonfirmasi perubahan.

2. **Regenerate badge** pada [CourseRecommendationCard](src/components/ai/CourseRecommendationCard.tsx:97-101) — menampilkan jumlah regenerasi yang telah dilakukan ("Regenerated Nx") sehingga pengguna tahu bahwa rekomendasi ini bukan rekomendasi pertama.

3. **Kontrol penuh pengguna** — semua perubahan memerlukan konfirmasi eksplisit dari pengguna. Tidak ada perubahan yang diterapkan secara otomatis.

**Status: Implemented**

---

### 3.15 Pedoman 15: Prevent Undue Influence

**Definisi & Tujuan**

Sistem AI harus dirancang untuk tidak memanipulasi atau mempengaruhi pengguna secara tidak etis. AI tidak boleh menggunakan teknik persuasif yang manipulatif, seperti menciptakan rasa urgensi palsu atau memberikan rekomendasi yang terlalu agresif. Sistem harus memprioritaskan kepentingan pengguna di atas kepentingan bisnis.

**Relevansi untuk PersonaLearn**

Platform e-Learning berpotensi memiliki insentif komersial untuk merekomendasikan kursus tertentu (misalnya kursus berbayar dari partner). AI harus memastikan bahwa rekomendasi didasarkan pada kecocokan dengan profil pengguna, bukan pada insentif komersial.

**Cara Implementasi di Persona琳earn**

1. **Rekomendasi berbasis data kuesioner** — seluruh rekomendasi didasarkan pada hasil kuesioner level dan preferensi pengguna ([LevelQuestionnaireClient](src/components/questionnaire/LevelQuestionnaireClient.tsx), [PreferencesQuestionnaireClient](src/components/questionnaire/PreferencesQuestionnaireClient.tsx)), bukan pada preferensi komersial.

2. **Tombol aksi yang netral** — tidak ada elemen UI yang menciptakan rasa urgensi palsu (misalnya countdown timer, "hanya tersisa 1 slots!" palsu, dll).

3. **Pemisahan antara rekomendasi dan iklan** — halaman [Course Recommendation](src/app/ai/course-recommendation/page.tsx) menampilkan rekomendasi murni tanpa elemen promosi atau sponsored content yang menyamar sebagai rekomendasi.

**Status: Implemented**

---

### 3.16 Pedoman 16: Provide Clear Consequences

**Definisi & Tujuan**

Sistem harus secara jelas menyatakan konsekuensi dari tindakan yang diambil pengguna, termasuk apa yang akan terjadi jika mereka mengonfirmasi tindakan tersebut. Pengguna harus memahami dampak dari setiap keputusan yang mereka buat dalam berinteraksi dengan sistem AI.

**Relevansi untuk PersonaLearn**

Beberapa tindakan di PersonaLearn memiliki konsekuensi yang permanen atau signifikan, seperti menghapus jalur belajar atau mengganti kursus. Pengguna harus memahami apa yang akan terjadi sebelum mereka mengonfirmasi tindakan tersebut.

**Cara Implementasi di Persona琳earn**

1. **Delete Confirmation Dialog** ([DeleteConfirmDialog](src/components/learning-path/DeleteConfirmDialog.tsx)) — menampilkan pesan eksplisit tentang apa yang akan dihapus (nama jalur belajar, jumlah fase, jumlah kursus) sebelum pengguna mengonfirmasi. Dialog ini memerlukan tindakan eksplisit (tombol "Hapus") untuk mengonfirmasi.

2. **Regenerate Path Modal** ([RegeneratePathModal](src/components/learning-path/RegeneratePathModal.tsx)) — memperingatkan pengguna bahwa jalur belajar saat ini akan diganti sebelum regenerasi, dengan opsi untuk membatalkan.

3. **Replace Course Modal** ([ReplaceCourseModal](src/components/learning-path/ReplaceCourseModal.tsx)) — menampilkan kursus yang akan diganti dan kursus pengganti yang direkomendasikan, sehingga pengguna memahami konsekuensi pertukaran.

**Status: Implemented**

---

### 3.17 Pedoman 17: Provide Global Controls

**Definisi & Tujuan**

Pengguna harus memiliki kontrol global atas AI, termasuk kemampuan untuk mengaktifkan atau menonaktifkan fitur AI, mengubah pengaturan privasi, atau mengakses halaman pengaturan utama dari mana saja di aplikasi. Kontrol global memastikan pengguna selalu memegang kendali atas pengalaman AI mereka.

**Relevansi untuk PersonaLearn**

Pengguna harus dapat mengelola semua pengaturan terkait AI dari satu tempat yang mudah diakses, termasuk preferensi pembelajaran, level keahlian, dan hasil kuesioner.

**Cara Implementasi di Persona琳earn**

1. **Halaman [Profile](src/app/profile/profile-form.tsx)** — berfungsi sebagai pusat kontrol global di mana pengguna dapat: (a) mengedit informasi profil, (b) mengubah preferensi pembelajaran, (c) memodifikasi hasil kuesioner level dan preferensi, dan (d) melihat semua pengaturan terkait personalisasi AI.

2. **Navbar** ([Navbar](src/components/layout/Navbar.tsx)) — navigasi global yang memberikan akses cepat ke semua fitur AI dari mana saja di aplikasi.

3. **Regenerate kapan saja** ([RegenerateSection](src/components/ai/RegenerateSection.tsx)) — pengguna dapat meregenerasi rekomendasi dari halaman kursus rekomendasi tanpa harus kembali ke halaman pengaturan.

**Status: Implemented**

---

### 3.18 Pedoman 18: Notify Users About Changes

**Definisi & Tujuan**

Sistem harus secara aktif memberi tahu pengguna ketika ada perubahan signifikan pada output AI, hasil rekomendasi, atau pengaturan sistem. Notifikasi ini harus jelas, tepat waktu, dan memberikan konteks tentang apa yang berubah dan mengapa.

**Relevansi untuk PersonaLearn**

Ketika pengguna mengedit preferensi mereka atau ketika ada pembaruan sistem yang mempengaruhi rekomendasi, pengguna perlu diberitahu agar mereka dapat meninjau perubahan yang terjadi pada rekomendasi mereka.

**Cara Implementasi di Persona琳earn**

**Status: Not Implemented**

Pedoman ini belum diimplementasikan pada PersonaLearn. Platform saat ini belum memiliki mekanisme notifikasi proaktif yang memberitahu pengguna ketika rekomendasi mereka berubah akibat perubahan preferensi atau pembaruan sistem. Fitur yang tersedia seperti [BadgeAwardedToast](src/components/badges/BadgeAwardedToast.tsx) hanya berfungsi untuk notifikasi badge baru, bukan untuk perubahan rekomendasi AI.

**Rencana Pengembangan:** Implementasi sistem notifikasi yang memberitahu pengguna ketika: (1) preferensi mereka telah diperbarui dan rekomendasi telah disesuaikan, (2) ada rekomendasi baru yang signifikan setelah perubahan profil, (3) ada pembaruan pada sistem rekomendasi.

---

## Bagian 4 — Tabel Ringkasan Kesesuaian

Berdasarkan penjelasan detail pada Bagian 3 berikut analisis komprehensif terhadap implementasi aktual, berikut adalah tabel ringkasan kesesuaian antara 12 fitur PersonaLearn dan 18 pedoman HAI Microsoft Research:

| No | Fitur | Pedoman yang Sesuai |
|----|-------|---------------------|
| 1 | Kuesioner Penentuan Level dan Preferensi | G3, G5, G8, G10, G13, G15, G17 |
| 2 | Rekomendasi Kursus | G1, G2, G4, G5, G6, G7, G8, G9, G10, G11, G13, G15 |
| 3 | Jalur Belajar | G1, G3, G5, G8, G10, G13, G15 |
| 4 | Modifikasi Jalur Belajar | G1, G6, G11, G13, G14, G16, G17 |
| 5 | Rekomendasi Karier | G2, G4, G5, G8, G10, G11, G15 |
| 6 | Katalog Kursus | G7, G13, G15 |
| 7 | Pengaturan Pengguna | G13, G17 |
| 8 | Sertifikat Belajar | G15 |
| 9 | Sistem Badge | G1, G6, G15 |
| 10 | Pengingat Belajar | G12, G17 |
| 11 | Onboarding & Intro Kuesioner | G3, G5, G8, G10 |
| 12 | Integrasi SSO | G15 |

**Keterangan:**
- Tabel di atas menunjukkan pedoman yang **telah diimplementasikan** pada setiap fitur.
- Total pedoman yang **telah diimplementasikan**: 14 dari 18 (G2, G3, G4, G5, G6, G7, G8, G9, G10, G11, G13, G14, G15, G16, G17).
- Total pedoman yang **belum diimplementasikan**: 3 dari 18 (G12 partially, G18 not implemented).

### Detail Implementasi per Pedoman

| Pedoman | Status | Bukti Implementasi |
|---------|--------|--------------------|
| G1: Support Human Performance | ✓ | Modifikasi LP penuh (Add/Delete/Replace/Reorder) |
| G2: Show Accuracy of AI | ✓ | Confidence Level di CareerPossibilityCard + Match Score di AIExplanationBadge |
| G3: Define AI "Person" | ✓ | "AI REASON" badge dengan ikon bohlam |
| G4: Display Appropriate Confidence | ✓ | Confidence bucket + Match Score progress bar |
| G5: Explain AI Assumptions | ✓ | Potential Gaps + Best For di AIExplanationBadge |
| G6: Encourage User Evaluation | ✓ | Simpan/Tidak Simpan + Regenerate + Modifikasi LP |
| G7: Clarify Search Results | ✓ | Label AI Reason + pemisahan halaman Catalog/Recommendation |
| G8: Display Purpose and Intent | ✓ | "Why this phase exists" + AI Reason di semua rekomendasi |
| G9: Distinguish AI Roles | ✓ | Pembedaan visual: info statis vs AI reasoning |
| G10: Define AI Capabilities/Limitations | ✓ | Match Score numerik + Disclaimer teks |
| G11: Make Explanations Easy to Understand | ✓ | Bahasa Indonesia + visual progress bar + iconografi |
| G12: Provide Time Controls | △ | Profile edit tersedia, pengingat belum terimplementasi |
| G13: Allow User Customization | ✓ | Edit preferences + context input + filter/sort + modifikasi LP |
| G14: Update and Adapt Cautiously | ✓ | RegeneratePathModal comparison view |
| G15: Prevent Undue Influence | ✓ | Rekomendasi berbasis kuesioner + tombol netral |
| G16: Provide Clear Consequences | ✓ | DeleteConfirmDialog + ReplaceCourseModal |
| G17: Provide Global Controls | ✓ | Halaman Profile sebagai pusat kontrol + Navbar |
| G18: Notify Users About Changes | ✗ | Belum ada mekanisme notifikasi perubahan rekomendasi |

---

## Bagian 5 — Penerapan Persona

### 5.1 Persona 1: Sarah Williams — Pemula yang Ingin Beralih Karier

Sarah Williams adalah seorang fresh graduate jurusan Administrasi Bisnis yang baru saja lulus dari universitas dan sedang berusaha menemukan arah karier di dunia teknologi. Ia memiliki ketertarikan pada bidang Data Analytics tetapi tidak memiliki latar belakang teknis yang memadai. Sarah membutuhkan platform e-Learning yang dapat membimbingnya dari nol, memberikan rekomendasi yang sesuai dengan level pemulianya, dan menunjukkan jalur belajar yang jelas menuju karier yang diinginkannya.

**Penerapan Pedoman HAI untuk Persona Sarah:**

Untuk Persona Sarah, pedoman HAI berikut sangat penting:

1. **G2 — Show Accuracy of AI** — Sarah sebagai pemula perlu melihat confidence level dari setiap rekomendasi. Badge "Tinggi" (hijau) memberinya keyakinan, sementara badge "Rendah" (merah) menandangnya untuk berhati-hati. Hal ini mencegah Sarah merasa overwhelmed oleh rekomendasi yang terlalu tinggi levelnya.

2. **G4 — Display Appropriate Confidence** — Sarah mungkin belum memahami konsep match score. Oleh karena itu, tampilan progress bar yang intuitif dan warna confidence level (hijau/kuning/merah) sangat membantu. Dia tidak perlu memahami matematika di balik skor, cukup melihat visual yang mudah dimengerti.

3. **G11 — Make Explanations Easy to Understand** — Penjelasan AI yang menggunakan bahasa Indonesia sederhana dan visual yang intuitif sangat penting bagi Sarah. Ketika dia melihat "AI REASON" dengan penjelasan dalam bahasa yang dia pahami, dia dapat membuat keputusan yang informed.

4. **G8 — Display Purpose and Intent** — Sarah perlu memahami mengapa kursus tertentu direkomendasikan. Dengan penjelasan "Why this phase exists" pada setiap fase jalur belajar, Sarah tahu apa yang akan dia capai setelah menyelesaikan fase tersebut, memberikan motivasi dan arah yang jelas.

5. **G16 — Provide Clear Consequences** — Sarah mungkin belum yakin dengan keputusan modifikasi jalur belajar. Dengan dialog konfirmasi yang jelas (misalnya pada [DeleteConfirmDialog](src/components/learning-path/DeleteConfirmDialog.tsx)), Sarah tahu apa yang akan terjadi sebelum dia menghapus atau mengubah jalur belajarnya.

### 5.2 Persona 2: Dr. David Chen — Profesional TI yang Ingin Meningkatkan Keahlian

Dr. David Chen adalah seorang Software Engineer dengan pengalaman 7 tahun di perusahaan teknologi multinasional. Ia sudah memiliki keahlian yang solid di bidang back-end development dan sekarang ingin memperdalam pengetahuan di bidang Machine Engineering dan MLOps. David membutuhkan platform e-Learning yang dapat memberikan rekomendasi lanjutan, bukan dasar, dan memungkinkan fleksibilitas dalam memodifikasi jalur belajar yang direkomendasikan.

**Penerapan Pedoman HAI untuk Persona David:**

Untuk Persona David, pedoman HAI berikut sangat penting:

1. **G13 — Allow User Customization** — David memerlukan kontrol penuh atas jalur belajarnya. Fitur replace, add, delete, dan reorder di [Modifikasi Jalur Belajar](src/components/learning-path/ReplaceCourseModal.tsx) memungkinkan dia menyesuaikan rekomendasi AI dengan kebutuhan spesifiknya.

2. **G14 — Update and Adapt Cautiously** — Ketika David meregenerasi rekomendasi, dia perlu memahami perubahan yang terjadi. [RegeneratePathModal](src/components/learning-path/RegeneratePathModal.tsx) dengan comparison view memungkinkan dia membandingkan jalur lama dan baru sebelum memutuskan.

3. **G17 — Provide Global Controls** — David sebagai profesional yang sibuk membutuhkan akses cepat ke pengaturan. [Halaman Profile](src/app/profile/profile-form.tsx) sebagai pusat kontrol global memungkinkan dia mengubah preferensi tanpa harus mencari-cari.

4. **G1 — Support Human Performance** — David bukan pemula, jadi dia menghargai bahwa AI hanya memberikan saran, bukan memaksakan keputusan. Kontrol penuh atas jalur belajar memberinya otonomi yang dia butuhkan.

5. **G9 — Distinguish AI Roles** — David yang berpengalaman dapat dengan mudah membedakan antara informasi faktual (rating, harga, durasi) dan interpretasi AI (alasan rekomendasi, match score). Namun, pembedaan visual yang jelas ([AIExplanationBadge](src/components/ai/AIExplanationBadge.tsx:45-46)) tetap penting untuk mempercepat proses pengambilan keputusannya.

---

## Bagian 6 — Sintesis dan Rujukan Silang

### 6.1 Peta Ruas Hubungan Persona dengan Pedoman

| Persona | Pedoman Utama yang Relevan | Fitur Terkait |
|---------|---------------------------|---------------|
| Sarah Williams (Pemula) | G2, G4, G8, G11, G16 | Rekomendasi Kursus, Jalur Belajar, Rekomendasi Karier |
| Dr. David Chen (Profesional) | G1, G13, G14, G17, G9 | Modifikasi Jalur Belajar, Katalog Kursus, Pengaturan Pengguna |

### 6.2 Analisis Ruas Hubungan

Dari peta di atas, terlihat bahwa setiap persona memiliki kebutuhan pedoman HAI yang berbeda sesuai dengan tingkat keahlian dan konteks penggunaannya:

**Sarah Williams** lebih mengandalkan pedoman yang berkaitan dengan **kejelasan dan transparansi** (G2, G4, G8, G11). Sebagai pemula, Sarah tidak memiliki domain knowledge yang cukup untuk mengevaluasi rekomendasi secara independen, sehingga dia sangat bergantung pada penjelasan AI yang mudah dipahami, tampilan akurasi yang jelas, dan indikasi konsekuensi yang eksplisit.

**Dr. David Chen** lebih mengandalkan pedoman yang berkaitan dengan **kontrol dan fleksibilitas** (G1, G13, G14, G17). Sebagai profesional berpengalaman, David mampu mengevaluasi rekomendasi sendiri, sehingga dia membutuhkan sistem yang memberinya otonomi penuh untuk menyesuaikan, memodifikasi, dan mengontrol pengalaman AI sesuai keinginannya.

### 6.3 Keterkaitan Fitur dengan Pedoman

Berikut adalah matriks keterkaitan fitur dengan pedoman utama:

| Fitur | Pedoman Kritis |
|-------|----------------|
| Kuesioner Level & Preferensi | G3, G5, G8, G10, G13 |
| Rekomendasi Kursus | G2, G4, G5, G8, G10, G11 |
| Jalur Belajar | G3, G5, G8, G10 |
| Modifikasi Jalur Belajar | G1, G6, G11, G13, G14, G16 |
| Rekomendasi Karier | G2, G4, G5, G8, G10, G11 |
| Katalog Kursus | G7, G13 |
| Pengaturan Pengguna | G13, G17 |
| Sistem Badge | G1, G6 |
| Onboarding & Intro Kuesioner | G3, G5, G8, G10 |

---

## Bagian 7 — Identifikasi Gap dan Future Work

Berdasarkan analisis mendalam terhadap kesesuaian antara 12 fitur PersonaLearn dan 18 pedoman HAI Microsoft Research, berikut adalah area yang masih perlu dikembangkan:

### 7.1 Pedoman 12: Provide Time Controls — Partially Implemented

**Status:** Hanya sebagian terimplementasi

**Kesenjangan:** Meskipun pengguna dapat mengubah preferensi pembelajaran di halaman profil, fitur pengingat belajar (study reminders) yang merupakan bagian dari pedoman ini belum sepenuhnya terimplementasi. Pengguna belum dapat mengatur frekuensi, waktu, dan saluran notifikasi pengingat belajar secara eksplisit.

**Rekomendasi Pengembangan:**
- Menambahkan pengaturan pengingat belajar pada halaman profil (waktu mulai, waktu akhir, frekuensi harian/mingguan)
- Mengimplementasikan sistem notifikasi (browser push notification atau email)
- Memberikan opsi untuk menonaktifkan semua pengingat secara global

### 7.2 Pedoman 18: Notify Users About Changes — Not Implemented

**Status:** Belum terimplementasi

**Kesenjangan:** Platform belum memiliki mekanisme untuk secara aktif memberi tahu pengguna ketika ada perubahan pada rekomendasi mereka. Ketika pengguna mengubah preferensi atau hasil kuesioner, mereka perlu diberitahu bahwa rekomendasi telah disesuaikan, tetapi saat ini tidak ada notifikasi yang muncul.

**Rekomendasi Pengembangan:**
- Mengimplementasikan sistem notifikasi yang memberitahu pengguna ketika rekomendasi telah diperbarui
- Menambahkan badge notifikasi pada navbar untuk perubahan rekomendasi
- Menampilkan toast notification setelah perubahan preferensi yang mempengaruhi rekomendasi
- Menyediakan halaman riwayat perubahan rekomendasi (recommended course history)

### 7.3 Area Pengembangan Jangka Panjang

Selain dua pedoman HAI yang belum diimplementasikan, terdapat area-area lain yang dapat dikembangkan untuk meningkatkan kepatuhan terhadap prinsip Human Centered AI:

1. **Explainability yang lebih mendalam:** Menambahkan fitur "kenapa kursus ini direkomendasikan" yang menampilkan faktor-faktor spesifik dari profil pengguna yang mempengaruhi rekomendasi (misalnya: "Kursus ini direkomendasikan karena Anda memilih level Beginner dan preferensi Data Science").

2. **Multi-language support:** Menambahkan dukungan bahasa Inggris sebagai alternatif, mengingat target pengguna PersonaLearn mencakup pengguna internasional.

3. **Accessibility enhancements:** Memastikan seluruh komponen AI dapat diakses oleh pengguna dengan disabilitas (screen reader support, keyboard navigation, high contrast mode).

4. **Bias detection dan mitigation:** Menambahkan mekanisme untuk mendeteksi dan mengurangi bias dalam rekomendasi, khususnya bias gender, ras, atau latar belakang pendidikan.

---

## Bagian 8 — Referensi

1. Microsoft Research. (2024). *Human Centered AI: Principles and Guidelines for Responsible AI Design*. Retrieved from https://www.microsoft.com/en-us/research/project/human-centered-ai/

2. Binns, R. (2018). Fairness in machine learning: Lessons from political philosophy. *Proceedings of the 2018 Conference on Fairness, Accountability and Transparency*, 149-164.

3. Doshi-Velez, F., & Kortli, K. (2017). Judging AI quality: A framework for evaluating explanations of machine learning models. *Proceedings of the AAAI Conference on Artificial Intelligence*, 31(1).

4. Rajkomar, A., Dean, J., & Kohane, I. (2019). Machine learning in medicine. *New England Journal of Medicine*, 380(14), 1347-1358.

5. Amershi, S., Weld, D., Vorvoreanu, M., & Byrd, J. (2019). Guidelines for Human-AI Interaction. *Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems*, 1-13.

6. IEEE Global Initiative on Ethics of Autonomous and Intelligent Systems. (2019). *Ethically Aligned Design: A Vision for Prioritizing Human Well-being with Autonomous and Intelligent Systems*. IEEE Standards Association.

7. European Commission High-Level Expert Group on AI. (2019). *Ethics Guidelines for Trustworthy AI*. Publications Office of the European Union.

8. Mittelstadt, B. (2019). Principles alone cannot guarantee ethical AI. *Nature Machine Intelligence*, 1(11), 501-507.
