"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Activity } from "lucide-react";
import { ChapterData } from "@/data/chapters";

export interface TimecodeDisplayHandle {
  updateTime: (seconds: number, chapterIndex: number) => void;
}

interface TimecodeDisplayProps {
  totalChapters: number;
}

export const TimecodeDisplay = forwardRef<TimecodeDisplayHandle, TimecodeDisplayProps>(
  function TimecodeDisplay({ totalChapters }, ref) {
    const timeRef = useRef<HTMLSpanElement>(null);
    const chapterRef = useRef<HTMLSpanElement>(null);

    const pad = (n: number) => n.toString().padStart(2, "0");

    useImperativeHandle(ref, () => ({
      updateTime: (seconds: number, chapterIndex: number) => {
        if (timeRef.current) {
          timeRef.current.textContent = seconds.toFixed(1).padStart(4, "0");
        }
        if (chapterRef.current) {
          chapterRef.current.textContent = pad(chapterIndex);
        }
      },
    }));

    return (
      <div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-8 z-40 flex items-center gap-3 bg-ink-900/80 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded pointer-events-none select-none text-birch shadow-xl shadow-black/40"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-amber-glue animate-pulse" />
          <span className="hidden sm:inline-block font-mono text-[11px] tracking-widest uppercase text-steel">
            Timeline
          </span>
        </div>

        <div className="h-3 w-[1px] bg-white/20" />

        {/* Chapter Counter */}
        <div className="flex items-baseline gap-1 font-mono">
          <span
            ref={chapterRef}
            className="text-sm sm:text-base font-bold text-veneer tabular-nums tracking-tight"
          >
            00
          </span>
          <span className="text-xs text-steel">/</span>
          <span className="text-xs text-steel tabular-nums">
            {pad(totalChapters - 1)}
          </span>
        </div>

        <div className="h-3 w-[1px] bg-white/20" />

        {/* Precise Seconds Timecode */}
        <div className="font-mono text-xs sm:text-sm text-birch/90 tabular-nums font-semibold tracking-wider">
          <span ref={timeRef}>00.0</span>
          <span className="text-[11px] text-steel ml-0.5">s</span>
        </div>
      </div>
    );
  }
);
