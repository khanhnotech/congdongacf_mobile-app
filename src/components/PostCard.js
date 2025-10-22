import { Image, Text, TouchableOpacity, View, Share, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useResponsiveSpacing } from '../hooks/useResponsiveSpacing';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { formatDateTime } from '../utils/format';
import { ROUTES } from '../utils/constants';
import { postsService } from '../services/posts.service';

export default function PostCard({ post, onPress, onToggleLike, likePending = false, disableProfileNavigation = false }) {
  if (!post) return null;

  const navigation = useNavigation();

  const handleShare = async () => {
    try {
      // Get slug from post data
      const slug = post.slug ?? post.raw?.slug ?? null;

      if (!slug) {
        Alert.alert('Lỗi', 'Không thể chia sẻ bài viết này vì thiếu thông tin');
        return;
      }

      // Call API to record share
      try {
        await postsService.shareArticle(slug);
      } catch (apiError) {
        console.warn('Share API error:', apiError);
        // Continue with share even if API fails
      }

      // Create share URL with slug
      const shareUrl = `https://acf-community.com/article/${slug}`;

      await Share.share({
        message: shareUrl,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Lỗi', 'Không thể chia sẻ bài viết');
    }
  };
  const { requireAuth } = useAuthRedirect();
  const {
    cardPadding,
    cardRadius,
    responsiveFontSize,
    responsiveSpacing,
    gapSmall,
    gapMedium,
    chipPaddingHorizontal,
    chipPaddingVertical,
    gapLarge: spacingGapLarge,
  } = useResponsiveSpacing();

  const initials =
    post.author
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'AC';

  // Get author avatar from various possible sources
  const authorAvatar = 
    post.authorAvatar ?? 
    post.author_avatar ?? 
    post.raw?.author_avatar ?? 
    null;

  const previewLimit = 150;
  const excerpt = post.excerpt ?? '';
  const shouldClamp = excerpt.length > previewLimit;
  const previewText = shouldClamp ? `${excerpt.slice(0, previewLimit)}...` : excerpt;

  const handlePress = () => {
    if (onPress) {
      onPress(post);
      return;
    }

    const params = {};
    const slugCandidate =
      typeof post?.slug === 'string' && post.slug.trim() ? post.slug.trim() : null;
    if (slugCandidate) {
      params.postSlug = slugCandidate;
    }

    const resolveNumericId = (value) => {
      if (value === undefined || value === null || value === '') return null;
      const number = Number(value);
      return Number.isFinite(number) ? number : null;
    };

    const numericIdCandidates = [
      post?.articleId,
      post?.raw?.article_id,
      post?.raw?.id,
      post?.id,
    ];

    for (const candidate of numericIdCandidates) {
      const numeric = resolveNumericId(candidate);
      if (numeric !== null) {
        params.postId = numeric;
        break;
      }
    }

    if (Object.keys(params).length) {
      navigation.navigate(ROUTES.STACK.POST_DETAIL, params);
    }
  };

  const handleProfilePress = () => {
    // Don't navigate to profile if disabled (e.g., in ProfileView to prevent infinite loop)
    if (disableProfileNavigation) {
      return;
    }
    
    // Ưu tiên post.raw?.author_id và post.raw?.author_name
    const userId = post.raw?.author_id || post.authorId || post.author_id;
    const userName = post.raw?.author_name || post.author;
    
    console.log('PostCard: Navigating to profile with:', { 
      userId, 
      userName, 
      rawAuthorId: post.raw?.author_id,
      rawAuthorName: post.raw?.author_name,
      post: post 
    });
    
    // Fallback nếu không có ID, sử dụng tên để tìm kiếm
    if (!userId) {
      console.log('PostCard: No userId, using userName for search');
      navigation.navigate(ROUTES.STACK.PROFILE_VIEW, { 
        userId: null,
        userName: userName,
        searchBy: 'name'
      });
    } else {
      navigation.navigate(ROUTES.STACK.PROFILE_VIEW, { 
        userId: userId,
        userName: userName
      });
    }
  };

  const gapLarge = spacingGapLarge ?? gapMedium * 1.6;
  const avatarSize = responsiveSpacing(42, { min: 36, max: 52 });
  const pillHorizontal = Math.max(chipPaddingHorizontal + 2, 14);
  const pillVertical = Math.max(chipPaddingVertical - 1, 8);
  const coverHeight = responsiveSpacing(210, { min: 160, max: 260 });
  const iconSize = responsiveFontSize(16, { min: 14, max: 20 });
  const likeCountLabel =
    typeof post.likeCount === 'number' ? `Thích (${post.likeCount})` : 'Thích';
  const isLiked = Boolean(post.liked);
  const likeIconName = isLiked ? 'heart' : 'heart-outline';

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      className="border border-red-100 bg-white shadow-sm"
      style={{
        padding: cardPadding,
        borderRadius: cardRadius,
        marginBottom: gapLarge,
      }}
    >
      <View className="flex-row items-center" style={{ gap: gapSmall }}>
        <TouchableOpacity
          onPress={handleProfilePress}
          className="items-center justify-center bg-slate-200 overflow-hidden"
          style={{
            height: avatarSize,
            width: avatarSize,
            borderRadius: avatarSize / 2,
          }}
        >
          {authorAvatar ? (
            <Image
              source={{ uri: authorAvatar }}
              style={{
                height: avatarSize,
                width: avatarSize,
                borderRadius: avatarSize / 2,
              }}
              resizeMode="cover"
            />
          ) : (
            <Text className="font-semibold text-slate-700" style={{ fontSize: responsiveFontSize(13) }}>
              {initials}
            </Text>
          )}
        </TouchableOpacity>
        <View className="flex-1">
          <TouchableOpacity onPress={handleProfilePress}>
            <Text
              className="font-semibold text-red-600"
              style={{ fontSize: responsiveFontSize(14, { min: 12 }) }}
            >
              {post.author}
            </Text>
          </TouchableOpacity>
          <Text className="text-slate-400" style={{ fontSize: responsiveFontSize(12, { min: 10 }) }}>
            {formatDateTime(post.createdAt)}
          </Text>
        </View>
      </View>

      <Text
        className="font-bold text-red-600"
        style={{ marginTop: gapMedium, fontSize: responsiveFontSize(18) }}
      >
        {post.title}
      </Text>
      <Text
        className="text-slate-600"
        style={{
          marginTop: gapSmall,
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18, max: 24 }),
        }}
      >
        {previewText}{' '}
        {shouldClamp ? (
          <Text
            className="font-semibold text-red-600"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Xem thêm
          </Text>
        ) : null}
      </Text>

      {post.cover ? (
        <View
          className="overflow-hidden border border-slate-100"
          style={{
            marginTop: gapMedium,
            borderRadius: cardRadius,
          }}
        >
          <Image
            source={{ uri: post.cover }}
            style={{
              width: '100%',
              height: coverHeight,
            }}
          />
        </View>
      ) : null}

      <View
        className="flex-row"
        style={{
          marginTop: gapMedium,
          flexWrap: 'wrap',
          marginHorizontal: -(gapSmall / 2),
        }}
      >
        <PostCardAction
          icon={likeIconName}
          label={likeCountLabel}
          iconSize={iconSize}
          style={{
            marginHorizontal: gapSmall / 2,
            marginBottom: gapSmall,
          }}
          iconColor={isLiked ? '#DC2626' : '#9CA3AF'}
          onPress={() => {
            requireAuth(() => {
              if (onToggleLike) {
                onToggleLike(post);
              }
            }, 'thích bài viết này')();
          }}
          disabled={likePending}
          chipPadding={{
            horizontal: pillHorizontal,
            vertical: pillVertical,
          }}
          radius={cardRadius}
          gap={gapSmall}
          responsiveFontSize={responsiveFontSize}
        />
        <PostCardAction
          icon="comment-outline"
          label="Bình luận"
          iconSize={iconSize}
          style={{
            marginHorizontal: gapSmall / 2,
            marginBottom: gapSmall,
          }}
          onPress={() => {
            requireAuth(() => {
              // Navigate to post detail with comment focus
              const params = {};
              const slugCandidate =
                typeof post?.slug === 'string' && post.slug.trim() ? post.slug.trim() : null;
              if (slugCandidate) {
                params.postSlug = slugCandidate;
              }

              const resolveNumericId = (value) => {
                if (value === undefined || value === null || value === '') return null;
                const number = Number(value);
                return Number.isFinite(number) ? number : null;
              };

              const numericIdCandidates = [
                post?.articleId,
                post?.raw?.article_id,
                post?.raw?.id,
                post?.id,
              ];

              for (const candidate of numericIdCandidates) {
                const numeric = resolveNumericId(candidate);
                if (numeric !== null) {
                  params.postId = numeric;
                  break;
                }
              }

              if (Object.keys(params).length) {
                navigation.navigate(ROUTES.STACK.POST_DETAIL, { ...params, focusComments: true });
              }
            }, 'bình luận bài viết này')();
          }}
          chipPadding={{
            horizontal: pillHorizontal,
            vertical: pillVertical,
          }}
          radius={cardRadius}
          gap={gapSmall}
          responsiveFontSize={responsiveFontSize}
        />
        <PostCardAction
          icon="share-variant"
          label="Chia sẻ"
          iconSize={iconSize}
          style={{
            marginHorizontal: gapSmall / 2,
            marginBottom: gapSmall,
          }}
          onPress={handleShare}
          chipPadding={{
            horizontal: pillHorizontal,
            vertical: pillVertical,
          }}
          radius={cardRadius}
          gap={gapSmall}
          responsiveFontSize={responsiveFontSize}
        />
      </View>
    </TouchableOpacity>
  );
}

function PostCardAction({
  icon,
  label,
  iconSize,
  style,
  onPress,
  disabled,
  iconColor = '#DC2626',
  chipPadding,
  radius,
  gap,
  responsiveFontSize,
}) {
  const { responsiveSpacing } = useResponsiveSpacing();
  const minWidth = responsiveSpacing(108, { min: 92, max: 140 });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      className="flex-row items-center border border-red-200 bg-white"
      style={[
        {
          gap: gap / 1.4,
          borderRadius: radius,
          paddingHorizontal: chipPadding.horizontal,
          paddingVertical: chipPadding.vertical,
          flexGrow: 1,
          flexShrink: 1,
          minWidth,
          justifyContent: 'center',
        },
        disabled ? { opacity: 0.6 } : null,
        style,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={iconSize} color={iconColor} />
      <Text className="font-medium text-red-600" style={{ fontSize: responsiveFontSize(13) }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

