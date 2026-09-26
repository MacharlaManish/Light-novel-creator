import React from "react";
import { HelpCircle, X, BookOpen, ShieldCheck, Sparkles, Clock, Users, ArrowRight } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: string;
}

const GLOSSARY_ITEMS = [
  {
    term: "Story Consistency",
    description: "The assistant makes sure your characters, ages, and events do not contradict earlier chapters."
  },
  {
    term: "Story Bible",
    description: "A notebook where the app remembers everything about your characters, places, relationships, and world rules."
  },
  {
    term: "Interactive Timeline",
    description: "A chronological chart that tracks when events happen in your story and where your novel changes real history."
  },
  {
    term: "Historical Person Mode",
    description: "Preserves the real historical identity and context of real people while giving you freedom to alter political decisions and inventions."
  },
  {
    term: "Character Reference Art",
    description: "An approved character appearance that the assistant remembers so future illustrations keep the same hairstyle, clothing, and features."
  },
  {
    term: "Chapter Pacing & Fidelity",
    description: "Allows you to decide whether the AI expands naturally on your original draft or invents creative twists."
  },
  {
    term: "EPUB E-Book",
    description: "The standard digital book format that can be opened on phones, tablets, Kindle, Apple Books, and Kobo."
  }
];

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, topic }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Beginner Guide & Plain Language</span>
        </div>

        <h3 className="text-xl font-bold font-serif text-white mb-2">
          How Light Novel Creator Works
        </h3>
        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          You don't need any knowledge of writing software or publishing jargon. Here are plain-English explanations of every tool in this app:
        </p>

        <div className="space-y-3">
          {GLOSSARY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1"
            >
              <h4 className="font-bold text-xs text-amber-300">{item.term}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
