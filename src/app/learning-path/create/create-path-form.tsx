"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { postGenerateRoadmap } from "@/lib/api/rag";
import { primaryGoldCtaClass, primaryCtaIconHover } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

const imgSearch =
  "/images/2d0d95a7-d81f-490b-9213-52f1556a0ad9.png";
const imgMap =
  "/images/166379ed-ce0d-4b7c-9fd1-8bea30e4ec1b.png";
const imgCheck =
  "/images/91811ac3-575e-4e53-94ed-fb369ec58c4e.png";
const imgSparkle =
  "/images/96085196-990e-4460-8a32-d3721f3f3537.png";

export function CreatePathForm() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || topic.trim().length < 3) return;
    setBusy(true);
    setError(null);
    try {
      const res = await postGenerateRoadmap({ topic: topic.trim(), count: 15 });
      // Navigate to modify page with the AI-generated path ID
      router.push(`/learning-path/${res.id}/modify`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal membuat learning path. Coba lagi.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full max-w-3xl rounded-2xl border border-[#e0e0e0] bg-white p-10 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05)]"
    >
      <div className="space-y-10">
        <div>
          <label className="mb-3 block px-1 font-body text-sm font-bold uppercase tracking-[0.08em] text-[#444749]">
            Tujuan pembelajaran
          </label>
          <div className="relative">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Masukkan topik"
              className="w-full rounded-2xl border border-[#e0e0e0] bg-[#f7f7f7] py-6 pl-6 pr-14 font-body text-lg text-dark outline-none placeholder:text-[#c4c7c5] ring-gold/30 focus:ring-2"
            />
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgSearch} alt="" width={18} height={18} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 px-1 font-body text-sm font-bold uppercase tracking-[0.08em] text-[#444749]">
            Format
          </h3>
          <div className="relative">
            <div
              className={cn(
                "flex min-h-[136px] flex-col items-center justify-center rounded-2xl border-2 border-gold bg-white p-6 shadow-md",
              )}
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-gold shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgMap} alt="" width={18} height={18} />
              </div>
              <p className="font-heading text-base font-extrabold text-[#1a1c1e]">
                Learning Path
              </p>
              <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-gold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgCheck} alt="" width={10} height={10} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          {error && (
            <div className="mb-4 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={busy || topic.trim().length < 3}
            className={cn(
              primaryGoldCtaClass(
                "group relative inline-flex min-w-[220px] items-center gap-2 rounded-full px-10 py-4 font-heading text-lg font-extrabold shadow-[0px_10px_15px_-3px_rgba(255,206,0,0.2)]",
              ),
              (busy || topic.trim().length < 3) && "cursor-not-allowed",
            )}
          >
            {busy ? "Generating..." : "Buat path"}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSparkle}
              alt=""
              width={22}
              height={22}
              className={primaryCtaIconHover}
            />
          </button>
        </div>
      </div>
    </form>
  );
}
