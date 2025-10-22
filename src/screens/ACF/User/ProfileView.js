import { useRoute } from '@react-navigation/native';
import { Image, ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { formatName } from '../../../utils/format';
import viewProfileService from '../../../services/viewProfile.service';

export default function ProfileView() {
  const route = useRoute();
  const { user } = useAuth();
  const { userId, userName, searchBy } = route.params ?? {};
  
  console.log('ProfileView: Route params:', route.params);
  console.log('ProfileView: userId:', userId, 'userName:', userName, 'searchBy:', searchBy);

  // Fetch profile data
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['view-profile', userId, userName, searchBy],
    queryFn: async () => {
      if (userId) {
        return viewProfileService.getProfileById(userId);
      } else if (userName && searchBy === 'name') {
        return viewProfileService.getProfileByUsername(userName);
      } else {
        throw new Error('No valid identifier provided');
      }
    },
    enabled: !!(userId || (userName && searchBy === 'name')),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const profile = profileData?.data;
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    responsiveFontSize,
    listContentPaddingBottom,
  } = useResponsiveSpacing();

  // Loading state
  if (profileLoading) {
    return <LoadingSpinner message="Đang tải hồ sơ người dùng..." />;
  }

  // Error state
  if (profileError) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{ padding: cardPadding }}
      >
        <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
        <Text
          className="text-red-500 font-semibold mt-2"
          style={{ fontSize: responsiveFontSize(16) }}
        >
          Có lỗi xảy ra
        </Text>
        <Text
          className="text-slate-500 text-center mt-1"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          {profileError.message || 'Không thể tải thông tin người dùng'}
        </Text>
        <TouchableOpacity
          className="bg-red-500 rounded-lg px-4 py-2 mt-4"
          onPress={() => refetchProfile()}
        >
          <Text className="text-white font-medium">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No profile found
  if (!profile) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{ padding: cardPadding }}
      >
        <MaterialCommunityIcons name="account-question" size={48} color="#6B7280" />
        <Text
          className="text-slate-500 font-semibold mt-2"
          style={{ fontSize: responsiveFontSize(16) }}
        >
          Không tìm thấy người dùng
        </Text>
        <Text
          className="text-slate-400 text-center mt-1"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          {userName ? `Người dùng "${userName}" không tồn tại` : 'Người dùng không tồn tại'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: listContentPaddingBottom,
        gap: gapMedium,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center" style={{ gap: gapSmall }}>
        <Image
          source={{
            uri:
              profile.user?.avatar_url ??
              'https://dummyimage.com/128x128/1e293b/ffffff&text=ACF',
          }}
          style={{
            height: 112,
            width: 112,
            borderRadius: 56,
            borderWidth: 4,
            borderColor: '#DC2626',
          }}
        />
        <Text
          className="font-bold text-slate-900"
          style={{ fontSize: responsiveFontSize(24) }}
        >
          {profile.user?.name || profile.user?.username || 'Người dùng'}
        </Text>
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          {profile.user?.role === 'businessmen' ? 'Doanh nhân' : 
           profile.user?.role === 'kol' ? 'KOL' : 'Thành viên'} • ID: {profile.user?.id}
        </Text>
        {profile.user?.username && (
          <Text
            className="text-slate-400"
            style={{ fontSize: responsiveFontSize(12) }}
          >
            @{profile.user.username}
          </Text>
        )}
      </View>

      {profile.user?.description && (
        <View style={{ gap: gapSmall }}>
          <Text
            className="font-semibold text-slate-900"
            style={{ fontSize: responsiveFontSize(18) }}
          >
            Giới thiệu
          </Text>
          <Text
            className="text-slate-600"
            style={{
              fontSize: responsiveFontSize(14),
              lineHeight: responsiveFontSize(20, { min: 18 }),
            }}
          >
            {profile.user.description}
          </Text>
        </View>
      )}

      {/* Thống kê */}
      <View className="flex-row justify-around bg-gray-50 rounded-lg p-4">
        <View className="items-center">
          <Text className="font-bold text-slate-900" style={{ fontSize: responsiveFontSize(20) }}>
            {profile.followers || 0}
          </Text>
          <Text className="text-slate-500" style={{ fontSize: responsiveFontSize(12) }}>
            Người theo dõi
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-bold text-slate-900" style={{ fontSize: responsiveFontSize(20) }}>
            {profile.following || 0}
          </Text>
          <Text className="text-slate-500" style={{ fontSize: responsiveFontSize(12) }}>
            Đang theo dõi
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-bold text-slate-900" style={{ fontSize: responsiveFontSize(20) }}>
            {profile.articleCount || 0}
          </Text>
          <Text className="text-slate-500" style={{ fontSize: responsiveFontSize(12) }}>
            Bài viết
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
