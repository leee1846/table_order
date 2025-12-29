import { useState } from 'react';
import { RadioButton } from '@repo/ui/components';
import * as S from '@/pages/settings/MenuScreenPage/ScreenMode/screenMode.style';
import LightModeImage from '@/pages/settings/MenuScreenPage/ScreenMode/assets/light_mode.svg';
import DarkModeImage from '@/pages/settings/MenuScreenPage/ScreenMode/assets/dark_mode.svg';

export const ScreenMode = () => {
  const [selectedMode, setSelectedMode] = useState<'light' | 'dark'>('light');

  return (
    <S.Container>
      <p>화면 모드</p>
      <S.Modes>
        <button type="button" onClick={() => setSelectedMode('light')}>
          <S.ModePreview>
            <S.PreviewImage src={LightModeImage} alt="라이트 모드 미리보기" />
          </S.ModePreview>
          <RadioButton
            value="light"
            onChange={() => setSelectedMode('light')}
            checked={selectedMode === 'light'}
          >
            <span>라이트</span>
          </RadioButton>
        </button>
        <button type="button" onClick={() => setSelectedMode('dark')}>
          <S.ModePreview>
            <S.PreviewImage src={DarkModeImage} alt="다크 모드 미리보기" />
          </S.ModePreview>
          <RadioButton
            value="dark"
            onChange={() => setSelectedMode('dark')}
            checked={selectedMode === 'dark'}
          >
            <span>다크</span>
          </RadioButton>
        </button>
      </S.Modes>
    </S.Container>
  );
};
