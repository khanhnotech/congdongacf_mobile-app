import { apiClient } from './api';

const chatService = {
  // Lấy danh sách tin nhắn (top-level comments)
  getMessages: async (params = {}) => {
    try {
      const response = await apiClient.get('/chat-global', { params });
      return {
        success: true,
        data: response?.data || [],
        meta: response?.meta || {},
      };
    } catch (error) {
      console.error('Get messages error:', error);
      return {
        success: false,
        data: [],
        meta: {},
        error: error.message,
      };
    }
  },

  // Gửi tin nhắn mới
  sendMessage: async (messageData) => {
    try {
      const response = await apiClient.post('/chat-global/create', messageData);
      return {
        success: true,
        data: response?.data || null,
      };
    } catch (error) {
      console.error('Send message error:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  },

  // Lấy số tin nhắn chưa đọc (tạm thời return 0 vì chưa có API)
  getUnreadCount: async () => {
    try {
      // Tạm thời return 0 vì chưa có API unread count
      return {
        success: true,
        data: 0,
      };
    } catch (error) {
      console.error('Get unread count error:', error);
      return {
        success: false,
        data: 0,
        error: error.message,
      };
    }
  },

  // Đánh dấu tin nhắn đã đọc (tạm thời không làm gì vì chưa có API)
  markAsRead: async (messageIds = []) => {
    try {
      // Tạm thời không làm gì vì chưa có API mark as read
      return {
        success: true,
        data: null,
      };
    } catch (error) {
      console.error('Mark as read error:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  },
};

export default chatService;
