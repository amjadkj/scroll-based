"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { CHAPTERS } from "@/data/chapters";
import { Navigation } from "./Navigation";
import { ProgressRail, ProgressRailHandle } from "./ProgressRail";
import { TimecodeDisplay, TimecodeDisplayHandle } from "./TimecodeDisplay";
import { ChapterOverlay, ChapterOverlayHandle } from "./ChapterOverlay";
import { QuoteModal } from "./QuoteModal";
import { SpecModal } from "./SpecModal";

const TOTAL_FRAMES = 450;

export function PlywoodStory() {
  const storyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // High performance handles (0 re-renders on scroll)
  const overlayHandlesRef = useRef<(ChapterOverlayHandle | null)[]>([]);
  const progressRailRef = useRef<ProgressRailHandle | null>(null);
  const timecodeRef = useRef<TimecodeDisplayHandle | null>(null);

  // Low frequency state (only updates on chapter transition or modal open)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReadyToScroll, setIsReadyToScroll] = useState(false);

  // Internal animation & frame cache refs
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedFlagsRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastActiveIdxRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isReducedMotionRef = useRef(false);

  // Jump to specific chapter smoothly
  const jumpToStage = useCallback((index: number) => {
    if (!storyRef.current) return;
    const ch = CHAPTERS[index];
    if (!ch) return;

    const maxScroll = storyRef.current.offsetHeight - window.innerHeight;
    const targetY = (ch.scrollStart / 100) * maxScroll;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }, []);

  const jumpToNextStage = useCallback(() => {
    const nextIdx = Math.min(CHAPTERS.length - 1, activeChapterIndex + 1);
    jumpToStage(nextIdx);
  }, [activeChapterIndex, jumpToStage]);

  // Main Canvas rendering helper
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const clampedIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
    let img = imagesRef.current[clampedIdx];

    // Fallback to nearest loaded frame if current frame is still downloading
    if (!img || !loadedFlagsRef.current[clampedIdx]) {
      // Check nearest keyframes or neighboring loaded frames
      let foundImg: HTMLImageElement | null = null;
      for (let offset = 1; offset < 30; offset++) {
        const left = clampedIdx - offset;
        const right = clampedIdx + offset;
        if (left >= 0 && loadedFlagsRef.current[left] && imagesRef.current[left]) {
          foundImg = imagesRef.current[left];
          break;
        }
        if (right < TOTAL_FRAMES && loadedFlagsRef.current[right] && imagesRef.current[right]) {
          foundImg = imagesRef.current[right];
          break;
        }
      }
      img = foundImg || imagesRef.current[0];
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Cover fit: crop to fill, centered
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth: number;
    let drawHeight: number;
    let drawX: number;
    let drawY: number;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      drawX = 0;
      drawY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      drawHeight = canvasHeight;
      drawX = (canvasWidth - drawWidth) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, []);

  // Frame preloader engine (Progressive 3-tier loading)
  useEffect(() => {
    let loadedCount = 0;
    const total = TOTAL_FRAMES;

    const getFramePath = (idx: number) => {
      const num = (idx + 1).toString().padStart(4, "0");
      return `/frames/f_${num}.webp`;
    };

    const loadSingleImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index]) {
          resolve(imagesRef.current[index]!);
          return;
        }
        const img = new Image();
        img.src = getFramePath(index);
        img.onload = () => {
          imagesRef.current[index] = img;
          loadedFlagsRef.current[index] = true;
          loadedCount++;
          const pct = Math.round((loadedCount / total) * 100);
          setLoadingProgress(pct);
          if (pct >= 25) {
            setIsReadyToScroll(true);
          }
          resolve(img);
        };
        img.onerror = () => {
          resolve(img);
        };
      });
    };

    // Tier 1: Load First Frame Immediately for Instant FMP
    loadSingleImage(0).then(() => {
      drawFrame(0);
      setIsReadyToScroll(true);
    });

    // Tier 2: Load Keyframes (every 10th frame: 0, 10, 20... 440, 449)
    const keyframeIndices: number[] = [];
    for (let i = 0; i < total; i += 10) {
      keyframeIndices.push(i);
    }
    if (!keyframeIndices.includes(total - 1)) {
      keyframeIndices.push(total - 1);
    }

    const loadKeyframes = async () => {
      for (const idx of keyframeIndices) {
        if (idx !== 0) {
          loadSingleImage(idx);
        }
      }
    };
    loadKeyframes();

    // Tier 3: Concurrently fill in the remaining intermediate frames with idle concurrency
    const remainingIndices: number[] = [];
    for (let i = 0; i < total; i++) {
      if (!keyframeIndices.includes(i)) {
        remainingIndices.push(i);
      }
    }

    let workerIdx = 0;
    const CONCURRENCY = 6;
    const runWorker = async () => {
      while (workerIdx < remainingIndices.length) {
        const nextIdx = remainingIndices[workerIdx++];
        await loadSingleImage(nextIdx);
      }
    };

    for (let c = 0; c < CONCURRENCY; c++) {
      runWorker();
    }
  }, [drawFrame]);

  // Main scroll and RAF animation loop (Zero React re-render bottleneck)
  useEffect(() => {
    // prefers-reduced-motion check
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    isReducedMotionRef.current = mediaQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    const canvas = canvasRef.current;
    const story = storyRef.current;

    // Handle high-DPI retina canvas sizing
    const updateCanvasSize = () => {
      if (!canvas) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const currentFrame = currentProgressRef.current * (TOTAL_FRAMES - 1);
      drawFrame(currentFrame);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize, { passive: true });

    // Native scroll tracking
    const calcProgress = () => {
      if (!story) return 0;
      const max = story.offsetHeight - window.innerHeight;
      if (max <= 0) return 0;
      return Math.min(1, Math.max(0, window.scrollY / max));
    };

    const handleScroll = () => {
      targetProgressRef.current = calcProgress();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial position on load / restore
    targetProgressRef.current = calcProgress();
    currentProgressRef.current = targetProgressRef.current;

    // 60FPS Render Loop
    const tick = () => {
      const target = targetProgressRef.current;
      let current = currentProgressRef.current;

      if (isReducedMotionRef.current) {
        current = target;
      } else {
        const diff = target - current;
        if (Math.abs(diff) < 0.0004) {
          current = target;
        } else {
          // Butter-smooth lerp
          current += diff * 0.14;
        }
      }

      currentProgressRef.current = current;

      // 1. Draw GPU Frame on Canvas
      const f = current * (TOTAL_FRAMES - 1);
      drawFrame(f);

      // 2. Direct DOM update for overlays (0 React re-renders)
      const currentPct = current * 100;
      for (let i = 0; i < overlayHandlesRef.current.length; i++) {
        const handle = overlayHandlesRef.current[i];
        if (handle) {
          handle.updateProgress(currentPct);
        }
      }

      // 3. Direct DOM update for Progress Rail
      if (progressRailRef.current) {
        progressRailRef.current.updateProgress(current);
      }

      // 4. Determine Active Chapter & Direct DOM update for Timecode
      let activeIdx = 0;
      for (let i = 0; i < CHAPTERS.length; i++) {
        const ch = CHAPTERS[i];
        if (currentPct >= ch.scrollStart && currentPct <= ch.scrollEnd) {
          activeIdx = i;
          break;
        }
        if (currentPct > ch.scrollEnd) {
          activeIdx = i;
        }
      }

      const timelineSeconds = current * 30.0;
      if (timecodeRef.current) {
        timecodeRef.current.updateTime(timelineSeconds, activeIdx);
      }

      // 5. Update React state ONLY when chapter index genuinely flips (rare event)
      if (activeIdx !== lastActiveIdxRef.current) {
        lastActiveIdxRef.current = activeIdx;
        setActiveChapterIndex(activeIdx);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateCanvasSize);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, [drawFrame]);

  const currentChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];
  const isRightAligned = currentChapter.placement.includes("right");

  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#chapter-finished"
        onClick={(e) => {
          e.preventDefault();
          jumpToStage(9);
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-glue focus:text-ink focus:font-bold focus:rounded focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to finished panel and quote contact
      </a>

      {/* Screen reader summary */}
      <div className="sr-only" aria-live="polite">
        Current manufacturing stage: {currentChapter.label}. {currentChapter.headline}. {currentChapter.body}
      </div>

      {/* Main Story Container with Scroll Distance */}
      <main
        ref={storyRef}
        id="story"
        className="relative w-full bg-ink"
        style={{
          height: "calc(100vh + var(--scroll-distance, 800vh))",
        }}
      >
        {/* Pinned Sticky Stage Viewport */}
        <div className="stage sticky top-0 h-screen h-[100dvh] w-full overflow-hidden select-none bg-ink">
          {/* High-Performance Canvas Rendering */}
          <canvas
            ref={canvasRef}
            id="film"
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
            aria-hidden="true"
          />

          {/* Dynamic Scrim Layer for 4.5:1 Contrast */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 z-10 ${
              isRightAligned ? "scrim-right" : "scrim-left"
            }`}
          />

          {/* Additional subtle cinematic vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/90 via-transparent to-ink/60 z-10" />

          {/* Progressive Loading Status Header */}
          {!isReadyToScroll && (
            <div className="absolute top-0 left-0 right-0 z-50 flex flex-col items-center justify-center h-full bg-ink/90 backdrop-blur-md">
              <div className="flex flex-col items-center gap-4 max-w-sm px-6 text-center">
                <div className="w-10 h-10 border-2 border-veneer/20 border-t-amber-glue rounded-full animate-spin" />
                <div className="font-mono text-xs uppercase tracking-widest text-veneer">
                  Optimizing Factory Sequence
                </div>
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-glue transition-all duration-300"
                    style={{ width: `${Math.max(15, loadingProgress)}%` }}
                  />
                </div>
                <p className="text-xs text-steel">
                  Preloading 60fps frame sequence ({loadingProgress}%)
                </p>
              </div>
            </div>
          )}

          {/* Navigation Bar */}
          <Navigation
            activeChapterIndex={activeChapterIndex}
            onOpenQuote={() => setIsQuoteOpen(true)}
            onOpenSpecs={() => setIsSpecsOpen(true)}
            onJumpToStage={jumpToStage}
          />

          {/* Stage Overlays (Imperative Handle Binding) */}
          {CHAPTERS.map((chapter, idx) => (
            <ChapterOverlay
              key={chapter.id}
              ref={(el) => {
                overlayHandlesRef.current[idx] = el;
              }}
              chapter={chapter}
              onOpenQuote={() => setIsQuoteOpen(true)}
              onOpenSpecs={() => setIsSpecsOpen(true)}
              onScrollToNext={jumpToNextStage}
            />
          ))}

          {/* Vertical Progress Rail (Right Edge) */}
          <ProgressRail
            ref={progressRailRef}
            chapters={CHAPTERS}
            activeChapterIndex={activeChapterIndex}
            onJumpToStage={jumpToStage}
          />

          {/* Bottom Timecode & Counter Status */}
          <TimecodeDisplay
            ref={timecodeRef}
            totalChapters={CHAPTERS.length}
          />

          {/* Bottom-left subtle technical specs badge */}
          <div className="hidden md:flex fixed bottom-6 left-6 z-40 items-center gap-3 font-mono text-[11px] text-steel/80 bg-ink-900/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-machine" />
            <span>30.0s Tracking Shot</span>
            <span className="text-white/20">·</span>
            <span>450 WebP Frames</span>
            <span className="text-white/20">·</span>
            <span>GPU Canvas Engine</span>
          </div>
        </div>
      </main>

      {/* Interactive Quotation Modal */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />

      {/* Interactive Engineering Spec Sheet Modal */}
      <SpecModal isOpen={isSpecsOpen} onClose={() => setIsSpecsOpen(false)} />
    </>
  );
}
