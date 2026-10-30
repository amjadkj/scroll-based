"use client";

import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ChapterData } from "@/data/chapters";

export interface ProgressRailHandle {
  updateProgress: (progress: number) => void;
}

interface ProgressRailProps {
  chapters: ChapterData[];
  activeChapterIndex: number;
  onJumpToStage: (index: number) => void;
}

export const ProgressRail = forwardRef<ProgressRailHandle, ProgressRailProps>(
  function ProgressRail({ chapters, activeChapterIndex, onJumpToStage }, ref) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const fillLineRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      updateProgress: (p: number) => {
        if (fillLineRef.current) {
          fillLineRef.current.style.height = `calc(${p * 100}% - 32px * ${p})`;
        }
      },
    }));

    return (
      <aside
        className="hidden sm:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end pointer-events-auto select-none"
        aria-label="Process Timeline Navigation"
      >
        <div className="relative flex flex-col items-end py-4">
          {/* Continuous Track Background Line */}
          <div className="absolute right-[7px] top-4 bottom-4 w-[2px] bg-steel/20 rounded-full" />

          {/* Animated Progress Fill Line */}
          <div
            ref={fillLineRef}
            className="absolute right-[7px] top-4 w-[2px] bg-gradient-to-b from-amber-glue to-veneer rounded-full origin-top"
            style={{
              height: "0%",
              maxHeight: "calc(100% - 32px)",
            }}
          />

          {/* Chapter Ticks */}
          <div className="flex flex-col gap-5 lg:gap-6 relative z-10">
            {chapters.map((ch, idx) => {
              const isActive = idx === activeChapterIndex;
              const isHovered = hoveredIndex === idx;
              const isPast = idx <= activeChapterIndex;

              return (
                <div key={ch.id} className="relative flex items-center justify-end group">
                  {/* Stage Title Tooltip */}
                  <div
                    className={`hidden lg:flex items-center gap-2 pr-3 transition-all duration-200 pointer-events-none ${
                      isActive || isHovered
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-2"
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] tracking-wider uppercase px-2 py-0.5 rounded backdrop-blur-md border ${
                        isActive
                          ? "bg-ink-800/95 text-amber-glow border-amber-glue/40 shadow-sm"
                          : "bg-ink/80 text-birch/80 border-white/10"
                      }`}
                    >
                      {ch.label.replace(/^\d+\s*\/\s*/, "")}
                    </span>
                  </div>

                  {/* Focusable Interactive Tick Button */}
                  <button
                    type="button"
                    onClick={() => onJumpToStage(idx)}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="flex items-center justify-center p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-glue"
                    aria-label={`Go to stage 0${idx}: ${ch.label.replace(/^\d+\s*\/\s*/, "")}`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <div
                      className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                        isActive
                          ? "w-4 h-4 bg-amber-glue shadow-lg shadow-amber-glue/50 ring-4 ring-amber-glue/20"
                          : isPast
                          ? "w-2.5 h-2.5 bg-veneer/80 hover:scale-125"
                          : "w-2 h-2 bg-steel/50 hover:bg-birch hover:scale-125"
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-ink" />
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    );
  }
);
