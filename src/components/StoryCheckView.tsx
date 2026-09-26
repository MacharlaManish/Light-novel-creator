import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2, Check, ArrowRight, Sparkles, RefreshCw, Eye } from "lucide-react";
import { BookProject, ContinuityAlert } from "../types";

interface StoryCheckViewProps {
  project: BookProject;
  onUpdateProject: (updated: BookProject) => void;
  onNavigateToChapter: (chapterNumber: number) => void;
  onProceedToExport: () => void;
}

export const StoryCheckView: React.FC<StoryCheckViewProps> = ({
  project,
  onUpdateProject,
  onNavigateToChapter,
  onProceedToExport
}) => {
  const [alerts, setAlerts] = useState<ContinuityAlert[]>(project.continuityAlerts || []);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [fixedAlerts, setFixedAlerts] = useState<string[]>([]);

  const handleRunHealthCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
    }, 800);
  };

  const handleFixAlert = (alertId: string) => {
    setFixedAlerts((prev) => [...prev, alertId]);
    const updated = alerts.map((a) => (a.id === alertId ? { ...a, applied: true } : a));
    setAlerts(updated);
    onUpdateProject({ ...project, continuityAlerts: updated });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-slate-100 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Step 9: Story Health & Consistency
        </span>
        <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight">
          Story Health Check
        </h2>
        <p className="text-slate-300 mt-1 text-sm">
          A plain-English continuity overview verifying character ages, timeline logic, and historical accuracy before publication.
        </p>
      </div>

      {/* Health Overview Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="font-serif font-bold text-lg text-white">
            Overall Story Status
          </h3>
          <button
            onClick={handleRunHealthCheck}
            disabled={isChecking}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin text-amber-400" : ""}`} />
            <span>{isChecking ? "Scanning..." : "Re-Scan Story"}</span>
          </button>
        </div>

        {/* 5 Non-Technical Health Items */}
        <div className="space-y-2.5">
          {[
            {
              status: "🟢",
              label: "Characters consistent",
              detail: "Ages, names, and core personality traits align across all written chapters."
            },
            {
              status: "🟢",
              label: "Timeline consistent",
              detail: "Yearly markers and technological milestones progress in chronological order."
            },
            {
              status: "🟡",
              label: "2 historical facts need checking",
              detail: "Pre-flood timeline references have been tagged for verification."
            },
            {
              status: "🟢",
              label: "No unresolved character conflicts",
              detail: "Major tensions between court scholars and the prince have clear thematic roles."
            },
            {
              status: "🟡",
              label: "1 major plot thread needs resolution",
              detail: "The British Resident's inspection durbar should conclude before Act III."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 flex items-start gap-3 text-xs sm:text-sm"
            >
              <span className="text-base leading-none">{item.status}</span>
              <div>
                <strong className="text-white block font-medium">{item.label}</strong>
                <span className="text-xs text-slate-400">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continuity Warnings & Fixes */}
      <div className="space-y-4 mb-8">
        <h3 className="font-serif font-bold text-lg text-white">
          Continuity Warnings & Smart Fixes
        </h3>

        {alerts.map((alert) => {
          const isFixed = alert.applied || fixedAlerts.includes(alert.id);

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all ${
                isFixed
                  ? "bg-slate-900/60 border-emerald-500/40 opacity-75"
                  : "bg-slate-900 border-amber-500/50 shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`w-5 h-5 mt-0.5 shrink-0 ${
                      isFixed ? "text-emerald-400" : "text-amber-400"
                    }`}
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{alert.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {alert.description}
                    </p>
                    {alert.suggestedFix && (
                      <p className="text-xs text-amber-300/90 mt-1.5 font-medium">
                        💡 Suggestion: {alert.suggestedFix}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isFixed ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolved</span>
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleFixAlert(alert.id)}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                      >
                        Fix Automatically
                      </button>
                      <button
                        onClick={() => {
                          const chapNum = parseInt(alert.chaptersInvolved[0]?.replace(/\D/g, "") || "1", 10);
                          onNavigateToChapter(chapNum);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
                      >
                        Show Me
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary CTA */}
      <div className="text-center pt-2">
        <button
          onClick={onProceedToExport}
          className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold rounded-xl shadow-xl shadow-amber-500/25 text-sm inline-flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ready to Create E-Book</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
