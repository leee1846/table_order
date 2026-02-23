import { useContext } from 'react';
import {
  ThemeModeContext,
  type ThemeModeContextValue,
} from '../contexts/ThemeModeContext';
import { createTheme } from '../theme/createTheme';

const defaultThemeModeValue: ThemeModeContextValue = {
  mode: 'light',
  theme: createTheme('light'),
  toggleMode: () => {
    // noop
  },
  setMode: () => {
    // noop
  },
  active: false,
};

export const useThemeMode = (): ThemeModeContextValue => {
  const context = useContext(ThemeModeContext);

  if (context !== undefined) {
    return context;
  }

  return defaultThemeModeValue;
};
