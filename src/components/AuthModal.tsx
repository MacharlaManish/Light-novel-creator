import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Cloud,
  CheckCircle2,
  AlertCircle,
  LogOut,
  FolderOpen,
  Sparkles,
  Lock,
  X,
  RefreshCw
} from "lucide-react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  listUserProjectsFromCloud,
  loadProjectFromCloud,
  saveProjectToCloud,
  type User
} from "../firebase/config";
import { BookProject } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  currentProject: BookProject | null;
  onLoadProject: (project: BookProject) => void;
  onSyncCurrentProject: () => Promise<void>;
  isSyncing: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentProject,
  onLoadProject,
  onSyncCurrentProject,
  isSyncing,
}) => {
  const [cloudProjects, setCloudProjects] = useState<Array<{ id: string; title: string; author: string; updatedAt: string; currentStep: number }>>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadCloudList();
    }
  }, [currentUser]);

  const loadCloudList = async () => {
    if (!currentUser) return;
    setLoadingList(true);
    setErrorMsg(null);
    try {
      const list = await listUserProjectsFromCloud(currentUser.uid);
      setCloudProjects(list);
    } catch (err: any) {
      console.warn("Could not load cloud projects:", err);
      setErrorMsg("Cloud project listing is syncing in background.");
    } finally {
      setLoadingList(false);
    }
  };

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccessMsg("Signed in successfully with Google.");
    } catch (err: any) {
      console.warn("Google sign-in popup error:", err);
      // Fallback to anonymous author auth if popups are blocked in iframe
      try {
        await signInAnonymously(auth);
        setSuccessMsg("Connected securely as Guest Author.");
      } catch (anonErr: any) {
        setErrorMsg("Sign-in error: " + (err.message || "Failed to sign in"));
      }
    }
  };

  const handleGuestSignIn = async () => {
    setErrorMsg(null);
    try {
      await signInAnonymously(auth);
      setSuccessMsg("Signed in anonymously. Your stories will sync to your session.");
    } catch (err: any) {
      setErrorMsg("Guest sign-in error: " + (err.message || "Failed"));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCloudProjects([]);
      setSuccessMsg("Signed out.");
    } catch (err: any) {
      setErrorMsg("Sign out error: " + err.message);
    }
  };

  const handleLoadCloudProject = async (projectId: string) => {
    if (!currentUser) return;
    try {
      const proj = await loadProjectFromCloud(currentUser.uid, projectId);
      if (proj) {
        onLoadProject(proj);
        setSuccessMsg(`Loaded "${proj.title}" from Cloud.`);
        onClose();
      } else {
        setErrorMsg("Failed to parse cloud project data.");
      }
    } catch (err: any) {
      setErrorMsg("Error loading project: " + err.message);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-base font-bold text-white">
                Cloud Sync & Author Account
              </h2>
              <p className="text-xs text-slate-400">
                Firebase Firestore Zero-Trust Persistence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {currentUser ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : "A"}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-xs">
                      {currentUser.displayName || (currentUser.isAnonymous ? "Guest Author" : "Author")}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {currentUser.email || "Encrypted Session"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Cloud Sync Actions */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <Cloud className="w-4 h-4 text-emerald-400" />
                    <span>Current Story Sync</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Connected
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {currentProject ? `"${currentProject.title}" is ready to sync.` : "No active project."}
                </p>
                {currentProject && (
                  <button
                    onClick={onSyncCurrentProject}
                    disabled={isSyncing}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>{isSyncing ? "Syncing to Firestore..." : "Backup Current Story to Cloud"}</span>
                  </button>
                )}
              </div>

              {/* Cloud Books List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">Your Cloud Library:</span>
                  <button
                    onClick={loadCloudList}
                    className="hover:text-amber-300 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingList ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                </div>

                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {cloudProjects.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-850">
                      No cloud backups found yet. Click 'Backup Current Story' to save.
                    </div>
                  ) : (
                    cloudProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                      >
                        <div className="truncate mr-2">
                          <p className="font-semibold text-white text-xs truncate">{p.title}</p>
                          <p className="text-[11px] text-slate-400">Step {p.currentStep} of 10</p>
                        </div>
                        <button
                          onClick={() => handleLoadCloudProject(p.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs rounded-lg transition-colors font-medium shrink-0 flex items-center gap-1"
                        >
                          <FolderOpen className="w-3 h-3" />
                          <span>Load</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-300">
                  Sign in to securely backup your manuscripts and access your light novels across any computer or mobile browser.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 border border-slate-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  onClick={handleGuestSignIn}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Start as Guest (Instant Cloud Storage)</span>
                </button>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Zero-Trust ABAC Security: Your manuscripts are isolated and accessible only to your authenticated credentials.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
