"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCourseById } from "@/lib/api/courses";
import { primaryGoldCtaClass } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";
import type { CourseDetail } from "@/lib/api/courses";

type Props = { courseId: string };

export function CourseDetailClient({ courseId }: Props) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCourseById(courseId)
      .then(setCourse)
      .catch(() => setError("Gagal memuat detail kursus."))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-[900px] flex-1 items-center justify-center px-6 py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-gold" />
          <p className="font-body text-sm text-[#9ca3af]">Memuat detail kursus...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto flex max-w-[900px] flex-1 items-center justify-center px-6 py-20">
        <div className="text-center">
          <p className="mb-4 font-body text-sm text-red-500">{error ?? "Kursus tidak ditemukan."}</p>
          <Link href="/course-catalog" className={primaryGoldCtaClass("rounded-lg px-6 py-3 font-heading text-sm font-bold")}>
            &larr; Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const platformName = course.platform?.name ?? "";
  const isUdemy = platformName.toLowerCase() === "udemy";
  const isCoursera = platformName.toLowerCase() === "coursera";
  const isIcei = platformName.toLowerCase() === "icei";

  function formatPrice() {
    if (course.price === null || course.price === undefined || Number(course.price) === 0) return "Gratis";
    const currency = course.currency === "IDR" ? "IDR" : course.currency;
    const price = Number(course.price);
    if (currency === "IDR") return `IDR ${price.toLocaleString("id-ID")}`;
    return `${currency} ${price.toFixed(2)}`;
  }

  const whatYouLearn = course.what_you_learn
    ? course.what_you_learn.split(/\n|;/).filter(Boolean).map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="mx-auto w-full max-w-[900px] flex-1 px-6 py-10">
      {/* Back */}
      <nav className="mb-6">
        <Link
          href="/course-catalog"
          className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-[#9ca3af] hover:text-dark"
        >
          <span aria-hidden>&larr;</span> Kembali ke Katalog
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Thumbnail + CTA */}
        <div className="lg:col-span-1">
          {course.thumbnail_url ? (
            <div className="overflow-hidden rounded-2xl bg-[#e5e7eb]">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          ) : (
            <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-[#e5e7eb]">
              <CoursePlaceholderIcon />
            </div>
          )}

          {/* Platform badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className={cn(
              "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
              isUdemy ? "bg-[#da1f26] text-white" :
              isCoursera ? "bg-[#0058a3] text-white" :
              isIcei ? "bg-[#1a1c1e] text-gold" :
              "bg-[#f3f4f6] text-[#6b7280]",
            )}>
              {platformName}
            </span>
            {course.level && (
              <span className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-xs font-bold text-[#6b7280]">
                {course.level}
              </span>
            )}
          </div>

          {/* Price + Rating */}
          <div className="mt-4 space-y-3 rounded-xl border border-[#e5e7eb] bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-heading text-2xl font-extrabold text-dark">{formatPrice()}</span>
              {course.rating != null && Number(course.rating) > 0 && (
                <span className="flex items-center gap-1 font-heading text-sm font-bold text-dark">
                  ⭐ {Number(course.rating).toFixed(1)}
                  <span className="font-body text-xs font-normal text-[#6b7280]">
                    ({Number(course.reviews_count).toLocaleString("id-ID")} review)
                  </span>
                </span>
              )}
            </div>
            {course.url && (
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(primaryGoldCtaClass("flex w-full items-center justify-center gap-2 rounded-xl py-3 font-heading text-sm font-bold"))}
              >
                <ExternalIcon />
                Buka di {platformName}
              </a>
            )}
          </div>
        </div>

        {/* Right: Course info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="font-heading text-2xl font-extrabold leading-tight tracking-tight text-dark md:text-3xl">
              {course.title}
            </h1>
            {course.instructor && (
              <p className="mt-2 font-body text-base text-[#6b7280]">
                oleh <span className="font-semibold text-dark">{course.instructor}</span>
              </p>
            )}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4">
            {course.duration && (
              <StatItem icon={<ClockIcon />} label="Durasi" value={course.duration} />
            )}
            {course.video_hours && Number(course.video_hours) > 0 && (
              <StatItem icon={<PlayIcon />} label="Video" value={`${Number(course.video_hours).toFixed(1)} jam`} />
            )}
            {course.reading_count > 0 && (
              <StatItem icon={<BookIcon />} label="Artikel" value={`${course.reading_count}`} />
            )}
            {course.assignment_count > 0 && (
              <StatItem icon={<CheckSquareIcon />} label="Tugas" value={`${course.assignment_count}`} />
            )}
          </div>

          {/* Description */}
          {course.description && (
            <div>
              <h2 className="mb-3 font-heading text-base font-extrabold text-dark">Deskripsi</h2>
              <p className="whitespace-pre-line font-body text-sm leading-relaxed text-[#4b5563]">
                {course.description}
              </p>
            </div>
          )}

          {/* What you'll learn */}
          {whatYouLearn.length > 0 && (
            <div>
              <h2 className="mb-3 font-heading text-base font-extrabold text-dark">Yang akan kamu pelajari</h2>
              <ul className="space-y-2">
                {whatYouLearn.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm text-[#4b5563]">
                    <CheckCircleIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div>
              <h2 className="mb-3 font-heading text-base font-extrabold text-dark">Topik</h2>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-xs font-bold text-[#6b7280]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#9ca3af]">{icon}</span>
      <div>
        <p className="font-body text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">{label}</p>
        <p className="font-heading text-sm font-bold text-dark">{value}</p>
      </div>
    </div>
  );
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function CheckSquareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0c335a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function CoursePlaceholderIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}