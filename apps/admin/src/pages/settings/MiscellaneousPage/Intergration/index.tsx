import { useAdminTranslation } from '@/config/i18n';
import { useEffect, useMemo, useState } from 'react';
import type { IShopSetting, TShopPosCode } from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { Dropdown } from '@repo/ui/components';
import { ConnectionIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { MiscellaneousChange } from '../types';

interface IntergrationProps {
  shopSetting?: IShopSetting;
  onChange?: (value: MiscellaneousChange) => void;
}

export const Intergration = ({ shopSetting, onChange }: IntergrationProps) => {
  const { t } = useAdminTranslation();
  const posOptions = useMemo(
    () => [
      { value: 'NONE', label: t('선택 안함') },
      { value: 'OKPOS', label: t('오케이포스') },
    ],
    [t]
  );
  const [shopPosCode, setShopPosCode] = useState('NONE');

  useEffect(() => {
    if (!shopSetting) {
      return;
    }

    setShopPosCode(shopSetting.shopPosCode ?? '');
  }, [shopSetting]);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    onChange({
      shopSetting: {
        shopSeq: shopSetting?.shopSeq,
        shopPosCode: shopPosCode as TShopPosCode,
      },
    });
  }, [onChange, shopPosCode, shopSetting?.shopSeq]);

  return (
    <SectionWrapper
      title={t('연동 관리')}
      icon={
        <ConnectionIcon
          width={32}
          height={32}
          color={theme.colors.primary[500]}
        />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>{t('POS 연동')}</p>
        <Dropdown
          options={posOptions}
          value={shopPosCode}
          onChange={(value) => {
            setShopPosCode(String(value));
          }}
        />
      </UIStyles.setting.ContentLayout>
    </SectionWrapper>
  );
};
