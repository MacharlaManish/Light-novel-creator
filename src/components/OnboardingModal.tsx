import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Check, Compass, Shield, BookOpen } from "lucide-react";
import { ControlLevel } from "../types";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: (config: { controlLevel: ControlLevel; selectedGenres: string[] }) => void;
}

const GENRE_OPTIONS = [
  "Fantasy",
  "Historical Fiction",
  "Alternate History",
  "Romance",
  "Adventure",
  "Mystery",
  "Science Fiction",
  "Isekai/Reincarnation",
  "Political/War",
  "Historical Light Novel",
  "Other"
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState<number>(1);
  const [controlLevel, setControlLevel] = useState<ControlLevel>("Balanced");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    "Historical Fiction",
    "Alternate History",
    "Historical Light Novel"
  ]);

  if (!isOpen) return null;

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleFinish = () => {
    onClose({ controlLevel, selectedGenres });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step dots */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">
            Step {screen} of 5
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === screen ? "w-6 bg-amber-500" : s < screen ? "w-3 bg-slate-600" : "w-1.5 bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* SCREEN 1: Welcome */}
        {screen === 1 && (
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                Welcome to Light Novel Creator!
              </h2>
              <p className="text-slate-300 mt-2 text-base leading-relaxed">
                This app helps you turn your story, manuscript, or idea into a complete, illustrated light novel — ready to read and publish.
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 text-sm text-slate-300">
              <p className="font-medium text-amber-300 mb-1">Designed for Complete Beginners</p>
              <p>No prior experience in writing software, publishing, EPUB formats, or AI prompts required. Just bring your ideas or text.</p>
            </div>
            <div className="pt-2">
              <button
                id="onboarding-next-1"
                onClick={() => setScreen(2)}
                className="w-full py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: How Does It Work? */}
        {screen === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
                How does it work?
              </h2>
              <p className="text-slate-300 mt-1 text-sm">
                A simple, guided 6-step journey from your raw idea to a published book.
              </p>
            </div>

            {/* Visual Pipeline */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4 space-y-3">
              {[
                { title: "Your Story", desc: "Upload Word/PDF/TXT, paste text, or start from an idea" },
                { title: "AI Understands It", desc: "Identifies characters, key conflicts, setting, and timeline" },
                { title: "You Answer Questions", desc: "Make 3-5 simple decisions in plain conversational language" },
                { title: "AI Develops the Book", desc: "Generates chapters, drafts scenes, and refines continuity" },
                { title: "You Review & Add Art", desc: "Review chapters, edit prose, and generate authentic illustrations" },
                { title: "Finished E-Book", desc: "Export ready-to-publish EPUB, PDF, Word, or Markdown" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setScreen(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                id="onboarding-next-2"
                onClick={() => setScreen(3)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-1.5 text-sm transition-all"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: How much control do you want? */}
        {screen === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
                How much control do you want?
              </h2>
              <p className="text-slate-300 mt-1 text-sm">
                Choose how actively you want the assistant to ask for your guidance.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "Guided" as ControlLevel,
                  color: "emerald",
                  badge: "🟢 Guided",
                  tagline: "Help me make most decisions",
                  description: "The AI suggests and selects sensible creative choices automatically. Ideal for fast drafting."
                },
                {
                  id: "Balanced" as ControlLevel,
                  color: "blue",
                  badge: "🔵 Balanced (Recommended)",
                  tagline: "Suggest things, but let me decide important matters",
                  description: "Offers smart recommendations while asking your preference on critical twists and character relationships."
                },
                {
                  id: "Author Control" as ControlLevel,
                  color: "purple",
                  badge: "🟣 Author Control",
                  tagline: "Ask me before making important changes",
                  description: "You confirm plot milestones, chapter pacing, and character arcs before scenes are drafted."
                }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setControlLevel(opt.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    controlLevel === opt.id
                      ? "bg-slate-800 border-amber-500 ring-1 ring-amber-500 shadow-md"
                      : "bg-slate-800/50 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-100">{opt.badge}</span>
                    {controlLevel === opt.id && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-xs font-medium text-amber-300/90 mt-1">«"{opt.tagline}"»</p>
                  <p className="text-xs text-slate-400 mt-1">{opt.description}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setScreen(2)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                id="onboarding-next-3"
                onClick={() => setScreen(4)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-1.5 text-sm transition-all"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4: What kind of book are you creating? */}
        {screen === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
                What kind of book are you creating?
              </h2>
              <p className="text-slate-300 mt-1 text-sm">
                Select one or more genres that match your vision.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 py-2">
              {GENRE_OPTIONS.map((g) => {
                const isSelected = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                        : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {isSelected && "✓ "}
                    {g}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 italic">
              *You can change or refine these genres at any time in your story settings.
            </p>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setScreen(3)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                id="onboarding-next-4"
                onClick={() => setScreen(5)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-1.5 text-sm transition-all"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: Ready? */}
        {screen === 5 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-amber-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
                You're Ready to Build Your Book!
              </h2>
              <p className="text-slate-300 mt-2 text-sm max-w-md mx-auto">
                Next, add your story manuscript, outline, or idea. We'll guide you step-by-step into a full illustrated light novel.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-left text-xs text-slate-300 space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Control Mode:</span>
                <span className="font-semibold text-amber-300">{controlLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Genres:</span>
                <span className="font-semibold text-slate-200">{selectedGenres.slice(0, 3).join(", ")}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setScreen(4)}
                className="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm"
              >
                Change Preferences
              </button>
              <button
                id="onboarding-create-project-btn"
                onClick={handleFinish}
                className="py-3 px-8 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/30 text-sm transition-all hover:scale-[1.02]"
              >
                Create My Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
