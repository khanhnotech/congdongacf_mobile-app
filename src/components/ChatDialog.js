import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import chatService from '../services/chat.service';

const ChatDialog = ({ visible, onClose, onSendMessage }) => {
  const { user, isAuthenticated } = useAuth();
  const { requireAuth } = useAuthRedirect();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);

  const gapSmall = 8;
  const gapMedium = 16;
  const screenPadding = 16;

  // Fetch messages từ API
  const messagesQuery = useQuery({
    queryKey: ['chat-global', 'messages'],
    queryFn: () => chatService.getMessages(),
    enabled: visible && isAuthenticated,
    refetchInterval: 30000, // Refetch mỗi 30 giây
  });

  // Mutation để gửi tin nhắn
  const sendMessageMutation = useMutation({
    mutationFn: (messageData) => chatService.sendMessage(messageData),
    onSuccess: () => {
      queryClient.invalidateQueries(['chat-global', 'messages']);
    },
  });

  const messages = messagesQuery.data?.data?.items || [];

  useEffect(() => {
    if (visible && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [visible, messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      content: message.trim(),
    };

    sendMessageMutation.mutate(messageData, {
      onSuccess: () => {
        setMessage('');
        if (onSendMessage) {
          onSendMessage(messageData);
        }
      },
    });
  };

  const handleSendWithAuth = () => {
    requireAuth(() => {
      handleSendMessage();
    });
  };

  const renderMessage = ({ item }) => (
    <View className="flex-row mb-4 px-4">
      <View className="mr-3">
        {item.user?.avatar ? (
          <Image
            source={{ uri: item.user.avatar }}
            className="rounded-full"
            style={{
              width: 32,
              height: 32,
            }}
          />
        ) : (
          <View
            className="rounded-full items-center justify-center"
            style={{
              width: 32,
              height: 32,
              backgroundColor: '#8B5CF6',
            }}
          >
            <Text
              className="text-white font-bold"
              style={{ fontSize: 14 }}
            >
              {item.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
        )}
      </View>
      
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text
            className="font-bold text-slate-800"
            style={{ fontSize: 14 }}
          >
            {item.user?.name || 'Người dùng'}
          </Text>
          <View className="flex-row items-center ml-2">
            <MaterialCommunityIcons
              name="clock-outline"
              size={12}
              color="#64748B"
            />
            <Text
              className="text-slate-500 ml-1"
              style={{ fontSize: 12 }}
            >
              {item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : 'Vừa xong'}
            </Text>
          </View>
        </View>
        
        <Text
          className="text-slate-700"
          style={{ fontSize: 14 }}
        >
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-4 py-3"
          style={{
            backgroundColor: '#DC2626',
            paddingTop: Platform.OS === 'ios' ? 50 : 20,
          }}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="chat"
              size={20}
              color="white"
            />
            <Text
              className="text-white font-bold ml-2"
              style={{ fontSize: 16 }}
            >
              CỘNG ĐỒNG AFC
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <View
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: '#10B981' }}
              />
              <Text
                className="text-white"
                style={{ fontSize: 12 }}
              >
                Online
              </Text>
            </View>
            
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{
            paddingVertical: gapMedium,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View
          className="flex-row items-center px-4 py-3 border-t border-slate-200"
          style={{ backgroundColor: '#F8FAFC' }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Viết bình luận..."
            placeholderTextColor="#94A3B8"
            className="flex-1 bg-white rounded-lg px-3 py-2 mr-3"
            style={{
              fontSize: 14,
              borderWidth: 1,
              borderColor: '#E2E8F0',
            }}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            onPress={handleSendWithAuth}
            className="bg-red-600 rounded-lg items-center justify-center"
            style={{
              width: 36,
              height: 36,
            }}
          >
            <MaterialCommunityIcons
              name="send"
              size={18}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChatDialog;
