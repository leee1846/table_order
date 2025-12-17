import { theme } from '@repo/ui';
import { SettingsIcon } from '@repo/ui/icons';
import { BasicButton } from '@repo/ui/components';
import { Account } from '@/pages/settings/MiscellaneousPage/Account';
import { Detail } from '@/pages/settings/MiscellaneousPage/Detail';
import * as S from '@/pages/settings/MiscellaneousPage/MiscellaneousPage.style';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useEffect, useState } from 'react';
import { useDeviceData } from '@/hooks/useDeviceData';
import { usePostDeviceDetail } from '@repo/api/queries';
import { useShopData } from '@/hooks/useShopData';
import { toast } from '@repo/feature/utils';

export const MiscellaneousPage = () => {
  const { t } = useAdminTranslation();

  const { data: deviceData, refresh: refreshDeviceData } = useDeviceData();
  const { shopData } = useShopData();

  const [useOrderposMode, setUseOrderposMode] = useState(false);
  const [orderPosNumber, setOrderPosNumber] = useState<number | null>(null);

  const handleOrderPosNumberChange = (value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed > 999) {
      return;
    }

    setOrderPosNumber(parsed);
  };

  const { mutateAsync: postDeviceDetail } = usePostDeviceDetail();
  const onSave = async () => {
    if (useOrderposMode && orderPosNumber === null) {
      toast(t('오더포스 번호를 입력해주세요.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    await postDeviceDetail({
      deviceType: useOrderposMode ? 'ORDER_POS' : 'MENU',
      tableNumber: useOrderposMode ? null : (deviceData?.tableNumber ?? 0),
      orderPosNumber: useOrderposMode ? orderPosNumber : null,
      shopCode: shopData?.shopCode ?? '',
      androidId: deviceData?.androidId ?? '',
      battery: deviceData?.battery ?? 0,
      wifiSignal: deviceData?.wifiSignal ?? '',
      ipAddress: deviceData?.ipAddress ?? '',
      version: deviceData?.version ?? '',
      buildNumber: deviceData?.buildNumber ?? '',
    });

    await refreshDeviceData();
    toast(t('설정이 저장되었습니다.'), {
      position: 'center-center',
      duration: 1500,
    });
  };

  useEffect(() => {
    if (!deviceData) {
      return;
    }

    setUseOrderposMode(deviceData?.deviceType === 'ORDER_POS');
    setOrderPosNumber(deviceData?.orderPosNumber ?? null);
  }, [deviceData]);

  return (
    <S.Container>
      <header>
        <div>
          <h1>{t('설정')}</h1>
          <SettingsIcon color={theme.colors.grey[800]} width={40} height={40} />
        </div>
        <BasicButton variant="Solid_Navy_XL" onClick={onSave}>
          {t('저장하기')}
        </BasicButton>
      </header>

      <S.Sections>
        <Account />
        <Detail
          useOrderposMode={useOrderposMode}
          onChangeUseOrderposMode={() => setUseOrderposMode((prev) => !prev)}
          orderPosNumber={orderPosNumber}
          handleOrderPosNumberChange={handleOrderPosNumberChange}
        />
      </S.Sections>
    </S.Container>
  );
};
