import { useState } from 'react';
import { RadioButton } from '@repo/ui/components';
import * as S from '@/pages/settings/MenuScreenPage/ScreenMode/screenMode.style';
import { theme } from '@repo/ui';

export const ScreenMode = () => {
  const [selectedMode, setSelectedMode] = useState<'light' | 'dark'>('light');

  return (
    <S.Container>
      <p>화면 모드</p>
      <S.Modes>
        <button type="button" onClick={() => setSelectedMode('light')}>
          <S.ModePreview>
            <S.PreviewContent light>
              <S.PreviewBlock />
              <S.PreviewBlock />
              <S.PreviewScrollBar />
            </S.PreviewContent>
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
            <S.PreviewContent dark>
              <S.PreviewBlock />
              <S.PreviewBlock />
              <S.PreviewScrollBar />
            </S.PreviewContent>
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

