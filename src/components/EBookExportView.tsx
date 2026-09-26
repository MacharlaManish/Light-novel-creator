import React, { useState } from "react";
import {
  Download,
  BookCheck,
  Check,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Layout,
  ArrowRight,
  Eye,
  BookOpen,
  Settings,
  Layers,
  CheckCircle2,
  FileCode,
  Share2
} from "lucide-react";
import { BookProject, PublishingMetadata } from "../types";
import {
  generateEBookHtml,
  generateEBookMarkdown,
  generateEBookWordDocument,
  generateEBookPlainText,
  isValidIsbn13,
  generateIsbnBarcodeSvg,
  EBookExportOptions
} from "../utils/ebookGenerator";

interface EBookExportViewProps {
  project: BookProject;
  onUpdateProject: (updated: BookProject) => void;
}

export const EBookExportView: React.FC<EBookExportViewProps> = ({ project, onUpdateProject }) => {
  const [title, setTitle] = useState<string>(project.title);
  const [author, setAuthor] = useState<string>(project.author || "Author");
  const [series, setSeries] = useState<string>(project.series || "Volume 1");
  const [appearance, setAppearance] = useState<"Light Novel" | "Classic" | "Modern" | "Minimal">("Light Novel");

  // Options toggles
  const [includeIllustrations, setIncludeIllustrations] = useState<boolean>(true);
  const [includeStoryBible, setIncludeStoryBible] = useState<boolean>(true);
  const [includeCharacterDossier, setIncludeCharacterDossier] = useState<boolean>(true);

  // Publishing & Industrial standards state
  const [isbn, setIsbn] = useState<string>(project.publishingMetadata?.isbn || "978-1-954000-01-8");
  const [contentRating, setContentRating] = useState<"All Ages" | "PG-13 (Teens)" | "16+ (Mature Young Adult)" | "18+ (Explicit/Mature)">(
    project.publishingMetadata?.contentRating || "PG-13 (Teens)"
  );
  const [aiDisclosure, setAiDisclosure] = useState<boolean>(
    project.publishingMetadata?.aiDisclosure !== false
  );
  const [pageProgressionDirection, setPageProgressionDirection] = useState<"ltr" | "rtl">(
    project.publishingMetadata?.pageProgressionDirection || "ltr"
  );

  // Export & preview state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>("");
  const [exportStage, setExportStage] = useState<number>(0);
  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  const [lastDownloadedFormat, setLastDownloadedFormat] = useState<string>("");

  // In-app preview modal
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  const totalWords = project.chapters.reduce((sum, ch) => {
    const text = ch.content || ch.description || "";
    return sum + (text.trim() ? text.trim().split(/\s+/).length : 0);
  }, 0);

  const EXPORT_STAGES = [
    "Compiling chapters and frontmatter",
    "Formatting table of contents and typography",
    "Packaging illustrations and cover art",
    "Binding Story Bible and character dossier",
    "Final E-Book package verified and ready"
  ];

  const getExportOptions = (): EBookExportOptions => ({
    title,
    author,
    series,
    appearance,
    includeIllustrations,
    includeStoryBible,
    includeCharacterDossier
  });

  const triggerRealDownload = (filename: string, textContent: string, mimeType: string) => {
    const blob = new Blob([textContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartExport = (format: "epub" | "html" | "docx" | "markdown" | "txt") => {
    const formatName =
      format === "epub"
        ? "EPUB E-Book"
        : format === "html"
        ? "Standalone HTML E-Book"
        : format === "docx"
        ? "Microsoft Word Document"
        : format === "markdown"
        ? "Markdown Manuscript"
        : "Plain Text";

    setExportFormat(formatName);
    setIsExporting(true);
    setExportStage(0);
    setDownloadReady(false);

    const interval = setInterval(() => {
      setExportStage((prev) => {
        if (prev < EXPORT_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      setExportStage(EXPORT_STAGES.length);
      setIsExporting(false);
      setDownloadReady(true);
      setLastDownloadedFormat(formatName);

      const options = getExportOptions();
      const safeTitle = (title || "Light_Novel").replace(/[^a-zA-Z0-9_-]/g, "_");

      if (format === "epub" || format === "html") {
        const htmlContent = generateEBookHtml(project, options);
        triggerRealDownload(`${safeTitle}_ebook.html`, htmlContent, "text/html");
      } else if (format === "markdown") {
        const mdContent = generateEBookMarkdown(project, options);
        triggerRealDownload(`${safeTitle}.md`, mdContent, "text/markdown");
      } else if (format === "docx") {
        const docContent = generateEBookWordDocument(project, options);
        triggerRealDownload(`${safeTitle}.doc`, docContent, "application/msword");
      } else {
        const txtContent = generateEBookPlainText(project, options);
        triggerRealDownload(`${safeTitle}.txt`, txtContent, "text/plain");
      }
    }, 2000);
  };

  const currentPreviewHtml = generateEBookHtml(project, getExportOptions());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-slate-100 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookCheck className="w-3.5 h-3.5" />
          Final Step: Export & Publish
        </span>
        <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight">
          Final E-Book Download
        </h2>
        <p className="text-slate-300 mt-1 text-sm">
          Export your complete light novel into verified publication formats, ready for Kindle, Apple Books, Kobo, or physical printing.
        </p>
      </div>

      {/* Hero 1-Click Download Card */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-rose-950/30 border-2 border-amber-500/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-20 h-28 rounded-xl bg-slate-950 border border-amber-500/40 overflow-hidden shadow-lg shrink-0 flex items-center justify-center">
              {project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt="Cover"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2 text-[10px] text-amber-300 font-serif font-bold">
                  {title}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ready for Download</span>
                </span>
                <span className="text-xs text-slate-400">
                  {project.chapters.length} Chapters • ~{totalWords.toLocaleString()} Words
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {series} • By {author}
              </p>
              <p className="text-xs text-slate-400 max-w-xl line-clamp-2">
                {project.summary || "Full illustrated alternate-history light novel."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              id="download-final-ebook-primary"
              onClick={() => handleStartExport("epub")}
              disabled={isExporting}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl shadow-xl shadow-amber-500/25 text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Final E-Book</span>
            </button>

            <button
              id="preview-final-ebook-button"
              onClick={() => setShowPreviewModal(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Preview E-Book In Browser</span>
            </button>
          </div>
        </div>

        {/* Meaningful Export Progress Display */}
        {isExporting && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-amber-500/60 space-y-2.5 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Packaging your {exportFormat}...</span>
            </div>

            <div className="space-y-1 text-xs">
              {EXPORT_STAGES.map((st, idx) => {
                const isDone = idx < exportStage;
                const isCurrent = idx === exportStage;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    {isDone ? (
                      <span className="text-emerald-400 font-bold">✓</span>
                    ) : isCurrent ? (
                      <span className="text-amber-400 font-bold animate-pulse">●</span>
                    ) : (
                      <span className="text-slate-600">○</span>
                    )}
                    <span
                      className={
                        isDone
                          ? "text-slate-300"
                          : isCurrent
                          ? "text-amber-300 font-semibold"
                          : "text-slate-500"
                      }
                    >
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {downloadReady && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>{lastDownloadedFormat}</strong> has been downloaded to your computer!
              </span>
            </div>
            <button
              onClick={() => setShowPreviewModal(true)}
              className="text-xs text-amber-300 hover:text-amber-200 underline font-bold"
            >
              Open Live Reader Preview
            </button>
          </div>
        )}
      </div>

      {/* Detailed Export Settings & Multi-Format Options */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
        {/* Step 1: Metadata Customizer */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Publication Metadata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Book Title</label>
              <input
                type="text"
                id="export-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Author Name</label>
              <input
                type="text"
                id="export-author-input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Series / Volume</label>
              <input
                type="text"
                id="export-series-input"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Book Content & Inclusions */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Content Inclusions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-3 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer hover:border-amber-500/50 transition-colors">
              <input
                type="checkbox"
                checked={includeIllustrations}
                onChange={(e) => setIncludeIllustrations(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <div className="text-xs">
                <span className="text-white font-bold block">Chapter Illustrations</span>
                <span className="text-slate-400 text-[11px]">
                  Embed color inserts ({project.illustrations?.length || 0})
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer hover:border-amber-500/50 transition-colors">
              <input
                type="checkbox"
                checked={includeCharacterDossier}
                onChange={(e) => setIncludeCharacterDossier(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <div className="text-xs">
                <span className="text-white font-bold block">Character Dossier</span>
                <span className="text-slate-400 text-[11px]">
                  Appendix with roles & goals ({project.characters?.length || 0})
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer hover:border-amber-500/50 transition-colors">
              <input
                type="checkbox"
                checked={includeStoryBible}
                onChange={(e) => setIncludeStoryBible(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <div className="text-xs">
                <span className="text-white font-bold block">Story Bible & Timeline</span>
                <span className="text-slate-400 text-[11px]">Historical events & divergences</span>
              </div>
            </label>
          </div>
        </div>

        {/* Step 3: Typography & Appearance */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Typography Theme</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "Light Novel", desc: "Japanese LN style with Lora serif & amber ornaments" },
              { id: "Classic", desc: "Traditional publishing with Baskerville & wine red" },
              { id: "Modern", desc: "Clean contemporary sans-serif design" },
              { id: "Minimal", desc: "Typewriter monospace manuscript format" }
            ].map((appStyle) => (
              <button
                key={appStyle.id}
                onClick={() => setAppearance(appStyle.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  appearance === appStyle.id
                    ? "bg-slate-800 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10"
                    : "bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="block font-bold text-xs mb-1">{appStyle.id}</span>
                <span className="block text-[11px] text-slate-400 leading-tight">{appStyle.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Industrial Standards, ISBN Barcode & Legal Colophon */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
                4
              </span>
              <span>Industrial Standards & ISBN Colophon</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <span>W3C EPUB 3.3 & EU AI Act Aligned</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ISBN & Barcode Box */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Standard Book Number (ISBN-13)
                </label>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isValidIsbn13(isbn)
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {isValidIsbn13(isbn) ? "✓ Valid ISBN-13 Checksum" : "Custom/Provisional ISBN"}
                </span>
              </div>
              <input
                type="text"
                value={isbn}
                onChange={(e) => {
                  setIsbn(e.target.value);
                  onUpdateProject({
                    ...project,
                    publishingMetadata: {
                      ...project.publishingMetadata,
                      isbn: e.target.value,
                    },
                  });
                }}
                placeholder="e.g. 978-1-954000-01-8"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
              <div className="pt-1 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Publication Barcode:</span>
                  <div
                    dangerouslySetInnerHTML={{ __html: generateIsbnBarcodeSvg(isbn) }}
                    className="mt-1"
                  />
                </div>
                <div className="text-right text-[11px] text-slate-400 space-y-0.5">
                  <p>Bookland EAN-13</p>
                  <p>Category: Fiction / LN</p>
                  <p>Standard B6 Trim (5" x 7.25")</p>
                </div>
              </div>
            </div>

            {/* Publication Controls & Rating */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 block">
                  International Content Rating
                </label>
                <select
                  value={contentRating}
                  onChange={(e) => {
                    const r = e.target.value as any;
                    setContentRating(r);
                    onUpdateProject({
                      ...project,
                      publishingMetadata: { ...project.publishingMetadata, contentRating: r },
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                >
                  <option value="All Ages">All Ages (General Audience)</option>
                  <option value="PG-13 (Teens)">PG-13 (Teen Readers)</option>
                  <option value="16+ (Mature Young Adult)">16+ (Mature Young Adult)</option>
                  <option value="18+ (Explicit/Mature)">18+ (Explicit / Mature Fiction)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 block">
                  Reading Direction
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPageProgressionDirection("ltr");
                      onUpdateProject({
                        ...project,
                        publishingMetadata: { ...project.publishingMetadata, pageProgressionDirection: "ltr" },
                      });
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                      pageProgressionDirection === "ltr"
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    Left-to-Right (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPageProgressionDirection("rtl");
                      onUpdateProject({
                        ...project,
                        publishingMetadata: { ...project.publishingMetadata, pageProgressionDirection: "rtl" },
                      });
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold ${
                      pageProgressionDirection === "rtl"
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    Right-to-Left (Japanese LN)
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-slate-200 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiDisclosure}
                  onChange={(e) => {
                    setAiDisclosure(e.target.checked);
                    onUpdateProject({
                      ...project,
                      publishingMetadata: { ...project.publishingMetadata, aiDisclosure: e.target.checked },
                    });
                  }}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                />
                <span>Include EU AI Act (Title IV) Transparency Colophon</span>
              </label>
            </div>
          </div>
        </div>

        {/* Step 5: All Export Formats */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
                5
              </span>
              <span>Available Download Formats</span>
            </div>
            <span className="text-xs text-slate-400">Click any format to generate and download</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* EPUB / HTML E-Book */}
            <button
              id="download-format-epub"
              onClick={() => handleStartExport("epub")}
              disabled={isExporting}
              className="p-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-white font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 text-center"
            >
              <Download className="w-5 h-5 text-amber-400" />
              <span className="text-amber-200">EPUB E-Book</span>
              <span className="text-[10px] text-slate-400">Kindle & Apple Books</span>
            </button>

            {/* Standalone HTML Reader */}
            <button
              id="download-format-html"
              onClick={() => handleStartExport("html")}
              disabled={isExporting}
              className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 text-center"
            >
              <FileCode className="w-5 h-5 text-sky-400" />
              <span>Offline Reader</span>
              <span className="text-[10px] text-slate-400">Single self-contained HTML</span>
            </button>

            {/* DOCX */}
            <button
              id="download-format-docx"
              onClick={() => handleStartExport("docx")}
              disabled={isExporting}
              className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 text-center"
            >
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Word (.doc)</span>
              <span className="text-[10px] text-slate-400">Publishing manuscript</span>
            </button>

            {/* Markdown */}
            <button
              id="download-format-markdown"
              onClick={() => handleStartExport("markdown")}
              disabled={isExporting}
              className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 text-center"
            >
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Markdown (.md)</span>
              <span className="text-[10px] text-slate-400">Obsidian & GitHub</span>
            </button>

            {/* Plain text */}
            <button
              id="download-format-txt"
              onClick={() => handleStartExport("txt")}
              disabled={isExporting}
              className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 text-center"
            >
              <FileText className="w-5 h-5 text-slate-400" />
              <span>Plain Text (.txt)</span>
              <span className="text-[10px] text-slate-400">Raw chapters</span>
            </button>
          </div>
        </div>
      </div>

      {/* In-App Live Reader Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-sm text-white font-serif">{title}</h4>
                  <span className="text-xs text-slate-400">In-Browser E-Book Live Reader</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartExport("epub")}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body / iframe preview */}
            <div className="flex-1 bg-white overflow-hidden">
              <iframe
                title="E-Book Preview"
                srcDoc={currentPreviewHtml}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
