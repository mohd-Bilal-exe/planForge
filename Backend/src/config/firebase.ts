import admin from "firebase-admin";
import { logger } from "../utils/logger";

let firebaseApp: admin.app.App | null = null;

export function initializeFirebase(): void {
  if (firebaseApp) {
    return;
  }

  try {
    // Initialize with service account from environment
    if (process.env.FIREBASE_ADMIN_SDK) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } else {
      // For development - will fail on actual Firebase calls
      logger.warn("Firebase not initialized - missing credentials");
      firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "planforge-dev",
      });
    }

    logger.info("Firebase Admin initialized");
  } catch (error) {
    logger.error("Failed to initialize Firebase", { error });
    throw error;
  }
}

export function getFirestore(): admin.firestore.Firestore {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.firestore();
}

export function getAuth(): admin.auth.Auth {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.auth();
}
