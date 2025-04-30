import { Dimensions, PixelRatio } from "react-native";
import * as OutlineIcons from 'react-native-heroicons/outline';
import * as SolidIcons from 'react-native-heroicons/solid';

const guidelineBaseWidth = 375; // iPhone X
const guidelineBaseHeight = 812;

let {width, height} = Dimensions.get('window');
Dimensions.addEventListener('change', ({window}) => {
  width = window.width;
  height = window.height;
});

const horizontalScale = size =>
  size ? (width / guidelineBaseWidth) * size : width;

const verticalScale = size =>
  size ? (height / guidelineBaseHeight) * size : height;

/**
 * Smooth scaling that blends width & height ratios.
 * `factor` 0 → keep original size, 1 → max scale.
 */
const moderateScale = (size, factor = 0.5) => {
  const scaleW = width / guidelineBaseWidth;
  const scaleH = height / guidelineBaseHeight;
  const scaleAvg = (scaleW + scaleH) / 2;
  return size + (size * scaleAvg - size) * factor;
};

/** Pixel-perfect border / font sizes */
const pixelPerfect = size => {
  const newSize = horizontalScale(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const COLORS = {
  'primary-dark-blue': '#0F0F33',
  'primary-black': '#0F1014',
  'primary-blue': '#1D76FC',
  'primary-gray': '#B4CAF5',
  'primary-washed-blue': '#437BE5',
  'primary-green-50': '#edf7eb',
  'primary-green-100': '#c8eac1',
  'primary-green-200': '#a4dca1',
  'primary-green-300': '#7ecf82',
  'primary-green-400': '#5abf67',
  'primary-green-500': '#22c55e',
  'primary-green-600': '#2e9745',
  'primary-green-700': '#218036',
  'primary-green-800': '#156b28',
  'primary-green-900': '#0d4f1b',
  'washed-blue-50': '#f0f3ff',
  'washed-blue-100': '#d0daff',
  'washed-blue-200': '#bac9ff',
  'washed-blue-300': '#9ab0ff',
  'washed-blue-400': '#86a1ff',
  'washed-blue-500': '#6889ff',
  'washed-blue-600': '#5f7de8',
  'washed-blue-700': '#4a61b5',
  'washed-blue-800': '#394b8c',
  'washed-blue-900': '#2c3a6b',
  'washed-purple-50': '#f8f7ff',
  'washed-purple-100': '#e8e7ff',
  'washed-purple-200': '#dddcff',
  'washed-purple-300': '#cecbff',
  'washed-purple-400': '#c5c1ff',
  'washed-purple-500': '#b6b2ff',
  'washed-purple-600': '#a6a2e8',
  'washed-purple-700': '#817eb5',
  'washed-purple-800': '#64628c',
  'washed-purple-900': '#4c4b6b',
  'primary-blue-50': '#e6f0ff',
  'primary-blue-100': '#b2d1ff',
  'primary-blue-200': '#8cbaff',
  'primary-blue-300': '#589bff',
  'primary-blue-400': '#3787ff',
  'primary-blue-500': '#0569ff',
  'primary-blue-600': '#0560e8',
  'primary-blue-700': '#044bb5',
  'primary-blue-800': '#033a8c',
  'primary-blue-900': '#022c6b',
  'primary-purple-50': '#f1e6ff',
  'primary-purple-100': '#d3b0ff',
  'primary-purple-200': '#bd8aff',
  'primary-purple-300': '#9f54ff',
  'primary-purple-400': '#8d33ff',
  'primary-purple-500': '#7000ff',
  'primary-purple-600': '#6600e8',
  'primary-purple-700': '#5000b5',
  'primary-purple-800': '#3e008c',
  'primary-purple-900': '#2f006b',
  'primary-yellow-50': '#fff9db',
  'primary-yellow-100': '#fff39f',
  'primary-yellow-200': '#ffe36e',
  'primary-yellow-300': '#ffd43c',
  'primary-yellow-400': '#ffc700',
  'primary-yellow-500': '#f5b200',
  'primary-yellow-600': '#db9900',
  'primary-yellow-700': '#b78400',
  'primary-yellow-800': '#936a00',
  'primary-yellow-900': '#7a5800',
  'Neutrals/neutrals-1': '#ffffff',
  'Neutrals/neutrals-2': '#fcfcfd',
  'Neutrals/neutrals-3': '#f5f5f6',
  'Neutrals/neutrals-4': '#f0f0f1',
  'Neutrals/neutrals-5': '#d9d9dc',
  'Neutrals/neutrals-6': '#c0bfc4',
  'Neutrals/neutrals-7': '#8d8c95',
  'Neutrals/neutrals-8': '#5b5966',
  'Neutrals/neutrals-9': '#464553',
  'Neutrals/neutrals-10': '#282637',
  'Neutrals/neutrals-11': '#201f30',
  'Neutrals/neutrals-12': '#161427',
  'Neutrals/neutrals-13': '#020014',
  'brand-washedPurple': '#b5b2ff',
  'brand-washedBlue': '#6889ff',
  'brand-primaryBlue': '#0469ff',
  'brand-primaryPurple': '#7000ff',
  'brand-dark': '#030014',
  'primary-rose-500': '#f43f5e',
  'primary-rose-600': '#e11d48',
  'primary-rose-700': '#be123c',
  'primary-rose-800': '#9f1239',
};

const SIZES = {
  xSmall: moderateScale(10),
  small: moderateScale(12),
  xMedium: moderateScale(14),
  medium: moderateScale(16),
  large: moderateScale(20),
  xLarge: moderateScale(24),
  xxLarge: moderateScale(28),
  xxxLarge: moderateScale(34),
};

export {
  COLORS,
  horizontalScale,
  verticalScale,
  moderateScale,
  pixelPerfect,
  SIZES,
  OutlineIcons,
  SolidIcons,
};
