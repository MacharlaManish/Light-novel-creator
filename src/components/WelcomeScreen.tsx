import React from "react";
import { FileText, Lightbulb, MessageSquare, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { SAMPLE_NIZAM_PROJECT } from "../data/sampleStories";
import { BookProject } from "../types";

interface WelcomeScreenProps {
  onSelectOption: (option: "story" | "idea" | "conversation") => void;
  onLoadSample: (project: BookProject) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectOption, onLoadSample }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-slate-100">
      {/* Hero Welcome Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Turn Any Idea into a Complete Light Novel</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight text-white mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300">Light Novel Creator</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Upload your story, outline, or concept. Answer simple questions, review the story plan, generate chapters, create authentic illustrations, and export a ready-to-read e-book.
        </p>
      </div>

      {/* The 3 Large Primary Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: I Have a Story */}
        <button
          id="btn-option-story"
          onClick={() => onSelectOption("story")}
          className="group text-left p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 hover:border-amber-500/80 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors">
              📄 I Have a Story
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Upload a Word document, PDF, TXT, Markdown manuscript, or paste your existing chapter text.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Upload or Paste Story</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Card 2: I Have an Idea */}
        <button
          id="btn-option-idea"
          onClick={() => onSelectOption("idea")}
          className="group text-left p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 hover:border-rose-500/80 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-serif text-white group-hover:text-rose-300 transition-colors">
              💡 I Have an Idea
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Start fresh from a prompt, concept, historical premise, or character premise in your mind.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform">
            <span>Start from an Idea</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Card 3: I Have a Conversation */}
        <button
          id="btn-option-conversation"
          onClick={() => onSelectOption("conversation")}
          className="group text-left p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 hover:border-indigo-500/80 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-serif text-white group-hover:text-indigo-300 transition-colors">
              💬 I Have a Conversation
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Paste or import a brainstorming session or chat log from an AI conversation.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
            <span>Import Conversation</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Beginner Helper Tip */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 text-center max-w-xl mx-auto mb-12">
        <p className="text-sm text-slate-300">
          <span className="font-semibold text-amber-300">Not sure which option to choose?</span>{" "}
          Choose <strong className="text-white">I Have a Story</strong> if you already have written material, or explore the instant sample below.
        </p>
      </div>

      {/* Preloaded Sample Projects for Instant Exploration */}
      <div className="border-t border-slate-800 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold font-serif text-white">
              Want to see a completed project first?
            </h3>
            <p className="text-xs text-slate-400">
              Explore an authentic pre-configured historical light novel project with 1 click.
            </p>
          </div>
          <button
            id="btn-load-sample-nizam"
            onClick={() => onLoadSample(SAMPLE_NIZAM_PROJECT)}
            className="self-start sm:self-auto px-4 py-2.5 bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 text-amber-300 font-semibold rounded-xl text-xs flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <BookOpen className="w-4 h-4" />
            <span>Load "Reincarnated as Nizam's Heir"</span>
          </button>
        </div>

        {/* Sample Card Preview */}
        <div
          onClick={() => onLoadSample(SAMPLE_NIZAM_PROJECT)}
          className="cursor-pointer group p-5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-16 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-xs shrink-0 shadow-inner">
              VOL. 1
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  Reincarnated as Nizam's Heir (Hyderabad 1886)
                </h4>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Historical Alternate Fiction
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl line-clamp-2">
                A 21st-century civil engineer reincarnated into the princely court of Hyderabad in 1886. Armed with future blueprints, he must navigate colonial intrigues and build flood defenses before the 1908 catastrophe.
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 shrink-0">
            <span>Explore Book</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
