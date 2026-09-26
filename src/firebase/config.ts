import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';
import type { BookProject } from '../types';

export const firebaseConfig = {
  projectId: "empyrean-reserve-r07pf",
  appId: "1:657260608968:web:bb539ecdcfbb78fac394fd",
  apiKey: "AIzaSyC-27WZjTUk7BaJy7nb3DIABVfI4Qupit4",
  authDomain: "empyrean-reserve-r07pf.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-lightnovelcreato-09c7749b-c657-49b3-b7e6-768b525904f4",
  storageBucket: "empyrean-reserve-r07pf.firebasestorage.app",
  messagingSenderId: "657260608968",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or network restricted.");
    }
    return false;
  }
}

// Cloud persistence helpers for Book Projects
export async function saveProjectToCloud(userId: string, project: BookProject): Promise<void> {
  if (!userId) return;
  const projectRef = doc(db, 'users', userId, 'projects', project.id);
  await setDoc(projectRef, {
    id: project.id,
    userId,
    title: project.title,
    author: project.author,
    summary: project.summary || "",
    currentStep: project.currentStep || 1,
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectData: JSON.stringify(project),
  }, { merge: true });
}

export async function loadProjectFromCloud(userId: string, projectId: string): Promise<BookProject | null> {
  if (!userId || !projectId) return null;
  const projectRef = doc(db, 'users', userId, 'projects', projectId);
  const snap = await getDoc(projectRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data?.projectData) {
    try {
      return JSON.parse(data.projectData) as BookProject;
    } catch {
      return null;
    }
  }
  return null;
}

export async function listUserProjectsFromCloud(userId: string): Promise<Array<{ id: string; title: string; author: string; updatedAt: string; currentStep: number }>> {
  if (!userId) return [];
  const colRef = collection(db, 'users', userId, 'projects');
  const snap = await getDocs(colRef);
  const results: Array<{ id: string; title: string; author: string; updatedAt: string; currentStep: number }> = [];
  snap.forEach(d => {
    const data = d.data();
    results.push({
      id: data.id || d.id,
      title: data.title || "Untitled Novel",
      author: data.author || "Unknown",
      updatedAt: data.updatedAt || "",
      currentStep: data.currentStep || 1,
    });
  });
  return results;
}

export async function deleteProjectFromCloud(userId: string, projectId: string): Promise<void> {
  if (!userId || !projectId) return;
  const projectRef = doc(db, 'users', userId, 'projects', projectId);
  await deleteDoc(projectRef);
}

export {
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  type User
};
