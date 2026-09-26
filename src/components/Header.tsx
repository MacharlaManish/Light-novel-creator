import React from "react";
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  Sliders,
  ChevronRight,
  Eye,
  ShieldCheck,
  Film,
  Scale,
  Cloud,
  User as UserIcon,
  Check
} from "lucide-react";
import { BookProject, ProjectMode } from "../types";
import type { User } from "../firebase/config";

interface HeaderProps {
  project: BookProject | null;
  mode: ProjectMode;
  onToggleMode: (mode: ProjectMode) => void;
  onOpenHelp: (topic?: string) => void;
  onNavigateStep: (step: number) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  onNewProject: () => void;
  onOpenVeoTrailer: () => void;
  onOpenAuth: () => void;
  onOpenLegal: (tab?: string) => void;
  currentUser: User | null;
  isCloudSynced: boolean;
}

export const JOURNEY_STEPS = [
  { step: 1, label: "Start", short: "Start", view: "welcome" },
  { step: 2, label: "Add Story", short: "Story", view: "upload" },
  { step: 3, label: "AI Analysis", short: "Understand", view: "assessment" },
  { step: 4, label: "Questions", short: "Questions", view: "questions" },
  { step: 5, label: "Story Plan", short: "Plan", view: "plan" },
  { step: 6, label: "Characters", short: "Characters", view: "characters" },
  { step: 7, label: "Write Book", short: "Write", view: "chapters" },
  { step: 8, label: "Illustrations", short: "Art", view: "illustrations" },
  { step: 9, label: "Check Story", short: "Check", view: "health" },
  { step: 10, label: "E-Book", short: "Publish", view: "export" },
];

export const Header: React.FC<HeaderProps> = ({
  project,
  mode,
  onToggleMode,
  onOpenHelp,
  onNavigateStep,
  activeView,
  setActiveView,
  onNewProject,
  onOpenVeoTrailer,
  onOpenAuth,
  onOpenLegal,
  currentUser,
  isCloudSynced,
}) => {
  const currentStep = project?.currentStep || 1;
  const progressPercent = Math.min(100, Math.round((currentStep / 10) * 100));

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="brand-home-button"
            onClick={() => setActiveView("dashboard")}
            className="flex items-center gap-2.5 text-left group hover:opacity-90 transition-opacity focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-serif">
                  LIGHT NOVEL CREATOR
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AI Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Source Document → Full Novel → Illustrated E-Book
              </p>
            </div>
          </button>

          {project && (
            <div className="hidden lg:flex items-center gap-2 pl-4 ml-4 border-l border-slate-800">
              <span className="text-xs text-slate-400">Current Book:</span>
              <button
                onClick={() => setActiveView("dashboard")}
                className="text-xs font-semibold text-amber-200 hover:text-amber-100 max-w-[200px] truncate underline decoration-dotted"
                title={project.title}
              >
                {project.title}
              </button>
            </div>
          )}
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-3">
          {/* Beginner / Advanced Mode Switch */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <button
              id="mode-beginner-toggle"
              onClick={() => onToggleMode("beginner")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                mode === "beginner"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Beginner Mode: Plain language, clean layout, sensible defaults"
            >
              Beginner Mode
            </button>
            <button
              id="mode-advanced-toggle"
              onClick={() => onToggleMode("advanced")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                mode === "advanced"
                  ? "bg-slate-700 text-amber-300 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Advanced Mode: Story Bible, continuity matrix, prompt controls, raw parameters"
            >
              <Sliders className="w-3 h-3" />
              Advanced
            </button>
          </div>

          {/* Veo 3 Anime Trailer Generator Button */}
          {project && (
            <button
              id="header-veo-trailer-btn"
              onClick={onOpenVeoTrailer}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/20 transition-all hover:scale-105"
              title="Generate animated anime book trailers using Veo 3 (veo-3.1-fast-generate-preview)"
            >
              <Film className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Veo 3 Trailer</span>
            </button>
          )}

          {/* Final E-Book Direct CTA */}
          {project && (
            <button
              id="header-final-ebook-cta"
              onClick={() => {
                onNavigateStep(10);
                setActiveView("export");
              }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105"
              title="Jump directly to Final E-Book Download"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Final E-Book</span>
            </button>
          )}

          {/* Legal, Ethical & Publishing Standards Hub */}
          <button
            id="legal-standards-header-btn"
            onClick={() => onOpenLegal()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            title="Legal, GDPR, Author Copyright & Accessibility Standards"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Standards</span>
          </button>

          {/* Firebase Cloud Sync & Auth Button */}
          <button
            id="auth-cloud-header-btn"
            onClick={onOpenAuth}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              currentUser
                ? "bg-slate-800 border-emerald-500/40 text-emerald-300"
                : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white"
            }`}
            title={currentUser ? `Cloud Synced (${currentUser.email || "Author"})` : "Connect Cloud Storage"}
          >
            <Cloud className={`w-3.5 h-3.5 ${currentUser ? "text-emerald-400" : "text-slate-400"}`} />
            <span className="hidden sm:inline">
              {currentUser ? (isCloudSynced ? "Cloud Synced" : "Saving...") : "Cloud Save"}
            </span>
          </button>

          {/* Need Help Button */}
          <button
            id="help-button-header"
            onClick={() => onOpenHelp()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Help</span>
          </button>

          {/* New Project / Switch */}
          <button
            id="new-project-header-button"
            onClick={onNewProject}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          >
            New Story
          </button>
        </div>
      </div>

      {/* Progress & Journey Navigation Bar */}
      {project && (
        <div className="bg-slate-950/70 border-t border-slate-800/70 py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
            {/* Quick status label */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Progress:</span>
                <span className="font-bold text-amber-400">{progressPercent}%</span>
              </div>
              <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs">
              {JOURNEY_STEPS.map((s) => {
                const isPassed = currentStep > s.step;
                const isCurrent = currentStep === s.step;
                const isSelected = activeView === s.view;

                return (
                  <button
                    key={s.step}
                    id={`nav-step-${s.step}`}
                    onClick={() => {
                      onNavigateStep(s.step);
                      setActiveView(s.view);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                      isSelected
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                        : isPassed
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                        : isCurrent
                        ? "text-rose-300 font-semibold bg-rose-500/10"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isPassed
                          ? "bg-emerald-500/20 text-emerald-300"
                          : isCurrent
                          ? "bg-amber-500 text-slate-950"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isPassed ? "✓" : s.step}
                    </span>
                    <span>{s.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
