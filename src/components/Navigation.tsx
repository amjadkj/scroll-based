"use client";

import React, { useState } from "react";
import { Trees, Compass, FileText, Phone, ShieldCheck, ArrowRight, Menu, X } from "lucide-react";

interface NavigationProps {
  onOpenQuote: () => void;
  onOpenSpecs: () => void;
  onJumpToStage: (index: number) => void;
  activeChapterIndex: number;
}

export function Navigation({
  onOpenQuote,
  onOpenSpecs,
  onJumpToStage,
  activeChapterIndex,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-colors duration-300 pointer-events-auto"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => onJumpToStage(0)}
            className="flex items-center gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-glue"
            aria-label="Arboris Timber Homepage"
          >
            <div className="w-10 h-10 rounded border border-veneer/30 bg-ink-800/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:border-amber-glue group-hover:bg-amber-glue/10">
              <Trees className="w-5 h-5 text-veneer transition-colors duration-300 group-hover:text-amber-glow" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base sm:text-lg tracking-wider text-birch uppercase leading-none group-hover:text-veneer transition-colors">
                Slash Demo
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-steel uppercase leading-tight mt-0.5">
                Industrial Timber · EST. 1984
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase">
            <button
              onClick={() => onJumpToStage(0)}
              className="text-birch/80 hover:text-veneer transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-glue"
            >
              <Compass className="w-3.5 h-3.5 text-steel" />
              <span>Process Line</span>
            </button>

            <button
              onClick={onOpenSpecs}
              className="text-birch/80 hover:text-veneer transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-glue"
            >
              <FileText className="w-3.5 h-3.5 text-steel" />
              <span>Technical Specs</span>
            </button>

            <button
              onClick={() => onJumpToStage(9)}
              className="text-birch/80 hover:text-veneer transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-glue"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-steel" />
              <span>Certifications</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="relative inline-flex items-center justify-center gap-2 px-4 py-2 font-mono text-xs font-semibold tracking-wider text-ink bg-amber-glue hover:bg-amber-glow transition-all duration-200 rounded active:scale-[0.98] shadow-lg shadow-amber-glue/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-glue focus-visible:ring-offset-ink"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenQuote}
              className="px-3 py-1.5 text-[11px] font-mono font-semibold tracking-wider text-ink bg-amber-glue rounded active:scale-95"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-birch/80 hover:text-birch bg-ink-800/80 border border-white/10 rounded"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-ink/95 backdrop-blur-xl border-b border-veneer/20 px-6 py-6 flex flex-col gap-4 font-mono text-xs uppercase tracking-widest">
            <button
              onClick={() => {
                onJumpToStage(0);
                setMobileMenuOpen(false);
              }}
              className="text-left text-birch py-2 hover:text-veneer"
            >
              00 · Factory Overview
            </button>
            <button
              onClick={() => {
                onJumpToStage(2);
                setMobileMenuOpen(false);
              }}
              className="text-left text-birch py-2 hover:text-veneer"
            >
              02 · Rotary Peeling
            </button>
            <button
              onClick={() => {
                onJumpToStage(7);
                setMobileMenuOpen(false);
              }}
              className="text-left text-birch py-2 hover:text-veneer"
            >
              07 · Hot Pressing
            </button>
            <button
              onClick={() => {
                onJumpToStage(9);
                setMobileMenuOpen(false);
              }}
              className="text-left text-birch py-2 hover:text-veneer"
            >
              09 · Finished Panels
            </button>
            <button
              onClick={() => {
                onOpenSpecs();
                setMobileMenuOpen(false);
              }}
              className="text-left text-veneer py-2 border-t border-white/10 pt-3"
            >
              Open Technical Specs
            </button>
            <button
              onClick={() => {
                onOpenQuote();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-3 bg-amber-glue text-ink font-bold rounded mt-2"
            >
              Request Commercial Quote
            </button>
          </div>
        )}
      </header>
    </>
  );
}

