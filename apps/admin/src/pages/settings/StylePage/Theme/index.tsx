import { useState } from 'react';
import { RadioButton } from '@repo/ui/components';
import * as S from '@/pages/settings/StylePage/Theme/theme.style';
import { theme } from '@repo/ui';

export const Theme = () => {
  const [selectedTheme, setSelectedTheme] = useState<
    'light' | 'dark' | 'image'
  >('light');

  return (
    <S.Container>
      <p>테마 설정</p>
      <S.Themes>
        <button type="button" onClick={() => setSelectedTheme('light')}>
          <S.ThemeColor backgroundColors={theme.colors.grey[200]} />
          <RadioButton
            value="light"
            onChange={() => setSelectedTheme('light')}
            checked={selectedTheme === 'light'}
          >
            <span>밝은 테마</span>
          </RadioButton>
        </button>
        <button type="button" onClick={() => setSelectedTheme('dark')}>
          <S.ThemeColor backgroundColors={theme.colors.grey[800]} />
          <RadioButton
            value="dark"
            onChange={() => setSelectedTheme('dark')}
            checked={selectedTheme === 'dark'}
          >
            <span>어두운 테마</span>
          </RadioButton>
        </button>
        <button type="button" onClick={() => setSelectedTheme('image')}>
          <S.ThemeColor backgroundColors={theme.colors.primary[200]}>
            IMAGE
          </S.ThemeColor>
          <RadioButton
            value="image"
            onChange={() => setSelectedTheme('image')}
            checked={selectedTheme === 'image'}
          >
            <span>전체 이미지</span>
          </RadioButton>
        </button>
      </S.Themes>
    </S.Container>
  );
};
