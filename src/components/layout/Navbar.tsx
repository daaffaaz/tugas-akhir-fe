import Link from "next/link";
import { primaryGoldCtaBase } from "@/lib/primary-cta";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#d1d1d1]/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link
          href="/"
          className="font-heading text-2xl font-extrabold tracking-tight text-dark"
        >
          PersonaLearn
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className={cn(
              primaryGoldCtaBase,
              "rounded px-6 py-2.5 text-center text-base font-bold",
            )}
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
