import { useMemo } from 'react';
import { useAdminTranslation } from '@/config/i18n';
import { Dropdown, ToggleButton } from '@repo/ui/components';
import type { TMenuboardTemplateType } from '@repo/api/types';
import * as S from '@/pages/settings/MenuScreenPage/Template/template.style';

interface TemplateProps {
  isMenuThreeColumnLayout: boolean;
  templateType: TMenuboardTemplateType;
  onChangeThreeColumnLayout: (value: boolean) => void;
  onChangeTemplateType: (value: TMenuboardTemplateType) => void;
}

export const Template = ({
  isMenuThreeColumnLayout,
  templateType,
  onChangeTemplateType,
  onChangeThreeColumnLayout,
}: TemplateProps) => {
  const { t } = useAdminTranslation();
  const templateOptions = useMemo(
    () => [
      { value: 'DEFAULT', label: t('가로 기본형') },
      {
        value: 'VERTICAL_TEXT',
        label: t('세로 텍스트형'),
      },
      {
        value: 'VERTICAL_IMAGE',
        label: t('세로 이미지형'),
      },
    ],
    [t]
  );

  return (
    <S.Container>
      <p>{t('템플릿 설정')}</p>
      <S.TemplateOptions>
        <S.OptionRow>
          <S.OptionLabel>{t('3열 배치')}</S.OptionLabel>
          <ToggleButton
            size="M"
            isOn={isMenuThreeColumnLayout}
            onChange={() => onChangeThreeColumnLayout(!isMenuThreeColumnLayout)}
          />
        </S.OptionRow>
        <S.OptionRow>
          <S.OptionLabel>
            {t('템플릿 선택')}
          </S.OptionLabel>
          <Dropdown
            options={templateOptions}
            value={templateType}
            onChange={(value) =>
              onChangeTemplateType(value as TMenuboardTemplateType)
            }
          />
        </S.OptionRow>
      </S.TemplateOptions>
    </S.Container>
  );
};
