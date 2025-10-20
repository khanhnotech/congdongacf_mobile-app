import { useMemo } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../hooks/useAuth';
import { useMyPosts } from '../../../hooks/usePosts';
import { useProfileDetail } from '../../../hooks/useProfile';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';
import { formatDateTime, formatName } from '../../../utils/format';

const STATUS_LABELS = {
  pending: 'Cho duyet',
  public: 'Da duyet',
  approved: 'Da duyet',
  draft: 'Nhap',
  rejected: 'Bi tu choi',
};

const STAT_COLORS = ['#2563eb', '#047857', '#0891b2', '#f59e0b'];
const DEFAULT_AVATAR = 'https://dummyimage.com/128x128/0f172a/ffffff&text=ACF';

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
    { key: 'birthYear', label: 'Nam sinh', value: null, display: 'Chua cap nhat' },
    { key: 'occupation', label: 'Nghe nghiep', value: null, display: 'Chua cap nhat' },
    { key: 'education', label: 'Noi hoc tap', value: null, display: 'Chua cap nhat' },
    { key: 'address', label: 'Dia chi', value: null, display: 'Chua cap nhat' },
    { key: 'bio', label: 'Mo ta', value: user?.bio ?? null, display: ensureDisplay(user?.bio) },
    { key: 'joinedAt', label: 'Tham gia', value: user?.createdAt ?? null, display: joinDisplay },
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
  const { user, logout, logoutStatus } = useAuth();
  const profileQuery = useProfileDetail(user?.id);
  const myPostsQuery = useMyPosts();
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

  const fallbackPersonalInfo = useMemo(
    () => buildFallbackPersonalInfo(user),
    [user],
  );

  const personalInfo = profileDetail?.personalInfo?.length
    ? profileDetail.personalInfo
    : fallbackPersonalInfo;

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

  const nameDisplay =
    personalInfoMap.fullName?.display ?? ensureDisplay(formatName(user));
  const emailDisplay =
    personalInfoMap.email?.display ?? ensureDisplay(user.email);
  const bioDisplay =
    personalInfoMap.bio?.display ?? ensureDisplay(user.bio);

  const isProfileLoading = profileQuery.isLoading && !profileDetail;
  const profileErrorMessage = profileQuery.isError
    ? 'Khong the tai thong tin ho so. Dang hien thi du lieu tam thoi.'
    : null;

  const myPosts = myPostsQuery.data?.items ?? [];
  const isMyPostsLoading = myPostsQuery.isLoading;
  const myPostsError = myPostsQuery.error;

  const handleOpenPostDetail = (post) => {
    const postId =
      post?.articleId ??
      post?.article_id ??
      (post?.raw?.article_id ?? post?.raw?.id);
    const postSlug = post?.slug ?? post?.raw?.slug;
    if (!postId && !postSlug) {
      return;
    }
    navigation.navigate(ROUTES.STACK.POST_DETAIL, {
      postId,
      postSlug,
    });
  };

  return (
    <View
      className="flex-1 bg-slate-100"
      style={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: listContentPaddingBottom / 2,
      }}
    >
      <View
        className="items-center bg-white shadow-sm"
        style={{
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        <Image
          source={avatarSource}
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
          style={{ marginTop: gapSmall, fontSize: responsiveFontSize(24) }}
        >
          {nameDisplay}
        </Text>
        <Text
          className="text-slate-500"
          style={{ marginTop: gapSmall / 2, fontSize: responsiveFontSize(14) }}
        >
          {emailDisplay}
        </Text>
        <Text
          className="text-center text-slate-600"
          style={{
            marginTop: gapSmall,
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          {bioDisplay}
        </Text>

        <View
          className="w-full flex-row justify-center"
          style={{ marginTop: gapMedium, gap: gapSmall }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.STACK.EDIT_PROFILE)}
            activeOpacity={0.85}
            className="flex-1 bg-red-500"
            style={{
              borderRadius: cardRadius - 4,
              paddingVertical: buttonPaddingVertical,
            }}
          >
            <Text
              className="text-center font-semibold text-white"
              style={{ fontSize: responsiveFontSize(16) }}
            >
              Chinh sua
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => logout().catch((error) => console.warn('Logout failed', error))}
            activeOpacity={0.85}
            className="flex-1 border border-slate-200"
            disabled={logoutStatus === 'pending'}
            style={{
              borderRadius: cardRadius - 4,
              paddingVertical: buttonPaddingVertical,
              opacity: logoutStatus === 'pending' ? 0.6 : 1,
            }}
          >
            <Text
              className="text-center font-semibold text-slate-600"
              style={{ fontSize: responsiveFontSize(16) }}
            >
              {logoutStatus === 'pending' ? 'Dang dang xuat...' : 'Dang xuat'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        className="bg-white shadow-sm"
        style={{
          marginTop: gapMedium,
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        <Text
          className="font-semibold text-slate-900"
          style={{ fontSize: responsiveFontSize(18) }}
        >
          Thong tin ca nhan
        </Text>
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
            <View style={{ gap: gapSmall * 0.75 }}>
              {personalInfo.map((item) => (
                <View
                  key={item.key ?? item.label ?? `info-${item.label}`}
                  style={{ gap: gapSmall * 0.25 }}
                >
                  <Text
                    className="font-semibold text-slate-700"
                    style={{ fontSize: responsiveFontSize(14) }}
                  >
                    {item.label}
                  </Text>
                  <Text
                    className="text-slate-600"
                    style={{
                      fontSize: responsiveFontSize(14),
                      lineHeight: responsiveFontSize(20, { min: 18 }),
                    }}
                  >
                    {ensureDisplay(item.display)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      <View
        className="bg-white shadow-sm"
        style={{
          marginTop: gapSmall,
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        <Text
          className="font-semibold text-slate-900"
          style={{ fontSize: responsiveFontSize(18) }}
        >
          Thong ke
        </Text>
        {isProfileLoading ? (
          <View
            className="items-center justify-center"
            style={{ paddingVertical: gapMedium }}
          >
            <ActivityIndicator size="small" color="#DC2626" />
          </View>
        ) : stats.length ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: gapSmall,
            }}
          >
            {stats.map((stat, index) => {
              const color = STAT_COLORS[index % STAT_COLORS.length];
              const valueNumber = Number.isFinite(Number(stat.value))
                ? Number(stat.value)
                : 0;
              return (
                <View
                  key={stat.key ?? `${stat.label}-${index}`}
                  style={{
                    borderRadius: cardRadius - 6,
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                    backgroundColor: '#F8FAFC',
                    paddingVertical: cardPadding * 0.75,
                    paddingHorizontal: cardPadding * 0.75,
                    width: '48%',
                    minWidth: '48%',
                    gap: gapSmall * 0.25,
                  }}
                >
                  <Text
                    className="text-slate-600"
                    style={{ fontSize: responsiveFontSize(13) }}
                  >
                    {stat.label}
                  </Text>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: cardPadding * 0.75,
                      paddingVertical: gapSmall * 0.25,
                      borderRadius: 999,
                      backgroundColor: color,
                    }}
                  >
                    <Text
                      className="font-semibold text-white"
                      style={{ fontSize: responsiveFontSize(16) }}
                    >
                      {valueNumber}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text
            className="text-slate-500"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Chua co so lieu thong ke.
          </Text>
        )}
      </View>

      <View
        className="bg-white shadow-sm"
        style={{
          marginTop: gapMedium,
          borderRadius: cardRadius,
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        <Text
          className="font-semibold text-slate-900"
          style={{ fontSize: responsiveFontSize(18) }}
        >
          Hoat dong gan day
        </Text>
        <Text
          className="text-slate-500"
          style={{
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Danh sach bai viet va hoat dong cua ban se hien tai day.
        </Text>

        {isMyPostsLoading ? (
          <View
            className="items-center justify-center"
            style={{ paddingVertical: gapMedium }}
          >
            <ActivityIndicator size="small" color="#DC2626" />
          </View>
        ) : myPostsError ? (
          <Text
            className="text-slate-500"
            style={{ fontSize: responsiveFontSize(14) }}
          >
            Khong the tai danh sach bai viet. Vui long thu lai sau.
          </Text>
        ) : myPosts.length ? (
          <View style={{ gap: gapSmall }}>
            {myPosts.map((post) => (
              <TouchableOpacity
                key={post.id ?? post.slug ?? `post-${Math.random()}`}
                activeOpacity={0.85}
                onPress={() => handleOpenPostDetail(post)}
                className="border border-slate-200 bg-slate-50"
                style={{
                  borderRadius: cardRadius,
                  padding: cardPadding,
                  gap: gapSmall / 2,
                }}
              >
                <Text
                  className="font-semibold text-slate-900"
                  style={{ fontSize: responsiveFontSize(16) }}
                >
                  {post.title || 'Bai viet'}
                </Text>
                <Text
                  className="text-slate-500"
                  style={{ fontSize: responsiveFontSize(13) }}
                >
                  {formatDateTime(post.createdAt)}
                </Text>
                <View className="self-start rounded-full bg-amber-100 px-3 py-1">
                  <Text className="text-sm font-semibold text-amber-700">
                    {STATUS_LABELS[post.status] ?? post.status ?? 'Khong xac dinh'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
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
    </View>
  );
}
