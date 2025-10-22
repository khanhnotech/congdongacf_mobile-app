import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import chatService from '../services/chat.service';
import { useAuth } from './useAuth';

export const useChat = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isChatVisible, setIsChatVisible] = useState(false);

  // Query để lấy tin nhắn
  const messagesQuery = useQuery({
    queryKey: ['chat-global', 'messages'],
    queryFn: () => chatService.getMessages(),
    enabled: isAuthenticated && isChatVisible,
    refetchInterval: 30000, // Refetch mỗi 30 giây
  });

  // Query để lấy số tin nhắn chưa đọc
  const unreadCountQuery = useQuery({
    queryKey: ['chat-global', 'unreadCount'],
    queryFn: () => chatService.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 10000, // Refetch mỗi 10 giây
  });

  // Mutation để gửi tin nhắn
  const sendMessageMutation = useMutation({
    mutationFn: (messageData) => chatService.sendMessage(messageData),
    onSuccess: () => {
      // Refetch tin nhắn sau khi gửi thành công
      queryClient.invalidateQueries(['chat-global', 'messages']);
      queryClient.invalidateQueries(['chat-global', 'unreadCount']);
    },
  });

  // Mutation để đánh dấu đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: (messageIds) => chatService.markAsRead(messageIds),
    onSuccess: () => {
      queryClient.invalidateQueries(['chat-global', 'unreadCount']);
    },
  });

  // Hàm gửi tin nhắn
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const messageData = {
      content: content.trim(),
      type: 'text',
    };

    return sendMessageMutation.mutateAsync(messageData);
  };

  // Hàm mở chat
  const openChat = () => {
    setIsChatVisible(true);
  };

  // Hàm đóng chat
  const closeChat = () => {
    setIsChatVisible(false);
    // Đánh dấu tất cả tin nhắn đã đọc khi đóng chat
    if (messagesQuery.data?.data?.items?.length > 0) {
      const messageIds = messagesQuery.data.data.items.map(msg => msg.id);
      markAsReadMutation.mutate(messageIds);
    }
  };

  // Hàm toggle chat
  const toggleChat = () => {
    if (isChatVisible) {
      closeChat();
    } else {
      openChat();
    }
  };

  return {
    // State
    isChatVisible,
    messages: messagesQuery.data?.data?.items || [],
    unreadCount: unreadCountQuery.data?.data || 0,
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    
    // Actions
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    
    // Mutations
    isSending: sendMessageMutation.isPending,
    sendError: sendMessageMutation.error,
  };
};
