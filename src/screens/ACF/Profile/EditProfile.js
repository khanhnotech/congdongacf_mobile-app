import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../hooks/useAuth';
import { useProfileDetail } from '../../../hooks/useProfile';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { formatName } from '../../../utils/format';

const DEFAULT_AVATAR = 'https://dummyimage.com/200x200/0f172a/ffffff&text=ACF';
const DEFAULT_COVER = 'https://dummyimage.com/900x360/cbd5f5/1f2937&text=ACF';

const pickFirst = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (text.length) return text;
  }
  return '';
};

const deriveInitialForm = (user, profileDetail) => {
  const rawPayload = profileDetail?.raw ?? user?.raw ?? {};
  const base = rawPayload.user ?? rawPayload;
  const profile = rawPayload.profile ?? {};
  const businessman = rawPayload.businessman ?? {};

  const initialFirst = pickFirst(
    user?.firstName,
    base?.firstName,
    base?.first_name,
    profile?.firstName,
    profile?.first_name,
  );
  const initialLast = pickFirst(
    user?.lastName,
    base?.lastName,
    base?.last_name,
    profile?.lastName,
    profile?.last_name,
  );

  return {
    firstName: initialFirst,
    lastName: initialLast,
    phone: pickFirst(base?.phone, user?.phone),
    birthYear: pickFirst(businessman?.birth_year, profile?.birth_year),
    workplace: pickFirst(profile?.workplace, businessman?.position),
    studiedAt: pickFirst(profile?.studied_at, businessman?.education),
    address: pickFirst(profile?.live_at),
    bio: pickFirst(user?.bio, base?.description, profile?.description),
  };
};

const resolveImagePickerMediaType = () => {
  const mediaType = ImagePicker?.MediaType;
  if (mediaType?.Images) return mediaType.Images;
  if (mediaType?.Image) return mediaType.Image;
  if (mediaType?.IMAGE) return mediaType.IMAGE;
  if (mediaType?.All) return mediaType.All;
  if (mediaType?.ALL) return mediaType.ALL;
  if (ImagePicker?.MediaTypeOptions?.Images) {
    return ImagePicker.MediaTypeOptions.Images;
  }
  return 'images';
};

const createFileFromAsset = (asset, fallbackName) => {
  if (!asset) return null;
  const uri = asset.uri ?? asset.path;
  if (!uri) return null;
  const baseName =
    asset.fileName ??
    asset.filename ??
    asset.name ??
    fallbackName ??
    uri.split('/').pop() ??
    `media-${Date.now()}.jpg`;
  const normalizedName = baseName.includes('.')
    ? baseName
    : `${baseName}.jpg`;
  const lowerName = normalizedName.toLowerCase();
  const mimeType =
    asset.mimeType ??
    asset.type ??
    (lowerName.endsWith('.png') ? 'image/png' : 'image/jpeg');

  return {
    uri,
    name: normalizedName,
    type: mimeType,
  };
};

