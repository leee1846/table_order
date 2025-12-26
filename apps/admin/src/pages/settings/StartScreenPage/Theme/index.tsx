import { useState } from 'react';
import { RadioButton } from '@repo/ui/components';
import * as S from '@/pages/settings/StartScreenPage/Theme/theme.style';
import { theme } from '@repo/ui';

export const Theme = () => {
  const [selectedTheme, setSelectedTheme] = useState<
    'light' | 'dark' | 'image'
  >('light');

  return (
    <S.Container>
      <S.Themes>
        <button type="button" onClick={() => setSelectedTheme('light')}>
          <S.ThemeColor backgroundColors={theme.colors.white}>
            <div></div>
            <div>IMAGE</div>
          </S.ThemeColor>
          <RadioButton
            value="light"
            onChange={() => setSelectedTheme('light')}
            checked={selectedTheme === 'light'}
            customStyle={S.RadioButtonStyle}
          >
            <span>밝은 테마</span>
          </RadioButton>
        </button>
        <button type="button" onClick={() => setSelectedTheme('dark')}>
          <S.ThemeColor backgroundColors={theme.colors.black}>
            <div></div>
            <div> IMAGE</div>
          </S.ThemeColor>
          <RadioButton
            value="dark"
            onChange={() => setSelectedTheme('dark')}
            checked={selectedTheme === 'dark'}
            customStyle={S.RadioButtonStyle}
          >
            <span>어두운 테마</span>
          </RadioButton>
        </button>
        <button type="button" onClick={() => setSelectedTheme('image')}>
          <S.ThemeColor backgroundColors={theme.colors.grey[200]}>
            IMAGE
          </S.ThemeColor>
          <RadioButton
            value="image"
            onChange={() => setSelectedTheme('image')}
            checked={selectedTheme === 'image'}
            customStyle={S.RadioButtonStyle}
          >
            <span>전체 이미지</span>
          </RadioButton>
        </button>
      </S.Themes>
    </S.Container>
  );
};
