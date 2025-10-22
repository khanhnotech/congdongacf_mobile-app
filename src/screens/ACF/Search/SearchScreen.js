import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';
import PostCard from '../../../components/PostCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { postsService } from '../../../services/posts.service';
import { apiClient } from '../../../services/api';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState('articles'); // articles, users, topics
  
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
    listContentPaddingBottom,
  } = useResponsiveSpacing();

  // Search query based on type
  const searchQuery_result = useQuery({
    queryKey: ['search', searchType, searchQuery],
    queryFn: async () => {
      try {
        console.log('🔍 Searching:', { q: searchQuery, type: searchType });
        const response = await apiClient.get('search', {
          params: { q: searchQuery, type: searchType }
        });
        
        console.log('📡 Search response:', response);
        
        // Server trả về: { ok: true, items: [...], pagination: {...} }
        const data = response.data || response;
        if (data?.ok && data?.items) {
          console.log('✅ Search success:', data.items.length, 'items');
          return {
            items: data.items,
            meta: {
              page: data.pagination?.page || 1,
              limit: data.pagination?.limit || 10,
              total: data.pagination?.total || 0,
            }
          };
        }
        
        console.log('⚠️ Search no results or invalid format:', data);
        return { items: [], meta: {} };
      } catch (error) {
        console.error('❌ Search error:', error);
        return { items: [], meta: {}, error: error.message };
      }
    },
    enabled: searchQuery.trim().length >= 2, // Chỉ search khi có ít nhất 2 ký tự
    staleTime: 30 * 1000, // 30 seconds
  });

  const handleSearch = useCallback((query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length >= 2) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  const searchTypes = [
    { key: 'articles', label: 'Bài viết', icon: 'file-document-outline' },
    { key: 'users', label: 'Người dùng', icon: 'account-outline' },
    { key: 'topics', label: 'Chủ đề', icon: 'tag-outline' },
  ];

  const handlePostPress = useCallback((post) => {
    const postId = post?.id || post?.articleId || post?.article_id;
    const postSlug = post?.slug;
    
    if (postId || postSlug) {
      navigation.navigate(ROUTES.STACK.POST_DETAIL, {
        postId,
        postSlug,
      });
    }
  }, [navigation]);

  const renderItem = useCallback(({ item }) => {
    if (searchType === 'articles') {
      return (
        <PostCard
          post={item}
          onPress={() => handlePostPress(item)}
        />
      );
    }
    
    if (searchType === 'users') {
      return (
        <TouchableOpacity
          className="bg-white rounded-xl p-4 border border-slate-200"
          onPress={() => {
            // Navigate to user profile
            navigation.navigate(ROUTES.STACK.PROFILE_VIEW, { userId: item.id });
          }}
        >
          <View className="flex-row items-center">
            <View
              className="items-center justify-center bg-red-100 rounded-full"
              style={{ width: 48, height: 48 }}
            >
              <MaterialCommunityIcons
                name="account"
                size={24}
                color="#DC2626"
              />
            </View>
            <View className="flex-1 ml-3">
              <Text
                className="font-semibold text-slate-900"
                style={{ fontSize: responsiveFontSize(16) }}
              >
                {item.name || item.username}
              </Text>
              <Text
                className="text-slate-500"
                style={{ fontSize: responsiveFontSize(14) }}
              >
                @{item.username}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    
    if (searchType === 'topics') {
      return (
        <TouchableOpacity
          className="bg-white rounded-xl p-4 border border-slate-200"
          onPress={() => {
            // Navigate to topic posts
            navigation.navigate(ROUTES.STACK.TOPIC_POSTS, { 
              topicSlug: item.slug,
              topicId: item.id 
            });
          }}
        >
          <View className="flex-row items-center">
            <View
              className="items-center justify-center rounded-full"
              style={{ 
                width: 48, 
                height: 48,
                backgroundColor: item.color || '#DC2626'
              }}
            >
              <MaterialCommunityIcons
                name="tag"
                size={24}
                color="white"
              />
            </View>
            <View className="flex-1 ml-3">
              <Text
                className="font-semibold text-slate-900"
                style={{ fontSize: responsiveFontSize(16) }}
              >
                {item.name}
              </Text>
              <Text
                className="text-slate-500"
                style={{ fontSize: responsiveFontSize(14) }}
              >
                {item.article_count || 0} bài viết
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    
    return null;
  }, [handlePostPress, navigation, searchType, responsiveFontSize]);

  const renderEmptyState = useMemo(() => {
    if (searchQuery_result.isLoading) {
      return <LoadingSpinner message="Đang tìm kiếm..." />;
    }

    if (searchQuery.trim().length < 2) {
      const currentType = searchTypes.find(type => type.key === searchType);
      return (
        <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: screenPadding }}>
          <View 
            className="items-center justify-center bg-white rounded-2xl"
            style={{
              padding: gapMedium * 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <MaterialCommunityIcons
              name={currentType?.icon || 'magnify'}
              size={responsiveFontSize(48)}
              color="#94A3B8"
            />
            <Text
              className="font-semibold text-slate-700 mt-4"
              style={{ fontSize: responsiveFontSize(18) }}
            >
              Tìm kiếm {currentType?.label || 'nội dung'}
            </Text>
            <Text
              className="text-center text-slate-500 mt-2"
              style={{ 
                fontSize: responsiveFontSize(14),
                lineHeight: responsiveFontSize(20),
              }}
            >
              Nhập từ khóa để tìm kiếm {currentType?.label || 'nội dung'}
            </Text>
          </View>
        </View>
      );
    }

    if (searchQuery_result.isError) {
      return (
        <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: screenPadding }}>
          <View 
            className="items-center justify-center bg-white rounded-2xl"
            style={{
              padding: gapMedium * 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <MaterialCommunityIcons
              name="alert-circle"
              size={responsiveFontSize(48)}
              color="#EF4444"
            />
            <Text
              className="font-semibold text-slate-700 mt-4"
              style={{ fontSize: responsiveFontSize(18) }}
            >
              Lỗi tìm kiếm
            </Text>
            <Text
              className="text-center text-slate-500 mt-2"
              style={{ 
                fontSize: responsiveFontSize(14),
                lineHeight: responsiveFontSize(20),
              }}
            >
              Không thể tải kết quả tìm kiếm. Vui lòng thử lại.
            </Text>
          </View>
        </View>
      );
    }

    if (searchQuery_result.data?.items?.length === 0) {
      return (
        <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: screenPadding }}>
          <View 
            className="items-center justify-center bg-white rounded-2xl"
            style={{
              padding: gapMedium * 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={responsiveFontSize(48)}
              color="#94A3B8"
            />
            <Text
              className="font-semibold text-slate-700 mt-4"
              style={{ fontSize: responsiveFontSize(18) }}
            >
              Không tìm thấy kết quả
            </Text>
            <Text
              className="text-center text-slate-500 mt-2"
              style={{ 
                fontSize: responsiveFontSize(14),
                lineHeight: responsiveFontSize(20),
              }}
            >
              Không có {searchTypes.find(t => t.key === searchType)?.label || 'nội dung'} nào phù hợp với "{searchQuery}"
            </Text>
          </View>
        </View>
      );
    }

    return null;
  }, [searchQuery, searchQuery_result, searchType, searchTypes, screenPadding, gapMedium, responsiveFontSize]);

  // Xử lý response từ server search API
  const searchResults = searchQuery_result.data?.items || [];
  const searchMeta = searchQuery_result.data?.meta || {};

  return (
    <View
      className="flex-1 bg-white"
      style={{
        paddingTop: verticalPadding + statusBarOffset,
      }}
    >
      {/* Search Header with Back Button */}
      <View
        className="bg-white"
        style={{
          paddingTop: gapMedium * 1.5,
          paddingHorizontal: screenPadding,
          paddingBottom: gapMedium,
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
        }}
      >
        {/* Header with Back Button */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="items-center justify-center bg-slate-100 rounded-full mr-3"
            style={{ width: 40, height: 40 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={20}
              color="#1E293B"
            />
          </TouchableOpacity>
          <Text
            className="font-semibold text-slate-900"
            style={{ fontSize: responsiveFontSize(18) }}
          >
            Tìm kiếm
          </Text>
        </View>
        <View
          className="flex-row items-center bg-slate-50 rounded-xl border border-slate-200"
          style={{
            paddingHorizontal: gapSmall,
            paddingVertical: gapSmall,
            gap: gapSmall / 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={responsiveFontSize(18)}
            color="#64748B"
          />
          <TextInput
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch(text);
            }}
            placeholder="Tìm kiếm bài viết, chủ đề, tác giả..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-base text-slate-800"
            style={{
              fontSize: responsiveFontSize(14),
              lineHeight: responsiveFontSize(18),
              paddingVertical: 0,
            }}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(searchQuery)}
            clearButtonMode="never"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              className="items-center justify-center"
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#E2E8F0',
              }}
            >
              <MaterialCommunityIcons
                name="close"
                size={responsiveFontSize(16)}
                color="#64748B"
              />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Search Type Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: gapSmall,
            paddingHorizontal: 4,
          }}
        >
          {searchTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              onPress={() => setSearchType(type.key)}
              className={`flex-row items-center rounded-full px-4 py-2 mr-2 ${
                searchType === type.key ? 'bg-red-100' : 'bg-slate-100'
              }`}
              style={{
                borderWidth: 1,
                borderColor: searchType === type.key ? '#DC2626' : '#E2E8F0',
              }}
            >
              <MaterialCommunityIcons
                name={type.icon}
                size={responsiveFontSize(16)}
                color={searchType === type.key ? '#DC2626' : '#64748B'}
              />
              <Text
                className={`ml-2 font-medium ${
                  searchType === type.key ? 'text-red-600' : 'text-slate-600'
                }`}
                style={{ fontSize: responsiveFontSize(14) }}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Results */}
      <View 
        className="flex-1 bg-slate-50" 
        style={{ 
          paddingHorizontal: screenPadding,
          paddingTop: gapMedium,
        }}
      >
        {renderEmptyState || (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: gapMedium }} />}
            contentContainerStyle={{
              paddingBottom: listContentPaddingBottom,
            }}
            showsVerticalScrollIndicator={false}
            refreshing={searchQuery_result.isFetching}
            onRefresh={() => searchQuery_result.refetch()}
          />
        )}
      </View>
    </View>
  );
}
