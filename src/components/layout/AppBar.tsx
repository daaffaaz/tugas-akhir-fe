"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const imgUserProfile =
  "/images/6f86e31f-7eaa-42bd-88e3-a103780b30a3.png";

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
