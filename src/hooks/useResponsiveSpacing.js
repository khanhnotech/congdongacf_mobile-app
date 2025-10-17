import { useCallback, useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

const PRESETS = [
  {
    key: 'xs',
    maxWidth: 360,
    screenPadding: 16,
    verticalPadding: 18,
    cardPadding: 16,
    cardRadius: 20,
    sectionGap: 12,
    listGap: 12,
    contentMaxWidth: 420,
    inputPaddingVertical: 11,
    buttonPaddingVertical: 12,
    chipPaddingHorizontal: 14,
    chipPaddingVertical: 8,
    heroHeight: 180,
    gridColumns: 2,
  },
  {
    key: 'sm',
    maxWidth: 400,
    screenPadding: 18,
    verticalPadding: 20,
    cardPadding: 18,
    cardRadius: 22,
    sectionGap: 14,
    listGap: 14,
    contentMaxWidth: 460,
    inputPaddingVertical: 12,
    buttonPaddingVertical: 13,
    chipPaddingHorizontal: 16,
    chipPaddingVertical: 9,
    heroHeight: 190,
    gridColumns: 2,
  },
  {
    key: 'md',
    maxWidth: 480,
    screenPadding: 20,
    verticalPadding: 22,
    cardPadding: 20,
    cardRadius: 24,
    sectionGap: 16,
    listGap: 16,
    contentMaxWidth: 520,
    inputPaddingVertical: 13,
    buttonPaddingVertical: 14,
    chipPaddingHorizontal: 18,
    chipPaddingVertical: 10,
    heroHeight: 200,
    gridColumns: 2,
  },
  {
    key: 'lg',
    maxWidth: 600,
    screenPadding: 22,
    verticalPadding: 24,
    cardPadding: 22,
    cardRadius: 26,
    sectionGap: 18,
    listGap: 18,
    contentMaxWidth: 600,
    inputPaddingVertical: 14,
    buttonPaddingVertical: 15,
    chipPaddingHorizontal: 18,
    chipPaddingVertical: 11,
    heroHeight: 220,
    gridColumns: 3,
  },
  {
    key: 'xl',
    maxWidth: Number.POSITIVE_INFINITY,
    screenPadding: 24,
    verticalPadding: 26,
    cardPadding: 26,
    cardRadius: 28,
    sectionGap: 20,
    listGap: 20,
    contentMaxWidth: 680,
    inputPaddingVertical: 15,
    buttonPaddingVertical: 16,
    chipPaddingHorizontal: 20,
    chipPaddingVertical: 12,
    heroHeight: 240,
    gridColumns: 3,
  },
];

const clamp = (value, min, max) => {
  'worklet'; // appease reanimated if present
  if (Number.isNaN(value)) return min;
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
};

export function useResponsiveSpacing() {
  const { width, height } = useWindowDimensions();

  const preset = useMemo(() => {
    for (let index = 0; index < PRESETS.length; index += 1) {
      const candidate = PRESETS[index];
      if (width <= candidate.maxWidth) {
        return candidate;
      }
    }
    return PRESETS[PRESETS.length - 1];
  }, [width]);

  const scale = useMemo(() => clamp(width / 393, 0.85, 1.25), [width]);
  const fontScale = useMemo(() => clamp(width / 393, 0.9, 1.22), [width]);

  const responsiveFontSize = useCallback(
    (value, options = {}) => {
      const scaled = value * fontScale;
      const minValue = options.min ?? value * 0.82;
      const maxValue = options.max ?? value * 1.28;
      return Math.round(clamp(scaled, minValue, maxValue));
    },
    [fontScale],
  );

  const responsiveSpacing = useCallback(
    (value, options = {}) => {
      const scaled = value * scale;
      const minValue = options.min ?? 0;
      const maxValue = options.max ?? Number.POSITIVE_INFINITY;
      const rounded = options.round === false ? scaled : Math.round(scaled);
      return clamp(rounded, minValue, maxValue);
    },
    [scale],
  );

  const gapSmall = Math.max(8, preset.sectionGap - 4);
  const gapMedium = preset.sectionGap;
  const gapLarge = preset.sectionGap + 6;
  const statusBarOffset = Platform.OS === 'android' ? 12 : 0;
  const listContentPaddingBottom = Math.max(160, preset.listGap * 8);

  return {
    presetKey: preset.key,
    width,
    height,
    scale,
    fontScale,
    responsiveFontSize,
    responsiveSpacing,
    screenPadding: preset.screenPadding,
    verticalPadding: preset.verticalPadding,
    contentMaxWidth: preset.contentMaxWidth,
    cardPadding: preset.cardPadding,
    cardRadius: preset.cardRadius,
    sectionGap: preset.sectionGap,
    listGap: preset.listGap,
    gapSmall,
    gapMedium,
    gapLarge,
    inputPaddingVertical: preset.inputPaddingVertical,
    buttonPaddingVertical: preset.buttonPaddingVertical,
    chipPaddingHorizontal: preset.chipPaddingHorizontal,
    chipPaddingVertical: preset.chipPaddingVertical,
    heroHeight: preset.heroHeight,
    gridColumns: preset.gridColumns,
    listContentPaddingBottom,
    statusBarOffset,
    isSmallDevice: preset.key === 'xs' || preset.key === 'sm',
    isTablet: width >= 600,
    hasWideLayout: width >= 720,
  };
}

