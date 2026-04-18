"use client";

import { useEffect, useState } from "react";
import type {
  CatalogCourse,
  CatalogFilters,
  CatalogSortDirection,
  CatalogSortKey,
  CoursePlatform,
} from "@/lib/types";
import { defaultCatalogFilters } from "@/lib/types";
import { getCourses } from "@/lib/api/courses";
import { CourseCatalogCard } from "@/components/course/CourseCatalogCard";
import { cn } from "@/lib/utils";

type PlatformTab = "all" | "udemy" | "coursera" | "icei";

const PAGE_SIZE = 6;

const TABS: { id: PlatformTab; label: string }[] = [
  { id: "all", label: "Semua kursus" },
  { id: "udemy", label: "Udemy" },
  { id: "coursera", label: "Coursera" },
  { id: "icei", label: "ICEI" },
];

function mapTabToPlatform(tab: PlatformTab): CoursePlatform {
  if (tab === "all") return "all";
  return tab;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#e5e7eb] py-4 last:border-b-0">
      <p className="mb-3 font-heading text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 font-body text-sm text-dark">
      <input
        type="checkbox"
        className="size-4 rounded border-[#d1d5db] accent-gold"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm animate-pulse">
      <div className="h-40 w-full bg-[#f3f4f6]" />
      <div className="flex flex-1 flex-col p-5 gap-3">
        <div className="h-4 rounded bg-[#e5e7eb] w-full" />
        <div className="h-4 rounded bg-[#e5e7eb] w-3/4" />
        <div className="h-3 rounded bg-[#f3f4f6] w-1/2 mt-1" />
        <div className="h-8 rounded bg-[#f3f4f6] mt-auto" />
      </div>
    </div>
  );
}

