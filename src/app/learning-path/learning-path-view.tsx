"use client";

import Image from "next/image";
import Link from "next/link";
import type { LearningPathStats, LearningPathSummary } from "@/lib/types";
import { LearningPathCard } from "@/components/learning-path/LearningPathCard";
import { primaryGoldCtaClass, primaryCtaIconHover } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

const imgTechBackground =
  "https://www.figma.com/api/mcp/asset/8138a0a8-d918-4d6c-9e75-ebb2545f2be9";
const imgSparkleBtn =
  "https://www.figma.com/api/mcp/asset/14acf7d8-16c3-43e5-835f-46552b35585e";
const imgCompass =
  "https://www.figma.com/api/mcp/asset/4ab9fb7e-2334-4de8-b654-832aff4615aa";
const imgStatSparkle =
  "https://www.figma.com/api/mcp/asset/c412f371-bb2d-4eaa-9d0c-456f3ac01e09";

type Props = {
  paths: LearningPathSummary[];
  stats: LearningPathStats;
};

function LearningPathFooter() {
  return (
    <footer className="mt-auto border-t border-[rgba(209,209,209,0.35)] bg-[#fdfdfd]">
      <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-6 px-8 py-12 text-[11px] font-bold uppercase tracking-wide text-[#4a4a4a] md:flex-row md:items-center">
        <p>© 2024 PrecisionLearn IT. All rights reserved.</p>
        <div className="flex flex-wrap gap-8">
          <span className="cursor-pointer hover:text-dark">Legal</span>
          <span className="cursor-pointer hover:text-dark">Support</span>
          <span className="cursor-pointer hover:text-dark">Privacy policy</span>
          <span className="cursor-pointer hover:text-dark">Terms of service</span>
        </div>
      </div>
    </footer>
  );
}

export function LearningPathView({ paths, stats }: Props) {
  const isEmpty = paths.length === 0;

  if (isEmpty) {
    return (
      <>
        <div className="flex flex-1 flex-col items-center px-6 pb-32 pt-16 md:px-8 md:pb-40 md:pt-28">
          <div className="grid w-full max-w-[896px] gap-12 md:grid-cols-2 md:items-center md:gap-12">
            <div>
              <div className="inline-block bg-gold px-3 py-1">
                <span className="font-body text-[10px] font-bold uppercase tracking-widest text-dark">
                  Your library
                </span>
              </div>
              <h1 className="mt-4 font-heading text-5xl font-extrabold leading-none tracking-[-0.06em] text-dark md:text-[60px] md:leading-[60px]">
                Belum ada
              </h1>
              <p className="mt-2 font-heading text-5xl font-extrabold leading-none tracking-[-0.06em] text-gold md:text-[60px] md:leading-[60px]">
                Learning Path
              </p>
              <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-[#4a4a4a]">
                Mulai buat Learning Path pertamamu. Kami bantu susun modul dan
                kursus yang cocok dengan tujuanmu.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/learning-path/create"
                  className={cn(
                    primaryGoldCtaClass(
                      "group relative inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold shadow-[0px_10px_15px_-3px_rgba(255,206,0,0.2)]",
                    ),
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSparkleBtn}
                    alt=""
                    width={22}
                    height={22}
                    className={primaryCtaIconHover}
                  />
                  Buat Learning Path pertamamu
                </Link>
                <Link
                  href="/course-catalog"
                  className="inline-flex items-center justify-center rounded-lg bg-[#f5f5f5] px-14 py-4 font-body text-sm font-bold text-dark hover:bg-[#ebebeb]"
                >
                  Lihat courses
                </Link>
              </div>
            </div>
            <div className="relative flex min-h-[320px] items-center justify-center md:min-h-[500px]">
              <div
                className="pointer-events-none absolute inset-0 rounded-[48px] blur-[32px]"
                style={{
                  background:
                    "linear-gradient(50deg, rgba(255,206,0,0.1) 0%, rgba(255,206,0,0.05) 50%, rgba(255,206,0,0) 100%)",
                }}
              />
              <div className="relative flex items-center justify-center">
                <div className="absolute -right-2 top-10 rotate-6">
                  <div className="relative h-48 w-48 overflow-hidden rounded-xl border border-gold/10 bg-white/40 shadow-xl backdrop-blur-md">
                    <div className="relative h-full w-full opacity-30">
                      <Image
                        src={imgTechBackground}
                        alt=""
                        fill
                        className="object-cover mix-blend-saturation"
                        sizes="200px"
                      />
                    </div>
                  </div>
                </div>
                <div className="relative z-[1] -rotate-3">
                  <div className="relative h-80 w-64 rounded-xl border border-gold/20 bg-white/70 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col items-center px-8 pb-10 pt-16">
                      <div className="flex size-20 items-center justify-center rounded-full bg-gold/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgCompass} alt="" width={40} height={40} />
                      </div>
                      <div className="mt-6 w-full space-y-2">
                        <div className="h-2 w-full rounded-full bg-gold/30" />
                        <div className="h-2 w-[70%] rounded-full bg-gold/20" />
                        <div className="h-2 w-[45%] rounded-full bg-gold/10" />
                      </div>
                      <p className="mt-8 font-body text-[10px] font-bold uppercase tracking-widest text-[#4a4a4a]">
                        Ready to build
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LearningPathFooter />
      </>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1280px] flex-1 px-6 pb-16 pt-12 md:px-6 md:pt-24">
        <div className="flex flex-col gap-6 pb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-[#1c1c1c] md:text-[36px] md:leading-10">
              Learning Path saya
            </h1>
            <p className="mt-2 font-body text-base leading-relaxed text-[#54595e]">
              Pantau presisi Anda dalam menguasai berbagai topik teknikal. Tiap
              jalur dibuat berdasarkan jangkauan Anda.
            </p>
          </div>
          <Link
            href="/learning-path/create"
            className={primaryGoldCtaClass(
              "inline-flex shrink-0 items-center gap-2 rounded-lg px-8 py-4 font-body text-base font-bold shadow-sm",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgStatSparkle}
              alt=""
              width={20}
              height={20}
              className={primaryCtaIconHover}
            />
            Buat path baru
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex h-48 flex-col justify-between rounded-xl border-l-4 border-gold bg-white px-8 py-8 shadow-sm md:h-auto md:min-h-[192px]">
            <div className="h-6 w-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgStatSparkle} alt="" width={24} height={24} />
            </div>
            <div>
              <p className="font-heading text-3xl font-extrabold text-[#1c1c1c]">
                {stats.activePaths}
              </p>
              <p className="mt-1 font-body text-sm font-bold uppercase tracking-wide text-[#54595e]">
                Path aktif
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-[#1c1c1c] px-8 py-10 text-white md:col-span-2">
            <div
              className="pointer-events-none absolute -right-12 -top-12 size-64 rounded-full bg-gold/10 blur-3xl"
              aria-hidden
            />
            <h3 className="font-body text-2xl font-bold">Progres umum</h3>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-heading text-5xl font-extrabold text-gold">
                {stats.overallProgressPercent}
              </span>
              <span className="pb-1 text-xl font-bold opacity-80">%</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gold"
                style={{ width: `${stats.overallProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6">
          {paths.map((p) => (
            <LearningPathCard key={p.id} path={p} />
          ))}
        </div>
      </div>
      <LearningPathFooter />
    </>
  );
}
