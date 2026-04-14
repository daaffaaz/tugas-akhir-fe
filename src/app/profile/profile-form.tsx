"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import {
  getProfile,
  getPreferences,
  updateProfile,
  updatePreferences,
  uploadAvatar,
  type UserPreferences,
} from "@/lib/api/profile";

// ---------------------------------------------------------------------------
// Preference state type — mirrors UserPreferences but with non-null defaults
// ---------------------------------------------------------------------------

type PrefsForm = {
  job_title: string;
  age_range: string;
  education_level: string;
  operating_system: "windows" | "macos" | "linux";
  git_skill: "none" | "basic" | "intermediate";
  cli_level: number;
  logic_level: number;
  weekly_hours: string;
  study_slot: "pagi" | "malam" | "kerja" | "weekend";
  material_format: "video" | "text" | "interactive" | "project";
  theory_practice: "theory" | "balanced" | "practice";
  evaluation_type: "quiz" | "coding_challenge" | "project";
  target_role: "backend" | "devops" | "data_ml";
  main_goal: "career_change" | "upskilling" | "hobby";
  ram_gb: "<8" | "8-16" | "16+";
  internet_quality: "unstable" | "stable" | "very_stable";
  budget_idr: "<500k" | "500k-2m" | ">2m";
};

const defaultPrefs: PrefsForm = {
  job_title: "",
  age_range: "18-24",
  education_level: "S1",
  operating_system: "windows",
  git_skill: "none",
  cli_level: 0,
  logic_level: 0,
  weekly_hours: "<4",
  study_slot: "malam",
  material_format: "interactive",
  theory_practice: "balanced",
  evaluation_type: "coding_challenge",
  target_role: "devops",
  main_goal: "upskilling",
  ram_gb: "<8",
  internet_quality: "stable",
  budget_idr: "<500k",
};

function apiPrefsToForm(raw: UserPreferences): PrefsForm {
  return {
    job_title: raw.job_title ?? "",
    age_range: raw.age_range ?? defaultPrefs.age_range,
    education_level: raw.education_level ?? defaultPrefs.education_level,
    operating_system:
      (raw.operating_system as PrefsForm["operating_system"]) ??
      defaultPrefs.operating_system,
    git_skill:
      (raw.git_skill as PrefsForm["git_skill"]) ?? defaultPrefs.git_skill,
    cli_level: raw.cli_level ?? 0,
    logic_level: raw.logic_level ?? 0,
    weekly_hours: raw.weekly_hours ?? defaultPrefs.weekly_hours,
    study_slot:
      (raw.study_slot as PrefsForm["study_slot"]) ?? defaultPrefs.study_slot,
    material_format:
      (raw.material_format as PrefsForm["material_format"]) ??
      defaultPrefs.material_format,
    theory_practice:
      (raw.theory_practice as PrefsForm["theory_practice"]) ??
      defaultPrefs.theory_practice,
    evaluation_type:
      (raw.evaluation_type as PrefsForm["evaluation_type"]) ??
      defaultPrefs.evaluation_type,
    target_role:
      (raw.target_role as PrefsForm["target_role"]) ?? defaultPrefs.target_role,
    main_goal:
      (raw.main_goal as PrefsForm["main_goal"]) ?? defaultPrefs.main_goal,
    ram_gb: (raw.ram_gb as PrefsForm["ram_gb"]) ?? defaultPrefs.ram_gb,
    internet_quality:
      (raw.internet_quality as PrefsForm["internet_quality"]) ??
      defaultPrefs.internet_quality,
    budget_idr:
      (raw.budget_idr as PrefsForm["budget_idr"]) ?? defaultPrefs.budget_idr,
  };
}

// ---------------------------------------------------------------------------
// Small UI helpers
// ---------------------------------------------------------------------------

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
  readOnly,
  disabled,
  ...rest
}: Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "readOnly" | "disabled"
> & {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
}) {
  return (
    <input
      {...rest}
      value={value}
      readOnly={readOnly}
      disabled={disabled}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      className={cn(
        "w-full rounded border border-[#e5e7eb] bg-[#f7f7f7] px-4 py-3 font-body text-sm text-dark outline-none ring-gold/30 focus:ring-2",
        (readOnly ?? disabled) && "cursor-not-allowed opacity-60",
        className,
      )}
    />
  );
}

