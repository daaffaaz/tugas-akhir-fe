"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { primaryGoldCtaClass } from "@/lib/primary-cta";

const imgAvatar =
  "https://www.figma.com/api/mcp/asset/670578d8-e120-42d5-b51a-63caa7234ecf";

type OsChoice = "windows" | "macos" | "linux";
type StudySlot = "pagi" | "malam" | "kerja" | "weekend";

const initial = {
  fullName: "Alex Rivers",
  email: "Rafli@gmail.com",
  job: "Junior DevOps Engineer",
  ageRange: "18-24 th",
  education: "S1 (Sarjana)",
  os: "windows" as OsChoice,
  gitSkill: "Bisa git clone & push dasar",
  cliLevel: 2,
  logicLevel: 2,
  weeklyHours: "8 - 14 jam (Moderat)",
  studySlot: "malam" as StudySlot,
  materialFormat: "interactive" as
    | "video"
    | "text"
    | "interactive"
    | "project",
  theoryPractice: "Seimbang (50/50)",
  evaluation: "Coding Challenge",
  targetRole: "DevOps/Cloud",
  mainGoal: "Promosi/Upskilling",
  ram: "< 8GB",
  internet: "Cukup stabil",
  budget: "< Rp 500rb",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block px-1 pb-2 font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9ca3af]">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  className,
  ...rest
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      {...rest}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded border border-[#e5e7eb] bg-[#f7f7f7] px-4 py-3 font-body text-sm text-dark outline-none ring-gold/30 focus:ring-2",
        className,
      )}
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full cursor-pointer appearance-none rounded border border-[#e5e7eb] bg-[#f7f7f7] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat px-4 py-3 font-body text-sm text-dark outline-none ring-gold/30 focus:ring-2"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function SegmentedScale({
  value,
  onChange,
  labels,
}: {
  value: number;
  onChange: (n: number) => void;
  labels: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(i)}
          className={cn(
            "flex-1 rounded border px-2 py-2 text-center font-body text-[10px] font-bold uppercase leading-tight tracking-wide transition-colors min-w-[4.5rem]",
            value === i
              ? "border-gold bg-gold text-dark"
              : "border-[#e5e7eb] bg-white text-muted hover:border-gold/50",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function ProfileForm() {
  const [baseline] = useState(initial);
  const [form, setForm] = useState(initial);

  function setField<K extends keyof typeof initial>(
    key: K,
    value: (typeof initial)[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const onDiscard = () => setForm(baseline);

  const onSave = () => {
    if (typeof window !== "undefined") {
      console.info("[profile stub] save", form);
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1152px] flex-1 px-6 pb-24 pt-12 md:px-16">
      {/* Profile header */}
      <section className="mb-12 flex flex-wrap items-center gap-8 rounded border border-[#e0e0e0] bg-white p-8 shadow-sm">
        <div className="relative shrink-0">
          <div className="size-32 overflow-hidden rounded-full shadow-[0_0_0_4px_rgba(255,206,0,0.1)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgAvatar}
              alt=""
              className="size-full object-cover"
            />
          </div>
          <button
            type="button"
            className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full bg-gold text-dark shadow-md hover:bg-dark hover:text-gold"
            aria-label="Ubah foto profil"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 20h4l10.5-10.5-4-4L4 16v4z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 6.5l4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#1f2937]">
            Rafli SJW
          </h1>
          <p className="mt-1 flex items-center gap-2 font-body text-sm text-muted">
            <span className="inline-block size-3 rounded-full bg-gold/40" />
            Member sejak Oktober 2025
          </p>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left: Informasi diri */}
        <section className="lg:col-span-4">
          <div className="rounded border border-[#e0e0e0] bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 font-heading text-lg font-extrabold text-[#1f2937]">
              <span className="text-gold">&#9679;</span> Informasi Diri
            </h2>
            <div className="space-y-5">
              <div>
                <FieldLabel>Nama lengkap</FieldLabel>
                <TextInput
                  value={form.fullName}
                  onChange={(v) => setField("fullName", v)}
                />
              </div>
              <div>
                <FieldLabel>Email address</FieldLabel>
                <TextInput
                  type="email"
                  value={form.email}
                  onChange={(v) => setField("email", v)}
                />
              </div>
              <div>
                <FieldLabel>Pekerjaan</FieldLabel>
                <TextInput
                  value={form.job}
                  onChange={(v) => setField("job", v)}
                />
              </div>
              <div className="border-t border-[#f0f0f0] pt-6">
                <p className="mb-4 font-heading text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#9ca3af]">
                  Profil & demografi
                </p>
                <div className="space-y-4">
                  <div>
                    <FieldLabel>Usia</FieldLabel>
                    <Select
                      value={form.ageRange}
                      onChange={(v) => setField("ageRange", v)}
                      options={[
                        { value: "18-24 th", label: "18-24 th" },
                        { value: "25-34 th", label: "25-34 th" },
                        { value: "35+ th", label: "35+ th" },
                      ]}
                    />
                  </div>
                  <div>
                    <FieldLabel>Pendidikan terakhir</FieldLabel>
                    <Select
                      value={form.education}
                      onChange={(v) => setField("education", v)}
                      options={[
                        { value: "SMA", label: "SMA" },
                        { value: "D3", label: "D3" },
                        { value: "S1 (Sarjana)", label: "S1 (Sarjana)" },
                        { value: "S2", label: "S2" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: preferences */}
        <section className="space-y-8 lg:col-span-8">
          <div className="rounded border border-[#e0e0e0] bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-heading text-lg font-extrabold text-[#1f2937]">
              Preferensi pembelajaran
            </h2>
            <div className="space-y-6">
              <div>
                <p className="mb-2 font-body text-sm font-bold text-[#374151]">
                  Kompetensi teknis
                </p>
                <FieldLabel>Sistem operasi</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["windows", "Windows"],
                      ["macos", "macOS"],
                      ["linux", "Linux"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setField("os", key)}
                      className={cn(
                        "rounded-full px-4 py-2 font-body text-sm font-bold transition-colors",
                        form.os === key
                          ? "bg-gold text-dark"
                          : "bg-[#f3f4f6] text-[#4b5563] hover:bg-gold/30",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Kemampuan Git</FieldLabel>
                <Select
                  value={form.gitSkill}
                  onChange={(v) => setField("gitSkill", v)}
                  options={[
                    {
                      value: "Belum pernah",
                      label: "Belum pernah",
                    },
                    {
                      value: "Bisa git clone & push dasar",
                      label: "Bisa git clone & push dasar",
                    },
                    {
                      value: "Branching & merge nyaman",
                      label: "Branching & merge nyaman",
                    },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>CLI / terminal</FieldLabel>
                <SegmentedScale
                  value={form.cliLevel}
                  onChange={(n) => setField("cliLevel", n)}
                  labels={["Tidak pernah", "Jarang", "Sering", "Sangat sering"]}
                />
              </div>
              <div>
                <FieldLabel>Programming logic</FieldLabel>
                <SegmentedScale
                  value={form.logicLevel}
                  onChange={(n) => setField("logicLevel", n)}
                  labels={[
                    "Tidak paham",
                    "Teori saja",
                    "Bisa coding",
                    "Mahir",
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="rounded border border-[#e0e0e0] bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-heading text-lg font-extrabold text-[#1f2937]">
              Ketersediaan waktu
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <FieldLabel>Alokasi per minggu</FieldLabel>
                <Select
                  value={form.weeklyHours}
                  onChange={(v) => setField("weeklyHours", v)}
                  options={[
                    { value: "< 4 jam", label: "< 4 jam" },
                    { value: "4 - 8 jam", label: "4 - 8 jam" },
                    {
                      value: "8 - 14 jam (Moderat)",
                      label: "8 - 14 jam (Moderat)",
                    },
                    { value: "15+ jam", label: "15+ jam" },
                  ]}
                />
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Waktu belajar utama</FieldLabel>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(
                    [
                      ["pagi", "Pagi hari"],
                      ["malam", "Malam hari"],
                      ["kerja", "Jam kerja"],
                      ["weekend", "Weekend"],
                    ] as const
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded border px-3 py-3 font-body text-sm font-semibold",
                        form.studySlot === key
                          ? "border-gold bg-gold/10"
                          : "border-[#e5e7eb] hover:border-gold/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="slot"
                        className="accent-gold"
                        checked={form.studySlot === key}
                        onChange={() => setField("studySlot", key)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded border border-[#e0e0e0] bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-heading text-lg font-extrabold text-[#1f2937]">
              Gaya belajar
            </h2>
            <FieldLabel>Format materi paling efektif</FieldLabel>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(
                [
                  ["video", "Video"],
                  ["text", "Teks"],
                  ["interactive", "Interactive"],
                  ["project", "Project"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setField("materialFormat", key)}
                  className={cn(
                    "rounded-lg border-2 py-6 text-center font-heading text-xs font-extrabold uppercase tracking-wider",
                    form.materialFormat === key
                      ? "border-gold bg-gold/10 text-dark"
                      : "border-[#e5e7eb] text-muted hover:border-gold/40",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <FieldLabel>Komposisi teori vs praktik</FieldLabel>
                <Select
                  value={form.theoryPractice}
                  onChange={(v) => setField("theoryPractice", v)}
                  options={[
                    { value: "Teori lebih banyak", label: "Teori lebih banyak" },
                    { value: "Seimbang (50/50)", label: "Seimbang (50/50)" },
                    { value: "Praktik lebih banyak", label: "Praktik lebih banyak" },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Evaluasi favorit</FieldLabel>
                <Select
                  value={form.evaluation}
                  onChange={(v) => setField("evaluation", v)}
                  options={[
                    { value: "Quiz", label: "Quiz" },
                    { value: "Coding Challenge", label: "Coding Challenge" },
                    { value: "Proyek akhir", label: "Proyek akhir" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="rounded border border-[#e0e0e0] bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-heading text-lg font-extrabold text-[#1f2937]">
              Goals & motivasi
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <FieldLabel>Target role IT</FieldLabel>
                <Select
                  value={form.targetRole}
                  onChange={(v) => setField("targetRole", v)}
                  options={[
                    { value: "Backend", label: "Backend" },
                    { value: "DevOps/Cloud", label: "DevOps/Cloud" },
                    { value: "Data/ML", label: "Data/ML" },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Tujuan utama</FieldLabel>
                <Select
                  value={form.mainGoal}
                  onChange={(v) => setField("mainGoal", v)}
                  options={[
                    { value: "Karir baru", label: "Karir baru" },
                    { value: "Promosi/Upskilling", label: "Promosi/Upskilling" },
                    { value: "Hobi", label: "Hobi" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="rounded border border-[#e0e0e0] bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-heading text-lg font-extrabold text-[#1f2937]">
              Hardware & kendala
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <FieldLabel>RAM laptop</FieldLabel>
                <Select
                  value={form.ram}
                  onChange={(v) => setField("ram", v)}
                  options={[
                    { value: "< 8GB", label: "< 8GB" },
                    { value: "8 - 16GB", label: "8 - 16GB" },
                    { value: "16GB+", label: "16GB+" },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Kualitas internet</FieldLabel>
                <Select
                  value={form.internet}
                  onChange={(v) => setField("internet", v)}
                  options={[
                    { value: "Kurang stabil", label: "Kurang stabil" },
                    { value: "Cukup stabil", label: "Cukup stabil" },
                    { value: "Sangat stabil", label: "Sangat stabil" },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Budget tools</FieldLabel>
                <Select
                  value={form.budget}
                  onChange={(v) => setField("budget", v)}
                  options={[
                    { value: "< Rp 500rb", label: "< Rp 500rb" },
                    { value: "Rp 500rb - 2jt", label: "Rp 500rb - 2jt" },
                    { value: "> 2jt", label: "> 2jt" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4 pb-8">
            <button
              type="button"
              onClick={onDiscard}
              className="font-body text-sm font-bold text-[#374151] underline-offset-4 hover:underline"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={onSave}
              className={primaryGoldCtaClass(
                "rounded px-10 py-3 font-body text-sm font-bold shadow-sm",
              )}
            >
              Save changes
            </button>
          </div>
        </section>
      </div>

      <footer className="mt-16 border-t border-[rgba(209,209,209,0.35)] pt-10">
        <div className="flex flex-col justify-between gap-6 text-[11px] font-bold uppercase tracking-wide text-[#4a4a4a] md:flex-row md:items-center">
          <p>© 2024 PrecisionLearn IT. All rights reserved.</p>
          <div className="flex flex-wrap gap-8">
            <span className="cursor-pointer hover:text-dark">Legal</span>
            <span className="cursor-pointer hover:text-dark">Support</span>
            <span className="cursor-pointer hover:text-dark">Privacy policy</span>
            <span className="cursor-pointer hover:text-dark">Terms of service</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
