import { useEffect, useState } from 'react';
import type { IShopSetting, TMenuboardTemplateType } from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { Dropdown, ToggleButton } from '@repo/ui/components';
import { DisplayIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

interface MenuAppViewProps {
  shopSetting?: IShopSetting;
}

const templateOptions = [
  { value: 'DEFAULT' as TMenuboardTemplateType, label: '기본' },
  { value: 'VERTICAL_TEXT' as TMenuboardTemplateType, label: '세로형 텍스트' },
  { value: 'VERTICAL_IMAGE' as TMenuboardTemplateType, label: '세로형 이미지' },
];

export const MenuAppView = ({ shopSetting }: MenuAppViewProps) => {
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
      title="메뉴판 화면 설정"
      icon={
        <DisplayIcon width={32} height={32} color={theme.colors.primary[500]} />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>템플릿 설정</p>
        <Dropdown
          options={templateOptions}
          value={menuboardTemplateType}
          onChange={(value) =>
            setMenuboardTemplateType(value as TMenuboardTemplateType | '')
          }
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>메뉴판 3열 배치</p>
        <ToggleButton
          size="M"
          isOn={isMenuThreeColumnLayout}
          onChange={() => setIsMenuThreeColumnLayout(!isMenuThreeColumnLayout)}
        />
      </UIStyles.setting.ContentLayout>
    </SectionWrapper>
  );
};
