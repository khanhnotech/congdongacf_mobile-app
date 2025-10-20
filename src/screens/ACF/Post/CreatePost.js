import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { usePosts } from '../../../hooks/usePosts';
import { useResponsiveSpacing } from '../../../hooks/useResponsiveSpacing';
import { ROUTES } from '../../../utils/constants';

const createEmptySection = (index) => ({
  id: `section-${Date.now()}-${index}`,
  title: '',
  content: '',
  media: [],
});

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

export default function CreatePost() {
  const navigation = useNavigation();
  const { createPost } = usePosts();
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [sections, setSections] = useState([createEmptySection(0)]);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const spacing = useResponsiveSpacing();
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
  } = spacing;
  const gapLarge = spacing.gapLarge ?? gapMedium * 1.5;

  useEffect(() => {
    let mounted = true;
    const prepare = async () => {
      try {
        const current =
          await ImagePicker.getMediaLibraryPermissionsAsync?.();
        if (mounted) {
          const status = current?.status ??
            (current?.granted ? 'granted' : 'undetermined');
          setPermissionStatus(status);
        }
      } catch {
        if (mounted) setPermissionStatus('undetermined');
      }
    };

    prepare();
    return () => {
      mounted = false;
    };
  }, []);

  const canSubmit = useMemo(() => {
    const hasTitle = typeof form.title === 'string' && form.title.trim();
    const hasContent =
      typeof form.content === 'string' && form.content.trim();
    return Boolean(hasTitle && hasContent);
  }, [form.content, form.title]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const nextErrors = { ...prev };
      delete nextErrors[key];
      return nextErrors;
    });
  };

  const ensurePermission = async () => {
    if (permissionStatus === 'granted') return true;
    try {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync?.();
      const status =
        result?.status ??
        (result?.granted ? 'granted' : 'undetermined');
      setPermissionStatus(status);
      if (status !== 'granted') {
        Alert.alert(
          'Quyền truy cập ảnh',
          'Ứng dụng cần quyền truy cập ảnh để tải hình lên.',
        );
        return false;
      }
      return true;
    } catch {
      Alert.alert(
        'Quyền truy cập ảnh',
        'Ứng dụng cần quyền truy cập ảnh để tải hình lên.',
      );
      return false;
    }
  };

  const pickImage = async () => {
    const allowed = await ensurePermission();
    if (!allowed) return null;

    const pickerOptions = {
      allowsMultipleSelection: false,
      quality: 0.8,
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
        fileKey: file.name ?? `media-${Date.now()}.jpg`,
      };
    } catch (error) {
      console.warn('Image picker failed', error);
      Alert.alert(
        'Không thể mở thư viện ảnh',
        error?.message ?? 'Vui lòng thử lại sau.',
      );
      return null;
    }
  };

  const handlePickCover = async () => {
    const selection = await pickImage();
    if (!selection) return;
    setCoverImage(selection);
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
  };

  const handleAddSection = () => {
    setSections((prev) => [...prev, createEmptySection(prev.length)]);
  };

  const handleRemoveSection = (sectionId) => {
    setSections((prev) =>
      prev.length > 1
        ? prev.filter((section) => section.id !== sectionId)
        : prev,
    );
  };

  const updateSectionField = (sectionId, key, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, [key]: value } : section,
      ),
    );
  };

  const handlePickSectionMedia = async (sectionId) => {
    const selection = await pickImage();
    if (!selection) return;
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          media: [...section.media, selection],
        };
      }),
    );
  };

  const handleRemoveSectionMedia = (sectionId, mediaKey) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          media: section.media.filter((media) => media.fileKey !== mediaKey),
        };
      }),
    );
  };

  const buildStructurePayload = () => {
    const mediaFiles = [];
    const structuredSections = sections
      .map((section, sectionIndex) => {
        const mediaEntries = section.media.map((media, mediaIndex) => {
          const fileKey =
            media.fileKey ?? `section-${sectionIndex}-${mediaIndex}.jpg`;
          if (media.file) {
            mediaFiles.push({
              file: media.file,
              fileKey,
            });
          }
          return {
            title: '',
            caption: '',
            media_url: '',
            media_type: 'image',
            file_key: fileKey,
          };
        });
        return {
          title: section.title ?? '',
          content: section.content ?? '',
          media: mediaEntries,
        };
      })
      .filter(
        (section) =>
          (section.title && section.title.trim()) ||
          (section.content && section.content.trim()) ||
          section.media.length > 0,
      );

    const structure =
      structuredSections.length > 0
        ? { sections: structuredSections }
        : undefined;
    return { structure, mediaFiles };
  };

  const handleSubmit = async () => {
    const validationErrors = {};
    if (!form.title?.trim()) {
      validationErrors.title = 'Vui lòng nhập tiêu đề.';
    }
    if (!form.content?.trim()) {
      validationErrors.content = 'Vui lòng nhập nội dung chính.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Alert.alert('Thiếu thông tin', 'Vui lòng kiểm tra lại các trường bắt buộc.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const { structure, mediaFiles } = buildStructurePayload();
      const payload = {
        title: form.title.trim(),
        summary: form.excerpt?.trim?.() ?? '',
        excerpt: form.excerpt?.trim?.() ?? '',
        content: form.content.trim(),
        status: 'pending',
        structure,
        coverFile: coverImage?.file ?? null,
        mediaFiles,
      };
      await createPost(payload);
      setErrors({});
      setSubmitError(null);
      setForm({ title: '', excerpt: '', content: '' });
      setCoverImage(null);
      setSections([createEmptySection(0)]);
      Alert.alert('Thông báo', 'Bài viết đã được gửi chờ duyệt.', [
        {
          text: 'Xem hồ sơ',
          onPress: () => {
            navigation.navigate(ROUTES.MAIN_TABS, {
              screen: ROUTES.TABS.PROFILE,
            });
          },
        },
      ]);
    } catch (error) {
      const message = error?.message ?? 'Không thể tạo bài viết.';
      setSubmitError(message);
      Alert.alert('Lỗi', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-100"
      contentContainerStyle={{
        paddingHorizontal: screenPadding,
        paddingTop: verticalPadding + statusBarOffset,
        paddingBottom: gapLarge,
        gap: gapMedium,
      }}
      showsVerticalScrollIndicator={false}
    >
      {submitError ? (
        <View
          className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3"
          style={{ marginBottom: gapSmall }}
        >
          <Text
            className="text-sm font-medium text-rose-700"
            style={{ fontSize: responsiveFontSize(13, { min: 12 }) }}
          >
            {submitError}
          </Text>
        </View>
      ) : null}

      <Text
        className="font-bold text-slate-900"
        style={{ fontSize: responsiveFontSize(28) }}
      >
        Tạo bài viết mới
      </Text>
      <Text
        className="text-slate-500"
        style={{
          fontSize: responsiveFontSize(14),
          lineHeight: responsiveFontSize(20, { min: 18 }),
        }}
      >
        Chia sẻ thông tin, câu chuyện hoặc hoạt động ý nghĩa cùng cộng đồng.
      </Text>

      <View style={{ marginTop: gapMedium, gap: gapMedium }}>
        <TextInput
          value={form.title}
          onChangeText={(value) => handleChange('title', value)}
          placeholder="Tiêu đề"
          className="border border-slate-200 text-slate-700"
          style={{
            borderRadius: cardRadius - 4,
            paddingHorizontal: cardPadding * 0.7,
            paddingVertical: inputPaddingVertical,
            borderColor: errors.title ? '#ef4444' : '#E2E8F0',
            fontSize: responsiveFontSize(15, { min: 13 }),
            backgroundColor: '#FFFFFF',
          }}
        />
        {errors.title ? (
          <Text
            className="text-rose-600"
            style={{ fontSize: responsiveFontSize(13, { min: 11 }) }}
          >
            {errors.title}
          </Text>
        ) : null}
        <TextInput
          value={form.excerpt}
          onChangeText={(value) => handleChange('excerpt', value)}
          placeholder="Mô tả ngắn"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          className="border border-slate-200 text-slate-700"
          style={{
            borderRadius: cardRadius - 4,
            paddingHorizontal: cardPadding * 0.7,
            paddingVertical: inputPaddingVertical,
            fontSize: responsiveFontSize(15, { min: 13 }),
            backgroundColor: '#FFFFFF',
            minHeight: cardPadding * 5,
          }}
        />
        <TextInput
          value={form.content}
          onChangeText={(value) => handleChange('content', value)}
          placeholder="Nội dung chính"
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          className="border border-slate-200 text-slate-700"
          style={{
            borderRadius: cardRadius - 4,
            paddingHorizontal: cardPadding * 0.7,
            paddingVertical: inputPaddingVertical,
            borderColor: errors.content ? '#ef4444' : '#E2E8F0',
            fontSize: responsiveFontSize(15, { min: 13 }),
            backgroundColor: '#FFFFFF',
            minHeight: cardPadding * 7,
          }}
        />
        {errors.content ? (
          <Text
            className="text-rose-600"
            style={{ fontSize: responsiveFontSize(13, { min: 11 }) }}
          >
            {errors.content}
          </Text>
        ) : null}
      </View>

      <View
        className="bg-white"
        style={{
          marginTop: gapMedium,
          borderRadius: cardRadius,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          padding: cardPadding,
          gap: gapSmall,
        }}
      >
        <Text
          className="font-semibold text-slate-900"
          style={{ fontSize: responsiveFontSize(16) }}
        >
          Ảnh bìa
        </Text>
        {coverImage?.previewUri ? (
          <View style={{ gap: gapSmall }}>
            <Image
              source={{ uri: coverImage.previewUri }}
              style={{
                width: '100%',
                height: cardPadding * 12,
                borderRadius: cardRadius - 6,
              }}
              resizeMode="cover"
            />
            <View
              style={{
                flexDirection: 'row',
                gap: gapSmall,
              }}
            >
              <TouchableOpacity
                onPress={handlePickCover}
                disabled={isSubmitting}
                className="flex-1 items-center justify-center bg-slate-900 px-4"
                style={{
                  borderRadius: cardRadius - 6,
                  paddingVertical: buttonPaddingVertical,
                }}
              >
                <Text
                  className="font-semibold text-white"
                  style={{
                    fontSize: responsiveFontSize(15, { min: 13 }),
                  }}
                >
                  Thay đổi ảnh bìa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRemoveCover}
                disabled={isSubmitting}
                className="items-center justify-center border border-slate-300 px-4"
                style={{
                  borderRadius: cardRadius - 6,
                  paddingVertical: buttonPaddingVertical,
                }}
              >
                <Text
                  className="text-slate-700"
                  style={{
                    fontSize: responsiveFontSize(15, { min: 13 }),
                  }}
                >
                  Xóa ảnh
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handlePickCover}
            disabled={isSubmitting}
            className="items-center justify-center border-2 border-slate-300 px-4"
            style={{
              borderRadius: cardRadius - 6,
              paddingVertical: cardPadding,
            }}
          >
            <Text
              className="text-slate-600"
              style={{
                fontSize: responsiveFontSize(15, { min: 13 }),
                textAlign: 'center',
              }}
            >
              Thêm ảnh bìa
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        className="bg-white"
        style={{
          borderRadius: cardRadius,
          borderWidth: 1,
          borderColor: '#E2E8F0',
          padding: cardPadding,
          gap: gapMedium,
        }}
      >
        <Text
          className="font-semibold text-slate-900"
          style={{ fontSize: responsiveFontSize(16) }}
        >
          Nội dung bổ sung
        </Text>
        {sections.map((section, index) => {
          const sectionTitle = `Mục ${index + 1}`;
          return (
            <View
              key={section.id}
              style={{
                borderWidth: 1,
                borderColor: '#E2E8F0',
                borderRadius: cardRadius - 4,
                padding: cardPadding * 0.75,
                gap: gapSmall,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  className="font-semibold text-slate-800"
                  style={{ fontSize: responsiveFontSize(15, { min: 14 }) }}
                >
                  {sectionTitle}
                </Text>
                {sections.length > 1 ? (
                  <TouchableOpacity
                    onPress={() => handleRemoveSection(section.id)}
                    disabled={isSubmitting}
                    className="items-center justify-center border border-slate-300 px-3"
                    style={{
                      borderRadius: cardRadius - 6,
                      paddingVertical: buttonPaddingVertical * 0.6,
                    }}
                  >
                    <Text
                      className="text-slate-600"
                      style={{
                        fontSize: responsiveFontSize(14, { min: 12 }),
                      }}
                    >
                      Xóa mục
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <TextInput
                value={section.title}
                onChangeText={(value) =>
                  updateSectionField(section.id, 'title', value)
                }
                placeholder="Tiêu đề mục"
                className="border border-slate-200 text-slate-700"
                style={{
                  borderRadius: cardRadius - 4,
                  paddingHorizontal: cardPadding * 0.6,
                  paddingVertical: inputPaddingVertical,
                  fontSize: responsiveFontSize(15, { min: 13 }),
                  backgroundColor: '#FFFFFF',
                }}
              />

              <TextInput
                value={section.content}
                onChangeText={(value) =>
                  updateSectionField(section.id, 'content', value)
                }
                placeholder="Nội dung"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className="border border-slate-200 text-slate-700"
                style={{
                  borderRadius: cardRadius - 4,
                  paddingHorizontal: cardPadding * 0.6,
                  paddingVertical: inputPaddingVertical,
                  fontSize: responsiveFontSize(15, { min: 13 }),
                  backgroundColor: '#FFFFFF',
                }}
              />

              {section.media?.length ? (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: gapSmall,
                  }}
                >
                  {section.media.map((mediaItem, mediaIndex) => {
                    const mediaKey =
                      mediaItem.fileKey ??
                      mediaItem.previewUri ??
                      `media-${section.id}-${mediaIndex}`;
                    const previewSource =
                      mediaItem.previewUri ??
                      mediaItem?.file?.uri ??
                      mediaItem?.file?.path ??
                      null;
                    return (
                      <View
                        key={mediaKey}
                        style={{
                          width: '48%',
                          gap: gapSmall,
                        }}
                      >
                        {previewSource ? (
                          <Image
                            source={{ uri: previewSource }}
                            style={{
                              width: '100%',
                              height: cardPadding * 8,
                              borderRadius: cardRadius - 6,
                            }}
                            resizeMode="cover"
                          />
                        ) : null}
                        <TouchableOpacity
                          onPress={() =>
                            handleRemoveSectionMedia(section.id, mediaItem.fileKey)
                          }
                          disabled={isSubmitting}
                          className="items-center justify-center bg-slate-200 px-3"
                          style={{
                            borderRadius: cardRadius - 6,
                            paddingVertical: buttonPaddingVertical * 0.6,
                          }}
                        >
                          <Text
                            className="text-slate-700"
                            style={{
                              fontSize: responsiveFontSize(14, { min: 12 }),
                            }}
                          >
                            Xóa ảnh
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => handlePickSectionMedia(section.id)}
                disabled={isSubmitting}
                className="items-center justify-center border-2 border-slate-300 px-4"
                style={{
                  borderRadius: cardRadius - 6,
                  paddingVertical: buttonPaddingVertical,
                }}
              >
                <Text
                  className="text-slate-600"
                  style={{
                    fontSize: responsiveFontSize(14, { min: 12 }),
                  }}
                >
                  Thêm ảnh vào mục
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <TouchableOpacity
          onPress={handleAddSection}
          disabled={isSubmitting}
          className="items-center justify-center border border-slate-300 px-4"
          style={{
            borderRadius: cardRadius - 4,
            paddingVertical: buttonPaddingVertical,
          }}
        >
          <Text
            className="text-slate-700"
            style={{ fontSize: responsiveFontSize(14, { min: 12 }) }}
          >
            Thêm mục mới
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        className="items-center justify-center bg-emerald-500"
        style={{
          borderRadius: cardRadius,
          paddingVertical: buttonPaddingVertical + 4,
          marginTop: gapMedium,
          opacity: !canSubmit || isSubmitting ? 0.6 : 1,
        }}
      >
        <Text
          className="font-semibold text-white"
          style={{ fontSize: responsiveFontSize(16, { min: 14 }) }}
        >
          {isSubmitting ? 'Đang gửi...' : 'Đăng bài'}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
