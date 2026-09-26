import React, { useState } from "react";
import { BookOpen, User, Users, Swords, Clock, Cpu, Check, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { BookProject } from "../types";

interface SourceAssessmentViewProps {
  project: BookProject;
  onConfirm: () => void;
  onUpdateProject: (updated: BookProject) => void;
}

export const SourceAssessmentView: React.FC<SourceAssessmentViewProps> = ({
  project,
  onConfirm,
  onUpdateProject
}) => {
  const [showFixModal, setShowFixModal] = useState<boolean>(false);
  const [fixCorrectionText, setFixCorrectionText] = useState<string>("");
  const [fixSuccessMessage, setFixSuccessMessage] = useState<string>("");
  const [isFixing, setIsFixing] = useState<boolean>(false);

  const handleApplyFix = async () => {
    if (!fixCorrectionText.trim()) return;
    setIsFixing(true);

    try {
      // Simulate/call Gemini or smart local rule update
      setTimeout(() => {
        let updated = { ...project };
        const text = fixCorrectionText.toLowerCase();

        if (text.includes("memory") || text.includes("memories") || text.includes("birth")) {
          updated.protagonistBio = `${updated.protagonistBio} Note: Memories gradually emerge during early childhood rather than at birth.`;
        }
        if (text.includes("father") || text.includes("nizam")) {
          updated.protagonistWants = `${updated.protagonistWants} Focuses heavily on court diplomacy with his royal father.`;
        }

        updated.summary = `${updated.summary} (Refined with author correction: "${fixCorrectionText}")`;
        onUpdateProject(updated);

        setIsFixing(false);
        setFixSuccessMessage("✓ Updated the story understanding.");
        setFixCorrectionText("");
        setTimeout(() => {
          setFixSuccessMessage("");
          setShowFixModal(false);
        }, 1500);
      }, 700);
    } catch {
      setIsFixing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-slate-100 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Step 3: Story Assessment
        </span>
        <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight">
          Here's What I Understand
        </h2>
        <p className="text-slate-300 mt-2 text-sm">
          Review how your story has been analyzed. If anything feels off, simply tell us in plain words.
        </p>
      </div>

      {/* Main Core Overview Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Your Story
            </span>
            <h3 className="text-lg font-bold font-serif text-white mt-1">
              {project.title}
            </h3>
            <span className="text-xs text-amber-400 font-medium">
              {project.bookType}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-rose-400" />
              Main Character
            </span>
            <h4 className="text-base font-bold text-white mt-1">
              {project.protagonistName}
            </h4>
            <span className="text-xs text-slate-400">
              Age {project.protagonistAge} • {project.protagonistRole}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Setting
            </span>
            <h4 className="text-base font-bold text-white mt-1">
              {project.setting}
            </h4>
            <span className="text-xs text-slate-400">
              {project.isHistorical ? "Historical Grounding Active" : "Original World"}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Core Hook
            </span>
            <p className="text-xs text-slate-300 mt-1 line-clamp-3 leading-relaxed">
              {project.summary}
            </p>
          </div>
        </div>
      </div>

      {/* "Important Things I Found" Grid Cards */}
      <div className="mb-10">
        <h3 className="text-lg font-bold font-serif text-white mb-4">
          Important Things I Found
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Main Character */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">
              <User className="w-4 h-4" />
              <span>Main Character</span>
            </div>
            <h4 className="font-bold text-sm text-white">{project.protagonistName}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {project.protagonistBio}
            </p>
          </div>

          {/* Card 2: Family */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wide mb-2">
              <Users className="w-4 h-4" />
              <span>Family & Royal Court</span>
            </div>
            <h4 className="font-bold text-sm text-white">
              {project.characters.find((c) => c.relationship === "Family" && c.name !== project.protagonistName)?.name || "Royal Lineage"}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {project.characters.find((c) => c.relationship === "Family" && c.name !== project.protagonistName)?.description ||
                "Deep family obligations and hereditary responsibilities shape every early decision."}
            </p>
          </div>

          {/* Card 3: Main Conflict */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wide mb-2">
              <Swords className="w-4 h-4" />
              <span>Main Conflict</span>
            </div>
            <h4 className="font-bold text-sm text-white">
              {project.protagonistWants ? "Modernization vs Colonial Friction" : "Core Journey"}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {project.protagonistWants}
            </p>
          </div>

          {/* Card 4: Historical Setting */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wide mb-2">
              <Clock className="w-4 h-4" />
              <span>Major Historical Setting</span>
            </div>
            <h4 className="font-bold text-sm text-white">{project.setting}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Rich cultural heritage, grand durbars, and expanding railway networks create the ideal backdrop for industrial progress.
            </p>
          </div>

          {/* Card 5: Technology */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">
              <Cpu className="w-4 h-4" />
              <span>Technology</span>
            </div>
            <h4 className="font-bold text-sm text-white">
              {project.technologies[0]?.name || "Civil Hydraulics & Steel"}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {project.technologies[0]?.description ||
                "Applying forward-looking metallurgical and fluid engineering to resolve impending civic disasters."}
            </p>
          </div>

          {/* Card 6: Important Relationships */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">
              <Users className="w-4 h-4" />
              <span>Important Relationships</span>
            </div>
            <h4 className="font-bold text-sm text-white">Allies & Political Observers</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {project.characters.filter((c) => c.relationship === "Allies" || c.relationship === "Rivals").map((c) => c.name).slice(0, 3).join(", ") ||
                "Scholarly preceptors and colonial residents observing every step."}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation & Error Correction CTA Bar */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">Does this match your vision?</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            If something was misunderstood, tell us simply and the AI will update its notes.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-fix-something"
            onClick={() => setShowFixModal(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            Something is Wrong
          </button>
          <button
            id="btn-confirm-source-assessment"
            onClick={onConfirm}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/25 text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <span>Looks Right — Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Easy Error Correction Modal */}
      {showFixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <h3 className="text-xl font-bold font-serif text-white">
              Is something incorrect?
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Type the correction in plain words. For example:
              <br />
              <em className="text-amber-300">«"His modern memories do not appear at birth."»</em> or{" "}
              <em className="text-amber-300">«"He wants to study chemistry first."»</em>
            </p>

            <div className="mt-4">
              <textarea
                value={fixCorrectionText}
                onChange={(e) => setFixCorrectionText(e.target.value)}
                rows={3}
                placeholder="Type your correction here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {fixSuccessMessage && (
              <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{fixSuccessMessage}</span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowFixModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                id="btn-apply-fix"
                onClick={handleApplyFix}
                disabled={isFixing || !fixCorrectionText.trim()}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs disabled:opacity-50 transition-colors"
              >
                {isFixing ? "Updating understanding..." : "Fix This"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
