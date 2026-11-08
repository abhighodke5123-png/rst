import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Safe singleton initialization for modern web environments
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Resilient Firestore initialization: try named database if specified, fallback to default
function createFirestoreInstance() {
  if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)") {
    try {
      return getFirestore(app, firebaseConfig.firestoreDatabaseId);
    } catch (err) {
      console.warn("Named Firestore database connection fallback to (default):", err);
      return getFirestore(app);
    }
  }
  return getFirestore(app);
}

export const db = createFirestoreInstance();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Reconnect and reset helper for robust session recovery
export function resetFirebaseConnection() {
  try {
    const currentApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const currentDb = createFirestoreInstance();
    const currentAuth = getAuth(currentApp);
    return { app: currentApp, db: currentDb, auth: currentAuth };
  } catch (err) {
    console.error("Firebase reset error:", err);
    return { app, db, auth };
  }
}
