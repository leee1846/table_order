import { colors } from './colors';

export type ThemeMode = 'light' | 'dark';

const darkColors = {
  black: 'red',
  white: 'red',
  grey: {
    50: 'red',
    100: 'red',
    200: 'red',
    300: 'red',
    400: 'red',
    500: 'red',
    600: 'red',
    700: 'red',
    800: 'red',
    900: 'red',
  },
  primary: {
    100: 'red',
    200: 'red',
    300: 'red',
    400: 'red',
    500: 'red',
    600: 'red',
    700: 'red',
    800: 'red',
  },
  secondary: {
    100: 'red',
    200: 'red',
    300: 'red',
    400: 'red',
    500: 'red',
    600: 'red',
    700: 'red',
    800: 'red',
  },
  semantic: {
    100: 'red',
    200: 'red',
    300: 'red',
    400: 'red',
    500: 'red',
    600: 'red',
    700: 'red',
    800: 'red',
  },
} as const;

export const getModeColors = (mode: ThemeMode) => {
  return mode === 'dark' ? darkColors : colors;
};
