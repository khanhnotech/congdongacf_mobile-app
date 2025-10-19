import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';
import { QUERY_KEYS } from '../utils/constants';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const {
    token,
    refreshToken,
    user,
    setAuth,
    clearAuth,
    isInitialLoading,
    finishInitialLoading,
  } = useAuthStore();

  useEffect(() => {
    if (!isInitialLoading) return;

    let canceled = false;
    const fallbackToken = process.env.EXPO_PUBLIC_DEMO_TOKEN ?? 'demo-token';

    const bootstrapDemoSession = async () => {
      try {
        const existingState = useAuthStore.getState();
        if (existingState.user) {
          finishInitialLoading();
          return;
        }

        const demoProfile = await authService.me();
        if (canceled) return;

        const shouldInjectToken = !existingState.token && fallbackToken;
        setAuth({
          token: shouldInjectToken ? fallbackToken : undefined,
          refreshToken: undefined,
          user: demoProfile,
        });
      } catch (error) {
        if (canceled) return;
        if (error?.status === 401 || error?.status === 404) {
          finishInitialLoading();
          return;
        }
        console.warn('Bootstrap demo session failed', error);
        finishInitialLoading();
      }
    };

    bootstrapDemoSession();

    return () => {
      canceled = true;
    };
  }, [isInitialLoading, finishInitialLoading, setAuth]);

  const loginMutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: authService.login,
    onSuccess: ({ token: nextToken, refreshToken: nextRefresh, user: nextUser }) => {
      setAuth({ token: nextToken, refreshToken: nextRefresh, user: nextUser });
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, nextUser);
    },
  });

  const registerMutation = useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: authService.register,
    onSuccess: ({ token: nextToken, refreshToken: nextRefresh, user: nextUser }) => {
      setAuth({ token: nextToken, refreshToken: nextRefresh, user: nextUser });
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, nextUser);
    },
  });

  const updateProfileMutation = useMutation({
    mutationKey: ['auth', 'updateProfile'],
    mutationFn: authService.updateProfile,
    onSuccess: (nextUser) => {
      setAuth({ token, refreshToken, user: nextUser });
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, nextUser);
    },
  });

  const logoutMutation = useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => authService.logout({ refreshToken, token }),
    onSettled: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
  });

  return {
    token,
    refreshToken,
    user,
    isInitialLoading,
    setAuth,
    login: loginMutation.mutateAsync,
    loginStatus: loginMutation.status,
    register: registerMutation.mutateAsync,
    registerStatus: registerMutation.status,
    updateProfile: updateProfileMutation.mutateAsync,
    updateProfileStatus: updateProfileMutation.status,
    logout: logoutMutation.mutateAsync,
    logoutStatus: logoutMutation.status,
  };
};
