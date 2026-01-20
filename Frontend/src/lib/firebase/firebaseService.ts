import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { auth, db } from './firebaseInit';
import useZustandStore from '../store/zustand';
import type { ProjectData } from '../types/homeTypes';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: any;
  updatedAt: any;
  [key: string]: any;
}

class FirebaseService {
  // Auth Methods
  async signInWithEmail(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await this.ensureUserDocument(result.user);
    useZustandStore.getState().updateUser({ ...result.user, isAuthenticated: true });
    return result;
  }

  async signUpWithEmail(email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await this.createUserDocument(result.user);
    useZustandStore.getState().updateUser({ ...result.user, isAuthenticated: true });
    return result;
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await this.ensureUserDocument(result.user);
    useZustandStore.getState().updateUser({ ...result.user, isAuthenticated: true });
    return result;
  }

  async signOut() {
    try {
      console.log('Signing out');
      await signOut(auth);
      useZustandStore.getState().updateUser(null);
    } catch (err) {
      console.error(err);
    }
  }

  // User Document Methods
  async createUserDocument(user: User, additionalData?: Partial<UserData>) {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData,
      };

      await setDoc(userRef, userData);
      return userData;
    }

    return userDoc.data() as UserData;
  }

  async ensureUserDocument(user: User) {
    if (!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return await this.createUserDocument(user);
    }

    return userDoc.data() as UserData;
  }

  async getUserDocument(uid: string) {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }

    return null;
  }

  async updateUserDocument(uid: string, data: Partial<UserData>) {
    const userRef = doc(db, 'users', uid);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userRef, updateData);
    return updateData;
  }

  async deleteUserDocument(uid: string) {
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
  }

  // Utility Methods
  getCurrentUser() {
    return auth.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  }
  // Project Document Methods
  async createProjectDocument(params: {
    userId: string;
    idea: string;
    domain: string;
    platform: string;
    additionalData?: Partial<ProjectData>;
  }) {
    const { userId, idea, domain, platform, additionalData } = params;

    if (!userId) throw new Error('User ID is required to create project');

    const projectRef = doc(db, 'projects', crypto.randomUUID());

    const projectData: ProjectData = {
      id: projectRef.id,
      userId,
      idea,
      domain,
      platform,
      status: 'questions',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...additionalData,
    };

    await setDoc(projectRef, projectData);
    this.updateUserDocument(userId, { projectRef: arrayUnion(projectRef) });
    return projectRef.id;
  }
  async getProjectDocument(projectId: string) {
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);

    if (projectDoc.exists()) {
      return projectDoc.data() as ProjectData;
    }

    return null;
  }
  async updateProjectDocument(projectId: string, data: Partial<ProjectData>) {
    const projectRef = doc(db, 'projects', projectId);

    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(projectRef, updateData);
    return updateData;
  }
  async deleteProjectDocument(projectId: string) {
    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);
  }
}

export const firebaseService = new FirebaseService();
