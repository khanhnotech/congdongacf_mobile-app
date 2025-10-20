import { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { usePosts } from '../../../hooks/usePosts';
import { useTogglePostLike } from '../../../hooks/useTogglePostLike';
import { usePostComments } from '../../../hooks/usePostComments';
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

const splitIntoParagraphs = (value) => {
  if (!value) return [];
  return String(value)
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
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

  const post = detailQuery?.data ?? null;

  const introParagraphs = useMemo(() => {
    const source =
      post?.excerpt ??
      post?.summary ??
      post?.raw?.summary ??
      '';
    return splitIntoParagraphs(source);
  }, [post]);

  const contentParagraphs = useMemo(() => {
    if (!post) return [];
    const source =
      post.content ??
      post.raw?.content ??
      post.raw?.body ??
      post.raw?.article_body ??
      '';
    return splitIntoParagraphs(source);
  }, [post]);

  const sections = useMemo(() => {
    if (!post?.raw?.sections) return [];
    return [...post.raw.sections]
      .sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
      .map((section, index) => ({
        ...section,
        key: String(section?.id ?? `section-${index}`),
        title: section?.title ?? `Section ${index + 1}`,
        paragraphs: splitIntoParagraphs(section?.content ?? ''),
        media: Array.isArray(section?.media)
          ? [...section.media]
              .filter((item) => item?.media_url)
              .sort(
                (a, b) =>
                  (a?.media_position ?? a?.position ?? 0) -
                  (b?.media_position ?? b?.position ?? 0),
              )
          : [],
      }))
      .filter((section) => section.paragraphs.length || section.media.length);
  }, [post]);

  const articleId = useMemo(() => {
    const resolved = resolveArticleId(post);
    if (Number.isFinite(resolved)) {
      return resolved;
    }
    const fallbackCandidates = [
      detailTarget?.postId,
      detailTarget?.id,
      detailTarget?.articleId,
    ];
    for (const candidate of fallbackCandidates) {
      const numeric = Number(candidate);
      if (Number.isFinite(numeric)) {
        return numeric;
      }
    }
    return undefined;
  }, [detailTarget, post]);

  const {
    comments,
    isLoading: commentsLoading,
    error: commentsError,
    hasNextPage: hasMoreComments,
    fetchNextPage: fetchMoreComments,
    isFetchingNextPage: isFetchingMoreComments,
    createComment,
    createStatus: commentCreateStatus,
  } = usePostComments(articleId, { pageSize: 10 });

  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState(null);

  const isCommentSubmitting = commentCreateStatus === 'pending';
  const commentsErrorMessage =
    commentsError?.message ?? 'Không thể tải bình luận. Thử lại sau.';
  const canSubmitComment = Number.isFinite(articleId);

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
  }, [articleId, post?.id, toggleLike]);

  const handleSubmitComment = useCallback(async () => {
    const trimmed = commentText.trim();
    if (!trimmed || !Number.isFinite(articleId)) {
      return;
    }
    try {
      setCommentError(null);
      await createComment(trimmed);
      setCommentText('');
    } catch (error) {
      const message =
        error?.message ?? 'Không thể gửi bình luận thử lại sau.';
      setCommentError(message);
    }
  }, [articleId, commentText, createComment]);

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
          Bai viet khong ton tai hoac da bi xoa.
        </Text>
      </View>
    );
  }

  if (detailQuery.isLoading) {
    return <LoadingSpinner message="Đang tải bài viết..." />;
  }

  if (!post) {
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
          description="Có thể bài viết đã bị gỡ bỏ hoặc liên kết không chính xát."
        />
      </View>
    );
  }

  const likeLabel =
    typeof post.likeCount === 'number' ? `Thích (${post.likeCount})` : 'Thích';
  const isLiked = Boolean(post.liked);
  const likeIcon = isLiked ? 'heart' : 'heart-outline';
  const likeActiveColor = '#DC2626';
  const likeInactiveColor = '#9CA3AF';
  const likeIconColor = isLiked ? likeActiveColor : likeInactiveColor;
  const likeTextColor = isLiked ? likeActiveColor : likeInactiveColor;
  const isLikePending = toggleLikeStatus === 'pending';

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
          {introParagraphs.length
            ? introParagraphs.map((paragraph, index) => (
                <Text
                  key={`intro-${index}`}
                  className="text-slate-600"
                  style={{
                    fontSize: responsiveFontSize(14),
                    lineHeight: responsiveFontSize(20, { min: 18 }),
                  }}
                >
                  {paragraph.replace(/\r?\n/g, '\n')}
                </Text>
              ))
            : null}
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
        {sections.length ? (
          <View style={{ gap: gapMedium, marginTop: gapMedium }}>
            {sections.map((section) => {
              const sectionMediaItems = section.media;
              return (
                <View
                  key={section.key}
                  className=""
                  style={{
                    borderRadius: cardRadius,
                    gap: gapSmall,
                  }}
                >
                  <Text
                    className="font-semibold text-slate-900"
                    style={{ fontSize: responsiveFontSize(16) }}
                  >
                    {section.title}
                  </Text>
                  {section.paragraphs.length
                    ? section.paragraphs.map((paragraph, index) => (
                        <Text
                          key={`${section.key}-paragraph-${index}`}
                          className="text-slate-600"
                          style={{
                            fontSize: responsiveFontSize(14),
                            lineHeight: responsiveFontSize(22, { min: 20 }),
                          }}
                        >
                          {paragraph.replace(/\r?\n/g, '\n')}
                        </Text>
                      ))
                    : null}
                  {sectionMediaItems.map((mediaItem, index) => (
                    <View
                      key={`${section.key}-media-${mediaItem.id ?? index}`}
                      className="border border-slate-200"
                      style={{
                        borderRadius: cardRadius,
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        source={{ uri: mediaItem.media_url }}
                        style={{
                          width: '100%',
                          height: responsiveSpacing(220, { min: 180, max: 320 }),
                        }}
                      />
                      {mediaItem.caption ? (
                        <Text
                          className="text-slate-500"
                          style={{
                            paddingTop: gapSmall / 2,
                            fontSize: responsiveFontSize(12),
                          }}
                        >
                          {mediaItem.caption}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              );
            })}
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
        <View
          className="border-t border-slate-200"
          style={{ paddingTop: gapMedium, gap: gapSmall }}
        >
          <Text
            className="font-semibold text-slate-900"
            style={{ fontSize: responsiveFontSize(18) }}
          >
            Binh luan
          </Text>
          <View
            className="border border-slate-200 bg-white"
            style={{
              borderRadius: cardRadius,
              padding: cardPadding,
              gap: gapSmall,
            }}
          >
            <TextInput
              multiline
              value={commentText}
              onChangeText={(value) => {
                setCommentText(value);
                if (commentError) {
                  setCommentError(null);
                }
              }}
              placeholder="Nhập bình luận của bạn..."
              placeholderTextColor="#94A3B8"
              className="text-slate-700"
              style={{
                minHeight: responsiveSpacing(96, { min: 80, max: 140 }),
                fontSize: responsiveFontSize(14),
                lineHeight: responsiveFontSize(20, { min: 18 }),
              }}
              editable={canSubmitComment}
              scrollEnabled
            />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSubmitComment}
              disabled={
                !canSubmitComment ||
                isCommentSubmitting ||
                !commentText.trim()
              }
              className="items-center justify-center bg-red-600"
              style={{
                borderRadius: cardRadius,
                paddingVertical: gapSmall,
                opacity:
                  !canSubmitComment || isCommentSubmitting || !commentText.trim()
                    ? 0.6
                    : 1,
              }}
            >
              <Text
                className="font-semibold text-white"
                style={{ fontSize: responsiveFontSize(14) }}
              >
                {isCommentSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
              </Text>
            </TouchableOpacity>
          </View>
          {commentError ? (
            <Text
              className="text-red-500"
              style={{ fontSize: responsiveFontSize(13) }}
            >
              {commentError}
            </Text>
          ) : null}
          {!canSubmitComment ? (
            <Text
              className="text-slate-500"
              style={{ fontSize: responsiveFontSize(13) }}
            >
              Không thể gửi bình luận cho bài viết này
            </Text>
          ) : null}
          {commentsLoading ? (
            <View className="items-center justify-center" style={{ paddingVertical: gapMedium }}>
              <ActivityIndicator size="small" color="#DC2626" />
            </View>
          ) : commentsError ? (
            <Text
              className="text-slate-500"
              style={{ fontSize: responsiveFontSize(14) }}
            >
              {commentsErrorMessage}
            </Text>
          ) : comments.length ? (
            <View style={{ gap: gapSmall }}>
              {comments.map((comment) => (
                <View
                  key={comment.id}
                  className="border border-slate-200 bg-white"
                  style={{
                    borderRadius: cardRadius,
                    padding: cardPadding,
                    gap: gapSmall / 2,
                  }}
                >
                  <Text
                    className="font-semibold text-slate-900"
                    style={{ fontSize: responsiveFontSize(14) }}
                  >
                    {comment.author}
                  </Text>
                  <Text
                    className="text-slate-400"
                    style={{ fontSize: responsiveFontSize(12) }}
                  >
                    {formatDateTime(comment.createdAt)}
                  </Text>
                  <Text
                    className="text-slate-600"
                    style={{
                      fontSize: responsiveFontSize(14),
                      lineHeight: responsiveFontSize(20, { min: 18 }),
                    }}
                  >
                    {comment.content}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text
              className="text-slate-500"
              style={{ fontSize: responsiveFontSize(14) }}
            >
              Chưa có bình luận nào hãy là người đầu tiên chia sẻ ý kiến!
            </Text>
          )}
          {hasMoreComments ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => fetchMoreComments()}
              disabled={isFetchingMoreComments}
              className="items-center justify-center border border-slate-200 bg-white"
              style={{
                borderRadius: cardRadius,
                paddingVertical: gapSmall,
                marginTop: gapSmall,
                opacity: isFetchingMoreComments ? 0.6 : 1,
              }}
            >
              {isFetchingMoreComments ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <Text
                  className="font-semibold text-red-600"
                  style={{ fontSize: responsiveFontSize(13) }}
                >
                  Tai them binh luan
                </Text>
              )}
            </TouchableOpacity>
          ) : null}
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
