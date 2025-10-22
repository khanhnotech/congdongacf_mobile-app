import { apiClient } from './api.js';

const viewProfileService = {
  // Lấy thông tin profile của user khác
  getProfileById: async (userId) => {
    try {
      console.log('Calling API: view-profile with userId:', userId);
      const response = await apiClient.get(`view-profile/${userId}`);
      console.log('View profile API response:', response);
      return { success: true, data: response?.data || null };
    } catch (error) {
      console.error('View profile error:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Lấy thông tin profile bằng username
  getProfileByUsername: async (username) => {
    try {
      console.log('Calling API: view-profile with username:', username);
      const response = await apiClient.get(`view-profile/${username}`);
      console.log('View profile by username API response:', response);
      return { success: true, data: response?.data || null };
    } catch (error) {
      console.error('View profile by username error:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Lấy bài viết của user
  getUserArticles: async (userId, params = {}) => {
    try {
      console.log('Calling API: view-profile articles with userId:', userId, 'params:', params);
      const response = await apiClient.get(`view-profile/${userId}/article`, { params });
      console.log('User articles API response:', response);
      return { success: true, data: response?.data || [], pagination: response?.pagination || {} };
    } catch (error) {
      console.error('User articles error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Follow/Unfollow user
  toggleFollow: async (userId) => {
    try {
      console.log('Calling API: toggle follow with userId:', userId);
      const response = await apiClient.post(`view-profile/${userId}/follow`);
      console.log('Toggle follow API response:', response);
      return { success: true, data: response?.data || null };
    } catch (error) {
      console.error('Toggle follow error:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Lấy số lượng follow
  getFollowCount: async (userId) => {
    try {
      console.log('Calling API: follow count with userId:', userId);
      const response = await apiClient.get(`view-profile/${userId}/follow/count`);
      console.log('Follow count API response:', response);
      return { success: true, data: response?.data || null };
    } catch (error) {
      console.error('Follow count error:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

export default viewProfileService;
