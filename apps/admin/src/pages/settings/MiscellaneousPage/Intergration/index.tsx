import { useEffect, useState } from 'react';
import type { IShopSetting } from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { Dropdown } from '@repo/ui/components';
import { ConnectionIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

interface IntergrationProps {
  shopSetting?: IShopSetting;
}

const posOptions = [{ value: 'OKPOS', label: 'OKPOS' }];

export const Intergration = ({ shopSetting }: IntergrationProps) => {
  const [shopPosCode, setShopPosCode] = useState('');

  useEffect(() => {
    if (!shopSetting) {
      return;
    }

    setShopPosCode(shopSetting.shopPosCode ?? '');
  }, [shopSetting]);

  return (
    <SectionWrapper
      title="연동 관리"
      icon={
        <ConnectionIcon
          width={32}
          height={32}
          color={theme.colors.primary[500]}
        />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>POS 연동</p>
        <Dropdown
          options={posOptions}
          value={shopPosCode}
          onChange={(value) => {
            if (typeof value === 'string') {
              setShopPosCode(value);
            } else {
              setShopPosCode(String(value));
            }
          }}
        />
      </UIStyles.setting.ContentLayout>
    </SectionWrapper>
  );
};
