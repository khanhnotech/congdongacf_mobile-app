import { apiClient } from './api.js';

const documentService = {
  // Lấy danh sách văn bản với tìm kiếm và phân trang
  getDocuments: async (params = {}) => {
    try {
      console.log('Calling API: document with params:', params);
      const response = await apiClient.get('document', { params });
      console.log('Documents API response:', response);
      return { success: true, data: response?.data || [], pagination: response?.pagination || {} };
    } catch (error) {
      console.error('Documents error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Lấy chi tiết văn bản
  getDocumentDetail: async (id) => {
    try {
      console.log('Calling API: document detail with id:', id);
      const response = await apiClient.get(`document/${id}`);
      console.log('Document detail API response:', response);
      return { success: true, data: response?.data || null };
    } catch (error) {
      console.error('Document detail error:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Lấy văn bản mới nhất
  getLatestDocuments: async (limit = 6) => {
    try {
      console.log('Calling API: latest documents with limit:', limit);
      const response = await apiClient.get('document/meta/latest', { params: { limit } });
      console.log('Latest documents API response:', response);
      return { success: true, data: response?.data || [] };
    } catch (error) {
      console.error('Latest documents error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Lấy danh mục
  getCategories: async () => {
    try {
      console.log('Calling API: document categories');
      const response = await apiClient.get('document/meta/categories');
      console.log('Categories API response:', response);
      return { success: true, data: response?.data || [] };
    } catch (error) {
      console.error('Categories error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Lấy danh sách năm
  getYears: async () => {
    try {
      console.log('Calling API: document years');
      const response = await apiClient.get('document/meta/years');
      console.log('Years API response:', response);
      return { success: true, data: response?.data || [] };
    } catch (error) {
      console.error('Years error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Tìm kiếm văn bản
  searchDocuments: async (query, filters = {}) => {
    try {
      console.log('Calling API: search documents with query:', query, 'filters:', filters);
      const params = {
        q: query,
        ...filters
      };
      const response = await apiClient.get('document', { params });
      console.log('Search documents API response:', response);
      return { success: true, data: response?.data || [], pagination: response?.pagination || {} };
    } catch (error) {
      console.error('Search documents error:', error);
      return { success: false, data: [], error: error.message };
    }
  }
};

export default documentService;
