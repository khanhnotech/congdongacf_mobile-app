import { apiClient } from './api.js';

const viewProfileService = {
  // Lấy thông tin profile của user khác
  getProfileById: async (userId) => {
    try {
      const response = await apiClient.get(`view-profile/${userId}`);
      return { success: true, data: response?.data || null };
    } catch (error) {
      console.error('View profile error:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Lấy thông tin profile bằng username
  getProfileByUsername: async (username) => {
    try {
      const response = await apiClient.get(`view-profile/${username}`);
      return { success: true, data: response?.data || null };
    } catch (error) {
      console.error('View profile by username error:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Lấy bài viết của user
  getUserArticles: async (userId, params = {}) => {
    try {
      const response = await apiClient.get(`view-profile/${userId}/article`, { params });
      return { success: true, data: response?.data || [], pagination: response?.pagination || {} };
    } catch (error) {
      console.error('User articles error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Follow/Unfollow user
  toggleFollow: async (userId) => {
    try {
      const response = await apiClient.post(`view-profile/${userId}/follow`);
      
      // Return the data directly since the server already wraps it in success/data structure
      const serverData = response?.data || response;
      return serverData;
    } catch (error) {
      console.error('Toggle follow error:', error);
      throw error; // Re-throw to let React Query handle the error
    }
  },

  // Lấy số lượng follow
  getFollowCount: async (userId) => {
    try {
      const response = await apiClient.get(`view-profile/${userId}/follow/count`);
      return { success: true, data: response?.data || null };
    } catch (error) {
      console.error('Follow count error:', error);
      return { success: false, data: null, error: error.message };
    }
  }
};

export default viewProfileService;
