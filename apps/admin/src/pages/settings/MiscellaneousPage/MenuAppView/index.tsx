import { useAdminTranslation } from '@/config/i18n';
import { useEffect, useMemo, useState } from 'react';
import type { IShopSetting, TMenuboardTemplateType } from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { Dropdown, ToggleButton } from '@repo/ui/components';
import { DisplayIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

interface MenuAppViewProps {
  shopSetting?: IShopSetting;
}

export const MenuAppView = ({ shopSetting }: MenuAppViewProps) => {
  const { t } = useAdminTranslation();
  const templateOptions = useMemo(
    () => [
      {
        value: 'DEFAULT' as TMenuboardTemplateType,
        label: t('기본'),
      },
      {
        value: 'VERTICAL_TEXT' as TMenuboardTemplateType,
        label: t('세로형 텍스트'),
      },
      {
        value: 'VERTICAL_IMAGE' as TMenuboardTemplateType,
        label: t('세로형 이미지'),
      },
    ],
    [t]
  );
  const [useDarkTheme, setUseDarkTheme] = useState(false);
  const [menuboardTemplateType, setMenuboardTemplateType] = useState<
    TMenuboardTemplateType | ''
  >('');
  const [isMenuThreeColumnLayout, setIsMenuThreeColumnLayout] = useState(false);

  useEffect(() => {
    if (!shopSetting) {
      return;
    }

    setUseDarkTheme(Boolean(shopSetting.useDarkTheme));
    setMenuboardTemplateType(shopSetting.menuboardTemplateType ?? '');
    setIsMenuThreeColumnLayout(Boolean(shopSetting.isMenuThreeColumnLayout));
  }, [shopSetting]);

  return (
    <SectionWrapper
      title={t('메뉴판 화면 설정')}
      icon={
        <DisplayIcon width={32} height={32} color={theme.colors.primary[500]} />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>{t('템플릿 설정')}</p>
        <Dropdown
          options={templateOptions}
          value={menuboardTemplateType}
          onChange={(value) =>
            setMenuboardTemplateType(value as TMenuboardTemplateType | '')
          }
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('메뉴판 3열 배치')}</p>
        <ToggleButton
          size="M"
          isOn={isMenuThreeColumnLayout}
          onChange={() => setIsMenuThreeColumnLayout(!isMenuThreeColumnLayout)}
        />
      </UIStyles.setting.ContentLayout>
    </SectionWrapper>
  );
};
