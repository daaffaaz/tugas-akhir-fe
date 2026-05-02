"use client";

import { useRouter } from "next/navigation";
import { AppBar } from "@/components/layout/AppBar";
import { primaryGoldCtaClass } from "@/lib/primary-cta";

export default function QuestionnaireCompletionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-grey-bg">
      <AppBar />
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12 md:px-8">
        <div className="w-full max-w-[720px] rounded bg-white p-16 shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.05),0px_8px_10px_-6px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center">
            <div className="mb-8 flex size-[96px] items-center justify-center">
              <div className="size-[64px]">
                <img
                  src="https://www.figma.com/api/mcp/asset/9d4b7b36-3536-4712-b122-154d52528ab2"
                  alt="Success"
                  className="size-full object-contain"
                />
              </div>
            </div>

            <h1 className="mb-6 text-center font-heading text-2xl font-extrabold tracking-tight text-[#0c335a] md:text-4xl">
              Kuesioner Selesai!
            </h1>

            <p className="mb-12 text-center font-body text-base leading-relaxed text-[#40618a] md:text-lg">
              Terima kasih telah melengkapi preferensi Anda. AI kami sekarang sedang
              merancang jalur belajar yang paling sesuai untuk membantu Anda mencapai
              target karir.
            </p>

            <div className="flex w-full max-w-[448px] flex-col gap-4">
              <button
                type="button"
                onClick={() => router.push("/learning-path")}
                className={primaryGoldCtaClass(
                  "flex items-center justify-center gap-2 rounded py-4 font-heading text-base font-semibold",
                )}
              >
                Mulai Buat Jalur Belajar
                <ArrowRightIcon />
              </button>

              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="py-4 font-body text-base font-semibold text-[#0c335a] underline decoration-[#735c00]"
              >
                Ubah Preferensi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}