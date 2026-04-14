"use client";

import { useEffect, useMemo, useState } from "react";
import type { CatalogCourse, CatalogFilters, CoursePlatform } from "@/lib/types";
import { defaultCatalogFilters } from "@/lib/types";
import { getCourses } from "@/lib/api/courses";
import { CourseCatalogCard } from "@/components/course/CourseCatalogCard";
import { cn } from "@/lib/utils";

type PlatformTab = "all" | "udemy" | "coursera" | "icei";
type SortKey = "relevance" | "rating" | "reviews";

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

function sortCourses(list: CatalogCourse[], sort: SortKey): CatalogCourse[] {
  const copy = [...list];
  if (sort === "rating") copy.sort((a, b) => b.rating - a.rating);
  else if (sort === "reviews") copy.sort((a, b) => b.reviewCount - a.reviewCount);
  return copy;
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

export function CourseCatalogView() {
  const [tab, setTab] = useState<PlatformTab>("all");
  const [query, setQuery] = useState("Cloud Architecture");
  const [sort, setSort] = useState<SortKey>("relevance");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CatalogFilters>(defaultCatalogFilters);
  const [courses, setCourses] = useState<CatalogCourse[]>([]);

  const platform = mapTabToPlatform(tab);

  useEffect(() => {
    let cancelled = false;
    void getCourses(query, platform, filters).then((data) => {
      if (!cancelled) setCourses(data);
    });
    return () => {
      cancelled = true;
    };
  }, [query, platform, filters]);

  const sorted = useMemo(() => sortCourses(courses, sort), [courses, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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
                Menampilkan{" "}
                <span className="font-bold text-dark">{sorted.length}</span>{" "}
                hasil
                {query.trim() ? (
                  <>
                    {" "}
                    untuk &apos;
                    <span className="font-semibold text-dark">{query.trim()}</span>
                    &apos;
                  </>
                ) : null}
              </p>
              <label className="flex items-center gap-2 font-body text-sm text-muted">
                Urutkan
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortKey);
                    setPage(1);
                  }}
                  className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 font-body text-sm font-semibold text-dark"
                >
                  <option value="relevance">Paling relevan</option>
                  <option value="rating">Rating tertinggi</option>
                  <option value="reviews">Ulasan terbanyak</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((c) => (
              <CourseCatalogCard key={c.id} course={c} />
            ))}
          </div>

          {sorted.length === 0 ? (
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
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                &larr;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={cn(
                    "min-w-[2.5rem] rounded px-3 py-2 text-sm font-bold",
                    n === currentPage
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
                disabled={currentPage >= totalPages}
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