export function CourseCatalogView() {
  const [tab, setTab] = useState<PlatformTab>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<CatalogSortKey>("relevance");
  const [sortDirection, setSortDirection] =
    useState<CatalogSortDirection>("desc");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CatalogFilters>(defaultCatalogFilters);
  const [courses, setCourses] = useState<CatalogCourse[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const platform = mapTabToPlatform(tab);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getCourses(query, platform, filters, sort, page, PAGE_SIZE, sortDirection)
      .then((result) => {
        if (!cancelled) {
          setCourses(result.courses);
          setTotal(result.total);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat kursus.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, platform, filters, sort, sortDirection, page]);

  function patchFilters(patch: Partial<CatalogFilters>) {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-20 pt-6 md:px-8 md:pt-10">
      <div className="border-b border-[#e5e7eb]">
        <div className="flex flex-wrap gap-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setPage(1);
              }}
              className={cn(
                "-mb-px border-b-2 pb-3 font-body text-sm font-bold transition-colors",
                tab === t.id
                  ? "border-gold text-dark"
                  : "border-transparent text-muted hover:text-dark",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-10 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <p className="font-heading text-lg font-extrabold text-dark">Filter</p>
          <div className="mt-4 rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
            <FilterSection title="Harga">
              <CheckRow
                label="Gratis"
                checked={filters.priceFree}
                onChange={(v) => patchFilters({ priceFree: v })}
              />
              <CheckRow
                label="Berbayar"
                checked={filters.pricePaid}
                onChange={(v) => patchFilters({ pricePaid: v })}
              />
            </FilterSection>
            <FilterSection title="Peringkat">
              <CheckRow
                label="4.5 & ke atas"
                checked={filters.rating45}
                onChange={(v) => patchFilters({ rating45: v })}
              />
              <CheckRow
                label="4.0 & ke atas"
                checked={filters.rating40}
                onChange={(v) => patchFilters({ rating40: v })}
              />
            </FilterSection>
            <FilterSection title="Durasi">
              <CheckRow
                label="0–2 jam"
                checked={filters.duration02}
                onChange={(v) => patchFilters({ duration02: v })}
              />
              <CheckRow
                label="3–6 jam"
                checked={filters.duration36}
                onChange={(v) => patchFilters({ duration36: v })}
              />
              <CheckRow
                label="7–16 jam"
                checked={filters.duration716}
                onChange={(v) => patchFilters({ duration716: v })}
              />
              <CheckRow
                label="17+ jam"
                checked={filters.duration17plus}
                onChange={(v) => patchFilters({ duration17plus: v })}
              />
            </FilterSection>
            <FilterSection title="Tingkat kesulitan">
              <CheckRow
                label="Pemula"
                checked={filters.difficultyBeginner}
                onChange={(v) => patchFilters({ difficultyBeginner: v })}
              />
              <CheckRow
                label="Menengah"
                checked={filters.difficultyIntermediate}
                onChange={(v) => patchFilters({ difficultyIntermediate: v })}
              />
              <CheckRow
                label="Lanjut"
                checked={filters.difficultyAdvanced}
                onChange={(v) => patchFilters({ difficultyAdvanced: v })}
              />
            </FilterSection>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-xl flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari kursus IT..."
                className="w-full rounded-full border border-[#e5e7eb] bg-white py-3 pl-12 pr-4 font-body text-sm outline-none ring-gold/25 focus:ring-2"
              />
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <p className="font-body text-sm text-muted">
                {isLoading ? (
                  <span className="inline-block h-4 w-24 animate-pulse rounded bg-[#e5e7eb]" />
                ) : (
                  <>
                    Menampilkan{" "}
                    <span className="font-bold text-dark">{total}</span>{" "}
                    hasil
                    {query.trim() ? (
                      <>
                        {" "}
                        untuk &apos;
                        <span className="font-semibold text-dark">{query.trim()}</span>
                        &apos;
                      </>
                    ) : null}
                  </>
                )}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <label className="flex items-center gap-2 font-body text-sm text-muted">
                  Urutkan
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as CatalogSortKey);
                      setPage(1);
                    }}
                    className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 font-body text-sm font-semibold text-dark"
                  >
                    <option value="relevance">Paling relevan</option>
                    <option value="rating">Rating</option>
                    <option value="reviews">Jumlah ulasan</option>
                  </select>
                </label>
                {sort !== "relevance" ? (
                  <label className="flex items-center gap-2 font-body text-sm text-muted">
                    Arah
                    <select
                      value={sortDirection}
                      onChange={(e) => {
                        setSortDirection(e.target.value as CatalogSortDirection);
                        setPage(1);
                      }}
                      className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 font-body text-sm font-semibold text-dark"
                    >
                      <option value="desc">Menurun (tinggi / terbanyak dulu)</option>
                      <option value="asc">Menaik (rendah / tersedikit dulu)</option>
                    </select>
                  </label>
                ) : null}
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-12 rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center">
              <p className="font-body text-sm font-semibold text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => setPage((p) => p)}
                className="mt-3 font-body text-sm font-bold text-dark underline underline-offset-4"
              >
                Coba lagi
              </button>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <CourseCardSkeleton key={i} />
                  ))
                : courses.map((c) => (
                    <CourseCatalogCard key={c.id} course={c} />
                  ))}
            </div>
          )}

          {!isLoading && !error && courses.length === 0 ? (
            <p className="mt-12 text-center font-body text-sm text-muted">
              Tidak ada kursus yang cocok dengan filter ini.
            </p>
          ) : null}

          {totalPages > 1 ? (
            <nav
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
              aria-label="Pagination"
            >
              <button
                type="button"
                className="rounded border border-[#e5e7eb] px-3 py-2 text-sm font-bold text-muted hover:bg-grey-bg disabled:opacity-40"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                &larr;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  disabled={isLoading}
                  className={cn(
                    "min-w-[2.5rem] rounded px-3 py-2 text-sm font-bold disabled:opacity-60",
                    n === page
                      ? "bg-gold text-dark"
                      : "border border-[#e5e7eb] text-muted hover:bg-grey-bg",
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className="rounded border border-[#e5e7eb] px-3 py-2 text-sm font-bold text-muted hover:bg-grey-bg disabled:opacity-40"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                &rarr;
              </button>
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