export default function EditProfile() {
  const navigation = useNavigation();
  const { user, updateProfile } = useAuth();
  const profileQuery = useProfileDetail(user?.id, {
    enabled: Boolean(user?.id),
    staleTime: 0,
    gcTime: 2 * 60 * 1000,
  });

  const initialForm = useMemo(
    () => deriveInitialForm(user, profileQuery.data),
    [user, profileQuery.data],
  );

  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [avatarSelection, setAvatarSelection] = useState(null);
  const [coverSelection, setCoverSelection] = useState(null);

  useEffect(() => {
    setForm(initialForm);
    setAvatarSelection(null);
    setCoverSelection(null);
  }, [initialForm]);

  useEffect(() => {
    let active = true;
    const prepare = async () => {
      try {
        const current =
          await ImagePicker.getMediaLibraryPermissionsAsync?.();
        if (!active) return;
        const status =
          current?.status ?? (current?.granted ? 'granted' : 'undetermined');
        setPermissionStatus(status);
      } catch {
        if (active) setPermissionStatus('undetermined');
      }
    };
    prepare();
    return () => {
      active = false;
    };
  }, []);

  const {
    screenPadding,
    verticalPadding,
    statusBarOffset,
    gapSmall,
    gapMedium,
    cardPadding,
    cardRadius,
    responsiveFontSize,
    inputPaddingVertical,
    buttonPaddingVertical,
  } = useResponsiveSpacing();

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value ?? '' }));
  };

  const ensurePermission = async () => {
    if (permissionStatus === 'granted') return true;
    try {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync?.();
      const status =
        result?.status ?? (result?.granted ? 'granted' : 'undetermined');
      setPermissionStatus(status);
      if (status !== 'granted') {
        Alert.alert(
          'Quyền truy cập ảnh',
          'Ứng dụng cần quyền truy cập thư viện để chọn ảnh.',
        );
        return false;
      }
      return true;
    } catch {
      Alert.alert(
        'Quyền truy cập ảnh',
        'Ứng dụng cần quyền truy cập thư viện để chọn ảnh.',
      );
      return false;
    }
  };

  const pickImage = async () => {
    const allowed = await ensurePermission();
    if (!allowed) return null;

    const pickerOptions = {
      allowsMultipleSelection: false,
      quality: 0.85,
    };
    const mediaTypes = resolveImagePickerMediaType();
    if (mediaTypes) {
      pickerOptions.mediaTypes = mediaTypes;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync?.(pickerOptions);
      if (!result || result.canceled) return null;
      const asset = result.assets?.[0];
      if (!asset) return null;
      const file = createFileFromAsset(asset);
      if (!file) return null;
      return {
        file,
        previewUri: asset.uri ?? asset.path,
      };
    } catch (error) {
      console.warn('Image picker failed', error);
      Alert.alert(
        'Không thể mở thư viện ảnh',
        error?.message ?? 'Vui lòng thử lại.',
      );
      return null;
    }
  };

  const loadingProfile = profileQuery.isLoading && !profileQuery.data;
  const isBusy = isSaving || loadingProfile;

  const handlePickAvatar = async () => {
    if (isBusy) return;
    const selection = await pickImage();
    if (!selection) return;
    setAvatarSelection(selection);
  };

  const handlePickCover = async () => {
    if (isBusy) return;
    const selection = await pickImage();
    if (!selection) return;
    setCoverSelection(selection);
  };

  const currentAvatarUri =
    avatarSelection?.previewUri ??
    profileQuery.data?.avatar ??
    user?.avatar ??
    DEFAULT_AVATAR;
  const currentCoverUri =
    coverSelection?.previewUri ??
    profileQuery.data?.cover ??
    user?.cover ??
    DEFAULT_COVER;

  const handleSubmit = async () => {
    const payload = {};
    const trimValue = (value) => {
      if (value === undefined || value === null) return undefined;
      const text = String(value).trim();
      return text.length ? text : undefined;
    };

    const firstName = trimValue(form.firstName);
    const lastName = trimValue(form.lastName);
    const bio = trimValue(form.bio);
    const phone = trimValue(form.phone);
    const workplace = trimValue(form.workplace);
    const studiedAt = trimValue(form.studiedAt);
    const address = trimValue(form.address);
    const birthYearSource = trimValue(form.birthYear);
    const birthYear =
      birthYearSource !== undefined && Number.isFinite(Number(birthYearSource))
        ? Number(birthYearSource)
        : undefined;

    payload.firstName = firstName ?? '';
    payload.lastName = lastName ?? '';
    if (bio !== undefined) payload.bio = bio;
    if (phone !== undefined) payload.phone = phone;
    if (birthYear !== undefined) payload.birth_year = birthYear;
    if (workplace !== undefined) payload.workplace = workplace;
    if (studiedAt !== undefined) payload.studied_at = studiedAt;
    if (address !== undefined) payload.live_at = address;
    if (avatarSelection?.file) payload.avatarFile = avatarSelection.file;
    if (coverSelection?.file) payload.coverFile = coverSelection.file;

    try {
      setIsSaving(true);
      await updateProfile(payload);
      Alert.alert('Thành công', 'Hồ sơ của bạn đã được cập nhật.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', error?.message ?? 'Không thể cập nhật hồ sơ.');
    } finally {
      setIsSaving(false);
    }
  };

  const sharedInputStyle = {
    borderRadius: cardRadius - 4,
    paddingHorizontal: cardPadding * 0.7,
    paddingVertical: inputPaddingVertical,
    fontSize: responsiveFontSize(15, { min: 13 }),
    backgroundColor: '#FFFFFF',
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-100"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        style={{ paddingHorizontal: screenPadding }}
        contentContainerStyle={{
          paddingTop: verticalPadding + statusBarOffset,
          paddingBottom: screenPadding + 490, // Extra space for keyboard
          gap: gapMedium,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraScrollHeight={200}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      >
      <View style={{ gap: gapSmall }}>
        <Text
          className="uppercase text-red-600"
          style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
        >
          Hồ sơ cá nhân
        </Text>
        <Text
          className="font-bold text-slate-900"
          style={{ fontSize: responsiveFontSize(28) }}
        >
          {formatName(user)}
        </Text>
        <Text
          className="text-slate-500"
          style={{
            fontSize: responsiveFontSize(14),
            lineHeight: responsiveFontSize(20, { min: 18 }),
          }}
        >
          Cập nhật thông tin để mọi người hiểu rõ hơn về bạn.
        </Text>
      </View>

      <TouchableOpacity
        onPress={handlePickCover}
        disabled={isBusy}
        activeOpacity={0.85}
        style={{ borderRadius: cardRadius, overflow: 'hidden' }}
      >
        <Image
          source={{ uri: currentCoverUri }}
          style={{
            width: '100%',
            height: cardPadding * 6,
            backgroundColor: '#e2e8f0',
          }}
          resizeMode="cover"
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingVertical: gapSmall * 0.6,
            backgroundColor: 'rgba(15,23,42,0.55)',
          }}
        >
          <Text
            className="text-center text-white"
            style={{ fontSize: responsiveFontSize(13, { min: 12 }) }}
          >
            {isBusy ? 'Đang xử lý...' : 'Thay ảnh bìa'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: gapMedium }}>
        <TouchableOpacity
          onPress={handlePickAvatar}
          disabled={isBusy}
          activeOpacity={0.85}
        >
          <Image
            source={{ uri: currentAvatarUri }}
            style={{
              width: cardPadding * 3.2,
              height: cardPadding * 3.2,
              borderRadius: (cardPadding * 3.2) / 2,
              backgroundColor: '#1e293b',
            }}
            resizeMode="cover"
          />
          <Text
            className="mt-1 text-center text-slate-500"
            style={{ fontSize: responsiveFontSize(12, { min: 11 }) }}
          >
            {isBusy ? 'Đang xử lý...' : 'Đổi ảnh đại diện'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ gap: gapSmall }}>
        <TextInput
          value={form.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
          placeholder="Họ"
          className="border border-slate-200 text-slate-700"
          style={sharedInputStyle}
          editable={!isBusy}
        />
        <TextInput
          value={form.lastName}
          onChangeText={(value) => handleChange('lastName', value)}
          placeholder="Tên"
          className="border border-slate-200 text-slate-700"
          style={sharedInputStyle}
          editable={!isBusy}
        />
        <TextInput
          value={form.phone}
          onChangeText={(value) => handleChange('phone', value)}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          className="border border-slate-200 text-slate-700"
          style={sharedInputStyle}
          editable={!isBusy}
        />
        <View style={{ flexDirection: 'row', gap: gapSmall }}>
          <TextInput
            value={form.birthYear}
            onChangeText={(value) =>
              handleChange('birthYear', value.replace(/[^0-9]/g, ''))
            }
            placeholder="Năm sinh"
            keyboardType="number-pad"
            className="border border-slate-200 text-slate-700 flex-1"
            style={sharedInputStyle}
            editable={!isBusy}
            maxLength={4}
          />
          <TextInput
            value={form.workplace}
            onChangeText={(value) => handleChange('workplace', value)}
            placeholder="Nghề nghiệp / Nơi làm việc"
            className="border border-slate-200 text-slate-700 flex-1"
            style={sharedInputStyle}
            editable={!isBusy}
          />
        </View>
        <TextInput
          value={form.studiedAt}
          onChangeText={(value) => handleChange('studiedAt', value)}
          placeholder="Nơi học tập"
          className="border border-slate-200 text-slate-700"
          style={sharedInputStyle}
          editable={!isBusy}
        />
        <TextInput
          value={form.address}
          onChangeText={(value) => handleChange('address', value)}
          placeholder="Địa chỉ sinh sống"
          className="border border-slate-200 text-slate-700"
          style={sharedInputStyle}
          editable={!isBusy}
        />
        <TextInput
          value={form.bio}
          onChangeText={(value) => handleChange('bio', value)}
          placeholder="Giới thiệu ngắn gọn về bạn"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="border border-slate-200 text-slate-700"
          style={{
            ...sharedInputStyle,
            minHeight: cardPadding * 4.5,
          }}
          editable={!isBusy}
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isBusy}
        className={`bg-red-500 ${isBusy ? 'opacity-60' : ''}`}
        activeOpacity={0.85}
        style={{
          borderRadius: cardRadius - 2,
          paddingVertical: buttonPaddingVertical,
          marginBottom: gapMedium,
        }}
      >
        <Text
          className="text-center font-semibold text-white"
          style={{ fontSize: responsiveFontSize(16) }}
        >
          {isBusy ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
