import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  isInitialLoading: false,
  setAuth: ({ token, user }) => set({ token, user, isInitialLoading: false }),
  clearAuth: () => set({ token: null, user: null, isInitialLoading: false }),
}));
