import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  isInitialLoading: false,
  setAuth: ({ token, refreshToken, user }) =>
    set((state) => ({
      token: token ?? state.token,
      refreshToken: refreshToken ?? state.refreshToken,
      user: user ?? state.user,
      isInitialLoading: false,
    })),
  clearAuth: () =>
    set({ token: null, refreshToken: null, user: null, isInitialLoading: false }),
}));
