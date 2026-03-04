import { useEffect, useState } from 'react';
import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { SettingsIcon } from '@repo/ui/icons';
import { toast } from '@repo/feature/utils';
import { usePostDeviceDetail } from '@repo/api/queries';
import type { IPostDeviceDetailRequest, TDeviceType } from '@repo/api/types';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { getDeviceInfo } from '@/utils/deviceInfo';
import { Account } from '@/pages/settings/MiscellaneousPage/Account';
import { Detail } from '@/pages/settings/MiscellaneousPage/Detail';
import { DeviceManagement } from '@/pages/settings/MiscellaneousPage/DeviceManagement';
import { Payment } from '@/pages/settings/MiscellaneousPage/Payment';
import * as S from '@/pages/settings/MiscellaneousPage/MiscellaneousPage.style';

const MAX_ORDER_POS_NUMBER = 999;
const TOAST_OPTIONS = {
  position: 'center-center' as const,
  duration: 1500,
};

export const MiscellaneousPage = () => {
  const { t } = useAdminTranslation();

  const { data: deviceData, setDataAsync: setDeviceData } = useDeviceData();
  const { shopData } = useShopData({ skipInitialRequest: true });
  const { mutateAsync: saveDeviceDetail } = usePostDeviceDetail();

  const [isOrderPosMode, setIsOrderPosMode] = useState(false);
  const [orderPosNumber, setOrderPosNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!deviceData) {
      return;
    }

    setIsOrderPosMode(deviceData.deviceType === 'ORDER_POS');
    setOrderPosNumber(deviceData.orderPosNumber ?? null);
  }, [deviceData]);

  const showToast = (message: string) => {
    toast(t(message), TOAST_OPTIONS);
  };

  const handleOrderPosNumberChange = (value: string) => {
    const parsedNumber = Number(value);
    if (Number.isNaN(parsedNumber) || parsedNumber > MAX_ORDER_POS_NUMBER) {
      return;
    }

    setOrderPosNumber(parsedNumber || null);
  };

  const handleToggleOrderPosMode = () => {
    setIsOrderPosMode((prev) => !prev);
  };

  const handleSave = async () => {
    if (isOrderPosMode && orderPosNumber === null) {
      showToast('오더포스 번호를 입력해주세요.');
      return;
    }

    // 🔒 최신 디바이스 정보 가져오기
    const freshDeviceInfo = await getDeviceInfo({ t });

    const baseDeviceDetail = {
      shopCode: shopData?.shopCode ?? '',
      androidId: freshDeviceInfo.androidId,
      battery: deviceData?.battery ?? 0,
      wifiSignal: deviceData?.wifiSignal ?? '',
      ipAddress: freshDeviceInfo.ipAddress,
      version: freshDeviceInfo.appInfo.version,
      buildNumber: freshDeviceInfo.appInfo.build,
    };

    const deviceDetail: IPostDeviceDetailRequest = {
      ...baseDeviceDetail,
      deviceType: (isOrderPosMode ? 'ORDER_POS' : 'MENU') as TDeviceType,
      tableNumber: isOrderPosMode ? null : (deviceData?.tableNumber ?? ''),
      orderPosNumber: isOrderPosMode ? orderPosNumber : null,
    };

    await saveDeviceDetail(deviceDetail);
    setDeviceData(deviceDetail);
    showToast('설정이 저장되었습니다.');
  };

  return (
    <S.Container>
      <header>
        <div>
          <h1>{t('설정')}</h1>
          <SettingsIcon color={theme.colors.grey[800]} width={40} height={40} />
        </div>
        <BasicButton variant="Solid_Navy_XL" onClick={handleSave}>
          {t('저장하기')}
        </BasicButton>
      </header>

      <S.Sections>
        <Account />
        <Detail
          useOrderposMode={isOrderPosMode}
          onChangeUseOrderposMode={handleToggleOrderPosMode}
          orderPosNumber={orderPosNumber}
          handleOrderPosNumberChange={handleOrderPosNumberChange}
        />
        <Payment />
        <DeviceManagement />
      </S.Sections>
    </S.Container>
  );
};
