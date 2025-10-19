import { useCallback, useMemo } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { usePosts } from '../../../hooks/usePosts';
import { useTogglePostLike } from '../../../hooks/useTogglePostLike';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { formatDateTime } from '../../../utils/format';

const resolveArticleId = (target) => {
  if (!target) return null;
  const candidates = [
    target.articleId,
    target.raw?.article_id,
    target.raw?.id,
    target.id,
  ];

  for (const candidate of candidates) {
    const number = Number(candidate);
    if (Number.isFinite(number)) {
      return number;
    }
  }

  return null;
};

export default function PostDetail() {
  const route = useRoute();
  const {
    postId,
    postSlug,
    id: legacyId,
    slug: legacySlug,
  } = route.params ?? {};
  const detailTarget = useMemo(() => {
    const slugValue = (postSlug ?? legacySlug) ?? null;
    const idValue = postId ?? legacyId ?? null;
    if (!slugValue && (idValue === null || idValue === undefined)) {
      return undefined;
    }
    const target = {};
    if (slugValue) target.postSlug = slugValue;
    if (idValue !== null && idValue !== undefined) target.postId = idValue;
    return target;
  }, [legacyId, legacySlug, postId, postSlug]);
  const { detailQuery } = usePosts(detailTarget);
  const { toggleLike, toggleLikeStatus } = useTogglePostLike();
  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
    responsiveSpacing,
    listContentPaddingBottom,
  } = useResponsiveSpacing();

  if (!detailTarget) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{ padding: screenPadding }}
      >
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Bài viết không tồn tại hoặc đã bị xoá.
        </Text>
      </View>
    );
  }

  if (detailQuery.isLoading) {
    return <LoadingSpinner message="Đang tải bài viết..." />;
  }

  if (!detailQuery.data) {
    return (
      <View
        className="flex-1 bg-white"
        style={{
          paddingHorizontal: screenPadding,
          paddingTop: verticalPadding + statusBarOffset,
        }}
      >
        <EmptyState
          title="Không tìm thấy bài viết"
          description="Có thể bài viết đã bị gỡ hoặc liên kết không chính xác."
        />
      </View>
    );
  }

  const post = detailQuery.data;
  const articleId = resolveArticleId(post);
  const likeLabel =
    typeof post.likeCount === 'number' ? `Th\u00EDch (${post.likeCount})` : 'Th\u00EDch';
  const isLiked = Boolean(post.liked);
  const likeIcon = isLiked ? 'heart' : 'heart-outline';
  const likeActiveColor = '#DC2626';
  const likeInactiveColor = '#9CA3AF';
  const likeIconColor = isLiked ? likeActiveColor : likeInactiveColor;
  const likeTextColor = isLiked ? likeActiveColor : likeInactiveColor;
  const isLikePending = toggleLikeStatus === 'pending';

  const handleToggleLike = useCallback(async () => {
    if (!Number.isFinite(articleId)) {
      console.warn('Cannot toggle like, invalid article id', post?.id);
      return;
    }
    try {
      await toggleLike(articleId);
    } catch (error) {
      console.warn('Toggle like failed', error);
    }
  }, [articleId, post, toggleLike]);
  const initials =
    post.author
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'AC';

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: listContentPaddingBottom,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        className="border border-red-100 bg-white shadow-sm"
        style={{
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapMedium,
        }}
      >
        <View
          className="flex-row items-center"
          style={{ gap: gapSmall }}
        >
          <View
            className="items-center justify-center bg-slate-200"
            style={{
              height: responsiveSpacing(48, { min: 42, max: 56 }),
              width: responsiveSpacing(48, { min: 42, max: 56 }),
              borderRadius: responsiveSpacing(48, { min: 42, max: 56 }) / 2,
            }}
          >
            <Text
              className="font-semibold text-slate-700"
              style={{ fontSize: responsiveFontSize(13) }}
            >
              {initials}
            </Text>
          </View>
          <View className="flex-1">
            <Text
              className="font-semibold text-red-600"
              style={{ fontSize: responsiveFontSize(15, { min: 13 }) }}
            >
              {post.author}
            </Text>
            <Text
              className="text-slate-400"
              style={{ fontSize: responsiveFontSize(12, { min: 10 }) }}
            >
              {formatDateTime(post.createdAt)}
            </Text>
          </View>
        </View>

        <View style={{ gap: gapSmall }}>
          <Text
            className="font-bold text-slate-900"
            style={{ fontSize: responsiveFontSize(24) }}
          >
            {post.title}
          </Text>
          <Text
            className="text-slate-600"
            style={{
              fontSize: responsiveFontSize(14),
              lineHeight: responsiveFontSize(20, { min: 18 }),
            }}
          >
            {post.excerpt}
          </Text>
        </View>

        {post.cover ? (
          <View
            className="border border-slate-100"
            style={{
              marginTop: gapSmall,
              borderRadius: cardRadius,
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: post.cover }}
              style={{
                width: '100%',
                height: responsiveSpacing(240, { min: 200, max: 320 }),
              }}
            />
          </View>
        ) : null}

        <View style={{ gap: gapSmall }}>
          <Text
            className="font-semibold text-slate-900"
            style={{ fontSize: responsiveFontSize(16) }}
          >
            Nội dung chi tiết
          </Text>
          <Text
            className="text-slate-600"
            style={{
              fontSize: responsiveFontSize(14),
              lineHeight: responsiveFontSize(22, { min: 20 }),
            }}
          >
            Nội dung chi tiết của bài viết sẽ được hiển thị tại đây. Bạn có thể mở rộng dữ liệu từ API thực tế để trình bày đầy đủ văn bản, hình ảnh hoặc tài liệu đính kèm.
          </Text>
        </View>

        <View
          className="flex-row"
          style={{
            marginTop: gapMedium,
            flexWrap: 'wrap',
            marginHorizontal: -(gapSmall / 2),
          }}
        >
          <ActionPill
            icon={likeIcon}
            label={likeLabel}
            onPress={handleToggleLike}
            disabled={isLikePending}
            iconColor={likeIconColor}
            textColor={likeTextColor}
            style={{
              marginHorizontal: gapSmall / 2,
              marginBottom: gapSmall,
            }}
          />
          <ActionPill
            icon="comment-outline"
            label="Bình luận"
            style={{
              marginHorizontal: gapSmall / 2,
              marginBottom: gapSmall,
            }}
          />
          <ActionPill
            icon="share-variant"
            label="Chia sẻ"
            style={{
              marginHorizontal: gapSmall / 2,
              marginBottom: gapSmall,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function ActionPill({
  icon,
  label,
  style: extraStyle,
  onPress,
  disabled = false,
  iconColor = '#DC2626',
  textColor = '#DC2626',
}) {
  const {
    cardRadius,
    chipPaddingHorizontal,
    chipPaddingVertical,
    gapSmall,
    responsiveFontSize,
    responsiveSpacing,
  } = useResponsiveSpacing();
  const minWidth = responsiveSpacing(108, { min: 92, max: 144 });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      className="flex-row items-center border border-red-200 bg-white"
      style={[
        {
          borderRadius: cardRadius,
          paddingHorizontal: chipPaddingHorizontal + 4,
          paddingVertical: chipPaddingVertical,
          gap: gapSmall / 1.3,
          flexGrow: 1,
          flexShrink: 1,
          minWidth,
          justifyContent: 'center',
        },
        extraStyle,
        disabled ? { opacity: 0.6 } : null,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={responsiveFontSize(18)} color={iconColor} />
      <Text
        className="font-semibold"
        style={{ fontSize: responsiveFontSize(13), color: textColor }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
