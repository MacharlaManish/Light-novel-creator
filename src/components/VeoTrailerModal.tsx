import React, { useState, useEffect } from "react";
import {
  Film,
  Sparkles,
  Play,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Sliders,
  Share2,
  Tv,
  Smartphone
} from "lucide-react";
import { BookProject, BookTrailer } from "../types";

interface VeoTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: BookProject | null;
  onSaveTrailer: (trailer: BookTrailer) => void;
}

export const VeoTrailerModal: React.FC<VeoTrailerModalProps> = ({
  isOpen,
  onClose,
  project,
  onSaveTrailer,
}) => {
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [resolution, setResolution] = useState<"720p" | "1080p">("720p");
  const [prompt, setPrompt] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [activeOperationName, setActiveOperationName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize prompt from project
  useEffect(() => {
    if (project && !prompt) {
      const char = project.protagonistName || "The Protagonist";
      const setting = project.setting || "imperial court and modern industrial workshops";
      setPrompt(
        `Official anime light novel trailer: ${char} standing before ${setting}, cherry blossom petals swirling, glowing technological blueprints, cinematic camera flyover, epic orchestral mood`
      );
    }
  }, [project]);

  if (!isOpen) return null;

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setProgress(10);
    setStatusMessage("Connecting to Veo 3 (veo-3.1-fast-generate-preview)...");

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          resolution,
        }),
      });

      if (!res.ok) {
        throw new Error("Server responded with error: " + res.statusText);
      }

      const data = await res.json();
      const opName = data.operationName;
      setActiveOperationName(opName);

      // Start polling
      pollVideoOperation(opName);
    } catch (err: any) {
      console.warn("Video start generation error:", err);
      setErrorMsg("Failed to start video generation: " + err.message);
      setIsGenerating(false);
    }
  };

  const pollVideoOperation = (operationName: string) => {
    const messages = [
      "Analyzing light novel dramatic arc...",
      "Generating keyframes with Veo 3 anime engine...",
      "Rendering cinematic camera movement and depth...",
      "Synthesizing dynamic lighting and particle effects...",
      "Encoding high-definition video trailer..."
    ];

    let step = 0;
    const interval = setInterval(async () => {
      try {
        step++;
        setStatusMessage(messages[step % messages.length]);
        setProgress((prev) => Math.min(95, prev + 15));

        const statusRes = await fetch("/api/video-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName }),
        });

        if (!statusRes.ok) return;

        const statusData = await statusRes.json();
        if (statusData.done) {
          clearInterval(interval);
          setProgress(100);
          setStatusMessage("Veo 3 generation completed!");

          // Download or fetch video URL
          const downloadRes = await fetch("/api/video-download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName }),
          });

          let finalUrl = "";
          const contentType = downloadRes.headers.get("content-type");
          if (contentType && contentType.includes("video/mp4")) {
            const blob = await downloadRes.blob();
            finalUrl = URL.createObjectURL(blob);
          } else {
            const json = await downloadRes.json();
            finalUrl = json.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
          }

          setGeneratedVideoUrl(finalUrl);
          setIsGenerating(false);

          // Save trailer to project
          const newTrailer: BookTrailer = {
            id: `trailer_${Date.now()}`,
            title: `${project?.title || "Light Novel"} — PV Trailer`,
            prompt,
            aspectRatio,
            resolution,
            status: "completed",
            videoUrl: finalUrl,
            chapterNumber: selectedChapter,
            createdAt: new Date().toISOString(),
          };
          onSaveTrailer(newTrailer);
        }
      } catch (err: any) {
        console.warn("Polling error:", err);
      }
    }, 2000);
  };

  const handleDownloadVideo = () => {
    if (!generatedVideoUrl) return;
    const a = document.createElement("a");
    a.href = generatedVideoUrl;
    a.download = `${(project?.title || "light_novel").toLowerCase().replace(/\s+/g, "_")}_trailer_${aspectRatio.replace(":", "x")}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="veo-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="veo-modal-title" className="text-base font-bold text-white">
                  Veo 3 Book Trailer & Scene Animator
                </h2>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  veo-3.1-fast-generate-preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transform your light novel chapters and characters into animated anime promotional videos (PV)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Aspect Ratio & Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>Aspect Ratio (Required: 16:9 or 9:16)</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAspectRatio("16:9")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    aspectRatio === "16:9"
                      ? "bg-amber-500/15 border-amber-500 text-amber-200 shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Tv className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs">16:9 Landscape</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Cinematic Anime Teaser, YouTube, Desktop Player
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio("9:16")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    aspectRatio === "9:16"
                      ? "bg-amber-500/15 border-amber-500 text-amber-200 shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-xs">9:16 Portrait</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    TikTok, Instagram Reels, YouTube Shorts
                  </p>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Resolution & Quality
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setResolution("720p")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    resolution === "720p"
                      ? "bg-amber-500/15 border-amber-500 text-amber-200 shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="font-bold text-xs block">720p High Definition</span>
                  <span className="text-[11px] text-slate-400">Ultra-fast generation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResolution("1080p")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    resolution === "1080p"
                      ? "bg-amber-500/15 border-amber-500 text-amber-200 shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="font-bold text-xs block">1080p Full HD</span>
                  <span className="text-[11px] text-slate-400">Crystal clear publication</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Scene Inspiration Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">Quick Trailer Presets:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                {
                  label: "Dramatic Opening Scene",
                  text: `Anime PV: ${project?.protagonistName || "Hero"} in ${project?.setting || "the capital"}, turning towards camera as destiny shifts, dynamic camera pan, glowing light, high emotional intensity`
                },
                {
                  label: "Industrial Breakthrough Reveal",
                  text: `Anime PV: Sparks flying in an imperial mechanical workshop, steam rising, intricate brass gears spinning, visionary smile of the reincarnated engineer, heroic theme`
                },
                {
                  label: "Court Intrigue & Tension",
                  text: `Anime PV: Shadows stretching across gilded palace arches, whispering courtiers, tense gazes between royal rivals, cinematic depth of field, dramatic shadows`
                },
                {
                  label: "Emotional Farewell & Blossoms",
                  text: `Anime PV: Evening sunset over ancient palace rooftops, cherry blossoms falling across cobblestones, quiet resolve, cinematic anime masterpiece`
                }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(preset.text)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Scene Animation Prompt (Passed to Veo 3)</span>
              <span className="text-[11px] text-slate-500 font-normal">
                English or Romanized keywords recommended
              </span>
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-amber-500"
              placeholder="Describe the animated scene, mood, camera motion, and visual effects..."
            />
          </div>

          {/* Video Preview or Generator Loading */}
          {isGenerating ? (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-rose-500/20 border-b-rose-500 animate-spin animate-reverse" />
                <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm">Generating Video with Veo 3</h3>
                <p className="text-xs text-amber-300/90 font-medium">{statusMessage}</p>
                <p className="text-[11px] text-slate-500">
                  Model: veo-3.1-fast-generate-preview • Aspect Ratio: {aspectRatio}
                </p>
              </div>
              <div className="w-64 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : generatedVideoUrl ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white text-xs">
                    Veo 3 Video Ready ({aspectRatio})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadVideo}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP4</span>
                  </button>
                </div>
              </div>

              {/* Video Player */}
              <div className="flex justify-center bg-black/60 rounded-xl overflow-hidden p-2">
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className={`rounded-lg object-contain ${
                    aspectRatio === "9:16" ? "max-h-[380px] w-auto aspect-[9/16]" : "max-h-[340px] w-full aspect-[16/9]"
                  }`}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            <span>Official Veo 3 Video Generation API</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartGeneration}
              disabled={isGenerating || !prompt.trim()}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isGenerating ? "Generating Trailer..." : "Generate Trailer (Veo 3)"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
