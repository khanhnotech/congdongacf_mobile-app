import React, { useState, useMemo, useCallback } from 'react';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Image, ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PostCard from '../../../components/PostCard';
import { useAuth } from '../../../hooks/useAuth';
import { useProfileArticles } from '../../../hooks/useProfile';
import { useTogglePostLike } from '../../../hooks/useTogglePostLike';
import { useLikesStore } from '../../../store/likes.store';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { formatName } from '../../../utils/format';
import viewProfileService from '../../../services/viewProfile.service';
import { useAuthRedirect } from '../../../hooks/useAuthRedirect';
import { QUERY_KEYS, ROUTES } from '../../../utils/constants';

export default function ProfileView() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { requireAuth } = useAuthRedirect();
  const queryClient = useQueryClient();
  const { userId, userName, searchBy } = route.params ?? {};
  const { toggleLike, toggleLikeStatus } = useTogglePostLike();
  const likesStore = useLikesStore();
  
  const [isFollowing, setIsFollowing] = useState(null);
  
  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
    return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
  };
  

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

  const profile = profileData?.data ?? null;

  // Fetch user articles
  const articleParams = useMemo(() => ({ limit: 10 }), []);
  const profileArticlesQuery = useProfileArticles(userId, articleParams, {
    enabled: !!userId,
  });

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: (targetId) => {
      return viewProfileService.toggleFollow(targetId);
    },
    onSuccess: (data) => {
      // Extract data from the server response
      const isNowFollowing = data?.data?.is_following ?? data?.is_following;
      const followerCount = data?.data?.follower_count ?? data?.follower_count;
      
      // Update local state immediately
      setIsFollowing(isNowFollowing);
      
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['view-profile'] });
      queryClient.invalidateQueries({ queryKey: ['top-businessmen'] });
      queryClient.invalidateQueries({ queryKey: ['top-kols'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
      
      // Invalidate current user's profile specifically
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE.DETAIL(user.id) });
        // Force refetch the profile data
        queryClient.refetchQueries({ queryKey: QUERY_KEYS.PROFILE.DETAIL(user.id) });
      }
    },
    onError: (error) => {
      console.error('Follow error:', error);
      // Optionally show error message to user
    },
  });

  // Update isFollowing when profile changes
  React.useEffect(() => {
    if (profile?.follow?.is_following !== undefined) {
      setIsFollowing(profile?.follow?.is_following);
    } else if (profile?.is_following !== undefined) {
      setIsFollowing(profile?.is_following);
    } else {
      // Default to false if no follow data available
      setIsFollowing(false);
    }
  }, [profile?.follow?.is_following, profile?.is_following]);

  // Refresh articles when screen comes into focus (e.g., returning from PostDetail)
  useFocusEffect(
    useCallback(() => {
      // Only refresh if we have articles data and not already loading
      if (profileArticlesQuery.data?.items?.length > 0 && !profileArticlesQuery.isLoading) {
        profileArticlesQuery.refetch();
      }
    }, [profileArticlesQuery.data?.items?.length, profileArticlesQuery.isLoading, profileArticlesQuery.refetch])
  );

  // Handle toggle like for articles
  const handleToggleLike = useCallback(
    async (targetPost) => {
      if (!targetPost) return;
      const candidateId =
        Number(
          targetPost.articleId ?? targetPost?.raw?.article_id ?? targetPost.id,
        );
      if (!Number.isFinite(candidateId)) {
        console.warn('Cannot toggle like, invalid article id', targetPost?.id);
        return;
      }
      try {
        const result = await toggleLike(candidateId);
        console.log('ProfileView: Like result', result);
        
        // Update profile articles query data directly
        if (result && typeof result.liked === 'boolean') {
          queryClient.setQueryData(
            profileArticlesQuery.queryKey,
            (oldData) => {
              if (!oldData?.items) return oldData;
              return {
                ...oldData,
                items: oldData.items.map(item => {
                  const itemId = Number(item.id ?? item.articleId ?? item.raw?.id ?? item.raw?.article_id);
                  if (itemId === candidateId) {
                    return {
                      ...item,
                      liked: result.liked,
                      likeCount: typeof result.likeCount === 'number' ? result.likeCount : item.likeCount,
                    };
                  }
                  return item;
                })
              };
            }
          );
        }
        
        // Also refresh to get latest data
        profileArticlesQuery.refetch();
      } catch (error) {
        console.warn('Toggle like failed', error);
      }
    },
    [toggleLike, profileArticlesQuery, queryClient],
  );

  // Transform articles data to ensure PostCard compatibility
  const transformArticlesForPostCard = useCallback((articles) => {
    if (!articles || !Array.isArray(articles)) return [];
    const userKey = user?.id ?? user?.email ?? null;
    const likedByUser = userKey ? likesStore.likedByUser[userKey] : {};
    
    return articles.map(article => {
      // Safety check for article object
      if (!article || typeof article !== 'object') {
        console.warn('ProfileView: Invalid article object', article);
        return null;
      }
      const articleId = Number(article.id ?? article.articleId ?? article.raw?.id ?? article.raw?.article_id);
      
      // Check liked status from multiple sources
      const likedFromData = Boolean(
        article.liked ??
        article.like ??
        article.is_liked ??
        article.raw?.liked ??
        article.raw?.like ??
        false
      );
      
      // Check liked status from likes store
      const likedFromStore = userKey && Number.isFinite(articleId) 
        ? Boolean(likedByUser[articleId])
        : false;
      
      // Use store data if available, otherwise use data from server
      const liked = likedFromStore || likedFromData;
      
      // Debug log to check article data
      console.log('ProfileView: Article data', {
        id: article.id,
        articleId: articleId,
        title: article.title,
        liked: liked,
        likedFromData: likedFromData,
        likedFromStore: likedFromStore,
        userKey: userKey,
        originalLiked: article.liked,
        originalLike: article.like,
        originalIsLiked: article.is_liked,
        rawLiked: article.raw?.liked,
        rawLike: article.raw?.like,
        likeCount: article.likeCount ?? article.like_count,
        commentCount: article.commentCount ?? article.comment_count,
        // Image fields
        cover: article.cover,
        cover_url: article.cover_url,
        imageUrl: article.imageUrl,
        image_url: article.image_url,
        main_image_url: article.main_image_url,
        mainImageUrl: article.mainImageUrl,
        main_image: article.main_image,
        mainImage: article.mainImage,
        thumbnail: article.thumbnail,
        thumbnail_url: article.thumbnail_url,
        // Raw image fields
        raw_cover: article.raw?.cover,
        raw_cover_url: article.raw?.cover_url,
        raw_imageUrl: article.raw?.imageUrl,
        raw_image_url: article.raw?.image_url,
        raw_main_image_url: article.raw?.main_image_url,
        raw_mainImageUrl: article.raw?.mainImageUrl,
        raw_main_image: article.raw?.main_image,
        raw_mainImage: article.raw?.mainImage,
        raw_thumbnail: article.raw?.thumbnail,
        raw_thumbnail_url: article.raw?.thumbnail_url,
        // Final cover value
        final_cover: article.cover ??
          article.cover_url ??
          article.imageUrl ??
          article.image_url ??
          article.main_image_url ??
          article.mainImageUrl ??
          article.main_image ??
          article.mainImage ??
          article.thumbnail ??
          article.thumbnail_url ??
          article.raw?.cover ??
          article.raw?.cover_url ??
          article.raw?.imageUrl ??
          article.raw?.image_url ??
          article.raw?.main_image_url ??
          article.raw?.mainImageUrl ??
          article.raw?.main_image ??
          article.raw?.mainImage ??
          article.raw?.thumbnail ??
          article.raw?.thumbnail_url ??
          null,
        // Other fields
        summary: article.summary,
        excerpt: article.excerpt,
        author: article.author,
        author_name: article.author_name,
        publishedAt: article.publishedAt,
        published_at: article.published_at,
        createdAt: article.createdAt,
        created_at: article.created_at,
      });
      
      return {
        ...article,
        // Ensure liked field is properly set
        liked: liked,
        // Ensure likeCount is properly set
        likeCount: Number.isFinite(Number(article.likeCount ?? article.like_count ?? 0))
          ? Number(article.likeCount ?? article.like_count ?? 0)
          : 0,
        // Ensure commentCount is properly set
        commentCount: Number.isFinite(Number(article.commentCount ?? article.comment_count ?? 0))
          ? Number(article.commentCount ?? article.comment_count ?? 0)
          : 0,
        // Map imageUrl to cover for PostCard compatibility (check all possible image fields)
        cover: article.cover ??
          article.cover_url ??
          article.imageUrl ??
          article.image_url ??
          article.main_image_url ??
          article.mainImageUrl ??
          article.main_image ??
          article.mainImage ??
          article.thumbnail ??
          article.thumbnail_url ??
          article.raw?.cover ??
          article.raw?.cover_url ??
          article.raw?.imageUrl ??
          article.raw?.image_url ??
          article.raw?.main_image_url ??
          article.raw?.mainImageUrl ??
          article.raw?.main_image ??
          article.raw?.mainImage ??
          article.raw?.thumbnail ??
          article.raw?.thumbnail_url ??
          null,
        // Ensure excerpt field is available
        excerpt: article.summary ?? article.excerpt ?? '',
        // Ensure author field is available
        author: article.author ?? article.author_name ?? article.raw?.author_name ?? 'Unknown',
        // Ensure createdAt field is available
        createdAt: article.publishedAt ?? article.published_at ?? article.createdAt ?? article.created_at ?? null,
      };
    }).filter(article => article !== null);
  }, [user?.id, user?.email, likesStore.likedByUser]);

  // Handle follow button press
  const handleFollow = () => {
    if (!profile?.user?.id || followMutation.isPending) return;
    
    const followAction = () => {
      if (profile?.user?.id) {
        followMutation.mutate(profile.user.id);
      }
    };
    
    // Call requireAuth and execute the returned function
    const wrappedAction = requireAuth(followAction, 'theo dõi người dùng');
    
    if (typeof wrappedAction === 'function') {
      wrappedAction();
    } else {
      followAction();
    }
  };

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
      {/* Cover Photo with Overlapping Avatar */}
      <View className="relative" style={{ marginBottom: gapMedium }}>
        {/* Cover Photo */}
        {profile?.user?.cover_photo ? (
          <Image
            source={{ uri: profile?.user?.cover_photo }}
            style={{
              width: '100%',
              height: 200,
              borderTopLeftRadius: cardRadius,
              borderTopRightRadius: cardRadius,
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: 200,
              backgroundColor: '#e2e8f0',
              borderTopLeftRadius: cardRadius,
              borderTopRightRadius: cardRadius,
            }}
          />
        )}
        
        {/* Avatar overlapping on cover */}
        <View 
          className="absolute items-center justify-center"
          style={{
            bottom: -56, // Half of avatar height (112/2)
            left: '50%',
            marginLeft: -56, // Half of avatar width (112/2)
          }}
        >
          <View
            style={{
              height: 112,
              width: 112,
              borderRadius: 56,
              borderWidth: 4,
              borderColor: '#DC2626',
              overflow: 'hidden',
              backgroundColor: '#e2e8f0',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {profile?.user?.avatar_url ? (
              <Image
                source={{ uri: profile?.user?.avatar_url }}
                style={{
                  height: 112,
                  width: 112,
                  borderRadius: 56,
                }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  height: 112,
                  width: 112,
                  borderRadius: 56,
                  backgroundColor: '#DC2626',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 32,
                    fontWeight: 'bold',
                  }}
                >
                  {profile?.user?.name?.[0]?.toUpperCase() ?? 'A'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* User Info - with top margin to account for overlapping avatar */}
      <View className="items-center" style={{ gap: gapSmall, marginTop: 56 }}>
        <Text
          className="font-bold text-slate-900"
          style={{ fontSize: responsiveFontSize(24) }}
        >
          {profile?.user?.name || profile?.user?.username || 'Người dùng'}
        </Text>
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          {profile?.user?.role === 'businessmen' ? 'Doanh nhân' : 
           profile?.user?.role === 'kol' ? 'KOL' : 'Thành viên'} • ID: {profile?.user?.id}
        </Text>
        {profile?.user?.username && (
          <Text
            className="text-slate-400"
            style={{ fontSize: responsiveFontSize(12) }}
          >
            @{profile?.user?.username}
          </Text>
        )}

        {/* Follow Button - Moved here under name */}
        {user?.id !== profile?.user?.id && (
          <TouchableOpacity
            className={`rounded-lg px-4 py-2 items-center justify-center min-w-[100px] ${
              isFollowing ? 'bg-gray-500' : 'bg-red-600'
            }`}
            onPress={handleFollow}
            disabled={followMutation.isPending}
            style={{ 
              opacity: followMutation.isPending ? 0.7 : 1,
              marginTop: gapSmall
            }}
          >
            {followMutation.isPending ? (
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-bold" style={{ fontSize: responsiveFontSize(14) }}>
                  Đang xử lý...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-bold" style={{ fontSize: responsiveFontSize(14) }}>
                {isFollowing === true ? 'Đang theo dõi' : 'Theo dõi'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {profile?.user?.description && (
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
            {profile?.user?.description}
          </Text>
        </View>
      )}

      {/* Thống kê */}
      <View className="flex-row justify-around bg-gray-50 rounded-lg p-4">
        <View className="items-center">
          <Text className="font-bold text-slate-900" style={{ fontSize: responsiveFontSize(20) }}>
            {profile?.stats?.follower_count || profile?.followers || 0}
          </Text>
          <Text className="text-slate-500" style={{ fontSize: responsiveFontSize(12) }}>
            Người theo dõi
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-bold text-slate-900" style={{ fontSize: responsiveFontSize(20) }}>
            {profile?.stats?.following_count || profile?.following || 0}
          </Text>
          <Text className="text-slate-500" style={{ fontSize: responsiveFontSize(12) }}>
            Đang theo dõi
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-bold text-slate-900" style={{ fontSize: responsiveFontSize(20) }}>
            {profile?.stats?.article_count || profile?.articleCount || 0}
          </Text>
          <Text className="text-slate-500" style={{ fontSize: responsiveFontSize(12) }}>
            Bài viết
          </Text>
        </View>
      </View>


      {/* Bài viết của người dùng */}
      <View style={{ gap: gapMedium }}>
        <Text
          className="font-bold text-slate-900"
          style={{ fontSize: responsiveFontSize(18) }}
        >
          Bài viết của {profile?.user?.name || 'người dùng'}
        </Text>
        
        {/* Articles List */}
        <View style={{ gap: gapSmall }}>
          {profileArticlesQuery.isLoading ? (
            <View className="bg-white rounded-lg p-8 items-center">
              <ActivityIndicator size="small" color="#DC2626" />
              <Text
                className="text-slate-500 mt-2"
                style={{ fontSize: responsiveFontSize(14) }}
              >
                Đang tải bài viết...
              </Text>
            </View>
          ) : (
            transformArticlesForPostCard(profileArticlesQuery.data?.items)?.map((article, index) => (
              <PostCard
                key={article.id || `article-${index}`}
                post={article}
                onPress={() => {
                  navigation.navigate(ROUTES.STACK.POST_DETAIL, {
                    postId: article.id,
                    postSlug: article.slug
                  });
                }}
                onToggleLike={handleToggleLike}
                likePending={toggleLikeStatus === 'pending'}
                // Disable profile navigation to prevent infinite loop
                disableProfileNavigation={true}
              />
            ))
          )}
          
          {(!profileArticlesQuery.data?.items || profileArticlesQuery.data.items.length === 0) && !profileArticlesQuery.isLoading && (
            <View className="bg-gray-50 rounded-lg p-8 items-center">
              <MaterialCommunityIcons
                name="file-document-outline"
                size={48}
                color="#9CA3AF"
              />
              <Text
                className="text-slate-500 font-medium mt-2"
                style={{ fontSize: responsiveFontSize(14) }}
              >
                Chưa có bài viết nào
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
