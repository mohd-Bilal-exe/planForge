import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface StoreState {
  user: any;
  theme: string;
  questions: any;
  setQuestions: (questions: any) => void;
  updateUser: (newUserInfo: any) => void;
  setTheme: (theme: string) => void;
}

const useZustandStore = create<StoreState>()(
  persist(
    set => ({
      user: null,
      theme: 'system',
      questions: null,
      setQuestions: (questions: any) => set({ questions }),
      updateUser: (newUserInfo: any) => set({ user: newUserInfo }),
      setTheme: (theme: string) => set({ theme }),
    }),
    {
      name: 'planforgeStorage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useZustandStore;
