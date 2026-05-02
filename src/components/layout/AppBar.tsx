"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const imgUserProfile =
  "/images/6f86e31f-7eaa-42bd-88e3-a103780b30a3.png";

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 0C6.14 0 4.63 1.51 4.63 3.37v1.26C3.01 5.5 1.88 7.35 1.88 9.5v4.38L0 15.25v1.25h16v-1.25l-1.88-1.37V9.5c0-2.15-1.13-4-2.75-4.87V3.37C11.37 1.51 9.86 0 8 0z"
        fill="currentColor"
      />
      <path d="M6 17a2 2 0 104 0H6z" fill="currentColor" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19.4 15a7.86 7.86 0 0 0 .1-1 7.86 7.86 0 0 0-.1-1l2.1-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.28 7.28 0 0 0-1.73-1l-.38-2.65A.5.5 0 0 0 14 4h-4a.5.5 0 0 0-.5.42l-.38 2.65a7.28 7.28 0 0 0-1.73 1l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64L4.5 12a7.86 7.86 0 0 0-.1 1 7.86 7.86 0 0 0 .1 1l-2.1 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1a7.28 7.28 0 0 0 1.73 1l.38 2.65a.5.5 0 0 0 .5.42h4a.5.5 0 0 0 .5-.42l.38-2.65a7.28 7.28 0 0 0 1.73-1l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64L19.4 15z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0c335a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M18.36 5.64 5.64 18.36" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0c335a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

export function AppBar() {
  const pathname = usePathname();
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAiDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f0f0f0] bg-white/80 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-[1280px] items-center justify-between py-4 pl-6 pr-6">
        <Link
          href="/"
          className="font-heading text-xl font-extrabold tracking-tight text-dark"
        >
          PersonaLearn
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <Link
            href="/learning-path"
            className={cn(
              "font-heading text-base font-semibold transition-colors",
              isActive("/learning-path")
                ? "text-dark"
                : "text-[#4a4a4a] hover:text-dark",
            )}
          >
            Learning Path
          </Link>
          <Link
            href="/course-catalog"
            className={cn(
              "font-heading text-base font-semibold transition-colors",
              isActive("/course-catalog")
                ? "text-dark"
                : "text-[#4a4a4a] hover:text-dark",
            )}
          >
            Courses
          </Link>

          {/* AI Features dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setAiDropdownOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 font-heading text-base font-semibold transition-colors",
                pathname.startsWith("/ai")
                  ? "text-dark"
                  : "text-[#4a4a4a] hover:text-dark",
              )}
              aria-expanded={aiDropdownOpen}
              aria-haspopup="true"
            >
              AI Features
              <ChevronDownIcon
                className={cn(
                  "size-4 transition-transform",
                  aiDropdownOpen && "rotate-180",
                )}
              />
            </button>

            {aiDropdownOpen && (
              <div className="absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 rounded-xl border border-[#e5e7eb] bg-white py-2 shadow-lg">
                <Link
                  href="/ai/course-recommendation"
                  className="flex items-center gap-3 px-4 py-3 font-body text-sm text-[#4a4a4a] hover:bg-[#fafafa]"
                  onClick={() => setAiDropdownOpen(false)}
                >
                  <SparklesIcon />
                  <div>
                    <div className="font-bold">Course Recommendation</div>
                    <div className="text-xs text-[#9ca3af]">AI-powered course suggestions</div>
                  </div>
                </Link>
                <div className="mx-4 my-1 border-t border-[#e5e7eb]" />
                <Link
                  href="/learning-path/create"
                  className="flex items-center gap-3 px-4 py-3 font-body text-sm text-[#4a4a4a] hover:bg-[#fafafa]"
                  onClick={() => setAiDropdownOpen(false)}
                >
                  <MapIcon />
                  <div>
                    <div className="font-bold">Learning Path</div>
                    <div className="text-xs text-[#9ca3af]">Structured AI-generated roadmaps</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            type="button"
            className="rounded-full p-2 text-[#4a4a4a] hover:bg-grey-bg"
            aria-label="Notifikasi"
          >
            <BellIcon className="mx-auto" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-[#4a4a4a] hover:bg-grey-bg"
            aria-label="Pengaturan"
          >
            <SettingsIcon className="mx-auto" />
          </button>
          <Link
            href="/profile"
            className="size-8 overflow-hidden rounded-full border border-[#e0e0e0] bg-[#f0f0f0] p-px ring-offset-2 hover:ring-2 hover:ring-gold/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUserProfile}
              alt="Profil pengguna"
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
