"use client";

import { useEffect, useRef, useState } from "react";
import {
  PhaseCard,
  type AugmentedCourse,
} from "@/components/learning-path/PhaseCard";
import type { LearningPathPhase } from "@/types/rag";
import { cn } from "@/lib/utils";

export interface PhaseGroup {
  phase: LearningPathPhase | null;
  phaseLabel: string;
  courses: AugmentedCourse[];
}

interface Props {
  phaseGroups: PhaseGroup[];
  expandedCourseId: string | null;
  onToggleExpand: (courseId: string) => void;
  onToggleComplete: (courseId: string) => void;
  onDelete: (courseId: string) => void;
  onReplace: (courseId: string, courseTitle: string) => void;
}

export function PhaseTabSlider({
  phaseGroups,
  expandedCourseId,
  onToggleExpand,
  onToggleComplete,
  onDelete,
  onReplace,
}: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Clamp ke range valid saat jumlah phase berkurang
  const clampedTab = phaseGroups.length > 0
    ? Math.min(activeTab, phaseGroups.length - 1)
    : 0;

  // Track height aktif slide pakai ResizeObserver
  useEffect(() => {
    const el = slideRefs.current[clampedTab];
    if (!el) return;
    const update = () => setHeight(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [clampedTab, phaseGroups]);

  if (phaseGroups.length === 0) {
    return (
      <div className="rounded border border-dashed border-[#e5e7eb] bg-white p-12 text-center">
        <p className="font-body text-[14px] text-[#9ca3af]">
          Belum ada course di learning path ini.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1.5 [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f3f4f6] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gold">
        {phaseGroups.map((group, idx) => {
          const isActive = clampedTab === idx;
          const isUnassigned = group.phase === null;
          return (
            <button
              key={
                group.phase
                  ? `phase-${group.phase.phase_number}`
                  : "unassigned"
              }
              type="button"
              onClick={() => setActiveTab(idx)}
              className={cn(
                "group flex shrink-0 items-center gap-2 rounded border px-3 py-2.5 transition-colors",
                isActive
                  ? "border-[#1c1c1c] bg-[#1c1c1c] text-white"
                  : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-[#1c1c1c] hover:text-[#1c1c1c]",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-heading text-[10px] font-extrabold uppercase tracking-[1px]",
                  isUnassigned
                    ? isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#f3f4f6] text-[#6b7280]"
                    : isActive
                      ? "bg-gold text-[#1c1c1c]"
                      : "bg-gold/20 text-[#1c1c1c]",
                )}
              >
                {isUnassigned ? "+" : `Fase ${group.phase!.phase_number}`}
              </span>
              <span className="max-w-[180px] truncate font-heading text-[12px] font-extrabold uppercase tracking-[0.5px]">
                {group.phaseLabel}
              </span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-body text-[10px] font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#f3f4f6] text-[#6b7280]",
                )}
              >
                {group.courses.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slider container */}
      <div
        className="overflow-hidden transition-[height] duration-300 ease-out"
        style={{ height: height ?? "auto" }}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${clampedTab * 100}%)` }}
        >
          {phaseGroups.map((group, idx) => (
            <div
              key={
                group.phase
                  ? `phase-${group.phase.phase_number}`
                  : "unassigned"
              }
              ref={(el) => {
                slideRefs.current[idx] = el;
              }}
              className="w-full shrink-0 self-start"
              aria-hidden={idx !== clampedTab}
              style={{
                pointerEvents: idx === clampedTab ? "auto" : "none",
              }}
            >
              <PhaseCard
                phase={group.phase}
                phaseLabel={group.phaseLabel}
                courses={group.courses}
                isLast={idx === phaseGroups.length - 1}
                expandedCourseId={expandedCourseId}
                onToggleExpand={onToggleExpand}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onReplace={onReplace}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
