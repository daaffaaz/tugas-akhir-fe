import Image from "next/image";
import Link from "next/link";
import { AppBar } from "@/components/layout/AppBar";
import { primaryCtaIconHover, primaryGoldCtaBase } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

const imgArrow =
  "https://www.figma.com/api/mcp/asset/70103432-6d64-43c3-a4ba-18e20eaad088";
const imgClock =
  "https://www.figma.com/api/mcp/asset/1c44f2dc-eed4-4d26-8e87-5ffc404e3bbd";
const imgShield =
  "https://www.figma.com/api/mcp/asset/f3f42237-404e-4f0e-95e4-f437aa22a158";

export default function QuestionnaireIntroPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AppBar />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_45%,rgba(255,206,0,0.09),transparent_65%)]"
          aria-hidden
        />

        <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 md:py-16">
          <div className="w-full max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gold/20 bg-gold-soft px-3 py-1.5">
              <span className="relative flex size-2">
                <span className="absolute inset-0 rounded-full bg-gold/75" />
                <span className="relative size-2 rounded-full bg-gold" />
              </span>
              <span className="font-heading text-[10px] font-extrabold uppercase tracking-wide text-[#453800]">
                Kuesioner
              </span>
            </div>

            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-dark md:text-5xl md:leading-[48px] md:tracking-[-0.025em]">
              Isi Data Diri dan <br />
              Preferensi Belajar kamu
            </h1>

            <p className="mx-auto mt-8 max-w-xl font-body text-lg font-medium leading-7 text-[#4a4a4a] md:text-xl">
              Beberapa pertanyaan singkat untuk membantu kami memahami dari mana
              kamu memulai, bagaimana kamu belajar, dan ke mana kamu ingin
              pergi.
            </p>

            <div className="mt-10 flex flex-col items-center gap-8">
              <Link
                href="/questionnaire/1"
                className={cn(
                  primaryGoldCtaBase,
                  "group inline-flex items-center gap-3 rounded px-10 py-5 font-heading text-base font-bold shadow-[0px_10px_15px_-3px_rgba(255,206,0,0.1)]",
                )}
              >
                Isi Kuesioner Sekarang
                <Image
                  src={imgArrow}
                  alt=""
                  width={14}
                  height={14}
                  className={cn("size-[13px]", primaryCtaIconHover)}
                  unoptimized
                />
              </Link>

              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
                <div className="flex items-center gap-2">
                  <Image
                    src={imgClock}
                    alt=""
                    width={15}
                    height={15}
                    className="size-[15px]"
                    unoptimized
                  />
                  <span className="font-heading text-sm font-semibold text-[#4a4a4a]">
                    Estimasi pengisian: ~5 menit
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={imgShield}
                    alt=""
                    width={12}
                    height={15}
                    className="h-[15px] w-3"
                    unoptimized
                  />
                  <span className="font-heading text-sm font-semibold text-[#4a4a4a]">
                    Privasi datamu akan tetap terjaga
                  </span>
                </div>
              </div>

              <div className="w-full max-w-xl border-t border-[#f0f0f0] pt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
