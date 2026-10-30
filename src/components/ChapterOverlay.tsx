"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { ChapterData } from "@/data/chapters";

export interface ChapterOverlayHandle {
  updateProgress: (scrollPercent: number) => void;
}

interface ChapterOverlayProps {
  chapter: ChapterData;
  onOpenQuote: () => void;
  onOpenSpecs: () => void;
  onScrollToNext: () => void;
}

// Cubic bezier approximation (.22,.61,.36,1)
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

export const ChapterOverlay = forwardRef<ChapterOverlayHandle, ChapterOverlayProps>(
  function ChapterOverlay({ chapter, onOpenQuote, onOpenSpecs, onScrollToNext }, ref) {
    const rootRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const isHero = chapter.index === 0;
    const isFinal = chapter.index === 9;
    const start = chapter.scrollStart;
    const end = chapter.scrollEnd;
    const range = end - start;

    useImperativeHandle(ref, () => ({
      updateProgress: (currentPct: number) => {
        if (!rootRef.current || !contentRef.current) return;

        let localP = (currentPct - start) / range;
        let opacity = 0;
        let translateY = 24;

        if (isHero) {
          if (localP <= 0 || localP < 0.7) {
            opacity = 1;
            translateY = 0;
          } else if (localP <= 1.0) {
            const exitP = (localP - 0.7) / 0.3;
            opacity = 1 - easeOutCubic(exitP);
            translateY = -exitP * 20;
          } else {
            opacity = 0;
          }
        } else if (isFinal) {
          if (localP < 0) {
            opacity = 0;
            translateY = 24;
          } else if (localP < 0.25) {
            const enterP = localP / 0.25;
            const eased = easeOutCubic(enterP);
            opacity = eased;
            translateY = (1 - eased) * 24;
          } else {
            opacity = 1;
            translateY = 0;
          }
        } else {
          if (localP < 0 || localP > 1) {
            opacity = 0;
          } else if (localP < 0.15) {
            const enterP = localP / 0.15;
            const eased = easeOutCubic(enterP);
            opacity = eased;
            translateY = (1 - eased) * 24;
          } else if (localP <= 0.85) {
            opacity = 1;
            translateY = 0;
          } else {
            const exitP = (localP - 0.85) / 0.15;
            opacity = 1 - easeOutCubic(exitP);
            translateY = -exitP * 16;
          }
        }

        const isVisible = opacity > 0.005;
        if (!isVisible) {
          if (rootRef.current.style.display !== "none") {
            rootRef.current.style.display = "none";
          }
          return;
        }

        if (rootRef.current.style.display !== "flex") {
          rootRef.current.style.display = "flex";
        }
        rootRef.current.style.opacity = opacity.toFixed(3);
        rootRef.current.style.pointerEvents = opacity > 0.4 ? "auto" : "none";
        contentRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      },
    }));

    // Placement CSS
    const getPlacementClasses = (pos: ChapterData["placement"]) => {
      switch (pos) {
        case "top-left":
          return "items-start justify-start pt-20 sm:pt-28 md:pt-32 pl-4 sm:pl-10 md:pl-16 lg:pl-24";
        case "top-right":
          return "items-end justify-start pt-20 sm:pt-28 md:pt-32 pr-4 sm:pr-14 md:pr-20 lg:pr-28 text-right sm:text-left";
        case "bottom-left":
          return "items-start justify-end pb-16 sm:pb-20 md:pb-24 pl-4 sm:pl-10 md:pl-16 lg:pl-24";
        case "bottom-right":
          return "items-end justify-end pb-16 sm:pb-20 md:pb-24 pr-4 sm:pr-14 md:pr-20 lg:pr-28 text-right sm:text-left";
        case "center-left":
          return "items-start justify-center py-20 pl-4 sm:pl-10 md:pl-16 lg:pl-24";
        default:
          return "items-start justify-end pb-20 pl-6";
      }
    };

    return (
      <div
        ref={rootRef}
        id={`chapter-${chapter.id}`}
        className={`absolute inset-0 z-30 flex flex-col ${getPlacementClasses(
          chapter.placement
        )} select-none`}
        style={{
          display: isHero ? "flex" : "none",
          opacity: isHero ? 1 : 0,
          pointerEvents: isHero ? "auto" : "none",
        }}
        aria-label={chapter.label}
      >
        <div
          ref={contentRef}
          className="overlay-content relative max-w-xl sm:max-w-2xl w-full"
          style={{
            transform: "translate3d(0, 0px, 0)",
          }}
        >
          {/* Subtle Giant Watermark Chapter Number */}
          <div
            className="absolute -top-16 -left-6 sm:-top-24 sm:-left-12 font-serif text-[6rem] sm:text-[10rem] font-bold text-veneer select-none pointer-events-none leading-none z-0"
            style={{ opacity: 0.09 }}
          >
            {chapter.index.toString().padStart(2, "0")}
          </div>

          <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
            {/* Eyebrow / Label */}
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-glue shadow-sm" />
              <span className="font-mono text-xs sm:text-[13px] tracking-[0.16em] uppercase text-veneer font-medium">
                {chapter.label}
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-birch leading-[1.08] tracking-tight max-w-[20ch]">
              {chapter.headline}
            </h2>

            {/* Body Narrative */}
            <p className="font-sans text-sm sm:text-base lg:text-lg text-birch/85 leading-relaxed max-w-[42ch]">
              {chapter.body}
            </p>

            {/* Precision Engineering Stat Card */}
            {chapter.stat && (
              <div className="mt-2 inline-flex items-center gap-3 bg-ink-800/80 backdrop-blur-md border border-veneer/25 px-4 py-2.5 rounded-sm max-w-fit shadow-md">
                <span className="font-mono text-lg sm:text-xl font-bold text-amber-glow tracking-tight">
                  {chapter.stat.value}
                </span>
                {chapter.stat.caption && (
                  <div className="h-5 w-[1px] bg-white/20" />
                )}
                {chapter.stat.caption && (
                  <span className="text-xs sm:text-sm text-steel tracking-wide">
                    {chapter.stat.caption}
                  </span>
                )}
              </div>
            )}

            {/* Quality Specifications bullet pills */}
            {chapter.details && chapter.details.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {chapter.details.map((detail, dIdx) => (
                  <span
                    key={dIdx}
                    className="font-mono text-[11px] sm:text-xs text-birch/75 bg-ink/60 border border-white/10 px-2.5 py-1 rounded backdrop-blur-sm flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-forest-machine" />
                    {detail}
                  </span>
                ))}
              </div>
            )}

            {/* Chapter 00 Hero Cue */}
            {isHero && (
              <div className="pt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={onScrollToNext}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded font-mono text-xs tracking-wider uppercase text-veneer bg-ink-800/80 border border-veneer/30 hover:border-amber-glue hover:text-amber-glow transition-all"
                >
                  <span>Scroll to scrub factory film</span>
                  <ArrowDown className="w-4 h-4 animate-bounce text-amber-glue" />
                </button>
              </div>
            )}

            {/* Chapter 09 Final Action and Embedded Footer Strip */}
            {isFinal && (
              <div className="pt-4 flex flex-col gap-6">
                {/* Primary & Secondary CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={onOpenQuote}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-glue hover:bg-amber-glow text-ink font-mono font-bold text-sm tracking-wider uppercase rounded transition-all duration-200 active:scale-95 shadow-xl shadow-amber-glue/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-glue"
                  >
                    <span>{chapter.cta?.primaryText || "Request a quote"}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenSpecs}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-ink-800/80 hover:bg-ink-700 border border-birch/30 hover:border-birch text-birch font-mono font-medium text-sm tracking-wider uppercase rounded transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-veneer"
                  >
                    <Download className="w-4 h-4 text-veneer" />
                    <span>{chapter.cta?.secondaryText || "Download Catalogue"}</span>
                  </button>
                </div>

                {/* Integrated Architectural Footer Strip */}
                <div className="mt-2 pt-4 border-t border-white/15 flex flex-col gap-3 font-mono text-[11px] sm:text-xs text-steel">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-birch font-semibold">Headquarters & Mill:</span> 48 Industrial Parkway, Timber Basin · Direct line: +1 (800) 555-WOOD
                    </div>
                    <div className="flex items-center gap-4 text-birch/70">
                      <a href="mailto:supply@arborisplywood.com" className="hover:text-amber-glow underline">
                        supply@arborisplywood.com
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-steel/80">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 border border-forest-machine/50 text-forest-machine font-bold rounded">
                        FSC-C104820
                      </span>
                      <span className="px-1.5 py-0.5 border border-forest-machine/50 text-forest-machine font-bold rounded">
                        EN 13986 CE
                      </span>
                      <span className="px-1.5 py-0.5 border border-forest-machine/50 text-forest-machine font-bold rounded">
                        IS:710 MARINE
                      </span>
                    </div>
                    <div>
                      © {new Date().getFullYear()} Arboris Timber Ltd. All rights reserved. Precision Wood Processing.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
