"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2, Shield, Building2 } from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    grade: "BWP Marine IS:710",
    thickness: "18mm (11-Ply)",
    volume: "1 Full Container Load (FCL)",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // simulate success
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div 
        data-lenis-prevent
        className="relative w-full max-w-xl bg-ink-800 border border-veneer/30 rounded-lg p-6 sm:p-8 shadow-2xl shadow-black text-birch max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-steel hover:text-birch bg-ink-700/60 rounded focus:outline-none focus:ring-2 focus:ring-amber-glue"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-forest-machine/20 border border-forest-machine flex items-center justify-center text-amber-glue">
              <CheckCircle2 className="w-8 h-8 text-forest-machine" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-birch">
              Quote Specification Transmitted
            </h3>
            <p className="font-sans text-sm text-steel max-w-md">
              Thank you, {formData.name || "Architect"}. Our mill logistics team has logged your specification for {formData.thickness} {formData.grade}. An official commercial estimate will reach {formData.email} within 4 business hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-amber-glue text-ink font-mono font-bold text-xs uppercase tracking-wider rounded"
            >
              Return to Story
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-veneer">
                <Building2 className="w-4 h-4 text-amber-glue" />
                <span>Commercial Timber Procurement</span>
              </div>
              <h2
                id="quote-modal-title"
                className="font-serif text-2xl sm:text-3xl font-bold text-birch"
              >
                Request Architectural Quotation
              </h2>
              <p className="text-xs sm:text-sm text-steel mt-1">
                Direct mill pricing for architectural projects, timber dealers, and commercial fabricators.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-steel uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. David Vance"
                    className="w-full bg-ink px-3.5 py-2.5 border border-white/15 rounded text-birch focus:border-amber-glue focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-steel uppercase tracking-wider mb-1">
                    Work Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="david@firm.com"
                    className="w-full bg-ink px-3.5 py-2.5 border border-white/15 rounded text-birch focus:border-amber-glue focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-steel uppercase tracking-wider mb-1">
                    Target Grade
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full bg-ink px-3.5 py-2.5 border border-white/15 rounded text-birch focus:border-amber-glue focus:outline-none text-sm"
                  >
                    <option>BWP Marine IS:710</option>
                    <option>BWR Moisture Resistant IS:303</option>
                    <option>Architectural Calibrated Face</option>
                    <option>Fire Retardant IS:5509</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs text-steel uppercase tracking-wider mb-1">
                    Thickness & Core
                  </label>
                  <select
                    value={formData.thickness}
                    onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                    className="w-full bg-ink px-3.5 py-2.5 border border-white/15 rounded text-birch focus:border-amber-glue focus:outline-none text-sm"
                  >
                    <option>18mm (11-Ply)</option>
                    <option>12mm (7-Ply)</option>
                    <option>16mm (9-Ply)</option>
                    <option>19mm (13-Ply)</option>
                    <option>25mm (17-Ply Heavy)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-steel uppercase tracking-wider mb-1">
                  Estimated Volume
                </label>
                <input
                  type="text"
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  placeholder="e.g. 1 FCL (Approx 1,400 sheets) or project area"
                  className="w-full bg-ink px-3.5 py-2.5 border border-white/15 rounded text-birch focus:border-amber-glue focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-steel uppercase tracking-wider mb-1">
                  Project Notes & Delivery Port
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Specify custom sheet sizing, delivery port, or certifications required."
                  className="w-full bg-ink px-3.5 py-2.5 border border-white/15 rounded text-birch focus:border-amber-glue focus:outline-none text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-steel">
                  <Shield className="w-3.5 h-3.5 text-forest-machine" />
                  <span>Mill direct warranty guarantee</span>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-glue hover:bg-amber-glow text-ink font-mono font-bold text-xs uppercase tracking-wider rounded transition-all active:scale-95 shadow-md shadow-amber-glue/20"
                >
                  <span>Submit RFQ</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

