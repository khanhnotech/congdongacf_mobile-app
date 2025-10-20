import { useMemo } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { useProfileDetail, useProfileArticles } from '../../../hooks/useProfile';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';
import { formatDateTime, formatName } from '../../../utils/format';
import PostCard from '../../../components/PostCard';

const STAT_COLORS = ['#2563eb', '#047857', '#0891b2', '#f59e0b'];
const DEFAULT_AVATAR = 'https://dummyimage.com/128x128/0f172a/ffffff&text=ACF';
const DEFAULT_COVER = 'https://dummyimage.com/900x360/e2e8f0/1f2937&text=ACF';
const DEFAULT_ARTICLE_IMAGE = 'https://dummyimage.com/640x360/e2e8f0/1f2937&text=ACF';

const ensureDisplay = (value) => {
  if (value === undefined || value === null) return 'Chua cap nhat';
  const text = String(value).trim();
  return text.length ? text : 'Chua cap nhat';
};

const formatDateDisplay = (value) => {
  if (!value) return 'Chua cap nhat';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chua cap nhat';
  return date.toLocaleDateString('vi-VN');
};

const buildFallbackPersonalInfo = (user) => {
  const joinDisplay = formatDateDisplay(
    user?.createdAt ??
      user?.raw?.created_at ??
      user?.raw?.user?.created_at ??
      null,
  );

  return [
    { key: 'fullName', label: 'Ho ten', value: formatName(user), display: ensureDisplay(formatName(user)) },
    { key: 'email', label: 'Email', value: user?.email ?? null, display: ensureDisplay(user?.email) },
    { key: 'phone', label: 'So dien thoai', value: user?.phone ?? null, display: ensureDisplay(user?.phone) },
    { key: 'address', label: 'Dia chi', value: user?.raw?.profile?.live_at ?? null, display: ensureDisplay(user?.raw?.profile?.live_at) },
    { key: 'bio', label: 'Mo ta', value: user?.bio ?? null, display: ensureDisplay(user?.bio) },
  ];
};

const FALLBACK_STATS = [
  { key: 'articles', label: 'Bai viet', value: 0 },
  { key: 'followers', label: 'Nguoi theo doi', value: 0 },
  { key: 'following', label: 'Dang theo doi', value: 0 },
  { key: 'likes', label: 'Luot thich', value: 0 },
];

export default function MyProfile() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const profileQuery = useProfileDetail(user?.id);
  const profileArticlesQuery = useProfileArticles(user?.id, { limit: 10 });
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
          Ban chua dang nhap. Hay dang nhap de xem ho so.
        </Text>
      </View>
    );
  }

  const profileDetail = profileQuery.data ?? null;
  const infoFallback = useMemo(() => buildFallbackPersonalInfo(user), [user]);

  const personalInfo = profileDetail?.personalInfo?.length
    ? profileDetail.personalInfo
    : infoFallback;

  const personalInfoMap = useMemo(() => {
    if (profileDetail?.personalInfoMap) return profileDetail.personalInfoMap;
    const map = {};
    personalInfo.forEach((item) => {
      if (item?.key) map[item.key] = item;
    });
    return map;
  }, [personalInfo, profileDetail?.personalInfoMap]);

  const stats = profileDetail?.stats?.length ? profileDetail.stats : FALLBACK_STATS;

  const avatarUri = profileDetail?.avatar ?? user.avatar ?? null;
  const avatarSource = { uri: avatarUri || DEFAULT_AVATAR };
  const coverUri = profileDetail?.cover ?? user.cover ?? null;
  const coverSource = { uri: coverUri || DEFAULT_COVER };

  const nameDisplay =
    personalInfoMap.fullName?.display ?? ensureDisplay(formatName(user));
  const bioDisplay =
    personalInfoMap.bio?.display ?? ensureDisplay(user.bio);

  const isProfileLoading = profileQuery.isLoading && !profileDetail;
  const profileErrorMessage = profileQuery.isError
    ? 'Khong the tai thong tin ho so. Dang hien thi du lieu tam thoi.'
    : null;

  const articlesData = profileArticlesQuery.data ?? null;
  const profileArticles = articlesData?.items ?? [];
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

  const primaryInfoCards = [
    personalInfoMap.fullName,
    personalInfoMap.email,
    personalInfoMap.phone,
    personalInfoMap.address,
  ].filter(Boolean);

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

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: gapSmall,
              }}
            >
              {primaryInfoCards.map((item) => (
                <View
                  key={item.key}
                  style={{
                    flexBasis: '48%',
                    borderRadius: cardRadius - 6,
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                    paddingVertical: gapSmall,
                    paddingHorizontal: gapSmall,
                    backgroundColor: '#F8FAFC',
                    gap: gapSmall * 0.25,
                  }}
                >
                  <Text
                    className="text-slate-500"
                    style={{ fontSize: responsiveFontSize(12) }}
                  >
                    {item.label}
                  </Text>
                  <Text
                    className="font-semibold text-slate-800"
                    style={{ fontSize: responsiveFontSize(14) }}
                  >
                    {ensureDisplay(item.display)}
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
                      className="text-white/80"
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
                borderRadius: cardRadius - 3,
                paddingVertical: buttonPaddingVertical,
              }}
            >
              <Text
                className="text-center font-semibold text-white"
                style={{ fontSize: responsiveFontSize(15) }}
              >
                Chinh sua thong tin ca nhan
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
          Bai viet cua ban
        </Text>
        <Text
          className="text-slate-500"
          style={{
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Cac bai viet gan day cua ban se duoc hien thi tai day.
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
            Khong the tai danh sach bai viet. Vui long thu lai sau.
          </Text>
        ) : profileArticles.length ? (
          <View style={{ gap: gapSmall }}>
            {profileArticles.map((article) => {
              const articleDate =
                article.publishedAt ??
                article.createdAt ??
                article.raw?.published_at ??
                article.raw?.created_at ??
                null;
              const thumbnail =
                article.imageUrl ?? article.raw?.main_image_url ?? DEFAULT_ARTICLE_IMAGE;

              const postCardData = {
                id: article.id,
                articleId: article.id,
                slug: article.slug,
                title: article.title ?? 'Bai viet',
                author: nameDisplay,
                createdAt: articleDate,
                excerpt: article.summary ?? '',
                cover: thumbnail,
                raw: article,
              };

              return (
                <PostCard
                  key={article.id ?? article.slug ?? `article-${Math.random()}`}
                  post={postCardData}
                  onPress={() => handleOpenArticleDetail(article)}
                />
              );
            })}
          </View>
        ) : (
          <Text
            className="text-slate-500"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Ban chua co bai viet nao.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
