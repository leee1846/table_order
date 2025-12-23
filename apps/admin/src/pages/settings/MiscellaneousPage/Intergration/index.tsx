import { useEffect, useState } from 'react';
import type { IShopSetting } from '@repo/api/types';
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

const posOptions = [{ value: 'OKPOS', label: '오케이포스' }];

export const Intergration = ({ shopSetting, onChange }: IntergrationProps) => {
  const [shopPosCode, setShopPosCode] = useState('');

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
        shopPosCode,
      },
    });
  }, [onChange, shopPosCode, shopSetting?.shopSeq]);

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
            setShopPosCode(String(value));
          }}
        />
      </UIStyles.setting.ContentLayout>
    </SectionWrapper>
  );
};
