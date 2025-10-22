import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { ROUTES } from '../utils/constants';
import topService from '../services/top.service';

const TopMembersCard = () => {
  console.log('TopMembersCard: Component rendering');
  
  const navigation = useNavigation();
  const { requireAuth } = useAuthRedirect();
  
  const [businessmenPage, setBusinessmenPage] = useState(1);
  const [kolsPage, setKolsPage] = useState(1);
  const [allBusinessmen, setAllBusinessmen] = useState([]);
  const [allKols, setAllKols] = useState([]);
  
  const { data: businessmenData, isLoading: businessmenLoading, error: businessmenError } = useQuery({
    queryKey: ['top-businessmen', businessmenPage],
    queryFn: async () => {
      console.log('TopMembersCard: Calling getTopBusinessmen page:', businessmenPage);
      const result = await topService.getTopBusinessmen({ 
        limit: 10, 
        page: businessmenPage 
      });
      console.log('TopMembersCard: getTopBusinessmen result:', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: kolData, isLoading: kolLoading, error: kolError } = useQuery({
    queryKey: ['top-kols', kolsPage],
    queryFn: async () => {
      console.log('TopMembersCard: Calling getTopKOLs page:', kolsPage);
      const result = await topService.getTopKOLs({ 
        limit: 10, 
        page: kolsPage 
      });
      console.log('TopMembersCard: getTopKOLs result:', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update all data when new data comes in
  React.useEffect(() => {
    if (businessmenData?.data) {
      if (businessmenPage === 1) {
        setAllBusinessmen(businessmenData.data);
      } else {
        setAllBusinessmen(prev => [...prev, ...businessmenData.data]);
      }
    }
  }, [businessmenData, businessmenPage]);

  React.useEffect(() => {
    if (kolData?.data) {
      if (kolsPage === 1) {
        setAllKols(kolData.data);
      } else {
        setAllKols(prev => [...prev, ...kolData.data]);
      }
    }
  }, [kolData, kolsPage]);

  const businessmen = allBusinessmen;
  const kols = allKols;
  const isLoading = businessmenLoading || kolLoading;
  const hasError = businessmenError || kolError;

  const handleBusinessmenScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isCloseToEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 100;
    
    if (isCloseToEnd && !businessmenLoading && businessmenData?.data?.length === 10) {
      console.log('Loading more businessmen...');
      setBusinessmenPage(prev => prev + 1);
    }
  };

  const handleKolsScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isCloseToEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 100;
    
    if (isCloseToEnd && !kolLoading && kolData?.data?.length === 10) {
      console.log('Loading more KOLs...');
      setKolsPage(prev => prev + 1);
    }
  };

  // Handle follow button press
  const handleFollow = (memberId, memberName) => {
    requireAuth(() => {
      // TODO: Implement follow functionality
      console.log('Following member:', memberId, memberName);
      // Here you would call the follow API
    });
  };

  // Handle profile navigation
  const handleProfilePress = (memberId, memberName) => {
    console.log('TopMembersCard: Navigating to profile with:', { memberId, memberName });
    
    // Fallback nếu không có ID, sử dụng tên để tìm kiếm
    if (!memberId) {
      console.log('TopMembersCard: No memberId, using userName for search');
      navigation.navigate(ROUTES.STACK.PROFILE_VIEW, { 
        userId: null,
        userName: memberName,
        searchBy: 'name'
      });
    } else {
      navigation.navigate(ROUTES.STACK.PROFILE_VIEW, { 
        userId: memberId,
        userName: memberName 
      });
    }
  };

  console.log('TopMembersCard: Data', {
    businessmen: businessmen.length,
    kols: kols.length,
    isLoading,
    hasError,
    businessmenData,
    kolData
  });

  if (isLoading) {
    return (
      <View className="bg-white mx-4 mb-4 rounded-xl p-4">
        <View className="flex-row items-center justify-center py-8">
          <ActivityIndicator size="small" color="#DC2626" />
          <Text className="text-gray-500 ml-2">Đang tải top thành viên...</Text>
        </View>
      </View>
    );
  }

  // Luôn hiển thị component để debug
  if (hasError || (!businessmen.length && !kols.length)) {
    return (
      <View className="bg-white mx-4 mb-4 rounded-xl p-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="alert-circle" size={20} color="#DC2626" />
            <Text className="text-lg font-bold text-red-600 ml-2">
              Debug Top Members
            </Text>
          </View>
        </View>
        
        <View className="bg-gray-50 rounded-lg p-4">
          <Text className="text-gray-700 mb-2">
            {hasError ? 'Lỗi tải dữ liệu' : 'Không có dữ liệu top thành viên'}
          </Text>
          <Text className="text-gray-500 text-sm">
            Business: {businessmen.length}, KOLs: {kols.length}
          </Text>
          <Text className="text-gray-500 text-sm">
            Loading: {isLoading ? 'Yes' : 'No'}
          </Text>
          <Text className="text-gray-500 text-sm">
            Error: {hasError ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className=" mb-4 rounded-2xl overflow-hidden" style={{ 
      backgroundColor: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      shadowColor: '#DC2626',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8
    }}>

      {/* Content with white background */}
      <View className="bg-white">
        {/* Top Businessmen Section */}
        <View className="py-4">
          <View className="flex-row items-center justify-between mb-4 px-6">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3">
                <MaterialCommunityIcons name="briefcase" size={16} color="#DC2626" />
              </View>
              <Text className="text-lg font-bold text-gray-800">
                Top thành viên hoạt động sôi nổi
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-red-500 mr-1" />
              <View className="w-2 h-2 rounded-full bg-red-300 mr-1" />
              <View className="w-2 h-2 rounded-full bg-red-200" />
            </View>
          </View>

          {businessmen.length > 0 ? (

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            onScroll={handleBusinessmenScroll}
            scrollEventThrottle={400}
          >
            {businessmen.map((member, index) => {
              console.log('TopMembersCard: Businessman member data:', member);
              return (
              <View key={member.id || index} className="mr-4" style={{ width: 150 }}>
                <View className="rounded-xl p-4 border-2 border-red-100" style={{
                  backgroundColor: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                  shadowColor: '#DC2626',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  marginTop: 8
                }}>
                  {/* Rank Badge */}
                  <View className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 items-center justify-center" style={{
                    shadowColor: '#F59E0B',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4
                  }}>
                    <Text className="text-red-600 font-bold text-xs">#{index + 1}</Text>
                  </View>

                  {/* Avatar */}
                  <TouchableOpacity 
                    className="items-center mb-3"
                    onPress={() => handleProfilePress(member.id, member.display_name || member.name)}
                  >
                    {member.avatar_url ? (
                      <View className="w-16 h-16 rounded-full border-4 border-yellow-300 overflow-hidden">
                        <Image
                          source={{ uri: member.avatar_url }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                    ) : (
                      <View className="w-16 h-16 rounded-full border-4 border-yellow-300 bg-gradient-to-br from-red-500 to-red-600 items-center justify-center">
                        <Text className="text-white font-bold text-xl">
                          {member.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Name */}
                  <TouchableOpacity
                    onPress={() => handleProfilePress(member.id, member.display_name || member.name)}
                  >
                    <Text className="text-sm font-bold text-gray-800 text-center mb-1" numberOfLines={1}>
                      {member.display_name || member.name || 'Người dùng'}
                    </Text>
                  </TouchableOpacity>

                  {/* Username */}
                  <Text className="text-xs text-gray-600 text-center mb-3" numberOfLines={1}>
                    @{member.username || 'user'}
                  </Text>

                  {/* Stats */}
                  <View className="bg-red-50 rounded-lg p-2 mb-3">
                    <View className="flex-row items-center justify-center">
                      <MaterialCommunityIcons name="account-group" size={12} color="#DC2626" />
                      <Text className="text-red-600 text-xs font-semibold ml-1">
                        {member.followers_count || 0} followers
                      </Text>
                    </View>
                  </View>

                  {/* Follow Button */}
                  <TouchableOpacity 
                    className="rounded-lg py-2 px-3" 
                    style={{
                      backgroundColor: '#DC2626',
                      shadowColor: '#DC2626',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3
                    }}
                    onPress={() => handleFollow(member.id, member.display_name || member.name)}
                  >
                    <Text className="text-white text-xs font-bold text-center">
                      + Theo dõi
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              );
            })}
            
            {/* Loading indicator for businessmen */}
            {businessmenLoading && businessmenPage > 1 && (
              <View className="mr-4 items-center justify-center" style={{ width: 150 }}>
                <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center">
                  <ActivityIndicator size="small" color="#DC2626" />
                </View>
                <Text className="text-red-600 text-xs mt-2 font-medium">Đang tải...</Text>
              </View>
            )}
          </ScrollView>
          ) : (
            <View className="items-center justify-center py-8 px-6">
              <MaterialCommunityIcons name="account-group-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 font-medium mt-2 text-center">
                Chưa có thông tin thành viên
              </Text>
            </View>
          )}
        </View>

        {/* Top KOLs Section */}
        <View className="py-4 border-t border-red-100">
          <View className="flex-row items-center justify-between mb-4 px-6">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-yellow-100 items-center justify-center mr-3">
                <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
              </View>
              <Text className="text-lg font-bold text-gray-800">
                Top KOL - KOC ACF
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-yellow-500 mr-1" />
              <View className="w-2 h-2 rounded-full bg-yellow-300 mr-1" />
              <View className="w-2 h-2 rounded-full bg-yellow-200" />
            </View>
          </View>

          {kols.length > 0 ? (

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            onScroll={handleKolsScroll}
            scrollEventThrottle={400}
          >
            {kols.map((member, index) => {
              console.log('TopMembersCard: KOL member data:', member);
              return (
              <View key={member.id || index} className="mr-4" style={{ width: 150 }}>
                <View className="rounded-xl p-4 border-2 border-yellow-100" style={{
                  backgroundColor: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                  shadowColor: '#F59E0B',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  marginTop: 8
                }}>
                  {/* Rank Badge */}
                  <View className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 items-center justify-center" style={{
                    shadowColor: '#DC2626',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4
                  }}>
                    <Text className="text-white font-bold text-xs">#{index + 1}</Text>
                  </View>

                  {/* Avatar */}
                  <TouchableOpacity 
                    className="items-center mb-3"
                    onPress={() => handleProfilePress(member.id, member.display_name || member.name)}
                  >
                    {member.avatar_url ? (
                      <View className="w-16 h-16 rounded-full border-4 border-red-300 overflow-hidden">
                        <Image
                          source={{ uri: member.avatar_url }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                    ) : (
                      <View className="w-16 h-16 rounded-full border-4 border-red-300 bg-gradient-to-br from-yellow-500 to-yellow-600 items-center justify-center">
                        <Text className="text-white font-bold text-xl">
                          {member.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Name */}
                  <TouchableOpacity
                    onPress={() => handleProfilePress(member.id, member.display_name || member.name)}
                  >
                    <Text className="text-sm font-bold text-gray-800 text-center mb-1" numberOfLines={1}>
                      {member.display_name || member.name || 'Người dùng'}
                    </Text>
                  </TouchableOpacity>

                  {/* Username */}
                  <Text className="text-xs text-gray-600 text-center mb-3" numberOfLines={1}>
                    @{member.username || 'user'}
                  </Text>

                  {/* Stats */}
                  <View className="bg-yellow-50 rounded-lg p-2 mb-3">
                    <View className="flex-row items-center justify-center">
                      <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                      <Text className="text-yellow-700 text-xs font-semibold ml-1">
                        {member.followers_count || 0} followers
                      </Text>
                    </View>
                  </View>

                  {/* Follow Button */}
                  <TouchableOpacity 
                    className="rounded-lg py-2 px-3" 
                    style={{
                      backgroundColor: '#F59E0B',
                      shadowColor: '#F59E0B',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3
                    }}
                    onPress={() => handleFollow(member.id, member.display_name || member.name)}
                  >
                    <Text className="text-white text-xs font-bold text-center">
                      + Theo dõi
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              );
            })}
            
            {/* Loading indicator for KOLs */}
            {kolLoading && kolsPage > 1 && (
              <View className="mr-4 items-center justify-center" style={{ width: 150 }}>
                <View className="w-16 h-16 rounded-full bg-yellow-100 items-center justify-center">
                  <ActivityIndicator size="small" color="#F59E0B" />
                </View>
                <Text className="text-yellow-600 text-xs mt-2 font-medium">Đang tải...</Text>
              </View>
            )}
          </ScrollView>
          ) : (
            <View className="items-center justify-center py-8 px-6">
              <MaterialCommunityIcons name="star-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 font-medium mt-2 text-center">
                Chưa có thông tin thành viên
              </Text>
            </View>
          )}
        </View>

      </View>
    </View>
  );
};

export default TopMembersCard;
