import * as api from './api.js';

console.log('api imported:', api);
console.log('api.apiClient:', api.apiClient);
console.log('api.apiClient.get:', api.apiClient?.get);

const topService = {
  getTopBusinessmen: async (params = {}) => {
    try {
      console.log('Calling API: top/business with params:', params);
      if (!api.apiClient || !api.apiClient.get) {
        throw new Error('apiClient is not properly imported');
      }
      const response = await api.apiClient.get('top/business', { params });
      console.log('Top businessmen API response:', response);
      return { success: true, data: response?.data || [], meta: response?.meta || {} };
    } catch (error) {
      console.error('Top businessmen error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  getTopKOLs: async (params = {}) => {
    try {
      console.log('Calling API: top/kol with params:', params);
      if (!api.apiClient || !api.apiClient.get) {
        throw new Error('apiClient is not properly imported');
      }
      const response = await api.apiClient.get('top/kol', { params });
      console.log('Top KOLs API response:', response);
      return { success: true, data: response?.data || [], meta: response?.meta || {} };
    } catch (error) {
      console.error('Top KOLs error:', error);
      return { success: false, data: [], error: error.message };
    }
  },
};

export default topService;
