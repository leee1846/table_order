import { useAdminTranslation } from '@/config/i18n';
import { useEffect, useMemo, useState } from 'react';
import type { IShopSetting, TShopPosCode } from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { BasicButton, Dropdown, ToggleButton } from '@repo/ui/components';
import { ConnectionIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import type { MiscellaneousChange } from '../types';
import { usePostOrderOnboardingTest } from '@repo/api/queries';
import { useAuth } from '@/hooks/useAuth';
import { openDualActionDialog } from '@repo/feature/utils';

interface IntergrationProps {
  shopSetting?: IShopSetting;
  onChange?: (value: MiscellaneousChange) => void;
}

export const Intergration = ({ shopSetting, onChange }: IntergrationProps) => {
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();

  const { mutate: postOrderOnboardingTest } = usePostOrderOnboardingTest();
  const handlePostOrderOnboardingTest = () => {
    if (!shopCode) {
      return;
    }

    openDualActionDialog({
      title: t('온보딩 테스트'),
      content: t(
        '오케이포스 동기화 후 정상 진행 가능합니다. \n오케이포스의 정보와 동기화된 상태인지 확인 후 진행하세요.'
      ),
      primaryText: t('영수증 출력'),
      secondaryText: t('취소'),
      onConfirm: () => {
        postOrderOnboardingTest({ shopCode });
      },
    });
  };

  const posOptions = useMemo(
    () => [
      { value: 'NONE', label: t('선택 안함') },
      { value: 'OKPOS', label: t('오케이포스') },
    ],
    [t]
  );
  const [shopPosCode, setShopPosCode] = useState('NONE');
  const [useSoldOutAutoRestore, setUseSoldOutAutoRestore] = useState(false);

  useEffect(() => {
    if (!shopSetting) {
      return;
    }

    setShopPosCode(shopSetting.shopPosCode ?? '');
    setUseSoldOutAutoRestore(shopSetting.useSoldOutAutoRestore ?? false);
  }, [shopSetting]);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    onChange({
      shopSetting: {
        shopSeq: shopSetting?.shopSeq,
        shopPosCode: shopPosCode as TShopPosCode,
        useSoldOutAutoRestore:
          shopPosCode === 'OKPOS' ? useSoldOutAutoRestore : false,
      },
    });
  }, [onChange, shopPosCode, useSoldOutAutoRestore, shopSetting?.shopSeq]);

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
      {shopPosCode === 'OKPOS' && (
        <>
          <UIStyles.setting.ContentLayout>
            <p>{t('메뉴 품절 자동 해제')}</p>
            <ToggleButton
              size="M"
              isOn={useSoldOutAutoRestore}
              onChange={() => setUseSoldOutAutoRestore(!useSoldOutAutoRestore)}
            />
          </UIStyles.setting.ContentLayout>
          <UIStyles.setting.ContentLayout>
            <p>{t('온보딩 테스트')}</p>
            <BasicButton
              variant="Outline_Grey_M"
              onClick={handlePostOrderOnboardingTest}
            >
              {t('영수증 출력')}
            </BasicButton>
          </UIStyles.setting.ContentLayout>
        </>
      )}
    </SectionWrapper>
  );
};
