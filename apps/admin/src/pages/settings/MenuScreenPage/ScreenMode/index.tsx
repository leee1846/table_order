import { RadioButton } from '@repo/ui/components';
import * as S from '@/pages/settings/MenuScreenPage/ScreenMode/screenMode.style';
import LightModeImage from '@/pages/settings/MenuScreenPage/ScreenMode/assets/light_mode.svg';
import DarkModeImage from '@/pages/settings/MenuScreenPage/ScreenMode/assets/dark_mode.svg';

export type ScreenModeOption = 'light' | 'dark';

interface ScreenModeProps {
  mode: ScreenModeOption;
  onChange: (mode: ScreenModeOption) => void;
}

export const ScreenMode = ({ mode, onChange }: ScreenModeProps) => {
  return (
    <S.Container>
      <p>화면 모드</p>
      <S.Modes>
        <button type="button" onClick={() => onChange('light')}>
          <S.ModePreview>
            <S.PreviewImage src={LightModeImage} alt="라이트 모드 미리보기" />
          </S.ModePreview>
          <RadioButton
            value="light"
            onChange={() => onChange('light')}
            checked={mode === 'light'}
          >
            <span>라이트</span>
          </RadioButton>
        </button>
        <button type="button" onClick={() => onChange('dark')}>
          <S.ModePreview>
            <S.PreviewImage src={DarkModeImage} alt="다크 모드 미리보기" />
          </S.ModePreview>
          <RadioButton
            value="dark"
            onChange={() => onChange('dark')}
            checked={mode === 'dark'}
          >
            <span>다크</span>
          </RadioButton>
        </button>
      </S.Modes>
    </S.Container>
  );
};
