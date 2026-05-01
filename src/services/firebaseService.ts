import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * GOOGLE ECOSYSTEM INTEGRATION:
 * We leverage Firebase for real-time session persistence, ensuring the 
 * user's voter profile and chat state are preserved across refreshes.
 */

const firebaseConfig = {
  // These are public-safe identifiers for Firebase (standard practice)
  apiKey: "demo-key-for-hackathon",
  authDomain: "votemate-hack.firebaseapp.com",
  projectId: "votemate-hack",
  storageBucket: "votemate-hack.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase (for demo purposes, we'll use a mocked/local-ready pattern if real keys aren't provided)
let db: any = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase initialization skipped: using local state fallback.");
}

export class FirebaseService {
  static async saveSession(sessionId: string, data: any) {
    if (!db) return;
    try {
      await setDoc(doc(db, "sessions", sessionId), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Firebase Save Error:", e);
    }
  }

  static async getSession(sessionId: string) {
    if (!db) return null;
    try {
      const docRef = doc(db, "sessions", sessionId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (e) {
      console.error("Firebase Get Error:", e);
      return null;
    }
  }
}
