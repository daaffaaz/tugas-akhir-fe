"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import { useAuth } from "@/context/AuthContext";
import {
  getProfile,
  getPreferences,
  updateProfile,
  updatePreferences,
  uploadAvatar,
} from "@/lib/api/profile";
import {
  getUserAnswers,
  patchUserAnswers,
  type ApiQuestion,
  type QuestionnaireAnswer,
} from "@/lib/api/questionnaire";

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

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-8 w-48 rounded bg-[#e5e7eb]" />
      <div className="h-4 w-32 rounded bg-[#f3f4f6]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Question card — renders a single question with selectable options
// ---------------------------------------------------------------------------

function QuestionCard({
  question,
  selected,
  onSelect,
  disabled,
  index,
}: {
  question: ApiQuestion;
  selected: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
  index: number;
}) {
  const options = Object.entries(question.options_json);
  // For ≤4 short options use grid; for ≥5 or longer text use stacked list.
  const useGrid =
    options.length <= 4 &&
    options.every(([, label]) => label.length <= 28);

  return (
    <div className="rounded border border-[#e5e7eb] bg-white p-5">
      <div className="mb-3 flex items-start gap-3">
        <span className="mt-[2px] flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/15 font-heading text-[10px] font-extrabold text-dark">
          {index}
        </span>
        <div className="flex-1">
          <p className="font-body text-sm font-semibold leading-[20px] text-[#1f2937]">
            {question.question_text}
          </p>
          {selected === null && (
            <p className="mt-1 font-body text-[11px] font-semibold text-amber-700">
              Belum dijawab
            </p>
          )}
        </div>
      </div>
      <div
        className={cn(
          "gap-2",
          useGrid
            ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2"
            : "flex flex-col",
        )}
      >
        {options.map(([key, label]) => {
          const isActive = selected === key;
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(key)}
              className={cn(
                "flex items-center gap-2 rounded border px-3 py-2.5 text-left font-body text-[13px] transition-colors",
                isActive
                  ? "border-gold bg-gold/15 font-bold text-dark"
                  : "border-[#e5e7eb] bg-white text-[#4b5563] hover:border-gold/50",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full font-heading text-[10px] font-extrabold",
                  isActive
                    ? "bg-dark text-gold"
                    : "bg-[#f3f4f6] text-[#6b7280]",
                )}
              >
                {key}
              </span>
              <span className="flex-1 leading-tight">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type Props = {
  questions: ApiQuestion[];
};

export function ProfileForm({ questions }: Props) {
  const router = useRouter();
  const { signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogout() {
    signOut();
    router.push("/login");
  }

  // --- Profile (full_name, email, avatar) ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [questionnaireCompletedAt, setQuestionnaireCompletedAt] = useState<
    string | null
  >(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // --- Preferences (only job_title is editable here, the rest derive from
  // questionnaire answers in BE). Loaded for legacy compatibility. ---
  const [jobTitle, setJobTitle] = useState("");
  const [prefsLoading, setPrefsLoading] = useState(true);

  // --- Questionnaire answers: { [question_id]: option_key } ---
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answersLoading, setAnswersLoading] = useState(true);
  const [answersError, setAnswersError] = useState<string | null>(null);

  // --- Baseline snapshots for Discard ---
  const [baselineName, setBaselineName] = useState("");
  const [baselineJobTitle, setBaselineJobTitle] = useState("");
  const [baselineAnswers, setBaselineAnswers] = useState<
    Record<string, string>
  >({});

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
        setQuestionnaireCompletedAt(p.questionnaire_completed_at);
      })
      .catch((err: unknown) => {
        setProfileError(
          err instanceof Error ? err.message : "Gagal memuat profil.",
        );
      })
      .finally(() => setProfileLoading(false));

    getPreferences()
      .then((raw) => {
        setJobTitle(raw.job_title ?? "");
        setBaselineJobTitle(raw.job_title ?? "");
      })
      .catch(() => {
        // If preferences don't exist yet, fall back to defaults silently
      })
      .finally(() => setPrefsLoading(false));

    getUserAnswers()
      .then((list) => {
        const map: Record<string, string> = {};
        for (const a of list) {
          map[a.question_id] = a.answer_option;
        }
        setAnswers(map);
        setBaselineAnswers(map);
      })
      .catch((err: unknown) => {
        setAnswersError(
          err instanceof Error
            ? err.message
            : "Gagal memuat jawaban questionnaire.",
        );
      })
      .finally(() => setAnswersLoading(false));
  }, []);

  // Group questions by section, preserving order_number order.
  const sections = useMemo(() => {
    const sorted = [...questions].sort(
      (a, b) => (a.order_number ?? 0) - (b.order_number ?? 0),
    );
    const map = new Map<string, ApiQuestion[]>();
    for (const q of sorted) {
      const sec = q.section ?? "Lainnya";
      if (!map.has(sec)) map.set(sec, []);
      map.get(sec)!.push(q);
    }
    return [...map.entries()].map(([section, items]) => ({ section, items }));
  }, [questions]);

  // Total answered count for the summary bar.
  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id]).length,
    [questions, answers],
  );

  function selectAnswer(questionId: string, option: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
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
    setJobTitle(baselineJobTitle);
    setAnswers(baselineAnswers);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const onSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    // Compute deltas — only PATCH what actually changed.
    const nameChanged = fullName !== baselineName;
    const jobTitleChanged = jobTitle !== baselineJobTitle;
    const changedAnswers: QuestionnaireAnswer[] = [];
    for (const q of questions) {
      const next = answers[q.id];
      if (next && next !== baselineAnswers[q.id]) {
        changedAnswers.push({ question_id: q.id, answer_option: next });
      }
    }

    try {
      const ops: Promise<unknown>[] = [];
      if (nameChanged) ops.push(updateProfile({ full_name: fullName }));
      if (jobTitleChanged) ops.push(updatePreferences({ job_title: jobTitle }));
      if (changedAnswers.length > 0) ops.push(patchUserAnswers(changedAnswers));

      await Promise.all(ops);

      setBaselineName(fullName);
      setBaselineJobTitle(jobTitle);
      setBaselineAnswers({ ...answers });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Gagal menyimpan perubahan.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const avatarSrc =
    avatarUrl ??
    "/images/670578d8-e120-42d5-b51a-63caa7234ecf.png";

  const isFormDisabled = profileLoading || prefsLoading || answersLoading;
  const isDirty =
    fullName !== baselineName ||
    jobTitle !== baselineJobTitle ||
    questions.some((q) => answers[q.id] !== baselineAnswers[q.id]);

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
        <div className="flex flex-1 flex-wrap items-start justify-between gap-4">
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
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded border border-[#e5e7eb] bg-white px-4 py-2 font-body text-sm font-bold text-[#374151] shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 16l4-4m0 0l-4-4m4 4H7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Keluar
          </button>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left: Informasi diri */}
        <section className="lg:col-span-4">
          <div className="sticky top-24 rounded border border-[#e0e0e0] bg-white p-8 shadow-sm">
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
                  value={jobTitle}
                  onChange={setJobTitle}
                  disabled={isFormDisabled}
                  placeholder="Contoh: Software Engineer"
                />
              </div>
            </div>

            <div className="mt-8 border-t border-[#f0f0f0] pt-6">
              <p className="mb-2 font-heading text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#9ca3af]">
                Status questionnaire
              </p>
              {answersLoading ? (
                <div className="h-4 w-32 animate-pulse rounded bg-[#f3f4f6]" />
              ) : (
                <p className="font-body text-sm text-[#374151]">
                  {answeredCount} dari {questions.length} pertanyaan terjawab
                  {questionnaireCompletedAt && (
                    <span className="block pt-1 text-[11px] text-[#9ca3af]">
                      Diselesaikan pertama kali:{" "}
                      {new Date(questionnaireCompletedAt).toLocaleDateString(
                        "id-ID",
                        { dateStyle: "medium" },
                      )}
                    </span>
                  )}
                </p>
              )}
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f3f4f6]">
                <div
                  className="h-full bg-gold transition-[width] duration-500"
                  style={{
                    width: `${
                      questions.length > 0
                        ? Math.round((answeredCount / questions.length) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right: 32 questionnaire questions grouped by section */}
        <section className="space-y-8 lg:col-span-8">
          {answersError && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 font-body text-sm font-semibold text-red-700">
              {answersError}
            </div>
          )}

          {sections.map(({ section, items }) => (
            <div
              key={section}
              className="rounded border border-[#e0e0e0] bg-white p-8 shadow-sm"
            >
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <h2 className="font-heading text-lg font-extrabold capitalize text-[#1f2937]">
                  {section.toLowerCase()}
                </h2>
                <span className="font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9ca3af]">
                  {items.filter((q) => answers[q.id]).length} / {items.length}
                </span>
              </div>
              <div className="space-y-4">
                {items.map((q) => (
                  <QuestionCard
                    key={q.id}
                    index={q.order_number ?? 0}
                    question={q}
                    selected={answers[q.id] ?? null}
                    onSelect={(opt) => selectAnswer(q.id, opt)}
                    disabled={isFormDisabled || isSaving}
                  />
                ))}
              </div>
            </div>
          ))}

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

          <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-4 rounded border border-[#e0e0e0] bg-white/95 p-4 shadow-md backdrop-blur">
            <span className="mr-auto font-body text-xs font-bold text-[#6b7280]">
              {isDirty ? "Ada perubahan belum disimpan" : "Tidak ada perubahan"}
            </span>
            <button
              type="button"
              onClick={onDiscard}
              disabled={isSaving || !isDirty}
              className="font-body text-sm font-bold text-[#374151] underline-offset-4 hover:underline disabled:opacity-50"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || isFormDisabled || !isDirty}
              className={primaryGoldCtaClass(
                "rounded px-10 py-3 font-body text-sm font-bold shadow-sm disabled:opacity-60",
              )}
            >
              {isSaving ? "Menyimpan..." : "Save changes"}
            </button>
          </div>
        </section>
      </div>

    </main>
  );
}
