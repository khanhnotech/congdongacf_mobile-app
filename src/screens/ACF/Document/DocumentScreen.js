import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import documentService from '../../../services/document.service';

const DocumentScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
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

  // Fetch documents
  const {
    data: documentsData,
    isLoading: documentsLoading,
    error: documentsError,
    refetch: refetchDocuments
  } = useQuery({
    queryKey: ['documents', searchQuery, selectedCategory, selectedYear],
    queryFn: async () => {
      const params = {
        q: searchQuery || undefined,
        category: selectedCategory || undefined,
        year: selectedYear || undefined,
        page: 1,
        limit: 20
      };
      return documentService.getDocuments(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ['document-categories'],
    queryFn: () => documentService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch years
  const {
    data: yearsData,
    isLoading: yearsLoading
  } = useQuery({
    queryKey: ['document-years'],
    queryFn: () => documentService.getYears(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const documents = documentsData?.data || [];
  const categories = categoriesData?.data || [];
  const years = yearsData?.data || [];

  // Handle download
  const handleDownload = async (fileUrl, fileName) => {
    try {
      if (!fileUrl) {
        Alert.alert('Lỗi', 'Không có file để tải xuống');
        return;
      }

      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert('Lỗi', 'Không thể mở file này');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Lỗi', 'Không thể tải xuống file');
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchDocuments();
    } finally {
      setRefreshing(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedYear('');
  };

  // Render document item
  const renderDocumentItem = ({ item }) => (
    <View className="bg-white rounded-lg p-4 mb-3 mx-4 shadow-sm border border-gray-100">
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            Số: {item.number}
          </Text>
          <Text className="text-xs text-gray-500">
            Ngày ban hành: {new Date(item.issued_date).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View className="items-center">
          <MaterialCommunityIcons name="file-document" size={24} color="#DC2626" />
        </View>
      </View>

      {/* Description */}
      {item.description && (
        <Text className="text-sm text-gray-700 mb-3" numberOfLines={3}>
          {item.description}
        </Text>
      )}

      {/* Category and Year */}
      <View className="flex-row items-center mb-3">
        {item.category && (
          <View className="bg-red-100 rounded-full px-3 py-1 mr-2">
            <Text className="text-red-600 text-xs font-medium">
              {item.category}
            </Text>
          </View>
        )}
        {item.issued_date && (
          <View className="bg-gray-100 rounded-full px-3 py-1">
            <Text className="text-gray-600 text-xs font-medium">
              {new Date(item.issued_date).getFullYear()}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="eye" size={16} color="#6B7280" />
          <Text className="text-gray-500 text-xs ml-1">
            {item.views || 0} lượt xem
          </Text>
        </View>
        
        {item.file_url && (
          <TouchableOpacity
            className="bg-red-500 rounded-lg px-4 py-2 flex-row items-center"
            onPress={() => handleDownload(item.file_url, item.title)}
          >
            <MaterialCommunityIcons name="download" size={16} color="white" />
            <Text className="text-white text-sm font-medium ml-1">
              Tải xuống
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Render category filter
  const renderCategoryFilter = () => (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-2 px-4">
        Danh mục
      </Text>
      <View className="flex-row flex-wrap px-4">
        <TouchableOpacity
          className={`rounded-full px-4 py-2 mr-2 mb-2 ${
            selectedCategory === '' ? 'bg-red-500' : 'bg-gray-200'
          }`}
          onPress={() => setSelectedCategory('')}
        >
          <Text className={`text-sm font-medium ${
            selectedCategory === '' ? 'text-white' : 'text-gray-700'
          }`}>
            Tất cả
          </Text>
        </TouchableOpacity>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={`category-${index}`}
            className={`rounded-full px-4 py-2 mr-2 mb-2 ${
              selectedCategory === category ? 'bg-red-500' : 'bg-gray-200'
            }`}
            onPress={() => setSelectedCategory(category)}
          >
            <Text className={`text-sm font-medium ${
              selectedCategory === category ? 'text-white' : 'text-gray-700'
            }`}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Render year filter
  const renderYearFilter = () => (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-2 px-4">
        Năm
      </Text>
      <View className="flex-row flex-wrap px-4">
        <TouchableOpacity
          className={`rounded-full px-4 py-2 mr-2 mb-2 ${
            selectedYear === '' ? 'bg-red-500' : 'bg-gray-200'
          }`}
          onPress={() => setSelectedYear('')}
        >
          <Text className={`text-sm font-medium ${
            selectedYear === '' ? 'text-white' : 'text-gray-700'
          }`}>
            Tất cả
          </Text>
        </TouchableOpacity>
        {years.map((year, index) => (
          <TouchableOpacity
            key={`year-${index}`}
            className={`rounded-full px-4 py-2 mr-2 mb-2 ${
              selectedYear === year ? 'bg-red-500' : 'bg-gray-200'
            }`}
            onPress={() => setSelectedYear(year)}
          >
            <Text className={`text-sm font-medium ${
              selectedYear === year ? 'text-white' : 'text-gray-700'
            }`}>
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <MaterialCommunityIcons name="file-document-outline" size={64} color="#D1D5DB" />
      <Text className="text-lg font-semibold text-gray-500 mt-4 mb-2">
        Không tìm thấy văn bản
      </Text>
      <Text className="text-sm text-gray-400 text-center px-8">
        {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có văn bản nào được đăng tải'}
      </Text>
      {searchQuery && (
        <TouchableOpacity
          className="bg-red-500 rounded-lg px-6 py-3 mt-4"
          onPress={clearFilters}
        >
          <Text className="text-white font-medium">Xóa bộ lọc</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        {/* Back Button */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 p-2"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800 flex-1">
            Văn bản pháp luật
          </Text>
        </View>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
          <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-700"
            placeholder="Tìm kiếm văn bản..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      {renderCategoryFilter()}
      {renderYearFilter()}

      {/* Clear Filters Button */}
      {(selectedCategory || selectedYear || searchQuery) && (
        <View className="px-4 mb-4">
          <TouchableOpacity
            className="bg-gray-200 rounded-lg py-2 px-4 flex-row items-center justify-center"
            onPress={clearFilters}
          >
            <MaterialCommunityIcons name="close" size={16} color="#6B7280" />
            <Text className="text-gray-700 font-medium ml-2">Xóa bộ lọc</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Documents List */}
      {documentsLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#DC2626" />
          <Text className="text-gray-500 mt-2">Đang tải...</Text>
        </View>
      ) : documentsError ? (
        <View className="flex-1 items-center justify-center">
          <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
          <Text className="text-red-500 font-semibold mt-2">Có lỗi xảy ra</Text>
          <Text className="text-gray-500 text-sm mt-1">Vui lòng thử lại sau</Text>
        </View>
      ) : (
        <FlatList
          data={documents}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#DC2626']}
              tintColor="#DC2626"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: listContentPaddingBottom }}
        />
      )}
    </SafeAreaView>
  );
};

export default DocumentScreen;
