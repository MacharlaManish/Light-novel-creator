import React, { useState, useEffect } from "react";
import { BookProject, Chapter, ProjectMode, ControlLevel, BookTrailer, ComplianceSettings } from "./types";
import { SAMPLE_NIZAM_PROJECT } from "./data/sampleStories";
import { Header } from "./components/Header";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { OnboardingModal } from "./components/OnboardingModal";
import { UploadStoryModal } from "./components/UploadStoryModal";
import { SourceAssessmentView } from "./components/SourceAssessmentView";
import { QuestionAssistantView } from "./components/QuestionAssistantView";
import { StoryPlanView } from "./components/StoryPlanView";
import { ChapterEditorView } from "./components/ChapterEditorView";
import { CharactersView } from "./components/CharactersView";
import { StoryBibleView } from "./components/StoryBibleView";
import { IllustrationsView } from "./components/IllustrationsView";
import { StoryCheckView } from "./components/StoryCheckView";
import { EBookExportView } from "./components/EBookExportView";
import { HelpModal } from "./components/HelpModal";
import { VeoTrailerModal } from "./components/VeoTrailerModal";
import { LegalEthicsModal } from "./components/LegalEthicsModal";
import { AuthModal } from "./components/AuthModal";
import { CookieBanner } from "./components/CookieBanner";
import {
  auth,
  onAuthStateChanged,
  testConnection,
  saveProjectToCloud,
  type User
} from "./firebase/config";
import { Clock } from "lucide-react";

const STORAGE_KEY = "ln_creator_current_project";
const ONBOARDED_KEY = "ln_creator_has_onboarded";
const COMPLIANCE_KEY = "ln_creator_compliance_settings";

