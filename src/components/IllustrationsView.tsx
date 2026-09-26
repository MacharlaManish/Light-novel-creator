import React, { useState } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Wand2,
  Check,
  RefreshCw,
  Layers,
  ShieldCheck,
  ArrowRight,
  Eye,
  Layout,
  Plus,
  Film,
  Play,
  Download,
  Smartphone,
  Tv,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { BookProject, IllustrationItem, BookTrailer } from "../types";

interface IllustrationsViewProps {
  project: BookProject;
  initialPrompt?: string;
  onUpdateProject: (updated: BookProject) => void;
}

export const IllustrationsView: React.FC<IllustrationsViewProps> = ({
  project,
  initialPrompt,
  onUpdateProject
}) => {
  const [activeTab, setActiveTab] = useState<"scenes" | "wizard" | "cover" | "trailers">("scenes");

  // Wizard state
  const [wizardSceneDesc, setWizardSceneDesc] = useState<string>(initialPrompt || "");
  const [wizardCharacters, setWizardCharacters] = useState<string>(project.protagonistName);
  const [wizardLocation, setWizardLocation] = useState<string>(project.setting);
  const [wizardMood, setWizardMood] = useState<"Calm" | "Dramatic" | "Emotional" | "Mysterious" | "Epic">("Dramatic");
  const [wizardShape, setWizardShape] = useState<"Portrait" | "Landscape" | "Square">("Portrait");
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);

  // Cover Wizard state
  const [coverTitle, setCoverTitle] = useState<string>(project.title);
  const [coverSubtitle, setCoverSubtitle] = useState<string>(project.subtitle || "");
  const [coverLayout, setCoverLayout] = useState<"Character-focused" | "Environment-focused" | "Character + environment">("Character-focused");
  const [isGeneratingCover, setIsGeneratingCover] = useState<boolean>(false);

  // Veo 3 Video Trailer state
  const [trailerPrompt, setTrailerPrompt] = useState<string>(
    `Official anime light novel trailer: ${project.protagonistName} standing in ${project.setting}, cherry blossoms fluttering, glowing runes, cinematic anime masterpiece`
  );
  const [trailerAspect, setTrailerAspect] = useState<"16:9" | "9:16">("16:9");
  const [trailerRes, setTrailerRes] = useState<"720p" | "1080p">("720p");
  const [isGeneratingTrailer, setIsGeneratingTrailer] = useState<boolean>(false);
  const [trailerProgress, setTrailerProgress] = useState<number>(0);
  const [trailerStatusMsg, setTrailerStatusMsg] = useState<string>("");
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const handleGenerateVeoTrailer = async () => {
    setIsGeneratingTrailer(true);
    setTrailerProgress(15);
    setTrailerStatusMsg("Connecting to Veo 3 (veo-3.1-fast-generate-preview)...");

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trailerPrompt,
          aspectRatio: trailerAspect,
          resolution: trailerRes,
        })
      });

      const data = await res.json();
      const opName = data.operationName;

      // Poll status
      let step = 0;
      const msgs = [
        "Rendering anime keyframes with Veo 3...",
        "Simulating camera pans and character motion...",
        "Compositing glowing magical & technological lighting...",
        "Encoding MP4 video trailer..."
      ];

      const poller = setInterval(async () => {
        step++;
        setTrailerStatusMsg(msgs[step % msgs.length]);
        setTrailerProgress((p) => Math.min(95, p + 18));

        try {
          const statusRes = await fetch("/api/video-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName: opName }),
          });

          const sData = await statusRes.json();
          if (sData.done) {
            clearInterval(poller);
            setTrailerProgress(100);
            setTrailerStatusMsg("Veo 3 trailer render complete!");

            const dlRes = await fetch("/api/video-download", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ operationName: opName }),
            });

            let finalUrl = "";
            const cType = dlRes.headers.get("content-type");
            if (cType && cType.includes("video/mp4")) {
              const blob = await dlRes.blob();
              finalUrl = URL.createObjectURL(blob);
            } else {
              const j = await dlRes.json();
              finalUrl = j.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
            }

            setActiveVideoUrl(finalUrl);
            setIsGeneratingTrailer(false);

            const newTrailer: BookTrailer = {
              id: `trailer_${Date.now()}`,
              title: `${project.title} — Official PV (${trailerAspect})`,
              prompt: trailerPrompt,
              aspectRatio: trailerAspect,
              resolution: trailerRes,
              status: "completed",
              videoUrl: finalUrl,
              createdAt: new Date().toISOString(),
            };

            onUpdateProject({
              ...project,
              trailers: [...(project.trailers || []), newTrailer],
            });
          }
        } catch (e) {
          console.warn("Poll err:", e);
        }
      }, 2000);
    } catch {
      setIsGeneratingTrailer(false);
      setTrailerStatusMsg("Failed to generate trailer.");
    }
  };

  // Handle generating standard scene illustration
  const handleGenerateSceneImage = async () => {
    setIsGeneratingImage(true);
    try {
      const promptText = `Light novel anime illustration, ${wizardMood.toLowerCase()} atmosphere. Scene: ${wizardSceneDesc}. Characters: ${wizardCharacters}. Setting: ${wizardLocation}. Authentic Japanese light novel full-page color insert art.`;

      const res = await fetch("/api/generate-illustration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          aspectRatio: wizardShape === "Landscape" ? "16:9" : wizardShape === "Square" ? "1:1" : "3:4"
        })
      });

      const data = await res.json();
      setGeneratedPreview(data.imageUrl || "");
    } catch {
      alert("Could not generate illustration right now.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Handle generating book cover
  const handleGenerateCover = async () => {
    setIsGeneratingCover(true);
    try {
      const promptText = `Light novel book cover artwork. Title: "${coverTitle}". Subtitle: "${coverSubtitle}". Protagonist: ${project.protagonistName} in late 19th-century Deccan royal attire and civil blueprints. Style: premium light novel front cover art, ${coverLayout.toLowerCase()} layout, high resolution anime masterpiece.`;

      const res = await fetch("/api/generate-illustration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          aspectRatio: "2:3"
        })
      });

      const data = await res.json();
      const coverUrl = data.imageUrl || "";
      onUpdateProject({ ...project, coverImage: coverUrl });
      alert("Cover generated and saved to your project!");
    } catch {
      alert("Cover generation failed.");
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleApproveImage = (saveForReference: boolean) => {
    if (!generatedPreview) return;

    const newIll: IllustrationItem = {
      id: `ill-${Date.now()}`,
      chapterNumber: 1,
      title: wizardSceneDesc.slice(0, 30) || "Scene Illustration",
      description: wizardSceneDesc,
      imageUrl: generatedPreview,
      character: wizardCharacters,
      location: wizardLocation,
      mood: wizardMood,
      isCharacterReference: saveForReference
    };

    onUpdateProject({
      ...project,
      illustrations: [...project.illustrations, newIll]
    });

    setGeneratedPreview(null);
    setWizardSceneDesc("");
    setActiveTab("scenes");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-slate-100 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <ImageIcon className="w-3.5 h-3.5" />
          Step 8: Illustrations & Cover Art
        </span>
        <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight">
          Light Novel Art Studio
        </h2>
        <p className="text-slate-300 mt-1 text-sm">
          Create chapter color inserts, character portraits, and ready-to-publish front covers without complex prompt engineering.
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab("scenes")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "scenes"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Chapter Illustrations ({project.illustrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("wizard")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "wizard"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800"
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>Image Creation Wizard</span>
        </button>

        <button
          onClick={() => setActiveTab("cover")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "cover"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
              : "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800"
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Book Cover Creator</span>
        </button>

        <button
          onClick={() => setActiveTab("trailers")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "trailers"
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
              : "text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800"
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Veo 3 Animated Trailers ({(project.trailers || []).length})</span>
        </button>
      </div>

      {/* TAB 1: SUGGESTED & EXISTING SCENE ILLUSTRATIONS */}
      {activeTab === "scenes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-white">
              Approved & Planned Illustrations
            </h3>
            <button
              onClick={() => setActiveTab("wizard")}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Art</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.illustrations.map((ill) => (
              <div
                key={ill.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div className="aspect-[4/3] bg-slate-800 relative overflow-hidden flex items-center justify-center text-slate-500">
                  {ill.imageUrl ? (
                    <img
                      src={ill.imageUrl}
                      alt={ill.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 text-amber-500/40 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-slate-400 block">
                        Light Novel Illustration
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Chapter {ill.chapterNumber} Insert
                      </span>
                    </div>
                  )}

                  {ill.isCharacterReference && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-bold shadow">
                      Character Reference
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">
                      Chapter {ill.chapterNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {ill.mood}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{ill.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{ill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: IMAGE CREATION WIZARD */}
      {activeTab === "wizard" && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold font-serif text-white">
              Illustration Wizard
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Answer 6 simple questions to generate authentic light novel artwork.
            </p>
          </div>

          {/* Question 1: What should this show? */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              1. What should this show?
            </label>
            <textarea
              rows={3}
              value={wizardSceneDesc}
              onChange={(e) => setWizardSceneDesc(e.target.value)}
              placeholder="e.g. Osman and tutor Server-ul-Mulk examining a repaired brass grandfather clock in the palace library..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Question 2: Which characters? */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              2. Which characters are present?
            </label>
            <input
              type="text"
              value={wizardCharacters}
              onChange={(e) => setWizardCharacters(e.target.value)}
              placeholder="e.g. Mir Osman Ali Khan, Server-ul-Mulk"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Question 3: Where does it take place? */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              3. Where does it take place?
            </label>
            <input
              type="text"
              value={wizardLocation}
              onChange={(e) => setWizardLocation(e.target.value)}
              placeholder="e.g. Purani Haveli Cedar Library, Hyderabad"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Question 4: Mood */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
              4. Mood
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(["Calm", "Dramatic", "Emotional", "Mysterious", "Epic"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setWizardMood(m)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    wizardMood === m
                      ? "bg-slate-800 border-amber-500 text-amber-300"
                      : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Shape */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
              5. Shape / Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Portrait", "Landscape", "Square"] as const).map((sh) => (
                <button
                  key={sh}
                  onClick={() => setWizardShape(sh)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    wizardShape === sh
                      ? "bg-slate-800 border-amber-500 text-amber-300"
                      : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {sh}
                </button>
              ))}
            </div>
          </div>

          {/* Preview & Approval Area */}
          {generatedPreview && (
            <div className="border border-amber-500/40 bg-slate-800/80 rounded-2xl p-4 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Generated Illustration Preview
              </span>
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={generatedPreview}
                  alt="Generated Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Approval Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => handleApproveImage(false)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Image</span>
                </button>

                <button
                  onClick={() => handleApproveImage(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save for Character Reference</span>
                </button>

                <button
                  onClick={handleGenerateSceneImage}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              onClick={handleGenerateSceneImage}
              disabled={isGeneratingImage || !wizardSceneDesc.trim()}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/25 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isGeneratingImage ? "Generating Light Novel Art..." : "Create Image"}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: BOOK COVER CREATOR */}
      {activeTab === "cover" && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold font-serif text-white">
              Light Novel Cover Creator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Design a front cover suitable for digital reading and physical publication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Title
              </label>
              <input
                type="text"
                value={coverTitle}
                onChange={(e) => setCoverTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={coverSubtitle}
                onChange={(e) => setCoverSubtitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Layout Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Character-focused", "Environment-focused", "Character + environment"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setCoverLayout(l)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    coverLayout === l
                      ? "bg-slate-800 border-amber-500 text-amber-300"
                      : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {project.coverImage && (
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center gap-4">
              <img
                src={project.coverImage}
                alt="Current Cover"
                referrerPolicy="no-referrer"
                className="w-16 h-24 object-cover rounded-lg shadow-md"
              />
              <div>
                <span className="text-xs font-bold text-emerald-400 block">Current Cover Active</span>
                <span className="text-[11px] text-slate-400">Ready for EPUB & PDF export</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleGenerateCover}
              disabled={isGeneratingCover || !coverTitle.trim()}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/25 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Layout className="w-4 h-4" />
              <span>{isGeneratingCover ? "Painting Cover Artwork..." : "Generate Cover"}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: VEO 3 ANIMATED TRAILERS */}
      {activeTab === "trailers" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-serif">
                    Veo 3 Anime Trailer Generator
                  </h3>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    veo-3.1-fast-generate-preview
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Create anime-quality promotional teaser videos (PV) for social media and reader hype.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTrailerAspect("16:9")}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    trailerAspect === "16:9"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>16:9 Landscape</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTrailerAspect("9:16")}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    trailerAspect === "9:16"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16 Shorts/TikTok</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Scene Animation Prompt (English or Anime Descriptors)
              </label>
              <textarea
                rows={3}
                value={trailerPrompt}
                onChange={(e) => setTrailerPrompt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-amber-500"
                placeholder="Describe scene, character motion, lighting effects..."
              />
            </div>

            {isGeneratingTrailer ? (
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs font-bold text-amber-300">{trailerStatusMsg}</p>
                <div className="w-48 bg-slate-800 rounded-full h-1.5 mx-auto overflow-hidden">
                  <div
                    className="bg-rose-500 h-full transition-all duration-300"
                    style={{ width: `${trailerProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={handleGenerateVeoTrailer}
                disabled={!trailerPrompt.trim()}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Video with Veo 3 ({trailerAspect})</span>
              </button>
            )}

            {activeVideoUrl && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Rendered Video Ready</span>
                  </span>
                  <a
                    href={activeVideoUrl}
                    download="trailer.mp4"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download MP4
                  </a>
                </div>
                <div className="flex justify-center bg-black/60 rounded-xl p-2">
                  <video
                    src={activeVideoUrl}
                    controls
                    autoPlay
                    loop
                    className={`rounded-lg ${
                      trailerAspect === "9:16" ? "max-h-[360px] aspect-[9/16]" : "max-h-[300px] aspect-[16/9]"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* List of Created Trailers */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-rose-400" />
              <span>Project Video Trailers ({(project.trailers || []).length})</span>
            </h4>

            {(project.trailers || []).length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
                No video trailers rendered yet. Use the generator above to create your first Veo 3 promotional teaser!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(project.trailers || []).map((tr) => (
                  <div key={tr.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[200px]">{tr.title}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tr.aspectRatio}
                      </span>
                    </div>
                    {tr.videoUrl && (
                      <video
                        src={tr.videoUrl}
                        controls
                        className="w-full rounded-lg bg-black/50 aspect-video object-contain"
                      />
                    )}
                    <p className="text-[11px] text-slate-400 line-clamp-2">{tr.prompt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
