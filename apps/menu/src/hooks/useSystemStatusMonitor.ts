import { useEffect, useRef } from 'react';
import { SystemControl, type SystemStatus } from '@repo/util/app';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { usePostDeviceDetail } from '@repo/api/queries';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { getDeviceInfo } from '@/utils/deviceInfo';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';

/**
 * WiFi 신호 모니터링 및 서버 동기화를 담당하는 커스텀 훅
 *
 * @description
 * - Android 네이티브 브릿지를 통해 WiFi 신호를 실시간으로 모니터링합니다
 * - WiFi 신호 변경 시에만 서버에 자동으로 동기화합니다
 * - 배터리 정보는 무시하고 처리하지 않습니다
 * - 디바이스 초기화가 완료된 후에만 서버 동기화를 수행합니다
 */
export const useSystemStatusMonitor = () => {
  const { t } = useAdminTranslation();
  const { data: deviceData } = useDeviceData({
    skipInitialRequest: true,
  });
  const { shopData } = useShopData({ skipInitialRequest: true });
  const { mutateAsync: postDeviceDetail } = usePostDeviceDetail();
  const { isInitialized } = useDeviceStore();

  // 최신 값들을 참조하기 위한 ref (비동기 콜백에서 최신 값 참조용)
  const deviceDataRef = useRef(deviceData);
  const shopDataRef = useRef(shopData);
  const isInitializedRef = useRef(isInitialized);

  // deviceData 변경 시 ref 동기화 (렌더링 없이 최신 값 유지)
  useEffect(() => {
    deviceDataRef.current = deviceData;
  }, [deviceData]);

  // shopData 변경 시 ref 동기화
  useEffect(() => {
    shopDataRef.current = shopData;
  }, [shopData]);

  // isInitialized 변경 시 ref 동기화
  useEffect(() => {
    isInitializedRef.current = isInitialized;
  }, [isInitialized]);

  useEffect(() => {
    const handleStatusUpdate = async (status: SystemStatus) => {
      // 배터리는 무시하고 WiFi만 처리
      if (status.wifi === undefined || status.wifi === null) {
        return;
      }

      const deviceData = deviceDataRef.current;
      const shopData = shopDataRef.current;
      const newWifiSignal = String(status.wifi);

      // WiFi 값이 변경되었는지 확인
      const isWifiChanged = !deviceData || deviceData.wifiSignal !== newWifiSignal;
      if (!isWifiChanged) {
        return;
      }

      // 서버 동기화 전제 조건 확인
      const canSyncToServer =
        deviceData &&
        isInitializedRef.current &&
        shopData?.shopCode;

      if (!canSyncToServer) {
        return;
      }

      // 필수 디바이스 정보가 없으면 새로 가져오기
      let deviceInfo = deviceData;
      if (!deviceInfo.androidId || !deviceInfo.ipAddress) {
        const freshInfo = await getDeviceInfo({ t });
        deviceInfo = {
          ...deviceInfo,
          androidId: freshInfo.androidId,
          ipAddress: freshInfo.ipAddress,
          version: freshInfo.appInfo.version,
          buildNumber: freshInfo.appInfo.build,
        };
      }

      // 필수 정보가 모두 있어야 서버에 전송
      if (!deviceInfo.androidId || !deviceInfo.ipAddress) {
        return;
      }

      // 서버에 WiFi 신호 동기화
      const deviceType = deviceInfo.deviceType ?? 'MENU';
      const tableNumber = deviceInfo.tableNumber ?? null;

      await postDeviceDetail({
        shopCode: shopData.shopCode,
        androidId: deviceInfo.androidId,
        ipAddress: deviceInfo.ipAddress,
        deviceType,
        wifiSignal: newWifiSignal,
        tableNumber: deviceType === 'ORDER_POS' ? null : tableNumber,
        battery: deviceInfo.battery ?? 0,
        orderPosNumber:
          deviceType === 'ORDER_POS' ? deviceInfo.orderPosNumber ?? null : null,
        version: deviceInfo.version ?? '',
        buildNumber: deviceInfo.buildNumber ?? '',
      });
    };

    SystemControl.startMonitoring(handleStatusUpdate);

    return () => {
      SystemControl.stopMonitoring();
    };
  }, [postDeviceDetail, t]);
};
