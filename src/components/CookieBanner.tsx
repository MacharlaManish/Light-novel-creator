import React, { useState, useEffect } from "react";
import { Cookie, ShieldCheck, Check, Settings, X } from "lucide-react";
import { ComplianceSettings } from "../types";

interface CookieBannerProps {
  onUpdatePreferences: (prefs: ComplianceSettings["cookiePreferences"]) => void;
  onOpenLegal: (tab?: string) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  onUpdatePreferences,
  onOpenLegal,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    preferences: true,
    analytics: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("lnc_cookie_consent");
    if (!saved) {
      setIsVisible(true);
    } else {
      try {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
      } catch {
        setIsVisible(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const all = { essential: true, preferences: true, analytics: true };
    localStorage.setItem("lnc_cookie_consent", JSON.stringify(all));
    onUpdatePreferences(all);
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    const minimal = { essential: true, preferences: false, analytics: false };
    localStorage.setItem("lnc_cookie_consent", JSON.stringify(minimal));
    onUpdatePreferences(minimal);
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem("lnc_cookie_consent", JSON.stringify(preferences));
    onUpdatePreferences(preferences);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-0 inset-x-0 z-50 p-4 bg-slate-950/95 border-t border-slate-800 text-slate-100 shadow-2xl backdrop-blur-lg"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Privacy & Data Integrity Notice (GDPR & CCPA Compliant)
              </h3>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Author Owned
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
              We respect your intellectual property and privacy. We use essential local storage to save your manuscript, chapters, and story bible. We never sell your data, use your manuscript for unauthorized model training, or track you across the web. You retain 100% full commercial copyright to all created works.
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-amber-300">
              <button
                onClick={() => onOpenLegal("privacy")}
                className="underline hover:text-amber-200"
              >
                Read Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => onOpenLegal("copyright")}
                className="underline hover:text-amber-200"
              >
                Author IP & Copyright Rights
              </button>
              <span>•</span>
              <button
                onClick={() => onOpenLegal("ethics")}
                className="underline hover:text-amber-200"
              >
                AI Ethics & Transparency
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        {!showCustomize ? (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCustomize(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Customize
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-transform active:scale-95"
            >
              Accept All
            </button>
          </div>
        ) : (
          <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.essential}
                disabled
                className="rounded border-slate-700 text-amber-500"
              />
              <span>Essential (Local Drafts)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.preferences}
                onChange={(e) =>
                  setPreferences({ ...preferences, preferences: e.target.checked })
                }
                className="rounded border-slate-700 text-amber-500"
              />
              <span>Preferences (Fonts, Contrast)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) =>
                  setPreferences({ ...preferences, analytics: e.target.checked })
                }
                className="rounded border-slate-700 text-amber-500"
              />
              <span>Anonymous Performance</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveCustom}
                className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowCustomize(false)}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