function Select({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full cursor-pointer appearance-none rounded border border-[#e5e7eb] bg-[#f7f7f7] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat px-4 py-3 font-body text-sm text-dark outline-none ring-gold/30 focus:ring-2",
        disabled && "cursor-not-allowed opacity-60",
      )}
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
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  labels: string[];
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          disabled={disabled}
          onClick={() => onChange(i)}
          className={cn(
            "flex-1 rounded border px-2 py-2 text-center font-body text-[10px] font-bold uppercase leading-tight tracking-wide transition-colors min-w-[4.5rem]",
            value === i
              ? "border-gold bg-gold text-dark"
              : "border-[#e5e7eb] bg-white text-muted hover:border-gold/50",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-8 w-48 rounded bg-[#e5e7eb]" />
      <div className="h-4 w-32 rounded bg-[#f3f4f6]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ProfileForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Backend-managed fields ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // --- Preference fields (GET/PATCH /api/users/preferences/) ---
  const [prefs, setPrefs] = useState<PrefsForm>(defaultPrefs);
  const [prefsLoading, setPrefsLoading] = useState(true);

  // --- Baseline snapshots for Discard ---
  const [baselineName, setBaselineName] = useState("");
  const [baselinePrefs, setBaselinePrefs] = useState<PrefsForm>(defaultPrefs);

  // --- Save state ---
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getProfile()
      .then((p) => {
        setFullName(p.full_name);
        setBaselineName(p.full_name);
        setEmail(p.email);
        setAvatarUrl(p.avatar_url ?? null);
      })
      .catch((err: unknown) => {
        setProfileError(
          err instanceof Error ? err.message : "Gagal memuat profil.",
        );
      })
      .finally(() => setProfileLoading(false));

    getPreferences()
      .then((raw) => {
        const loaded = apiPrefsToForm(raw);
        setPrefs(loaded);
        setBaselinePrefs(loaded);
      })
      .catch(() => {
        // If preferences don't exist yet, fall back to defaults silently
      })
      .finally(() => setPrefsLoading(false));
  }, []);

  function setPrefsField<K extends keyof PrefsForm>(
    key: K,
    value: PrefsForm[K],
  ) {
    setPrefs((p) => ({ ...p, [key]: value }));
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setAvatarError(null);
    try {
      const { avatar_url } = await uploadAvatar(file);
      await updateProfile({ avatar_url });
      setAvatarUrl(avatar_url);
    } catch (err: unknown) {
      setAvatarError(
        err instanceof Error ? err.message : "Gagal mengunggah foto.",
      );
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  }

  const onDiscard = () => {
    setFullName(baselineName);
    setPrefs(baselinePrefs);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const onSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const [updatedProfile] = await Promise.all([
        updateProfile({ full_name: fullName }),
        updatePreferences(prefs),
      ]);
      setFullName(updatedProfile.full_name);
      setBaselineName(updatedProfile.full_name);
      setBaselinePrefs(prefs);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Gagal menyimpan profil.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const avatarSrc =
    avatarUrl ??
    "https://www.figma.com/api/mcp/asset/670578d8-e120-42d5-b51a-63caa7234ecf";

  const isFormDisabled = profileLoading || prefsLoading;

  return (
    <main className="mx-auto w-full max-w-[1152px] flex-1 px-6 pb-24 pt-12 md:px-16">
      {/* Profile header */}
      <section className="mb-12 flex flex-wrap items-center gap-8 rounded border border-[#e0e0e0] bg-white p-8 shadow-sm">
        <div className="relative shrink-0">
          <div className="size-32 overflow-hidden rounded-full shadow-[0_0_0_4px_rgba(255,206,0,0.1)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt=""
              className={cn(
                "size-full object-cover transition-opacity",
                avatarUploading && "opacity-50",
              )}
            />
          </div>
          <button
            type="button"
            disabled={avatarUploading}
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full bg-gold text-dark shadow-md hover:bg-dark hover:text-gold disabled:opacity-60"
            aria-label="Ubah foto profil"
          >
            {avatarUploading ? (
              <svg
                className="animate-spin"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="40"
                  strokeDashoffset="10"
                />
              </svg>
            ) : (
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
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          {profileLoading ? (
            <ProfileSkeleton />
          ) : profileError ? (
            <p className="font-body text-sm font-semibold text-red-500">
              {profileError}
            </p>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#1f2937]">
                {fullName || "—"}
              </h1>
              <p className="mt-1 flex items-center gap-2 font-body text-sm text-muted">
                <span className="inline-block size-3 rounded-full bg-gold/40" />
                {email}
              </p>
            </>
          )}
          {avatarError && (
            <p className="mt-2 font-body text-xs font-semibold text-red-500">
              {avatarError}
            </p>
          )}
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
                  value={fullName}
                  onChange={setFullName}
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <FieldLabel>Email address</FieldLabel>
                <TextInput
                  type="email"
                  value={email}
                  readOnly
                  title="Email tidak dapat diubah"
                />
              </div>
              <div>
                <FieldLabel>Pekerjaan</FieldLabel>
                <TextInput
                  value={prefs.job_title}
                  onChange={(v) => setPrefsField("job_title", v)}
                  disabled={isFormDisabled}
                />
              </div>
              <div className="border-t border-[#f0f0f0] pt-6">
                <p className="mb-4 font-heading text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#9ca3af]">
                  Profil &amp; demografi
                </p>
                <div className="space-y-4">
                  <div>
                    <FieldLabel>Usia</FieldLabel>
                    <Select
                      value={prefs.age_range}
                      onChange={(v) => setPrefsField("age_range", v)}
                      disabled={isFormDisabled}
                      options={[
                        { value: "18-24", label: "18-24 th" },
                        { value: "25-34", label: "25-34 th" },
                        { value: "35+", label: "35+ th" },
                      ]}
                    />
                  </div>
                  <div>
                    <FieldLabel>Pendidikan terakhir</FieldLabel>
                    <Select
                      value={prefs.education_level}
                      onChange={(v) => setPrefsField("education_level", v)}
                      disabled={isFormDisabled}
                      options={[
                        { value: "SMA", label: "SMA" },
                        { value: "D3", label: "D3" },
                        { value: "S1", label: "S1 (Sarjana)" },
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
                      disabled={isFormDisabled}
                      onClick={() => setPrefsField("operating_system", key)}
                      className={cn(
                        "rounded-full px-4 py-2 font-body text-sm font-bold transition-colors",
                        prefs.operating_system === key
                          ? "bg-gold text-dark"
                          : "bg-[#f3f4f6] text-[#4b5563] hover:bg-gold/30",
                        isFormDisabled && "cursor-not-allowed opacity-60",
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
                  value={prefs.git_skill}
                  onChange={(v) => setPrefsField("git_skill", v as PrefsForm["git_skill"])}
                  disabled={isFormDisabled}
                  options={[
                    { value: "none", label: "Belum pernah" },
                    { value: "basic", label: "Bisa git clone & push dasar" },
                    { value: "intermediate", label: "Branching & merge nyaman" },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>CLI / terminal</FieldLabel>
                <SegmentedScale
                  value={prefs.cli_level}
                  onChange={(n) => setPrefsField("cli_level", n)}
                  disabled={isFormDisabled}
                  labels={["Tidak pernah", "Jarang", "Sering", "Sangat sering"]}
                />
              </div>
              <div>
                <FieldLabel>Programming logic</FieldLabel>
                <SegmentedScale
                  value={prefs.logic_level}
                  onChange={(n) => setPrefsField("logic_level", n)}
                  disabled={isFormDisabled}
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
                  value={prefs.weekly_hours}
                  onChange={(v) => setPrefsField("weekly_hours", v)}
                  disabled={isFormDisabled}
                  options={[
                    { value: "<4", label: "< 4 jam" },
                    { value: "4-8", label: "4 - 8 jam" },
                    { value: "8-14", label: "8 - 14 jam (Moderat)" },
                    { value: "15+", label: "15+ jam" },
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
                        prefs.study_slot === key
                          ? "border-gold bg-gold/10"
                          : "border-[#e5e7eb] hover:border-gold/40",
                        isFormDisabled && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <input
                        type="radio"
                        name="slot"
                        className="accent-gold"
                        disabled={isFormDisabled}
                        checked={prefs.study_slot === key}
                        onChange={() => setPrefsField("study_slot", key)}
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
                  disabled={isFormDisabled}
                  onClick={() => setPrefsField("material_format", key)}
                  className={cn(
                    "rounded-lg border-2 py-6 text-center font-heading text-xs font-extrabold uppercase tracking-wider",
                    prefs.material_format === key
                      ? "border-gold bg-gold/10 text-dark"
                      : "border-[#e5e7eb] text-muted hover:border-gold/40",
                    isFormDisabled && "cursor-not-allowed opacity-60",
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
                  value={prefs.theory_practice}
                  onChange={(v) =>
                    setPrefsField("theory_practice", v as PrefsForm["theory_practice"])
                  }
                  disabled={isFormDisabled}
                  options={[
                    { value: "theory", label: "Teori lebih banyak" },
                    { value: "balanced", label: "Seimbang (50/50)" },
                    { value: "practice", label: "Praktik lebih banyak" },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Evaluasi favorit</FieldLabel>
                <Select
                  value={prefs.evaluation_type}
                  onChange={(v) =>
                    setPrefsField(
                      "evaluation_type",
                      v as PrefsForm["evaluation_type"],
                    )
                  }
                  disabled={isFormDisabled}
                  options={[
                    { value: "quiz", label: "Quiz" },
                    { value: "coding_challenge", label: "Coding Challenge" },
                    { value: "project", label: "Proyek akhir" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="rounded border border-[#e0e0e0] bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-heading text-lg font-extrabold text-[#1f2937]">
              Goals &amp; motivasi
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <FieldLabel>Target role IT</FieldLabel>
                <Select
                  value={prefs.target_role}
                  onChange={(v) =>
                    setPrefsField("target_role", v as PrefsForm["target_role"])
                  }
                  disabled={isFormDisabled}
                  options={[
                    { value: "backend", label: "Backend" },
                    { value: "devops", label: "DevOps/Cloud" },
                    { value: "data_ml", label: "Data/ML" },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Tujuan utama</FieldLabel>
                <Select
                  value={prefs.main_goal}
                  onChange={(v) =>
                    setPrefsField("main_goal", v as PrefsForm["main_goal"])
                  }
                  disabled={isFormDisabled}
                  options={[
                    { value: "career_change", label: "Karir baru" },
                    { value: "upskilling", label: "Promosi/Upskilling" },
                    { value: "hobby", label: "Hobi" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="rounded border border-[#e0e0e0] bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-heading text-lg font-extrabold text-[#1f2937]">
              Hardware &amp; kendala
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <FieldLabel>RAM laptop</FieldLabel>
                <Select
                  value={prefs.ram_gb}
                  onChange={(v) =>
                    setPrefsField("ram_gb", v as PrefsForm["ram_gb"])
                  }
                  disabled={isFormDisabled}
                  options={[
                    { value: "<8", label: "< 8GB" },
                    { value: "8-16", label: "8 - 16GB" },
                    { value: "16+", label: "16GB+" },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Kualitas internet</FieldLabel>
                <Select
                  value={prefs.internet_quality}
                  onChange={(v) =>
                    setPrefsField(
                      "internet_quality",
                      v as PrefsForm["internet_quality"],
                    )
                  }
                  disabled={isFormDisabled}
                  options={[
                    { value: "unstable", label: "Kurang stabil" },
                    { value: "stable", label: "Cukup stabil" },
                    { value: "very_stable", label: "Sangat stabil" },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Budget tools</FieldLabel>
                <Select
                  value={prefs.budget_idr}
                  onChange={(v) =>
                    setPrefsField("budget_idr", v as PrefsForm["budget_idr"])
                  }
                  disabled={isFormDisabled}
                  options={[
                    { value: "<500k", label: "< Rp 500rb" },
                    { value: "500k-2m", label: "Rp 500rb - 2jt" },
                    { value: ">2m", label: "> 2jt" },
                  ]}
                />
              </div>
            </div>
          </div>

          {saveError && (
            <p className="rounded border border-red-200 bg-red-50 px-4 py-3 font-body text-sm font-semibold text-red-600">
              {saveError}
            </p>
          )}
          {saveSuccess && (
            <p className="rounded border border-green-200 bg-green-50 px-4 py-3 font-body text-sm font-semibold text-green-700">
              Profil berhasil disimpan.
            </p>
          )}

          <div className="flex flex-wrap items-center justify-end gap-4 pb-8">
            <button
              type="button"
              onClick={onDiscard}
              disabled={isSaving}
              className="font-body text-sm font-bold text-[#374151] underline-offset-4 hover:underline disabled:opacity-50"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || isFormDisabled}
              className={primaryGoldCtaClass(
                "rounded px-10 py-3 font-body text-sm font-bold shadow-sm disabled:opacity-60",
              )}
            >
              {isSaving ? "Menyimpan..." : "Save changes"}
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
