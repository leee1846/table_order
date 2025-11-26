import { colors } from './colors';

export type ThemeMode = 'light' | 'dark';

export const darkModeColors = {
  black: '#000000', // #000000
  white: '#ffffff', // #ffffff
  grey: {
    50: '#303438',
    100: '#424951',
    200: '#525C67',
    300: '#67717D',
    400: '#7B8692',
    500: '#9AA1A8',
    600: '#A5AFB8',
    700: '#B7C0CA',
    800: '#C9D0D8',
    900: '#D8E0E8',
  },
  primary: {
    100: '#03071F',
    300: '#000B54',
    400: '#8FA2FF',
    500: '#6F91FF',
  },
  semantic: {
    400: '#FF6675',
  },

  // 디자인 시스템에 정의되지 않은 라이트/다크 테마 컬러
  undefined_palette: {
    100: '#0D0D0D', // background/dark
    200: '#303438', // grey[50]
    300: '#D8E0E8', // grey[900]
    400: '#ffffff', // white
    500: '#525C67', // grey[200]
    600: '#303438', // grey[50]
    700: '#000000', // black
    800: '#67717D', // grey[300]
    900: '#0D0D0D', // background/dark
  },
} as const;

export const getModeColors = (mode: ThemeMode) => {
  return mode === 'dark' ? darkModeColors : colors;
};