export default function App() {
  const [project, setProject] = useState<BookProject | null>(null);
  const [mode, setMode] = useState<ProjectMode>("beginner");
  const [activeView, setActiveView] = useState<string>("welcome");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // Modals state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadInputType, setUploadInputType] = useState<"story" | "idea" | "conversation">("story");
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [illustrationInitialPrompt, setIllustrationInitialPrompt] = useState<string>("");

  // New Modals for Veo 3, Auth, and Legal/Ethics
  const [showVeoModal, setShowVeoModal] = useState<boolean>(false);
  const [showLegalModal, setShowLegalModal] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<string>("copyright");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Firebase auth & cloud sync state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Legal, Ethical & Accessibility Compliance Settings
  const [complianceSettings, setComplianceSettings] = useState<ComplianceSettings>(() => {
    try {
      const saved = localStorage.getItem(COMPLIANCE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      highContrast: false,
      dyslexicFont: false,
      fontSize: "md",
      reducedMotion: false,
      cookieConsentAccepted: false,
      cookiePreferences: {
        essential: true,
        preferences: true,
        analytics: false,
      },
      greenAiMode: true,
    };
  });

  // Apply Accessibility Classes to document
  useEffect(() => {
    const root = document.documentElement;
    if (complianceSettings.dyslexicFont) {
      root.classList.add("dyslexic-font");
    } else {
      root.classList.remove("dyslexic-font");
    }

    if (complianceSettings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    if (complianceSettings.reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }

    try {
      localStorage.setItem(COMPLIANCE_KEY, JSON.stringify(complianceSettings));
    } catch {}
  }, [complianceSettings]);

  // Firebase Auth listener and connection validation
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Load project on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const hasOnboarded = localStorage.getItem(ONBOARDED_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        setProject(parsed);
        setSelectedChapter(parsed.chapters?.[0] || null);
        setActiveView(getViewForStep(parsed.currentStep || 5));
      } else if (!hasOnboarded) {
        setShowOnboarding(true);
      }
    } catch {
      // Fallback
    }
  }, []);

  // Save project changes locally and to Firebase
  const handleUpdateProject = (updated: BookProject) => {
    setProject(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Auto-sync to Firebase cloud if authenticated
    if (currentUser) {
      setIsCloudSynced(false);
      saveProjectToCloud(currentUser.uid, updated)
        .then(() => setIsCloudSynced(true))
        .catch((err) => {
          console.warn("Cloud autosync error:", err);
          setIsCloudSynced(false);
        });
    }
  };

  const handleSyncCurrentProject = async () => {
    if (!currentUser || !project) return;
    setIsSyncing(true);
    try {
      await saveProjectToCloud(currentUser.uid, project);
      setIsCloudSynced(true);
    } catch (err: any) {
      console.warn("Manual sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const getViewForStep = (step: number): string => {
    switch (step) {
      case 1:
        return "welcome";
      case 2:
        return "upload";
      case 3:
        return "assessment";
      case 4:
        return "questions";
      case 5:
        return "plan";
      case 6:
        return "characters";
      case 7:
        return "chapters";
      case 8:
        return "illustrations";
      case 9:
        return "health";
      case 10:
        return "export";
      default:
        return "plan";
    }
  };

  const handleFinishOnboarding = (config: { controlLevel: ControlLevel; selectedGenres: string[] }) => {
    localStorage.setItem(ONBOARDED_KEY, "true");
    setShowOnboarding(false);
  };

  const handleStartOption = (option: "story" | "idea" | "conversation") => {
    setUploadInputType(option);
    setShowUploadModal(true);
  };

  const handleStoryAnalyzed = (newProject: BookProject) => {
    handleUpdateProject(newProject);
    setSelectedChapter(newProject.chapters[0] || null);
    setShowUploadModal(false);
    setActiveView("assessment");
  };

  const handleLoadSample = (sampleProject: BookProject) => {
    handleUpdateProject(sampleProject);
    setSelectedChapter(sampleProject.chapters[0] || null);
    setActiveView("plan");
  };

  const handleNavigateStep = (step: number) => {
    if (!project) return;
    const view = getViewForStep(step);
    setActiveView(view);
    handleUpdateProject({ ...project, currentStep: step });
  };

  const handleResetToWelcome = () => {
    if (window.confirm("Start a new story? Your current project will remain in saved memory.")) {
      setProject(null);
      setActiveView("welcome");
    }
  };

  const handleSaveVeoTrailer = (trailer: BookTrailer) => {
    if (!project) return;
    const updated = {
      ...project,
      trailers: [...(project.trailers || []), trailer],
    };
    handleUpdateProject(updated);
  };

  // GDPR Data Rights actions
  const handleExportAllUserData = () => {
    const archive = {
      timestamp: new Date().toISOString(),
      standardsCompliance: "GDPR Article 20 Machine-Readable Export",
      project,
      complianceSettings,
      user: currentUser ? { uid: currentUser.uid, email: currentUser.email } : null,
    };
    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `light_novel_author_data_gdpr_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteAllUserData = () => {
    localStorage.clear();
    setProject(null);
    setActiveView("welcome");
    setShowLegalModal(false);
    alert("All author data, cached manuscripts, and preferences have been permanently erased (GDPR Article 17).");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Universal Header */}
      <Header
        project={project}
        mode={mode}
        onToggleMode={(newMode) => setMode(newMode)}
        onOpenHelp={() => setShowHelpModal(true)}
        onNavigateStep={handleNavigateStep}
        activeView={activeView}
        setActiveView={setActiveView}
        onNewProject={handleResetToWelcome}
        onOpenVeoTrailer={() => setShowVeoModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenLegal={(tab) => {
          if (tab) setLegalModalTab(tab);
          setShowLegalModal(true);
        }}
        currentUser={currentUser}
        isCloudSynced={isCloudSynced}
      />

      {/* Main Screen Body */}
      <main className="flex-1 pb-16">
        {!project || activeView === "welcome" ? (
          <WelcomeScreen
            onSelectOption={handleStartOption}
            onLoadSample={handleLoadSample}
          />
        ) : activeView === "assessment" ? (
          <SourceAssessmentView
            project={project}
            onConfirm={() => {
              handleUpdateProject({ ...project, currentStep: 4 });
              setActiveView("questions");
            }}
            onUpdateProject={handleUpdateProject}
          />
        ) : activeView === "questions" ? (
          <QuestionAssistantView
            project={project}
            onAnswerSaved={(updatedQuestions) => {
              handleUpdateProject({ ...project, questions: updatedQuestions });
            }}
            onCompleteQuestions={() => {
              handleUpdateProject({ ...project, currentStep: 5 });
              setActiveView("plan");
            }}
          />
        ) : activeView === "plan" ? (
          <StoryPlanView
            project={project}
            onSelectChapter={(ch) => {
              setSelectedChapter(ch);
              handleUpdateProject({ ...project, currentStep: 7 });
              setActiveView("chapters");
            }}
            onUpdateProject={handleUpdateProject}
            onStartWriting={() => {
              setSelectedChapter(project.chapters[0] || null);
              handleUpdateProject({ ...project, currentStep: 7 });
              setActiveView("chapters");
            }}
          />
        ) : activeView === "chapters" && selectedChapter ? (
          <ChapterEditorView
            project={project}
            chapter={selectedChapter}
            onUpdateChapter={(updatedCh) => {
              const updatedChapters = project.chapters.map((c) => (c.id === updatedCh.id ? updatedCh : c));
              handleUpdateProject({ ...project, chapters: updatedChapters });
              setSelectedChapter(updatedCh);
            }}
            onNavigateChapter={(dir) => {
              const currentIdx = project.chapters.findIndex((c) => c.id === selectedChapter.id);
              if (dir === "prev" && currentIdx > 0) {
                setSelectedChapter(project.chapters[currentIdx - 1]);
              } else if (dir === "next" && currentIdx < project.chapters.length - 1) {
                setSelectedChapter(project.chapters[currentIdx + 1]);
              }
            }}
            onOpenIllustrations={(suggestedPrompt) => {
              setIllustrationInitialPrompt(suggestedPrompt || "");
              handleUpdateProject({ ...project, currentStep: 8 });
              setActiveView("illustrations");
            }}
            onBackToPlan={() => {
              setActiveView("plan");
            }}
          />
        ) : activeView === "characters" ? (
          <CharactersView
            project={project}
            onUpdateProject={handleUpdateProject}
            onGenerateCharacterArt={(charName) => {
              setIllustrationInitialPrompt(`Character portrait of ${charName}`);
              handleUpdateProject({ ...project, currentStep: 8 });
              setActiveView("illustrations");
            }}
          />
        ) : activeView === "bible" ? (
          <StoryBibleView
            project={project}
            onUpdateProject={handleUpdateProject}
          />
        ) : activeView === "illustrations" ? (
          <IllustrationsView
            project={project}
            initialPrompt={illustrationInitialPrompt}
            onUpdateProject={handleUpdateProject}
          />
        ) : activeView === "health" ? (
          <StoryCheckView
            project={project}
            onUpdateProject={handleUpdateProject}
            onNavigateToChapter={(chapNum) => {
              const target = project.chapters.find((c) => c.number === chapNum) || project.chapters[0];
              setSelectedChapter(target);
              setActiveView("chapters");
            }}
            onProceedToExport={() => {
              handleUpdateProject({ ...project, currentStep: 10 });
              setActiveView("export");
            }}
          />
        ) : activeView === "export" ? (
          <EBookExportView
            project={project}
            onUpdateProject={handleUpdateProject}
          />
        ) : (
          /* Fallback Dashboard Hub */
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-2xl font-serif font-bold text-white">{project.title}</h2>
              <p className="text-xs text-slate-400">{project.summary}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView("plan")}
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Go to Story Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Advanced Mode Floating Drawer for Story Bible (Timeline & Tech) */}
      {mode === "advanced" && project && activeView !== "welcome" && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setActiveView("bible")}
            className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/60 rounded-xl shadow-2xl text-amber-300 font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-all hover:scale-105"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Story Bible & Matrix</span>
          </button>
        </div>
      )}

      {/* First-visit Onboarding Wizard */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleFinishOnboarding}
      />

      {/* Upload Story Modal */}
      <UploadStoryModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        inputType={uploadInputType}
        onStoryAnalyzed={handleStoryAnalyzed}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      {/* Veo 3 Anime Trailer Generator Modal */}
      <VeoTrailerModal
        isOpen={showVeoModal}
        onClose={() => setShowVeoModal(false)}
        project={project}
        onSaveTrailer={handleSaveVeoTrailer}
      />

      {/* Legal, Ethical & Publishing Standards Modal */}
      <LegalEthicsModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        initialTab={legalModalTab}
        project={project}
        complianceSettings={complianceSettings}
        onUpdateComplianceSettings={(updates) =>
          setComplianceSettings((prev) => ({ ...prev, ...updates }))
        }
        onExportAllUserData={handleExportAllUserData}
        onDeleteAllUserData={handleDeleteAllUserData}
      />

      {/* Firebase Cloud Sync & Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        currentProject={project}
        onLoadProject={(loadedProject) => {
          handleUpdateProject(loadedProject);
          setSelectedChapter(loadedProject.chapters?.[0] || null);
          setActiveView("plan");
        }}
        onSyncCurrentProject={handleSyncCurrentProject}
        isSyncing={isSyncing}
      />

      {/* Cookie & Privacy Consent Banner */}
      <CookieBanner
        onUpdatePreferences={(prefs) =>
          setComplianceSettings((prev) => ({
            ...prev,
            cookieConsentAccepted: true,
            cookiePreferences: prefs,
          }))
        }
        onOpenLegal={(tab) => {
          if (tab) setLegalModalTab(tab);
          setShowLegalModal(true);
        }}
      />
    </div>
  );
}
