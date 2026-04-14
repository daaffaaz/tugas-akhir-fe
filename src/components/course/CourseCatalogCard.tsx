import Image from "next/image";
import type { CatalogCourse } from "@/lib/types";
import { primaryGoldCtaClass } from "@/lib/primary-cta";

function platformLabel(platform: CatalogCourse["platform"]) {
  switch (platform) {
    case "udemy":
      return "Udemy";
    case "coursera":
      return "Coursera";
    case "icei":
      return "ICEI";
    case "youtube":
      return "YouTube";
    default:
      return platform;
  }
}

function formatReviews(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

function StarRow({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className={i < rounded ? "text-gold" : "text-[#e5e7eb]"}
          fill="currentColor"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export function CourseCatalogCard({ course }: { course: CatalogCourse }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      <div className="relative h-40 w-full bg-grey-bg">
        <Image
          src={course.thumbnailUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <span className="absolute right-3 top-3 rounded bg-white/95 px-2 py-1 font-heading text-[10px] font-extrabold uppercase tracking-wide text-dark shadow-sm">
          {platformLabel(course.platform)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3rem] font-body text-base font-bold leading-snug text-dark">
          {course.title}
        </h3>
        <p className="mt-2 font-body text-sm text-muted">{course.instructor}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-heading text-sm font-extrabold text-dark">
            {course.rating.toFixed(1)}
          </span>
          <StarRow rating={course.rating} />
          <span className="font-body text-xs text-muted">
            ({formatReviews(course.reviewCount)})
          </span>
        </div>
        <button
          type="button"
          className={primaryGoldCtaClass(
            "mt-5 w-full py-3 font-heading text-xs font-extrabold uppercase tracking-widest",
          )}
        >
          Lihat kursus
        </button>
      </div>
    </article>
  );
}
