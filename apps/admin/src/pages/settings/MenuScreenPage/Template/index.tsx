import { useAdminTranslation } from '@/config/i18n';
import { ToggleButton } from '@repo/ui/components';
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
  onChangeThreeColumnLayout,
}: TemplateProps) => {
  const { t } = useAdminTranslation();

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
        {/* <S.OptionRow>
          <S.OptionLabel>{t('템플릿 선택')}</S.OptionLabel>
          <Dropdown
            options={templateOptions}
            value={templateType}
            onChange={(value) =>
              onChangeTemplateType(value as TMenuboardTemplateType)
            }
            disabled={true}
          />
        </S.OptionRow> */}
      </S.TemplateOptions>
    </S.Container>
  );
};
