import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../hooks/useAuth';
import { useProfileDetail, useProfileArticles } from '../../../hooks/useProfile';
import { useTogglePostLike } from '../../../hooks/useTogglePostLike';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES, QUERY_KEYS } from '../../../utils/constants';
import { formatDateTime, formatName } from '../../../utils/format';

const STAT_COLORS = ['#2563eb', '#047857', '#0891b2', '#f59e0b'];
const DEFAULT_AVATAR = 'https://dummyimage.com/128x128/0f172a/ffffff&text=ACF';
const DEFAULT_COVER = 'https://dummyimage.com/900x360/e2e8f0/1f2937&text=ACF';
const DEFAULT_ARTICLE_IMAGE = 'https://dummyimage.com/640x360/e2e8f0/1f2937&text=ACF';

const ensureDisplay = (value) => {
  if (value === undefined || value === null) return 'Chưa cập nhật';
  const text = String(value).trim();
  return text.length ? text : 'Chưa cập nhật';
};

const formatDateDisplay = (value) => {
  if (!value) return 'Chưa cập nhật';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật';
  return date.toLocaleDateString('vi-VN');
};

const buildFallbackPersonalInfo = (user) => {
  const joinDisplay = formatDateDisplay(
    user?.createdAt ?? user?.raw?.created_at ?? user?.raw?.user?.created_at ?? null,
  );

  return [
    { key: 'fullName', label: 'Họ tên', value: formatName(user), display: ensureDisplay(formatName(user)) },
    { key: 'email', label: 'Email', value: user?.email ?? null, display: ensureDisplay(user?.email) },
    { key: 'phone', label: 'Số điện thoại', value: user?.phone ?? null, display: ensureDisplay(user?.phone) },
    { key: 'birthYear', label: 'Năm sinh', value: user?.raw?.profile?.birth_year ?? null, display: ensureDisplay(user?.raw?.profile?.birth_year) },
    { key: 'occupation', label: 'Nghề nghiệp', value: user?.raw?.profile?.workplace ?? null, display: ensureDisplay(user?.raw?.profile?.workplace) },
    { key: 'education', label: 'Nơi học tập', value: user?.raw?.profile?.studied_at ?? null, display: ensureDisplay(user?.raw?.profile?.studied_at) },
    { key: 'address', label: 'Địa chỉ', value: user?.raw?.profile?.live_at ?? null, display: ensureDisplay(user?.raw?.profile?.live_at) },
    { key: 'joinedAt', label: 'Tham gia', value: user?.createdAt ?? null, display: joinDisplay },
  ];
};

const FALLBACK_STATS = [
  { key: 'articles', label: 'Bài viết', value: 0 },
  { key: 'followers', label: 'Người theo dõi', value: 0 },
  { key: 'following', label: 'Đang theo dõi', value: 0 },
  { key: 'likes', label: 'Lượt thích', value: 0 },
];

