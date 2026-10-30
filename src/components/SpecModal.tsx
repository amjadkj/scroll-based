"use client";

import React from "react";
import { X, Download, ShieldCheck, Check, Layers, Cpu, Compass } from "lucide-react";

interface SpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpecModal({ isOpen, onClose }: SpecModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="specs-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-ink-800 border border-veneer/30 rounded-lg p-6 sm:p-8 shadow-2xl text-birch max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-steel hover:text-birch bg-ink-700/60 rounded focus:outline-none focus:ring-2 focus:ring-amber-glue"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5 font-mono text-xs uppercase tracking-widest text-veneer">
            <Layers className="w-4 h-4 text-amber-glue" />
            <span>Engineering Data Sheet</span>
          </div>
          <h2
            id="specs-modal-title"
            className="font-serif text-2xl sm:text-3xl font-bold text-birch"
          >
            Arboris BWP Marine Calibrated Plywood
          </h2>
          <p className="text-xs sm:text-sm text-steel mt-1">
            Standard specifications for heavy-duty architectural, marine, and joinery applications.
          </p>
        </div>

        {/* Spec Table */}
        <div className="flex flex-col gap-4">
          <div className="border border-white/10 rounded overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-ink-900 border-b border-white/10 text-veneer uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Parameter</th>
                  <th className="py-2.5 px-4">Test Standard</th>
                  <th className="py-2.5 px-4">Calibrated Metric</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-birch/90">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-birch">Adhesive Matrix</td>
                  <td className="py-2.5 px-4 text-steel">IS:710 / EN 314-2</td>
                  <td className="py-2.5 px-4 text-amber-glow">Phenol Formaldehyde (72h Boiling Proof)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-birch">Core Construction</td>
                  <td className="py-2.5 px-4 text-steel">Orthogonal 90° Cross</td>
                  <td className="py-2.5 px-4">11-Ply Hardwood (Full Core, Zero Gap)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-birch">Moisture Content</td>
                  <td className="py-2.5 px-4 text-steel">EN 322 / IS:1734</td>
                  <td className="py-2.5 px-4 text-amber-glow">8.5% ± 1.0% (Equalized)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-birch">Density</td>
                  <td className="py-2.5 px-4 text-steel">EN 323</td>
                  <td className="py-2.5 px-4">760 – 820 kg/m³</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-birch">Modulus of Elasticity</td>
                  <td className="py-2.5 px-4 text-steel">EN 310</td>
                  <td className="py-2.5 px-4">Parallel: 6,400 N/mm² · Perpendicular: 4,800 N/mm²</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-birch">Thickness Tolerance</td>
                  <td className="py-2.5 px-4 text-steel">Calibrated 4-Head</td>
                  <td className="py-2.5 px-4 text-amber-glow">± 0.20 mm</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-birch">Formaldehyde Emission</td>
                  <td className="py-2.5 px-4 text-steel">CARB Phase 2 / E1</td>
                  <td className="py-2.5 px-4">≤ 0.05 ppm (Ultra-Low)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Certifications highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
            <div className="bg-ink p-3 rounded border border-white/10 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-machine flex-shrink-0" />
              <span>FSC 100% Chain-of-Custody</span>
            </div>
            <div className="bg-ink p-3 rounded border border-white/10 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-glue flex-shrink-0" />
              <span>Ultrasound Void Inspected</span>
            </div>
            <div className="bg-ink p-3 rounded border border-white/10 flex items-center gap-2">
              <Compass className="w-4 h-4 text-veneer flex-shrink-0" />
              <span>Boiling Water Tested 72h</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-xs text-steel">
              Document Ref: ARB-SPEC-2026-V4.PDF (2.8 MB)
            </span>
            <a
              href="/scrub.mp4"
              download="Arboris_Plywood_Technical_Spec.mp4"
              onClick={(e) => {
                // Trigger download notice
                alert("Technical Catalogue & Mill Footage package download started.");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-veneer hover:bg-veneer-light text-ink font-mono font-bold text-xs uppercase tracking-wider rounded transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Spec Sheet</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

