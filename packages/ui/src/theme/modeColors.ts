import { colors } from './colors';

export type ThemeMode = 'light' | 'dark';

export const darkModeColors = {
  black: '#000000', // #000000
  white: '#ffffff', // #ffffff
  background: {
    100: '#0D0D0D',
  },
  grey: {
    50: '#303438',
    100: '#424951',
    200: '#525C67',
    300: '#C9CDD1',
    400: '#67717D',
    500: '#9AA1A8',
    600: '#A5AFB8',
    700: '#B7C0CA',
    800: '#C9D0D8',
    900: '#D8E0E8',
  },
  primary: {
    100: 'red',
    200: 'red',
    300: 'red',
    400: 'red',
    500: '#6F91FF',
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
  return mode === 'dark' ? darkModeColors : colors;
};
