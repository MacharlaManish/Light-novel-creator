import React, { useState, useRef } from "react";
import {
  PenTool,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Image,
  RotateCcw,
  Sliders,
  Maximize2,
  Minimize2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  Type,
  Sun,
  Moon,
  Coffee,
  Check,
  X,
  MessageSquare
} from "lucide-react";
import { BookProject, Chapter, ChapterStatus, GenerationOptions } from "../types";

interface ChapterEditorViewProps {
  project: BookProject;
  chapter: Chapter;
  onUpdateChapter: (updated: Chapter) => void;
  onNavigateChapter: (direction: "prev" | "next") => void;
  onOpenIllustrations: (suggestedPrompt?: string) => void;
  onBackToPlan: () => void;
}

export const ChapterEditorView: React.FC<ChapterEditorViewProps> = ({
  project,
  chapter,
  onUpdateChapter,
  onNavigateChapter,
  onOpenIllustrations,
  onBackToPlan
}) => {
  // Reader Settings
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [themeMode, setThemeMode] = useState<"dark" | "sepia" | "light">("dark");

  // State for generation modal
  const [showGenerateModal, setShowGenerateModal] = useState<boolean>(!chapter.content);
  const [genOptions, setGenOptions] = useState<GenerationOptions>({
    length: "Standard",
    style: "Balanced",
    fidelity: "Expand naturally"
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<number>(0);

  // Text selection popover state
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionCoords, setSelectionCoords] = useState<{ x: number; y: number } | null>(null);
  const [showImproveMenu, setShowImproveMenu] = useState<boolean>(false);
  const [showAskAiMenu, setShowAskAiMenu] = useState<boolean>(false);
  const [aiAnswerModal, setAiAnswerModal] = useState<{ question: string; answer: string } | null>(null);

  // Version History state
  const [history, setHistory] = useState<Array<{ timestamp: string; label: string; content: string }>>([
    {
      timestamp: "Original Draft",
      label: "Initial Version",
      content: chapter.content || ""
    }
  ]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const GENERATION_STAGES = [
    "Reviewing previous events",
    "Checking character relationships",
    "Checking timeline",
    "Writing scenes",
    "Checking consistency",
    "Preparing chapter"
  ];

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setGenerationStage(0);

    const interval = setInterval(() => {
      setGenerationStage((prev) => {
        if (prev < GENERATION_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      const res = await fetch("/api/generate-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookTitle: project.title,
          chapterNumber: chapter.number,
          chapterTitle: chapter.title,
          chapterDescription: chapter.description,
          length: genOptions.length,
          style: genOptions.style,
          fidelity: genOptions.fidelity,
          protagonistName: project.protagonistName,
          setting: project.setting,
          summary: project.summary,
          characters: project.characters
        })
      });

      const data = await res.json();
      clearInterval(interval);
      setGenerationStage(GENERATION_STAGES.length);

      const generatedContent = data.content || "";
      const wordCount = generatedContent.split(/\s+/).filter(Boolean).length;

      const updatedChapter: Chapter = {
        ...chapter,
        content: generatedContent,
        wordCount,
        status: "Needs Review"
      };

      // Add to history
      setHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          label: `AI Draft (${genOptions.style}, ${genOptions.length})`,
          content: generatedContent
        },
        ...prev
      ]);

      onUpdateChapter(updatedChapter);
      setIsGenerating(false);
      setShowGenerateModal(false);
    } catch (err) {
      clearInterval(interval);
      setIsGenerating(false);
      alert("Chapter generation failed. Please try again.");
    }
  };

  const handleImproveSelection = async (instruction: string) => {
    if (!selectedText) return;
    setShowImproveMenu(false);

    try {
      const res = await fetch("/api/improve-prose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedText,
          instruction,
          context: `Book: ${project.title}`
        })
      });

      const data = await res.json();
      const improved = data.improvedText || selectedText;

      if (chapter.content) {
        const newContent = chapter.content.replace(selectedText, improved);
        const updated: Chapter = {
          ...chapter,
          content: newContent,
          wordCount: newContent.split(/\s+/).filter(Boolean).length
        };
        onUpdateChapter(updated);

        // Record in history
        setHistory((prev) => [
          {
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            label: `Improved text: ${instruction}`,
            content: newContent
          },
          ...prev
        ]);
      }
      setSelectedText("");
      setSelectionCoords(null);
    } catch {
      alert("Could not improve prose right now.");
    }
  };

  const handleAskAi = async (questionText: string) => {
    setShowAskAiMenu(false);
    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText,
          context: `Book: ${project.title}\nSetting: ${project.setting}\nProtagonist: ${project.protagonistName}\nExcerpt: ${selectedText}`
        })
      });
      const data = await res.json();
      setAiAnswerModal({
        question: questionText,
        answer: data.answer || "No response received."
      });
    } catch {
      alert("AI inquiry failed.");
    }
  };

  const handleInsertIllustrationMarker = () => {
    const marker = `\n\n[Illustration: ${selectedText || chapter.title}]\n\n`;
    if (chapter.content) {
      const newContent = chapter.content.replace(selectedText, `${selectedText}${marker}`);
      onUpdateChapter({ ...chapter, content: newContent });
    }
    setSelectedText("");
    setSelectionCoords(null);
    onOpenIllustrations(selectedText || chapter.title);
  };

  // Text selection handler
  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 5) {
      setSelectedText(text);
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setSelectionCoords({
          x: Math.min(window.innerWidth - 300, Math.max(20, rect.left + rect.width / 2 - 120)),
          y: Math.max(70, rect.top - 50)
        });
      }
    } else {
      setSelectedText("");
      setSelectionCoords(null);
    }
  };

  const getThemeClasses = () => {
    switch (themeMode) {
      case "sepia":
        return "bg-[#fbf0d9] text-[#433422] border-[#e8d5b5]";
      case "light":
        return "bg-slate-50 text-slate-900 border-slate-200";
      default:
        return "bg-slate-950 text-slate-100 border-slate-800";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-slate-100 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Chapter Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPlan}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Story Plan</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold text-amber-400">
            Chapter {chapter.number}: {chapter.title}
          </span>
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              chapter.status === "Approved"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : chapter.status === "Needs Review"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
            }`}
          >
            {chapter.status === "Approved" ? "🟢 Approved" : chapter.status === "Needs Review" ? "🟡 Needs Review" : "🔵 Ready to Write"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Reader Preferences */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="px-2 py-0.5 text-slate-400 hover:text-white"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-slate-500 px-1">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(26, fontSize + 2))}
              className="px-2 py-0.5 text-slate-400 hover:text-white"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <button
            onClick={() => setFontFamily(fontFamily === "serif" ? "sans" : "serif")}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white flex items-center gap-1"
            title="Toggle Serif / Sans Font"
          >
            <Type className="w-3 h-3" />
            <span>{fontFamily === "serif" ? "Serif" : "Sans"}</span>
          </button>

          {/* Theme switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs gap-1">
            <button
              onClick={() => setThemeMode("dark")}
              className={`p-1 rounded ${themeMode === "dark" ? "bg-slate-800 text-amber-300" : "text-slate-400"}`}
              title="Dark Mode"
            >
              <Moon className="w-3 h-3" />
            </button>
            <button
              onClick={() => setThemeMode("sepia")}
              className={`p-1 rounded ${themeMode === "sepia" ? "bg-[#e8d5b5] text-[#433422]" : "text-slate-400"}`}
              title="Sepia Paper Mode"
            >
              <Coffee className="w-3 h-3" />
            </button>
            <button
              onClick={() => setThemeMode("light")}
              className={`p-1 rounded ${themeMode === "light" ? "bg-slate-200 text-slate-900" : "text-slate-400"}`}
              title="Light Mode"
            >
              <Sun className="w-3 h-3" />
            </button>
          </div>

          {/* History / Undo */}
          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white flex items-center gap-1"
            title="Version History & Undo"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Versions ({history.length})</span>
          </button>

          {/* Re-generate or Write with AI */}
          <button
            onClick={() => setShowGenerateModal(true)}
            className="px-3 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{chapter.content ? "Draft with AI" : "Write Chapter"}</span>
          </button>
        </div>
      </div>

      {/* Floating Selection Action Toolbar (when user highlights text) */}
      {selectionCoords && selectedText && (
        <div
          className="fixed z-50 bg-slate-900 border border-amber-500/80 rounded-xl shadow-2xl p-1.5 flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150"
          style={{ top: `${selectionCoords.y}px`, left: `${selectionCoords.x}px` }}
        >
          <button
            onClick={() => {
              setShowImproveMenu(!showImproveMenu);
              setShowAskAiMenu(false);
            }}
            className="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 rounded-lg flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>✨ Improve Writing</span>
          </button>

          <button
            onClick={() => {
              setShowAskAiMenu(!showAskAiMenu);
              setShowImproveMenu(false);
            }}
            className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white rounded-lg flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>❓ Ask AI</span>
          </button>

          <button
            onClick={handleInsertIllustrationMarker}
            className="px-2.5 py-1 text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white rounded-lg flex items-center gap-1 transition-colors"
          >
            <Image className="w-3.5 h-3.5" />
            <span>🎨 Add Art</span>
          </button>

          <button
            onClick={() => {
              setSelectedText("");
              setSelectionCoords(null);
            }}
            className="p-1 text-slate-400 hover:text-white rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Submenu for Improve Writing */}
          {showImproveMenu && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 text-xs text-slate-200 z-50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block">
                Prose Adjustments:
              </span>
              {[
                "Make clearer",
                "Make more emotional",
                "Make more dramatic",
                "Make more natural",
                "Add sensory description",
                "Improve character dialogue",
                "Shorten & tighten",
                "Expand with detail"
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleImproveSelection(opt)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-500 hover:text-slate-950 font-medium transition-colors block"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Submenu for Ask AI */}
          {showAskAiMenu && (
            <div className="absolute top-full left-10 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 text-xs text-slate-200 z-50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block">
                Story Consistency Queries:
              </span>
              {[
                "Why did this character behave this way?",
                "Is this historically plausible?",
                "Can you explain this technology?",
                "Does this contradict an earlier chapter?"
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleAskAi(q)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors block"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Chapter Reader / Editor Container */}
      <div
        className={`rounded-2xl border p-6 sm:p-10 shadow-xl transition-colors duration-200 ${getThemeClasses()}`}
        onMouseUp={handleMouseUp}
      >
        {/* Chapter Header Info */}
        <div className="text-center max-w-2xl mx-auto mb-8 pb-6 border-b border-current/10">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
            {chapter.act ? `${chapter.act} • ` : ""}Chapter {chapter.number}
          </span>
          <h1
            className={`text-2xl sm:text-4xl font-extrabold mt-1 tracking-tight ${
              fontFamily === "serif" ? "font-serif" : "font-sans"
            }`}
          >
            {chapter.title}
          </h1>
          <p className="text-xs mt-2 opacity-70 max-w-lg mx-auto">
            {chapter.description}
          </p>
        </div>

        {/* Content Area */}
        {chapter.content ? (
          <div className="space-y-4">
            <textarea
              ref={editorRef}
              value={chapter.content}
              onChange={(e) => {
                const text = e.target.value;
                onUpdateChapter({
                  ...chapter,
                  content: text,
                  wordCount: text.split(/\s+/).filter(Boolean).length
                });
              }}
              rows={24}
              style={{ fontSize: `${fontSize}px` }}
              className={`w-full bg-transparent border-0 focus:outline-none focus:ring-0 resize-y leading-relaxed ${
                fontFamily === "serif" ? "font-serif" : "font-sans"
              }`}
              placeholder="Start writing or let the assistant generate the scene..."
            />
          </div>
        ) : (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <PenTool className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-white">This chapter has not been written yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Ready to draft Chapter {chapter.number}? Choose your preferred pacing, length, and style.
              </p>
            </div>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/25 text-sm inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Write Chapter with AI</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Floating Bar for Chapter Review & Approval */}
      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>
            Word Count: <strong className="text-slate-200">{chapter.wordCount || 0}</strong> words
          </span>
          <span>•</span>
          <span>
            Reading Time: ~<strong className="text-slate-200">{Math.max(1, Math.round((chapter.wordCount || 0) / 200))}</strong> min
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status buttons */}
          <button
            onClick={() => onUpdateChapter({ ...chapter, status: "Approved" })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              chapter.status === "Approved"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800 text-emerald-400 hover:bg-slate-700 border border-emerald-500/30"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve Chapter</span>
          </button>

          <button
            onClick={() => onOpenIllustrations(chapter.title)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5"
          >
            <Image className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Illustration</span>
          </button>

          {/* Prev / Next chapter navigation */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
            <button
              onClick={() => onNavigateChapter("prev")}
              disabled={chapter.number <= 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
              title="Previous Chapter"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateChapter("next")}
              disabled={chapter.number >= project.chapters.length}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
              title="Next Chapter"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Generation Options Modal (Beginner-Friendly Chapter Setup) */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/90 rounded-2xl max-w-xl w-full p-6 sm:p-8 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setShowGenerateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {isGenerating ? (
              <div className="py-6 text-center space-y-6">
                <div className="w-14 h-14 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mx-auto" />
                <div>
                  <h3 className="text-xl font-bold font-serif text-white">
                    Writing Chapter {chapter.number}...
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Crafting dialogue, historical atmosphere, and character arcs.
                  </p>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 max-w-md mx-auto text-left space-y-2 text-xs">
                  {GENERATION_STAGES.map((stage, idx) => {
                    const isDone = idx < generationStage;
                    const isCurrent = idx === generationStage;
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        {isDone ? (
                          <span className="text-emerald-400 font-bold">✓</span>
                        ) : isCurrent ? (
                          <span className="text-amber-400 font-bold animate-pulse">●</span>
                        ) : (
                          <span className="text-slate-600">○</span>
                        )}
                        <span className={isDone ? "text-slate-400" : isCurrent ? "text-amber-300 font-semibold" : "text-slate-500"}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Write Chapter {chapter.number}
                  </span>
                  <h2 className="text-2xl font-bold font-serif text-white mt-0.5">
                    {chapter.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{chapter.description}</p>
                </div>

                {/* Length Options */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Length
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "Short", label: "Short (~1,000 words)" },
                      { id: "Standard", label: "Standard (~2,000 words)" },
                      { id: "Detailed", label: "Detailed (~3,500 words)" }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setGenOptions({ ...genOptions, length: item.id as any })}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          genOptions.length === item.id
                            ? "bg-slate-800 border-amber-500 text-amber-300"
                            : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Options */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "Balanced",
                      "More emotional",
                      "More cinematic",
                      "More detailed",
                      "More dialogue"
                    ].map((st) => (
                      <button
                        key={st}
                        onClick={() => setGenOptions({ ...genOptions, style: st as any })}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                          genOptions.style === st
                            ? "bg-slate-800 border-amber-500 text-amber-300"
                            : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fidelity Options */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Story Fidelity
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      "Stay close to source",
                      "Expand naturally",
                      "Develop creatively"
                    ].map((fid) => (
                      <button
                        key={fid}
                        onClick={() => setGenOptions({ ...genOptions, fidelity: fid as any })}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                          genOptions.fidelity === fid
                            ? "bg-slate-800 border-amber-500 text-amber-300"
                            : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {fid}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <div className="pt-2">
                  <button
                    id="btn-confirm-write-chapter"
                    onClick={handleStartGeneration}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/25 text-sm flex items-center justify-center gap-2"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Write Chapter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Answer Modal */}
      {aiAnswerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>AI Story Clarification</span>
            </div>
            <h3 className="text-lg font-bold font-serif text-white mb-3">
              «"{aiAnswerModal.question}"»
            </h3>
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed max-h-60 overflow-y-auto">
              {aiAnswerModal.answer}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setAiAnswerModal(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <h3 className="text-lg font-bold font-serif text-white mb-2">Version History</h3>
            <p className="text-xs text-slate-400 mb-4">
              Never lose your writing. Restore any previous revision with a single click.
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {history.map((rev, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{rev.label}</span>
                    <span className="text-slate-400 text-[11px]">{rev.timestamp}</span>
                  </div>
                  <button
                    onClick={() => {
                      onUpdateChapter({
                        ...chapter,
                        content: rev.content,
                        wordCount: rev.content.split(/\s+/).filter(Boolean).length
                      });
                      setShowHistoryModal(false);
                    }}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-amber-500 hover:text-slate-950 rounded-lg text-slate-200 text-xs font-semibold transition-colors"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
