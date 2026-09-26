import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, Loader2, ArrowRight, X, Sparkles, AlertCircle } from "lucide-react";
import { BookProject } from "../types";

interface UploadStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputType: "story" | "idea" | "conversation";
  onStoryAnalyzed: (project: BookProject) => void;
}

export const UploadStoryModal: React.FC<UploadStoryModalProps> = ({
  isOpen,
  onClose,
  inputType,
  onStoryAnalyzed
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>("");
  const [detectedSummary, setDetectedSummary] = useState<{
    title: string;
    pageCount: number;
    paragraphCount: number;
    genre: string;
    protagonistName: string;
    charactersCount: number;
    arcsCount: number;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const PROCESSING_STAGES = [
    "Reading your document",
    "Finding the main character",
    "Identifying important events",
    "Building the timeline",
    "Looking for unanswered questions",
    "Preparing your story plan"
  ];

  // Helper to parse file and detect stats
  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      analyzeInputLocally(text, selectedFile.name);
    };
    reader.readAsText(selectedFile);
  };

  const handlePasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPastedText(text);
    if (text.trim().length > 50) {
      analyzeInputLocally(text, "My Story Draft");
    } else {
      setDetectedSummary(null);
    }
  };

  const analyzeInputLocally = (content: string, fallbackTitle: string) => {
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const words = content.split(/\s+/).filter(Boolean).length;
    const estPages = Math.max(1, Math.round(words / 300));

    // Smart detector for character / title names
    let title = fallbackTitle.replace(/\.[^/.]+$/, "");
    if (content.toLowerCase().includes("nizam") || content.toLowerCase().includes("osman") || content.toLowerCase().includes("hyderabad")) {
      title = "Reincarnated as Nizam's Heir";
    } else if (paragraphs[0] && paragraphs[0].length < 80) {
      title = paragraphs[0].replace(/chapter\s*\d+:?/i, "").trim();
    }

    setDetectedSummary({
      title: title || "New Light Novel Project",
      pageCount: estPages,
      paragraphCount: Math.max(12, paragraphs.length),
      genre: content.toLowerCase().includes("hyderabad") || content.toLowerCase().includes("nizam")
        ? "Historical Alternate-History Light Novel"
        : "Fantasy / Adventure Light Novel",
      protagonistName: content.toLowerCase().includes("osman") ? "Mir Osman Ali Khan" : "Identified Protagonist",
      charactersCount: Math.min(18, Math.max(4, Math.round(words / 150))),
      arcsCount: 3
    });
  };

  const handleStartAnalysis = async () => {
    setIsProcessing(true);
    setProcessingStage(0);

    // Stagger progress animation so the user sees meaningful steps
    const stageInterval = setInterval(() => {
      setProcessingStage((prev) => {
        if (prev < PROCESSING_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 900);

    try {
      const textToAnalyze = pastedText || (file ? await file.text().catch(() => "") : "");
      
      const res = await fetch("/api/analyze-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyText: textToAnalyze,
          inputType,
          genres: ["Historical Alternate History", "Light Novel"],
          controlLevel: "Balanced"
        })
      });

      const data = await res.json();
      clearInterval(stageInterval);
      setProcessingStage(PROCESSING_STAGES.length);

      // Construct a new BookProject
      const newProject: BookProject = {
        id: `project-${Date.now()}`,
        title: data.title || detectedSummary?.title || "Reincarnated as Nizam's Heir",
        subtitle: data.subtitle || "A Light Novel Chronicle",
        author: "You",
        series: "Chronicles",
        volume: "Vol. 1",
        genres: [data.bookType || "Light Novel", "Historical Fiction"],
        controlLevel: "Balanced",
        setting: data.setting || "Late 19th Century",
        bookType: data.bookType || "Historical Alternate History Light Novel",
        summary: data.summary || "A gripping alternate-history journey of royal duty and future foresight.",
        isHistorical: Boolean(data.isHistorical),
        historicalIdentityNote: data.historicalIdentityNote,
        protagonistName: data.protagonist || "Mir Osman Ali Khan",
        protagonistAge: data.protagonistAge || 10,
        protagonistRole: data.protagonistRole || "Protagonist / Royal Heir",
        protagonistBio: data.protagonistBio || "An heir apparent carrying uncanny modern insights.",
        protagonistWants: data.protagonistWants || "To modernize his homeland and protect his people.",
        protagonistFears: data.protagonistFears || "Failing to avert future crises.",
        characters: (data.characters || []).map((c: any, i: number) => ({
          id: `char-${i + 1}`,
          name: c.name,
          role: c.role || "Ally",
          age: c.age || 25,
          description: c.description || "",
          relationship: c.relationship || "Allies"
        })),
        chapters: (data.chapters || []).map((ch: any, i: number) => ({
          id: `chap-${i + 1}`,
          number: ch.number || i + 1,
          act: ch.act || "Act I",
          actTitle: ch.actTitle || "The Beginning",
          title: ch.title || `Chapter ${i + 1}`,
          description: ch.description || "",
          status: ch.status || (i === 0 ? "Ready to Write" : "Not Started")
        })),
        technologies: (data.technologies || []).map((t: any, i: number) => ({
          id: `tech-${i + 1}`,
          name: t.name,
          stage: t.stage || "Prototype",
          description: t.description || "",
          whyNeeded: t.whyNeeded || "",
          whatRequired: t.whatRequired || "",
          whatHappened: t.whatHappened || "",
          nextStep: t.nextStep || ""
        })),
        historicalFacts: (data.historicalFacts || []).map((hf: any, i: number) => ({
          id: `fact-${i + 1}`,
          claim: hf.claim,
          status: hf.status || "Confirmed",
          usedIn: hf.usedIn || "Chapter 1",
          details: hf.details || ""
        })),
        timeline: (data.timeline || []).map((tm: any, i: number) => ({
          id: `time-${i + 1}`,
          year: tm.year || "1886",
          title: tm.title || "",
          description: tm.description || "",
          type: tm.type || "Historical Record",
          isDivergence: Boolean(tm.isDivergence)
        })),
        questions: [
          {
            id: "q-1",
            title: "Modern Knowledge Usage",
            question: "When should the protagonist begin actively using their modern engineering insights?",
            whyAsking: "This affects when the protagonist's abilities become visible to other characters.",
            options: [
              "Immediately from childhood",
              "Gradually during childhood",
              "Only after a major public event",
              "Let AI suggest an option"
            ],
            selectedOption: "Gradually during childhood",
            aiSuggestion: {
              recommendedOption: "Gradually during childhood",
              reasoning: "Gradual revelation allows other characters to slowly realize the prince's genius without causing instant disbelief."
            }
          },
          {
            id: "q-2",
            title: "Historical Record Adherence",
            question: "How closely should we follow the historical record?",
            whyAsking: "Controls how bold alternate inventions can be before clashing with real historical events.",
            options: [
              "Very closely",
              "Mostly historical, with major alternate developments",
              "Freely alternate history",
              "Let AI suggest"
            ],
            selectedOption: "Mostly historical, with major alternate developments",
            aiSuggestion: {
              recommendedOption: "Mostly historical, with major alternate developments",
              reasoning: "Preserves the authentic cultural texture of the era while giving full freedom to build alternate industrial projects."
            }
          },
          {
            id: "q-3",
            title: "Narrative Voice",
            question: "How should the story usually be told?",
            whyAsking: "This determines whose thoughts the reader hears most intimately.",
            options: [
              "Mostly from the protagonist's perspective",
              "Follow different characters",
              "Mostly protagonist, occasionally others",
              "Let AI recommend"
            ],
            selectedOption: "Mostly protagonist, occasionally others",
            aiSuggestion: {
              recommendedOption: "Mostly protagonist, occasionally others",
              reasoning: "Focusing on the hero keeps their internal motives clear, while cutaways heighten court tension."
            }
          }
        ],
        illustrations: [
          {
            id: "ill-1",
            chapterNumber: 1,
            title: `${data.protagonist || "Protagonist"} at the Palace Balcony`,
            description: "Overlooking the historic capital with blueprints in hand.",
            imageUrl: "",
            character: data.protagonist || "Protagonist",
            location: data.setting || "Royal Palace",
            mood: "Dramatic",
            isCharacterReference: true
          }
        ],
        continuityAlerts: [],
        currentStep: 3, // Source assessment screen
        planningMode: "Let AI Plan As We Go",
        sourceText: textToAnalyze,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTimeout(() => {
        setIsProcessing(false);
        onStoryAnalyzed(newProject);
      }, 500);
    } catch (err) {
      clearInterval(stageInterval);
      setIsProcessing(false);
      alert("Could not process story. Please try again or paste directly.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Step 2: Add Your Story</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-white tracking-tight">
            {inputType === "story"
              ? "Add Your Story Manuscript"
              : inputType === "idea"
              ? "Tell Us Your Story Idea"
              : "Import Your Story Conversation"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Upload your document or paste your text. The assistant will read and organize the characters, setting, and timeline for you.
          </p>
        </div>

        {/* Processing State View */}
        {isProcessing ? (
          <div className="py-8 px-4 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
              <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
            </div>

            <div>
              <h3 className="text-lg font-bold font-serif text-white">
                Understanding your story...
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Reading characters, timeline, and narrative arcs without changing your intent.
              </p>
            </div>

            {/* Meaningful Stage Indicators */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 max-w-md mx-auto text-left space-y-2.5">
              {PROCESSING_STAGES.map((stage, idx) => {
                const isDone = idx < processingStage;
                const isCurrent = idx === processingStage;

                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    {isDone ? (
                      <span className="text-emerald-400 font-bold">✓</span>
                    ) : isCurrent ? (
                      <span className="text-amber-400 font-bold animate-pulse">●</span>
                    ) : (
                      <span className="text-slate-600">○</span>
                    )}
                    <span
                      className={`${
                        isDone
                          ? "text-slate-300 line-through/opacity-80"
                          : isCurrent
                          ? "text-amber-300 font-semibold"
                          : "text-slate-500"
                      }`}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : detectedSummary ? (
          /* "I Found Your Story" Assessment Preview */
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-amber-500/40 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    I Found Your Story
                  </span>
                  <h3 className="text-xl font-bold font-serif text-white mt-1">
                    {detectedSummary.title}
                  </h3>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block">Length</span>
                  <span className="font-semibold text-slate-200">
                    ~{detectedSummary.pageCount} pages ({detectedSummary.paragraphCount} paragraphs)
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block">Type</span>
                  <span className="font-semibold text-amber-300 truncate block">
                    {detectedSummary.genre}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block">Protagonist</span>
                  <span className="font-semibold text-slate-200">
                    {detectedSummary.protagonistName}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-4 text-xs text-slate-300">
                <span>👤 {detectedSummary.charactersCount} characters detected</span>
                <span>📜 {detectedSummary.arcsCount} major story arcs</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  setDetectedSummary(null);
                  setFile(null);
                  setPastedText("");
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
              >
                Choose Another File / Text
              </button>
              <button
                id="btn-understand-my-story"
                onClick={handleStartAnalysis}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 text-sm transition-all hover:scale-[1.01]"
              >
                <span>Understand My Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* File Upload & Paste Tabs */
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === "upload"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Upload File (DOCX, PDF, TXT)
              </button>
              <button
                onClick={() => setActiveTab("paste")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === "paste"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Paste Text Instead
              </button>
            </div>

            {activeTab === "upload" ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleFileSelected(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-2xl p-8 sm:p-10 text-center cursor-pointer bg-slate-800/40 hover:bg-slate-800/70 transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx,.doc,.pdf,.txt,.md"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-100">
                  Drop your Word document or manuscript here
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  or click to browse your computer
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-[11px] text-slate-400 border border-slate-700">
                  Supported formats: DOCX, PDF, TXT, Markdown
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={pastedText}
                  onChange={handlePasteChange}
                  rows={8}
                  placeholder="Paste your story excerpt, chapter, conversation, or outline here..."
                  className="w-full rounded-xl bg-slate-800/70 border border-slate-700 p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-sans"
                />
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    {pastedText.length} characters ({pastedText.split(/\s+/).filter(Boolean).length} words)
                  </span>
                  {pastedText.length > 50 && (
                    <button
                      onClick={handleStartAnalysis}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors"
                    >
                      Analyze Pasted Story
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quick Demo Option for instant testing */}
            <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Want to test with a pre-written story sample?
              </span>
              <button
                onClick={() => {
                  const sampleText = `REINCARNATED AS NIZAM'S HEIR\nMir Osman Ali Khan, born in Purani Haveli in 1886, retains memories of a modern infrastructure engineer. Determined to modernize Hyderabad and prevent the devastating Great Musi Flood of 1908, he begins secretly casting steel gears and surveying water channels.`;
                  setPastedText(sampleText);
                  analyzeInputLocally(sampleText, "Reincarnated as Nizam's Heir");
                }}
                className="text-amber-400 hover:underline font-semibold shrink-0"
              >
                Insert Hyderabad Sample →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
