export type QuestionOption = {
  id: string;
  label: string;
};

export type QuestionnaireQuestion = {
  id: string;
  prompt: string;
  options: QuestionOption[];
};

export const QUESTIONNAIRE_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: "q1",
    prompt: "Apa tujuan utama Anda menggunakan PersonaLearn?",
    options: [
      { id: "q1-a", label: "Meningkatkan skill untuk pekerjaan saat ini" },
      { id: "q1-b", label: "Berpindah karier ke bidang IT" },
      { id: "q1-c", label: "Persiapan sertifikasi profesional" },
    ],
  },
  {
    id: "q2",
    prompt: "Berapa lama pengalaman Anda di bidang teknologi?",
    options: [
      { id: "q2-a", label: "Baru memulai (< 1 tahun)" },
      { id: "q2-b", label: "1–3 tahun" },
      { id: "q2-c", label: "Lebih dari 3 tahun" },
    ],
  },
  {
    id: "q3",
    prompt: "Berapa jam per minggu yang bisa Anda luangkan untuk belajar?",
    options: [
      { id: "q3-a", label: "Kurang dari 5 jam" },
      { id: "q3-b", label: "5–10 jam" },
      { id: "q3-c", label: "Lebih dari 10 jam" },
    ],
  },
  {
    id: "q4",
    prompt: "Gaya belajar mana yang paling Anda sukai?",
    options: [
      { id: "q4-a", label: "Video dan hands-on project" },
      { id: "q4-b", label: "Membaca dan kuis" },
      { id: "q4-c", label: "Campuran keduanya" },
    ],
  },
  {
    id: "q5",
    prompt:
      "Berapa budget maksimal yang Anda siapkan untuk mengambil satu kursus?",
    options: [
      { id: "q5-a", label: "0 - 100k Rupiah" },
      { id: "q5-b", label: "100k - 250k Rupiah" },
      { id: "q5-c", label: "> 250k Rupiah" },
    ],
  },
  {
    id: "q6",
    prompt: "Kapan Anda ingin menyelesaikan jalur belajar utama?",
    options: [
      { id: "q6-a", label: "Dalam 3 bulan" },
      { id: "q6-b", label: "3–6 bulan" },
      { id: "q6-c", label: "Lebih dari 6 bulan" },
    ],
  },
  {
    id: "q7",
    prompt: "Bahasa pemrograman atau domain mana yang paling menarik?",
    options: [
      { id: "q7-a", label: "Web (frontend/backend)" },
      { id: "q7-b", label: "Data & AI" },
      { id: "q7-c", label: "DevOps / Cloud" },
    ],
  },
  {
    id: "q8",
    prompt: "Platform pembelajaran mana yang sudah pernah Anda gunakan?",
    options: [
      { id: "q8-a", label: "Coursera / edX" },
      { id: "q8-b", label: "Udemy / Skillshare" },
      { id: "q8-c", label: "Belum pernah / lainnya" },
    ],
  },
  {
    id: "q9",
    prompt: "Seberapa penting sertifikat resmi bagi Anda?",
    options: [
      { id: "q9-a", label: "Sangat penting" },
      { id: "q9-b", label: "Cukup penting" },
      { id: "q9-c", label: "Tidak terlalu penting" },
    ],
  },
  {
    id: "q10",
    prompt: "Bagaimana Anda ingin menerima rekomendasi jalur belajar?",
    options: [
      { id: "q10-a", label: "Langsung penuh dari AI" },
      { id: "q10-b", label: "Saya ingin menyesuaikan manual" },
      { id: "q10-c", label: "Kombinasi keduanya" },
    ],
  },
];

export const QUESTIONNAIRE_TOTAL = QUESTIONNAIRE_QUESTIONS.length;

export const QUESTIONNAIRE_STORAGE_KEY = "personalearn_questionnaire_answers";
