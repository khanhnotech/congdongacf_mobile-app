import { useQuery } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { QUERY_KEYS } from '../utils/constants';

export const useProfileDetail = (userId, options = {}) => {
  const queryKey = userId ? QUERY_KEYS.PROFILE.DETAIL(userId) : ['profile', 'nil'];
  return useQuery({
    queryKey,
    queryFn: () => profileService.getProfile(userId),
    enabled: Boolean(userId) && (options.enabled ?? true),
    staleTime: options.staleTime ?? 60 * 1000,
    gcTime: options.gcTime ?? 5 * 60 * 1000,
    ...options,
  });
};

export const useProfileArticles = (userId, params = {}, options = {}) => {
  const queryKey = userId
    ? QUERY_KEYS.PROFILE.ARTICLES(userId, params)
    : ['profile', 'nil', 'articles'];
  return useQuery({
    queryKey,
    queryFn: () => profileService.getProfileArticles(userId, params),
    enabled: Boolean(userId) && (options.enabled ?? true),
    staleTime: options.staleTime ?? 60 * 1000,
    gcTime: options.gcTime ?? 5 * 60 * 1000,
    ...options,
  });
};

export const useMyProfileArticles = (userId, params = {}, options = {}) => {
  const queryKey = userId
    ? QUERY_KEYS.PROFILE.MY_ARTICLES(userId, params)
    : ['profile', 'nil', 'my-articles'];
  return useQuery({
    queryKey,
    queryFn: () => profileService.getMyProfileArticles(userId, params),
    enabled: Boolean(userId) && (options.enabled ?? true),
    staleTime: options.staleTime ?? 60 * 1000,
    gcTime: options.gcTime ?? 5 * 60 * 1000,
    ...options,
  });
};

export default {
  useProfileDetail,
  useProfileArticles,
  useMyProfileArticles,
};
