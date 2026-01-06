import { t } from '@/config/i18n';
import { RadioButton } from '@repo/ui/components';
import type { TInitPageLayout } from '@repo/api/types';
import * as S from '@/pages/settings/StartScreenPage/Theme/theme.style';
import { theme } from '@repo/ui';

interface ThemeProps {
  value: TInitPageLayout;
  onChange: (value: TInitPageLayout) => void;
}

export const Theme = ({ value, onChange }: ThemeProps) => {
  return (
    <S.Container>
      <S.Themes>
        <button type="button" onClick={() => onChange('LIGHT')}>
          <S.ThemeColor backgroundColors={theme.colors.white}>
            <div></div>
            <div>IMAGE</div>
          </S.ThemeColor>
          <RadioButton
            value="LIGHT"
            onChange={() => onChange('LIGHT')}
            checked={value === 'LIGHT'}
            customStyle={S.RadioButtonStyle}
          >
            <span>{t('밝은 테마')}</span>
          </RadioButton>
        </button>
        <button type="button" onClick={() => onChange('DARK')}>
          <S.ThemeColor backgroundColors={theme.colors.black}>
            <div></div>
            <div> IMAGE</div>
          </S.ThemeColor>
          <RadioButton
            value="DARK"
            onChange={() => onChange('DARK')}
            checked={value === 'DARK'}
            customStyle={S.RadioButtonStyle}
          >
            <span>{t('어두운 테마')}</span>
          </RadioButton>
        </button>
        <button type="button" onClick={() => onChange('IMAGE')}>
          <S.ThemeColor backgroundColors={theme.colors.grey[200]}>
            IMAGE
          </S.ThemeColor>
          <RadioButton
            value="IMAGE"
            onChange={() => onChange('IMAGE')}
            checked={value === 'IMAGE'}
            customStyle={S.RadioButtonStyle}
          >
            <span>{t('전체 이미지')}</span>
          </RadioButton>
        </button>
      </S.Themes>
    </S.Container>
  );
};
