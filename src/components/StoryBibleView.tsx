import React, { useState } from "react";
import { Clock, Cpu, Landmark, ShieldCheck, AlertCircle, Sparkles, Check, ArrowRight, CheckCircle2 } from "lucide-react";
import { BookProject, TechnologyItem, HistoricalFact, TimelineEvent } from "../types";

interface StoryBibleViewProps {
  project: BookProject;
  onUpdateProject: (updated: BookProject) => void;
}

export const StoryBibleView: React.FC<StoryBibleViewProps> = ({ project, onUpdateProject }) => {
  const [activeTab, setActiveTab] = useState<"timeline" | "facts" | "technology">("timeline");
  const [timelineFilter, setTimelineFilter] = useState<"all" | "history" | "mystory">("all");

  const filteredTimeline = project.timeline.filter((e) => {
    if (timelineFilter === "history") return e.type === "Historical Record";
    if (timelineFilter === "mystory") return e.isDivergence || e.type === "My Story";
    return true;
  });

  const getStageBadge = (stage: TechnologyItem["stage"]) => {
    const stages: TechnologyItem["stage"][] = [
      "Idea",
      "Experiment",
      "Prototype",
      "Workshop",
      "Factory",
      "Mass Production"
    ];
    const currentIdx = stages.indexOf(stage);

    return (
      <div className="flex items-center gap-1">
        {stages.map((st, idx) => (
          <div
            key={st}
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              idx === currentIdx
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : idx < currentIdx
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            {st}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-slate-100 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <Landmark className="w-3.5 h-3.5" />
          Story Bible & Lore
        </span>
        <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight">
          History, Timeline & Technology
        </h2>
        <p className="text-slate-300 mt-1 text-sm">
          Track historical claims, narrative divergences, and technological breakthroughs across the novel.
        </p>
      </div>

      {/* Historical Person Mode Banner */}
      {project.isHistorical && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 text-amber-200">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-amber-300">
                Historical Person Mode Active
              </h4>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                {project.historicalIdentityNote ||
                  "This story is grounded in real historical figures. The app preserves documented titles and customs while giving you creative freedom to alter political decisions and industrial advancements."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab("timeline")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "timeline"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Interactive Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab("technology")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "technology"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Technology Tracker ({project.technologies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("facts")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "facts"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800"
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Historical Facts ({project.historicalFacts.length})</span>
        </button>
      </div>

      {/* TAB 1: TIMELINE */}
      {activeTab === "timeline" && (
        <div className="space-y-6">
          {/* Subfilter */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing {filteredTimeline.length} events
            </span>
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setTimelineFilter("all")}
                className={`px-3 py-1 rounded-lg ${
                  timelineFilter === "all" ? "bg-slate-800 text-amber-300 font-bold" : "text-slate-400"
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setTimelineFilter("history")}
                className={`px-3 py-1 rounded-lg ${
                  timelineFilter === "history" ? "bg-slate-800 text-sky-300 font-bold" : "text-slate-400"
                }`}
              >
                Historical Record
              </button>
              <button
                onClick={() => setTimelineFilter("mystory")}
                className={`px-3 py-1 rounded-lg ${
                  timelineFilter === "mystory" ? "bg-slate-800 text-rose-300 font-bold" : "text-slate-400"
                }`}
              >
                My Story Divergences
              </button>
            </div>
          </div>

          {/* Timeline Stream */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-6">
            {filteredTimeline.map((item) => (
              <div key={item.id} className="relative group">
                {/* Node dot */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 ${
                    item.isDivergence
                      ? "bg-rose-500 border-rose-300 animate-pulse"
                      : "bg-sky-500 border-sky-300"
                  }`}
                />

                <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-amber-400 font-mono">
                        {item.year}
                      </span>
                      <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    </div>

                    {item.isDivergence ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-flex items-center gap-1 self-start sm:self-auto">
                        <Sparkles className="w-3 h-3" />
                        <span>Your story changes history here</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 self-start sm:self-auto">
                        Historical Record
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TECHNOLOGY TRACKER */}
      {activeTab === "technology" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {project.technologies.map((tech) => (
              <div
                key={tech.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-colors space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white">
                      {tech.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{tech.description}</p>
                  </div>
                  {getStageBadge(tech.stage)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 block font-semibold mb-1">Why Needed?</span>
                    <p className="text-slate-300">{tech.whyNeeded}</p>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 block font-semibold mb-1">What was Required?</span>
                    <p className="text-slate-300">{tech.whatRequired}</p>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 block font-semibold mb-1">What Happened When Tested?</span>
                    <p className="text-slate-300">{tech.whatHappened}</p>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                    <span className="text-amber-400 block font-semibold mb-1">Next Step</span>
                    <p className="text-slate-300">{tech.nextStep}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HISTORICAL FACTS */}
      {activeTab === "facts" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {project.historicalFacts.map((fact) => (
              <div
                key={fact.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        fact.status === "Confirmed"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : fact.status === "Needs checking"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      }`}
                    >
                      {fact.status === "Confirmed" ? "🟢 Confirmed" : fact.status === "Needs checking" ? "🟡 Needs checking" : "🔵 Story-created"}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-white">{fact.claim}</h4>
                  </div>
                  <p className="text-xs text-slate-400 pl-1">{fact.details}</p>
                </div>

                <div className="text-xs text-slate-500 sm:text-right shrink-0">
                  <span>Used in: {fact.usedIn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