export default function MyProfile() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { toggleLike, toggleLikeStatus } = useTogglePostLike();
  const queryClient = useQueryClient();
  const profileQuery = useProfileDetail(user?.id);
  const articleParams = useMemo(() => ({ limit: 10 }), []);
  const profileArticlesQuery = useProfileArticles(user?.id, articleParams);
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
    buttonPaddingVertical,
    listContentPaddingBottom,
  } = useResponsiveSpacing();
  const profileArticlesKey = useMemo(
    () => (user?.id ? QUERY_KEYS.PROFILE.ARTICLES(user.id, articleParams) : null),
    [user?.id, articleParams],
  );

  const handleRefresh = useCallback(async () => {
    if (!user?.id) return;
    try {
      setRefreshing(true);
      await Promise.all([
        profileQuery.refetch(),
        profileArticlesQuery.refetch(),
      ]);
    } catch (error) {
      console.warn('Refresh profile failed', error);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, profileQuery, profileArticlesQuery]);

  // Refresh data when screen comes into focus (e.g., returning from PostDetail)
  useFocusEffect(
    useCallback(() => {
      // Only refresh if we have user and articles data, and not already refreshing
      if (user?.id && profileArticlesQuery.data?.items?.length > 0 && !refreshing) {
        // Refresh profile articles to update like counts and comments
        profileArticlesQuery.refetch();
        // Also refresh profile data to update stats (like count, etc.)
        profileQuery.refetch();
      }
    }, [user?.id, profileArticlesQuery.data?.items?.length, refreshing, profileArticlesQuery.refetch, profileQuery.refetch])
  );

  if (!user) {
    return (
      <View
        className="flex-1 items-center justify-center bg-white"
        style={{ padding: screenPadding }}
      >
        <Text
          className="text-slate-500"
          style={{ fontSize: responsiveFontSize(14) }}
        >
          Bạn chưa đăng nhập. Hãy đăng nhập để xem hồ sơ.
        </Text>
      </View>
    );
  }

  const profileDetail = profileQuery.data ?? null;
  const fallbackInfo = useMemo(() => buildFallbackPersonalInfo(user), [user]);

  const personalInfoLookup = useMemo(() => {
    if (profileDetail?.personalInfoMap) return profileDetail.personalInfoMap;
    const map = {};
    fallbackInfo.forEach((item) => {
      if (item?.key) map[item.key] = item;
    });
    return map;
  }, [fallbackInfo, profileDetail?.personalInfoMap]);

  const stats = profileDetail?.stats?.length ? profileDetail.stats : FALLBACK_STATS;

  const avatarUri = profileDetail?.avatar ?? user.avatar ?? null;
  const avatarSource = { uri: avatarUri || DEFAULT_AVATAR };
  const coverUri = profileDetail?.cover ?? user.cover ?? null;
  const coverSource = { uri: coverUri || DEFAULT_COVER };

  const nameDisplay =
    personalInfoLookup.fullName?.display ?? ensureDisplay(formatName(user));
  const bioDisplay =
    personalInfoLookup.bio?.display ?? ensureDisplay(user.bio);

  const isProfileLoading = profileQuery.isLoading && !profileDetail;
  const profileErrorMessage = profileQuery.isError
    ? 'Không thể tải thông tin hồ sơ. Đang hiển thị dữ liệu tạm thời.'
    : null;

  const profileArticles = profileArticlesQuery.data?.items ?? [];
  const isArticlesLoading = profileArticlesQuery.isLoading;
  const articlesError = profileArticlesQuery.error;

  const handleOpenArticleDetail = (article) => {
    const articleId =
      article?.id ??
      article?.articleId ??
      article?.article_id ??
      article?.raw?.article_id ??
      article?.raw?.id;
    const articleSlug = article?.slug ?? article?.raw?.slug ?? null;
    if (!articleId && !articleSlug) return;
    navigation.navigate(ROUTES.STACK.POST_DETAIL, {
      postId: articleId,
      postSlug: articleSlug,
    });
  };

  const handleToggleLike = (article) => {
    const articleId =
      article?.id ??
      article?.articleId ??
      article?.article_id ??
      article?.raw?.article_id ??
      article?.raw?.id;
    if (!articleId) return;
    toggleLike(articleId)
      .then(({ liked: nextLiked, likeCount: nextLikeCount }) => {
        if (!profileArticlesKey) return;
        queryClient.setQueryData(profileArticlesKey, (previous) => {
          if (!previous) return previous;

          const updateItems = (items) => {
            if (!Array.isArray(items)) return items;
            let changed = false;
            const mapped = items.map((item) => {
              const itemId =
                item?.id ??
                item?.articleId ??
                item?.article_id ??
                item?.raw?.article_id ??
                item?.raw?.id;
              if (Number(itemId) !== Number(articleId)) return item;
              changed = true;
              const fallbackCount = Number(item.likeCount ?? item.raw?.like_count ?? 0);
              const resolvedCount = Number.isFinite(nextLikeCount)
                ? nextLikeCount
                : nextLiked
                  ? fallbackCount + 1
                  : Math.max(fallbackCount - 1, 0);
              return {
                ...item,
                liked: Boolean(nextLiked),
                likeCount: resolvedCount,
                raw: item.raw
                  ? { ...item.raw, like_count: resolvedCount, liked: Boolean(nextLiked) }
                  : item.raw,
              };
            });
            return changed ? mapped : items;
          };

          const nextItems = updateItems(previous.items);
          const nextRaw = previous.raw
            ? { ...previous.raw, items: updateItems(previous.raw.items ?? []) }
            : previous.raw;

          return {
            ...previous,
            items: nextItems,
            raw: nextRaw,
          };
        });
      })
      .catch((error) => {
        console.warn('Toggle like failed', error);
      });
  };

  const infoKeys = [
    'email',
    'phone',
    'birthYear',
    'occupation',
    'education',
    'address',
    'joinedAt',
  ];
  const personalInfoItems = infoKeys
    .map((key) => personalInfoLookup[key])
    .filter(Boolean);

  return (
    <ScrollView
      className="flex-1 bg-slate-100"
      style={{ paddingHorizontal: screenPadding }}
      contentContainerStyle={{
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: listContentPaddingBottom,
        gap: gapMedium,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#DC2626"
          colors={['#DC2626']}
        />
      }
    >
      <View
        className="bg-white shadow-sm"
        style={{
          borderRadius: cardRadius,
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Image
          source={coverSource}
          style={{
            width: '100%',
            height: cardPadding * 10,
            backgroundColor: '#e2e8f0',
          }}
          resizeMode="cover"
        />
        <Image
          source={avatarSource}
          style={{
            height: 112,
            width: 112,
            borderRadius: 56,
            borderWidth: 4,
            borderColor: '#DC2626',
            marginTop: -cardPadding * 2.2,
            backgroundColor: '#0f172a',
          }}
        />
        <View style={{ width: '100%', padding: cardPadding, gap: gapSmall }}>
          <Text
            className="font-bold text-slate-900 text-center"
            style={{ fontSize: responsiveFontSize(24) }}
          >
            {nameDisplay}
          </Text>
          <Text
            className="text-center text-slate-600"
            style={{
              fontSize: responsiveFontSize(14),
              lineHeight: responsiveFontSize(20, { min: 18 }),
            }}
          >
            {bioDisplay}
          </Text>
        </View>
      </View>

      <View
        className="bg-white shadow-sm"
        style={{
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        {isProfileLoading ? (
          <View
            className="items-center justify-center"
            style={{ paddingVertical: gapMedium }}
          >
            <ActivityIndicator size="small" color="#DC2626" />
          </View>
        ) : (
          <>
            {profileErrorMessage ? (
              <Text
                className="text-slate-500"
                style={{ fontSize: responsiveFontSize(13) }}
              >
                {profileErrorMessage}
              </Text>
            ) : null}

            <Text
              className="font-semibold text-slate-900"
              style={{ fontSize: responsiveFontSize(16) }}
            >
              Thông tin cá nhân
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: gapSmall,
              }}
            >
              {personalInfoItems.map((item) => (
                <View
                  key={item.key}
                  style={{
                    flexBasis: '48%',
                    paddingVertical: gapSmall * 0.3,
                  }}
                >
                  <Text style={{ fontSize: responsiveFontSize(13) }}>
                    <Text
                      className="font-semibold text-slate-700"
                      style={{ fontSize: responsiveFontSize(13) }}
                    >
                      {item.label}:
                    </Text>{' '}
                    <Text className="text-slate-600">
                      {ensureDisplay(item.display)}
                    </Text>
                  </Text>
                </View>
              ))}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: gapSmall,
              }}
            >
              {stats.slice(0, 4).map((stat, index) => {
                const color = STAT_COLORS[index % STAT_COLORS.length];
                return (
                  <View
                    key={stat.key ?? `${stat.label}-${index}`}
                    style={{
                      flex: 1,
                      borderRadius: cardRadius - 6,
                      backgroundColor: color,
                      paddingVertical: gapSmall * 1.2,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      className="font-semibold text-white"
                      style={{ fontSize: responsiveFontSize(18) }}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      className="text-white/80 text-center"
                      style={{ fontSize: responsiveFontSize(12) }}
                    >
                      {stat.label}
                    </Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.STACK.EDIT_PROFILE)}
              activeOpacity={0.85}
              className="bg-red-500"
              style={{
                marginTop: gapSmall,
                borderRadius: cardRadius - 3,
                paddingVertical: buttonPaddingVertical,
              }}
            >
              <Text
                className="text-center font-semibold text-white"
                style={{ fontSize: responsiveFontSize(15) }}
              >
                Chỉnh sửa thông tin cá nhân
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View
        className="bg-white shadow-sm"
        style={{
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        <Text
          className="font-semibold text-slate-900"
          style={{ fontSize: responsiveFontSize(18) }}
        >
          Bài viết của bạn
        </Text>
        <Text
          className="text-slate-500"
          style={{
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Các bài viết gần đây của bạn sẽ được hiển thị tại đây.
        </Text>

        {isArticlesLoading ? (
          <View
            className="items-center justify-center"
            style={{ paddingVertical: gapMedium }}
          >
            <ActivityIndicator size="small" color="#DC2626" />
          </View>
        ) : articlesError ? (
          <Text
            className="text-slate-500"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Không thể tải danh sách bài viết. Vui lòng thử lại sau.
          </Text>
        ) : profileArticles.length ? (
          <View style={{ gap: gapMedium }}>
            {profileArticles.map((article) => {
              const articleDate =
                article.publishedAt ??
                article.createdAt ??
                article.raw?.published_at ??
                article.raw?.created_at ??
                null;
              const thumbnail =
                article.imageUrl ?? article.raw?.main_image_url ?? DEFAULT_ARTICLE_IMAGE;
              const likeCount =
                article.likeCount ??
                article.likes ??
                article.raw?.like_count ??
                article.raw?.likes ??
                0;
              const commentCount =
                article.commentCount ??
                article.comments ??
                article.raw?.comment_count ??
                article.raw?.comments ??
                0;
              const liked = Boolean(article.liked ?? article.raw?.liked);
              return (
                <TouchableOpacity
                  key={article.id ?? article.slug ?? `article-${Math.random()}`}
                  activeOpacity={0.85}
                  onPress={() => handleOpenArticleDetail(article)}
                  className="border border-red-100 bg-white shadow-sm"
                  style={{
                    padding: cardPadding,
                    borderRadius: cardRadius,
                    gap: gapMedium,
                  }}
                >
                  <View className="flex-row items-center" style={{ gap: gapSmall }}>
                    <Image
                      source={{ uri: article.authorAvatar ?? article.raw?.author_avatar ?? avatarSource.uri }}
                      style={{
                        width: cardPadding * 2.2,
                        height: cardPadding * 2.2,
                        borderRadius: (cardPadding * 2.2) / 2,
                        backgroundColor: '#e2e8f0',
                      }}
                      resizeMode="cover"
                    />
                    <View style={{ flex: 1, gap: gapSmall * 0.2 }}>
                      <Text
                        className="font-semibold text-red-600"
                        style={{ fontSize: responsiveFontSize(14) }}
                        numberOfLines={1}
                      >
                        {article.author ?? article.raw?.author_name ?? nameDisplay}
                      </Text>
                        {article.status === 'pending' ? (
                      <Text
                        className="font-semibold text-amber-500"
                        style={{ fontSize: responsiveFontSize(12) }}
                      >
                        Chờ duyệt
                      </Text>
                    ) : null}
                      <Text
                        className="text-slate-400"
                        style={{ fontSize: responsiveFontSize(12) }}
                      >
                        {articleDate ? formatDateTime(articleDate) : 'Chưa cập nhật'}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-start justify-between" style={{ gap: gapSmall }}>
                    <Text
                      className="font-semibold text-slate-900"
                      style={{ fontSize: responsiveFontSize(16), flex: 1 }}
                      numberOfLines={2}
                    >
                      {article.title || 'Bài viết'}
                    </Text>
                  </View>

                  {article.summary ? (
                    <Text
                      className="text-slate-600"
                      style={{ fontSize: responsiveFontSize(13) }}
                      numberOfLines={3}
                    >
                      {article.summary}
                    </Text>
                  ) : null}

                  <Image
                    source={{ uri: thumbnail }}
                    style={{
                      width: '100%',
                      height: cardPadding * 6,
                      borderRadius: cardRadius - 6,
                      backgroundColor: '#e2e8f0',
                    }}
                    resizeMode="cover"
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: gapSmall,
                      marginTop: gapSmall,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleToggleLike(article)}
                      activeOpacity={0.8}
                      disabled={toggleLikeStatus === 'pending'}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: gapSmall * 0.4,
                        borderRadius: cardRadius,
                        borderWidth: 1,
                        borderColor: liked ? '#FEE2E2' : '#F3F4F6',
                        paddingVertical: gapSmall * 0.6,
                        opacity: toggleLikeStatus === 'pending' ? 0.6 : 1,
                      }}
                    >
                      <MaterialCommunityIcons
                        name={liked ? 'heart' : 'heart-outline'}
                        size={responsiveFontSize(16)}
                        color={liked ? "#DC2626" : "#9CA3AF"}
                      />
                      <Text
                        className={`font-medium ${liked ? 'text-red-600' : 'text-gray-500'}`}
                        style={{ fontSize: responsiveFontSize(13) }}
                      >
                        {`Thích (${likeCount})`}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleOpenArticleDetail(article)}
                      activeOpacity={0.8}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: gapSmall * 0.4,
                        borderRadius: cardRadius,
                        borderWidth: 1,
                        borderColor: '#FEE2E2',
                        paddingVertical: gapSmall * 0.6,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="comment-outline"
                        size={responsiveFontSize(16)}
                        color="#DC2626"
                      />
                      <Text
                        className="font-medium text-red-600"
                        style={{ fontSize: responsiveFontSize(13) }}
                      >
                        {`Bình luận (${commentCount})`}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleOpenArticleDetail(article)}
                      activeOpacity={0.8}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: gapSmall * 0.4,
                        borderRadius: cardRadius,
                        borderWidth: 1,
                        borderColor: '#FEE2E2',
                        paddingVertical: gapSmall * 0.6,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="share-variant"
                        size={responsiveFontSize(16)}
                        color="#DC2626"
                      />
                      <Text
                        className="font-medium text-red-600"
                        style={{ fontSize: responsiveFontSize(13) }}
                      >
                        Chia sẻ
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text
            className="text-slate-500"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Bạn chưa có bài viết nào.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
