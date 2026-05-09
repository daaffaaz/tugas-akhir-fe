import type { RagLearningPathResponse } from "@/types/rag";

interface Props {
  path: RagLearningPathResponse;
  courseCount: number;
  completedCount: number;
}

export function PathOverviewCard({ path, courseCount, completedCount }: Props) {
  const snap = path.questionnaire_snapshot;
  const title = snap?.roadmap_title ?? path.title;
  const overview = snap?.overview ?? path.description;
  const totalWeeks = snap?.total_duration_weeks;
  const totalHours = snap?.total_hours_estimated;
  const difficulty = snap?.difficulty_curve;
  const targetSkills = snap?.target_skills ?? [];
  const progress = path.progress_percentage ?? 0;
  const regenCount = (path as unknown as { regenerate_count?: number }).regenerate_count;

  return (
    <div className="flex flex-col gap-5">
      {/* Title row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-[28px] font-extrabold leading-none tracking-[-0.9px] text-[#1c1c1c] sm:text-[36px]">
            {title}
          </h1>
          {regenCount != null && regenCount > 0 && (
            <span className="rounded-full bg-gold px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wide text-dark">
              Regen {regenCount}
            </span>
          )}
        </div>
        <div className="self-start rounded bg-[#1c1c1c] px-3 py-1">
          <span className="font-heading text-[10px] font-extrabold uppercase tracking-[1px] text-white">
            {courseCount} Courses
          </span>
        </div>
      </div>

      {/* Overview text */}
      {overview && (
        <p className="font-body text-[14px] leading-[22.75px] text-[#4b5563]">
          {overview}
        </p>
      )}

      {/* Stats strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded border border-[#e5e7eb] bg-white px-5 py-4 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        {totalWeeks ? <Stat icon={<CalendarIcon />} value={`${totalWeeks} minggu`} /> : null}
        {totalHours ? <Stat icon={<ClockIcon />} value={`${totalHours} jam`} /> : null}
        {difficulty ? <Stat icon={<ChartIcon />} value={difficulty} /> : null}
        <Stat icon={<CheckCircleIcon />} value={`${completedCount}/${courseCount} selesai`} />
        <div className="flex min-w-[160px] flex-1 items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e5e7eb]">
            <div
              className="h-full rounded-full bg-gold transition-[width]"
              style={{ width: `${Math.round(progress)}%` }}
            />
          </div>
          <span className="font-heading text-[12px] font-extrabold text-gold">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Target skills */}
      {targetSkills.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-heading text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#9ca3af]">
            Target Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {targetSkills.map((skill, i) => (
              <span
                key={i}
                className="rounded border border-[#ffce00] bg-[#fff9e6] px-[9px] py-[5px] font-body text-[10px] font-bold uppercase tracking-[0.5px] text-[#1c1c1c]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="font-body text-[12px] font-bold text-[#4b5563]">{value}</span>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

