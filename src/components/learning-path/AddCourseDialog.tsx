"use client";

import { useMemo, useState } from "react";
import type { CatalogCourse, CoursePlatform, ManualCourseDraft } from "@/lib/types";
import { MOCK_DIALOG_COURSES } from "@/lib/api/courses";
import { Dialog } from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";

const imgTabSearch =
  "https://www.figma.com/api/mcp/asset/34b3f69c-0c0d-4aff-8130-22473c3187e9";
const imgTabList =
  "https://www.figma.com/api/mcp/asset/8c6569c3-876e-4ebc-b7e3-cedff6a6a86e";
const imgSearch =
  "https://www.figma.com/api/mcp/asset/c2472632-02c8-4e45-8654-ecd1a1c64dbd";
const imgChevron =
  "https://www.figma.com/api/mcp/asset/9b741f72-8518-4039-bfcd-c5a43779f5ce";

type Tab = "catalog" | "manual";

const PLATFORMS: { id: CoursePlatform; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "udemy", label: "Udemy" },
  { id: "coursera", label: "Coursera" },
  { id: "youtube", label: "YouTube" },
];

export type AddCourseResult =
  | { kind: "catalog"; course: CatalogCourse }
  | { kind: "manual"; draft: ManualCourseDraft };

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (result: AddCourseResult) => void | Promise<void>;
};

export function AddCourseDialog({ open, onClose, onAdd }: Props) {
  const [tab, setTab] = useState<Tab>("catalog");
  const [platform, setPlatform] = useState<CoursePlatform>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [manualTitle, setManualTitle] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [manualDuration, setManualDuration] = useState("2 jam");
  const [manualLevel, setManualLevel] = useState("Beginner");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_DIALOG_COURSES.filter((c) => {
      const platOk = platform === "all" || c.platform === platform;
      const textOk =
        q === "" ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q);
      return platOk && textOk;
    });
  }, [platform, query]);

  async function handlePrimary() {
    if (tab === "catalog") {
      const sel = filtered.find((c) => c.id === selectedId) ?? filtered[0];
      if (!sel) return;
      await Promise.resolve(onAdd({ kind: "catalog", course: sel }));
    } else {
      if (!manualTitle.trim()) return;
      await Promise.resolve(
        onAdd({
          kind: "manual",
          draft: {
            title: manualTitle.trim(),
            url: manualUrl.trim(),
            durationLabel: manualDuration,
            level: manualLevel,
          },
        }),
      );
    }
    onClose();
    setSelectedId(null);
    setQuery("");
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      hideTitleRow
      className="h-[720px] max-w-[520px]"
      panelClassName="!overflow-hidden flex min-h-0 flex-1 flex-col p-0"
    >
      <div className="flex shrink-0 items-start justify-between px-8 pb-4 pt-8">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#1f2937]">
          Tambah course
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-2 text-[#1f2937] hover:bg-grey-bg"
          aria-label="Tutup"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8">
        <div className="flex rounded bg-[#f3f4f6] p-1">
          <button
            type="button"
            onClick={() => setTab("catalog")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded py-2.5 font-body text-sm font-bold transition-colors",
              tab === "catalog"
                ? "bg-gold text-[#1f2937] shadow-sm"
                : "text-[#4b5563]",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgTabSearch} alt="" width={14} height={14} />
            Pilih dari katalog
          </button>
          <button
            type="button"
            onClick={() => setTab("manual")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded py-2.5 font-body text-sm font-semibold transition-colors",
              tab === "manual"
                ? "bg-gold text-[#1f2937] shadow-sm"
                : "text-[#4b5563]",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgTabList} alt="" width={14} height={14} />
            Tambah manual
          </button>
        </div>

        {tab === "catalog" ? (
          <div className="mt-6 space-y-6 pb-4">
            <div>
              <p className="mb-2 px-1 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#1f2937]">
                Filter berdasarkan platform
              </p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    className={cn(
                      "rounded px-5 py-2 font-body text-[10px] font-bold uppercase tracking-wide",
                      platform === p.id
                        ? "bg-gold text-[#1f2937]"
                        : "bg-[#f3f4f6] text-[#4b5563]",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 px-1 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#1f2937]">
                Cari course
              </p>
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Masukkan judul..."
                  className="w-full rounded border border-[#d1d5db] bg-white py-3.5 pl-12 pr-4 font-body text-base text-dark outline-none placeholder:text-[#9ca3af] ring-gold/30 focus:ring-2"
                />
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgSearch} alt="" width={14} height={14} />
                </div>
              </div>
            </div>
            <div>
              <p className="mb-2 px-1 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#1f2937]">
                Hasil pencarian
              </p>
              <div className="flex flex-col gap-2">
                {filtered.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "flex w-full items-center gap-4 rounded border border-transparent bg-[#f3f4f6] p-4 text-left transition-colors",
                      (selectedId === c.id || (!selectedId && i === 0)) &&
                        "ring-2 ring-gold/60",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded",
                        i === 0 ? "bg-gold" : "bg-[#d1d5db]",
                      )}
                    >
                      <span className="font-heading text-xs font-extrabold text-dark">
                        {c.platform[0]!.toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-sm font-bold text-[#1f2937]">
                        {c.title}
                      </p>
                      <p className="mt-0.5 font-body text-[10px] font-semibold uppercase tracking-wide text-[#4b5563]">
                        {c.instructor} • {c.rating} rating
                      </p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgChevron} alt="" width={8} height={12} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4 pb-4">
            <div>
              <label className="mb-2 block px-1 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#1f2937]">
                Judul course
              </label>
              <input
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                className="w-full rounded border border-[#d1d5db] bg-white px-4 py-3 font-body text-sm outline-none ring-gold/30 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-2 block px-1 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#1f2937]">
                URL / sumber (opsional)
              </label>
              <input
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="w-full rounded border border-[#d1d5db] bg-white px-4 py-3 font-body text-sm outline-none ring-gold/30 focus:ring-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block px-1 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#1f2937]">
                  Durasi
                </label>
                <input
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value)}
                  className="w-full rounded border border-[#d1d5db] bg-white px-4 py-3 font-body text-sm outline-none ring-gold/30 focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-2 block px-1 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#1f2937]">
                  Level
                </label>
                <select
                  value={manualLevel}
                  onChange={(e) => setManualLevel(e.target.value)}
                  className="w-full rounded border border-[#d1d5db] bg-white px-4 py-3 font-body text-sm outline-none ring-gold/30 focus:ring-2"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advance">Advance</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex shrink-0 justify-end gap-4 border-t border-[#d1d5db] bg-surface px-8 py-8">
        <button
          type="button"
          onClick={onClose}
          className="rounded px-6 py-3 font-body text-sm font-bold text-[#1f2937] hover:bg-grey-bg"
        >
          Batalkan
        </button>
        <button
          type="button"
          onClick={handlePrimary}
          disabled={
            tab === "manual" ? !manualTitle.trim() : filtered.length === 0
          }
          className="rounded bg-gold px-10 py-3 font-body text-sm font-bold text-[#1f2937] shadow-md transition-colors hover:bg-dark hover:text-gold disabled:opacity-50 disabled:hover:bg-gold disabled:hover:text-[#1f2937]"
        >
          Tambah ke path
        </button>
      </div>
    </Dialog>
  );
}
