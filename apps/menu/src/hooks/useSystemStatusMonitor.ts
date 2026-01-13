import { useEffect, useRef } from 'react';
import { SystemControl, type SystemStatus } from '@repo/util/app';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { usePostDeviceDetail } from '@repo/api/queries';
import { useDeviceStore } from '@/stores/useDeviceStore';

/**
 * SystemControl 리스너를 등록하고 상태 변경을 모니터링하는 훅
 * - 리스너는 앱 시작 시 즉시 등록
 * - 관련 값(battery, wifiSignal)을 업데이트
 */
export const useSystemStatusMonitor = () => {
  const { data: deviceData, setDataAsync } = useDeviceData({
    skipInitialRequest: true,
  });
  const { shopData } = useShopData({ skipInitialRequest: true });
  const { mutateAsync: postDeviceDetail } = usePostDeviceDetail();
  const { isInitialized } = useDeviceStore();

  // 최신 값들을 참조하기 위한 ref
  const deviceDataRef = useRef(deviceData);
  const shopDataRef = useRef(shopData);
  const isInitializedRef = useRef(isInitialized);

  useEffect(() => {
    deviceDataRef.current = deviceData;
  }, [deviceData]);

  useEffect(() => {
    shopDataRef.current = shopData;
  }, [shopData]);

  useEffect(() => {
    isInitializedRef.current = isInitialized;
  }, [isInitialized]);

  // 리스너는 앱 시작 시 즉시 등록
  useEffect(() => {
    const handleStatusUpdate = async (status: SystemStatus) => {
      // TODO 브릿지가 계속 pending상태임 체크 필요.
      const currentDeviceData = deviceDataRef.current;
      const currentShopData = shopDataRef.current;

      let shouldUpdateDeviceData = false;
      let newBattery: number | undefined;
      let newWifi: number | undefined;
      // battery가 제공된 경우
      if (status.battery !== undefined && status.battery !== null) {
        if (currentDeviceData) {
          // deviceData가 있으면 비교 후 변경된 경우에만 업데이트
          const prevBattery = currentDeviceData.battery ?? 0;
          if (prevBattery !== status.battery) {
            shouldUpdateDeviceData = true;
            newBattery = status.battery;
          }
        } else {
          // deviceData가 null이면 항상 업데이트
          shouldUpdateDeviceData = true;
          newBattery = status.battery;
        }
      }

      // wifi가 제공된 경우
      if (status.wifi !== undefined && status.wifi !== null) {
        const newWifiSignal = String(status.wifi);
        if (currentDeviceData) {
          // deviceData가 있으면 비교 후 변경된 경우에만 업데이트
          const prevWifiSignal = currentDeviceData.wifiSignal ?? '';
          if (prevWifiSignal !== newWifiSignal) {
            shouldUpdateDeviceData = true;
            newWifi = status.wifi;
          }
        } else {
          // deviceData가 null이면 항상 업데이트
          shouldUpdateDeviceData = true;
          newWifi = status.wifi;
        }
      }

      // status 관련 값은 항상 업데이트
      if (shouldUpdateDeviceData) {
        const updatedDeviceData = {
          ...(currentDeviceData || {}),
          ...(newBattery !== undefined && { battery: newBattery }),
          ...(newWifi !== undefined && { wifiSignal: String(newWifi) }),
        };

        // setDataAsync는 항상 실행
        setDataAsync(updatedDeviceData);

        // postDeviceDetail은 조건부로 실행
        // - deviceData가 있어야 함
        // - 초기화가 완료되어야 함 (GET 요청이 완료된 후에만 POST)
        if (
          currentDeviceData &&
          isInitializedRef.current &&
          currentShopData?.shopCode
        ) {
          const tableNumber = currentDeviceData.tableNumber ?? null;
          if (
            currentDeviceData?.androidId &&
            currentDeviceData?.ipAddress &&
            currentDeviceData?.wifiSignal
          ) {
            await postDeviceDetail({
              shopCode: currentShopData.shopCode,
              androidId: currentDeviceData.androidId,
              ipAddress: currentDeviceData.ipAddress,
              deviceType: currentDeviceData.deviceType ?? 'MENU',
              wifiSignal:
                newWifi !== null && newWifi !== undefined
                  ? String(newWifi)
                  : (currentDeviceData?.wifiSignal ?? null),
              tableNumber,
              battery: newBattery ?? currentDeviceData.battery ?? 0,
              orderPosNumber: currentDeviceData.orderPosNumber ?? null,
              // TODO: 아래 2개의 data도 app에서 값을 가져와야함.
              version: currentDeviceData.version ?? '',
              buildNumber: currentDeviceData.buildNumber ?? '',
            });
          }
        }
      }
    };

    SystemControl.startMonitoring(handleStatusUpdate);

    return () => {
      SystemControl.stopMonitoring();
    };
  }, [setDataAsync, postDeviceDetail]);
};
