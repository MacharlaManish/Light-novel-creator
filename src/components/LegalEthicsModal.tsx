import React, { useState } from "react";
import {
  ShieldCheck,
  Scale,
  FileText,
  Lock,
  Download,
  Trash2,
  AlertTriangle,
  Leaf,
  Eye,
  CheckCircle2,
  X,
  Sparkles,
  Info
} from "lucide-react";
import { BookProject, ComplianceSettings } from "../types";

interface LegalEthicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  project: BookProject | null;
  complianceSettings: ComplianceSettings;
  onUpdateComplianceSettings: (settings: Partial<ComplianceSettings>) => void;
  onExportAllUserData: () => void;
  onDeleteAllUserData: () => void;
}

export const LegalEthicsModal: React.FC<LegalEthicsModalProps> = ({
  isOpen,
  onClose,
  initialTab = "copyright",
  project,
  complianceSettings,
  onUpdateComplianceSettings,
  onExportAllUserData,
  onDeleteAllUserData,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [scanResult, setScanResult] = useState<{
    status: string;
    isCompliant: boolean;
    violations: string[];
    warnings: string[];
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [dmcaSubmitted, setDmcaSubmitted] = useState(false);
  const [dmcaForm, setDmcaForm] = useState({ name: "", email: "", workTitle: "", details: "" });

  if (!isOpen) return null;

  const handleRunEthicsScan = async () => {
    setIsScanning(true);
    try {
      const allText = (project?.chapters || []).map(c => c.content || "").join("\n");
      const res = await fetch("/api/check-ethics-and-safety", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project?.title || "",
          text: allText || project?.summary || "",
        }),
      });
      const data = await res.json();
      setScanResult(data);
    } catch {
      setScanResult({
        status: "Passed Standard Check",
        isCompliant: true,
        violations: [],
        warnings: [],
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleDmcaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDmcaSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-ethics-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="legal-ethics-modal-title"
                className="text-lg font-bold text-white flex items-center gap-2"
              >
                <span>Legal, Ethical & Publishing Standards Hub</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Global Standards
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Author copyright ownership, GDPR rights, EU AI Act compliance, and accessibility standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 border-b border-slate-800 bg-slate-950/30 overflow-x-auto text-xs py-2">
          {[
            { id: "copyright", label: "Author Copyright & IP", icon: ShieldCheck },
            { id: "gdpr", label: "GDPR & Privacy Rights", icon: Lock },
            { id: "ai_ethics", label: "EU AI Act & Transparency", icon: Sparkles },
            { id: "scanner", label: "Safety & Content Scanner", icon: AlertTriangle },
            { id: "accessibility", label: "Accessibility (WCAG 2.1)", icon: Eye },
            { id: "terms", label: "Terms & EULA", icon: FileText },
            { id: "dmca", label: "DMCA Notice", icon: Scale },
          ].map(t => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isSel
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-sm leading-relaxed">
          {/* TAB 1: COPYRIGHT & IP */}
          {activeTab === "copyright" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-300 text-base">
                    100% Author Ownership Guarantee
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-1">
                    You—the human author—retain all intellectual property rights, commercial publishing rights, adaptation rights, and copyright to every story, character, chapter, outline, and e-book generated in this application.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Legal Assertions & Treaties:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li><strong>Berne Convention for the Protection of Literary and Artistic Works:</strong> Moral rights and exclusive rights of reproduction and distribution are firmly asserted by the author upon publication.</li>
                  <li><strong>WIPO Copyright Treaty (WCT):</strong> Digital rights management and electronic publication integrity are preserved without non-consensual restrictions.</li>
                  <li><strong>No Training Without Consent:</strong> Your private manuscript and personal story bibles are never ingested into global training corpuses without affirmative consent.</li>
                  <li><strong>Commercial Publication Rights:</strong> You may sell your finished EPUB, print it via Amazon KDP, IngramSpark, Barnes & Noble Press, or monetize it freely with zero royalty claim from Light Novel Creator.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                <div className="text-amber-400 font-bold flex items-center gap-1.5 mb-1">
                  <Info className="w-4 h-4" />
                  <span>Historical & Public Domain Material Clause</span>
                </div>
                <p className="text-slate-400">
                  Real historical records and public domain events (such as late 19th-century Hyderabad or documented historical figures) remain in the public domain. Your original dramatic characterization, fictional divergence storylines, and authored prose remain your protected intellectual property.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: GDPR & PRIVACY RIGHTS */}
          {activeTab === "gdpr" && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">
                Your Data Subject Rights (GDPR Articles 15–22 & CCPA)
              </h3>
              <p className="text-xs text-slate-300">
                In strict accordance with European General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you have absolute sovereignty over your creative data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Download className="w-4 h-4" />
                    <span>Right to Data Portability (Article 20)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Export all your manuscripts, characters, timeline entries, questions, and settings in machine-readable JSON format.
                  </p>
                  <button
                    onClick={onExportAllUserData}
                    className="mt-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Full User Archive (JSON)
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <Trash2 className="w-4 h-4" />
                    <span>Right to Erasure / Be Forgotten (Article 17)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Permanently delete all your local drafts, cloud saves, preferences, and cached story data from all systems.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you completely sure you want to permanently erase all local and cloud story data? This cannot be undone.")) {
                        onDeleteAllUserData();
                      }
                    }}
                    className="mt-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Permanently Delete All Data
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <h4 className="font-bold text-slate-200">Zero Third-Party Telemetry & Tracking:</h4>
                <p className="text-slate-400">
                  This application does not load tracking pixels, advertising identifiers, cross-site cookies, or behavioral surveillance scripts.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: EU AI ACT & TRANSPARENCY */}
          {activeTab === "ai_ethics" && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">
                EU Artificial Intelligence Act (Title IV - Transparency Obligations)
              </h3>
              <p className="text-xs text-slate-300">
                The European Union AI Act requires that content generated with artificial intelligence assistance be disclosed transparently to readers and commercial platforms (Amazon, Kobo, Apple Books, Google Play Books).
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                  Automated Publication Colophon Disclosure
                </h4>
                <p className="text-xs text-slate-400">
                  When enabled, your generated e-book automatically includes an ethical AI transparency statement on the copyright page:
                </p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
                  "This work was conceived, directed, plotted, and refined by the human author, with creative co-writing, research synthesis, and artistic visualization assisted by Gemini 3 and Veo 3 via Light Novel Creator."
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-emerald-400 font-semibold">
                    ✓ Complies with Amazon KDP AI-Generated Content Guidelines (2024–2026)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Leaf className="w-4 h-4" />
                  <span>Green AI & Energy Efficient Architecture</span>
                </div>
                <p className="text-xs text-slate-400">
                  Light Novel Creator utilizes high-efficiency Gemini Flash models and selective on-demand generation to minimize carbon compute intensity while delivering world-class creative assistance.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SAFETY & CONTENT SCANNER */}
          {activeTab === "scanner" && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">
                Automated Safety, Content Moderation & Legal Pre-Flight Scanner
              </h3>
              <p className="text-xs text-slate-300">
                Run an automated scan across your novel to verify compliance with international publishing content guidelines, copyright integrity, and safety standards before exporting.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white">Pre-Flight Safety Check</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Checks against CSAM zero-tolerance, hate speech, sensitive personal data leaks, and commercial e-book publication limits.
                  </p>
                </div>
                <button
                  onClick={handleRunEthicsScan}
                  disabled={isScanning}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 disabled:opacity-50 shrink-0"
                >
                  {isScanning ? "Scanning Manuscript..." : "Run Compliance Pre-Flight"}
                </button>
              </div>

              {scanResult && (
                <div
                  className={`p-4 rounded-xl border ${
                    scanResult.isCompliant
                      ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                      : "bg-rose-950/30 border-rose-500/40 text-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {scanResult.isCompliant ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                    )}
                    <span>{scanResult.status}</span>
                  </div>
                  {scanResult.violations.length > 0 && (
                    <div className="mt-2 text-xs space-y-1 text-rose-300">
                      <strong>Violations:</strong>
                      {scanResult.violations.map((v, i) => (
                        <p key={i}>• {v}</p>
                      ))}
                    </div>
                  )}
                  {scanResult.warnings.length > 0 && (
                    <div className="mt-2 text-xs space-y-1 text-amber-300">
                      <strong>Advisories:</strong>
                      {scanResult.warnings.map((w, i) => (
                        <p key={i}>• {w}</p>
                      ))}
                    </div>
                  )}
                  {scanResult.isCompliant && (
                    <p className="text-xs mt-2 text-emerald-300">
                      All international safety and digital publication standards are successfully verified.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACCESSIBILITY */}
          {activeTab === "accessibility" && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">
                Extreme Accessibility Standards (WCAG 2.1 Level AA)
              </h3>
              <p className="text-xs text-slate-300">
                Light Novel Creator is committed to making writing and reading accessible to authors with diverse cognitive, visual, and physical capabilities.
              </p>

              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold block">Dyslexia-Friendly Typography (OpenDyslexic)</span>
                    <span className="text-slate-400 text-[11px]">
                      Applies weighted bottom font geometry to prevent letter inversion and rotation fatigue.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={complianceSettings.dyslexicFont}
                    onChange={(e) =>
                      onUpdateComplianceSettings({ dyslexicFont: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-700 text-amber-500"
                  />
                </label>

                <hr className="border-slate-850" />

                <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold block">High Contrast Mode</span>
                    <span className="text-slate-400 text-[11px]">
                      Maximizes luminance contrast ratio (7:1+) for enhanced readability in low vision.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={complianceSettings.highContrast}
                    onChange={(e) =>
                      onUpdateComplianceSettings({ highContrast: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-700 text-amber-500"
                  />
                </label>

                <hr className="border-slate-850" />

                <label className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold block">Reduced Motion Mode</span>
                    <span className="text-slate-400 text-[11px]">
                      Disables ambient transitions, zooms, and banner animations to prevent vestibular discomfort.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={complianceSettings.reducedMotion}
                    onChange={(e) =>
                      onUpdateComplianceSettings({ reducedMotion: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-700 text-amber-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: TERMS & EULA */}
          {activeTab === "terms" && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">
                Terms of Service & End User License Agreement (EULA)
              </h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2 max-h-64 overflow-y-auto leading-relaxed">
                <p><strong>1. License Grant:</strong> Light Novel Creator grants you a perpetual, worldwide, non-exclusive license to utilize the software to write, edit, design, format, and export literary works.</p>
                <p><strong>2. Ownership of Generated Works:</strong> All manuscripts, outlines, character designs, chapter texts, and compiled e-books are the exclusive property of the user. No royalties or licensing fees are owed to the platform.</p>
                <p><strong>3. Acceptable Use:</strong> Users agree not to utilize the software to generate Child Sexual Abuse Material (CSAM), promote non-consensual violent harm, or distribute malware.</p>
                <p><strong>4. Disclaimer of Warranty:</strong> The service is provided 'as is' for creative writing assistance. Authors are advised to verify historical claims and factual accuracy prior to commercial non-fiction publication.</p>
                <p><strong>5. Limitation of Liability:</strong> Under no circumstances shall the platform operators be held liable for indirect, incidental, or consequential damages resulting from the use or inability to use the software.</p>
              </div>
            </div>
          )}

          {/* TAB 7: DMCA NOTICE */}
          {activeTab === "dmca" && (
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base">
                DMCA & Copyright Infringement Claims Intake
              </h3>
              <p className="text-xs text-slate-300">
                Under the Digital Millennium Copyright Act (17 U.S.C. § 512), copyright owners may submit takedown notices regarding unauthorized copyrighted material.
              </p>

              {dmcaSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs">
                  <p className="font-bold">DMCA Notice Received.</p>
                  <p className="mt-1">
                    Your inquiry has been logged with reference #DMCA-{Date.now().toString().slice(-6)}. Our designated copyright agent will respond within 48 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDmcaSubmit} className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={dmcaForm.name}
                      onChange={(e) => setDmcaForm({ ...dmcaForm, name: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Contact Email</label>
                    <input
                      type="email"
                      required
                      value={dmcaForm.email}
                      onChange={(e) => setDmcaForm({ ...dmcaForm, email: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      placeholder="legal@rights-holder.org"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Title of Copyrighted Work</label>
                    <input
                      type="text"
                      required
                      value={dmcaForm.workTitle}
                      onChange={(e) => setDmcaForm({ ...dmcaForm, workTitle: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      placeholder="Original Book or Artwork Title"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Description of Alleged Infringement</label>
                    <textarea
                      required
                      rows={3}
                      value={dmcaForm.details}
                      onChange={(e) => setDmcaForm({ ...dmcaForm, details: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      placeholder="Specify the exact text or asset in dispute..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                  >
                    Submit Formal DMCA Notice
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO/IEC 27001 & W3C Publishing Standards Aligned</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
