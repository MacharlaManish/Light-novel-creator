import React, { useState } from "react";
import { BookMarked, PenTool, CheckCircle, Clock, Sparkles, ArrowRight, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { BookProject, Chapter, ChapterStatus } from "../types";

interface StoryPlanViewProps {
  project: BookProject;
  onSelectChapter: (chapter: Chapter) => void;
  onUpdateProject: (updated: BookProject) => void;
  onStartWriting: () => void;
}

export const StoryPlanView: React.FC<StoryPlanViewProps> = ({
  project,
  onSelectChapter,
  onUpdateProject,
  onStartWriting
}) => {
  const [planningMode, setPlanningMode] = useState(project.planningMode || "Let AI Plan As We Go");
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Group chapters by Act
  const actsMap: Record<string, Chapter[]> = {};
  project.chapters.forEach((ch) => {
    const actKey = ch.act ? `${ch.act} — ${ch.actTitle || "Narrative Arc"}` : "Act I — The Opening";
    if (!actsMap[actKey]) actsMap[actKey] = [];
    actsMap[actKey].push(ch);
  });

  const handleModeChange = (mode: "Plan Everything First" | "Start Writing Now" | "Let AI Plan As We Go") => {
    setPlanningMode(mode);
    onUpdateProject({ ...project, planningMode: mode });
  };

  const getStatusBadge = (status: ChapterStatus) => {
    switch (status) {
      case "Approved":
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🟢 Approved</span>;
      case "Needs Review":
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">🟡 Needs Review</span>;
      case "Ready to Write":
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30">🔵 Ready to Write</span>;
      default:
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">⚪ Not Started</span>;
    }
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const nextNum = project.chapters.length + 1;
    const newChap: Chapter = {
      id: `chap-${nextNum}`,
      number: nextNum,
      act: "Act II",
      actTitle: "The Expansion",
      title: newChapterTitle.trim(),
      description: "A newly planned chapter in your story arc.",
      status: "Ready to Write",
      wordCount: 0
    };
    onUpdateProject({
      ...project,
      chapters: [...project.chapters, newChap]
    });
    setNewChapterTitle("");
    setShowAddModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-slate-100 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookMarked className="w-3.5 h-3.5" />
          Step 5: Story Plan
        </span>
        <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight">
          Your Story Plan
        </h2>
        <p className="text-slate-300 mt-1 text-sm">
          A visual overview of your acts and chapters. You can plan everything in detail now, or start writing right away!
        </p>
      </div>

      {/* Planning Freedom Selector (Do not force users to plan everything) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Choose How You Want to Work:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: "Let AI Plan As We Go" as const,
              title: "✨ Let AI Plan As We Go (Default)",
              desc: "Write chapters one by one; the AI suggests the next chapter as you advance."
            },
            {
              id: "Start Writing Now" as const,
              title: "✍️ Start Writing Now",
              desc: "Jump straight into drafting Chapter 1 without worrying about later chapters."
            },
            {
              id: "Plan Everything First" as const,
              title: "📋 Plan Everything First",
              desc: "Flesh out all chapters and scenes in detail before writing any prose."
            }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleModeChange(item.id)}
              className={`p-3.5 rounded-xl text-left border transition-all ${
                planningMode === item.id
                  ? "bg-slate-800 border-amber-500 ring-1 ring-amber-500 text-white shadow-md"
                  : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
              }`}
            >
              <h4 className="font-semibold text-xs text-amber-300">{item.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Acts & Chapters Tree */}
      <div className="space-y-6 mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-serif text-amber-400 tracking-wider">
              BOOK 1: {project.title.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500">({project.chapters.length} Chapters Planned)</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-amber-500 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Chapter</span>
          </button>
        </div>

        {Object.entries(actsMap).map(([actName, chapterList], actIdx) => (
          <div key={actName} className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 sm:p-6">
            {/* Act Header */}
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="font-serif font-bold text-base text-white">
                {actName}
              </h3>
            </div>

            {/* Chapters inside this Act */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pl-2 sm:pl-4 border-l-2 border-slate-800">
              {chapterList.map((chap) => (
                <div
                  key={chap.id}
                  onClick={() => onSelectChapter(chap)}
                  className="group cursor-pointer bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/60 p-4 rounded-xl transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-amber-400">
                        Chapter {chap.number}
                      </span>
                      {getStatusBadge(chap.status)}
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {chap.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {chap.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                    <span>{chap.wordCount ? `${chap.wordCount} words` : "Unwritten"}</span>
                    <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      {chap.content ? "Read / Edit" : "Write Chapter"}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Action Button */}
      <div className="text-center pt-2">
        <button
          id="btn-start-writing-plan"
          onClick={onStartWriting}
          className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold rounded-xl shadow-xl shadow-amber-500/25 text-sm inline-flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <PenTool className="w-4 h-4" />
          <span>Start Writing Chapter 1</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Add Chapter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold font-serif text-white mb-2">Add New Chapter</h3>
            <p className="text-xs text-slate-400 mb-4">Give your new chapter a working title.</p>
            <input
              type="text"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="e.g. The Midnight Foundry"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChapter}
                disabled={!newChapterTitle.trim()}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs disabled:opacity-50"
              >
                Add Chapter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
