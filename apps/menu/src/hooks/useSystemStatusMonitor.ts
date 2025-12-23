import { useEffect, useRef } from 'react';
import { SystemControl, type SystemStatus } from '@repo/util/app';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { usePostDeviceDetail } from '@repo/api/queries';

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

  // 최신 값들을 참조하기 위한 ref
  const deviceDataRef = useRef(deviceData);
  const shopDataRef = useRef(shopData);

  useEffect(() => {
    deviceDataRef.current = deviceData;
  }, [deviceData]);

  useEffect(() => {
    shopDataRef.current = shopData;
  }, [shopData]);

  // 리스너는 앱 시작 시 즉시 등록
  useEffect(() => {
    const handleStatusUpdate = async (status: SystemStatus) => {
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

        // TODO: 디바이스 정보 조회하는 브릿지가 생긴다면, 그건 테이블 선택할때 가져와서 device Api를
        // 요청해서 data 업데이트하고 여기는 업데이트되는 정보만 변경하는 방법으로 진행해야함
        // 그러면 useDeviceData에서 api요청 조건을 다시 확인해야함.
        // setDataAsync는 항상 실행
        setDataAsync(updatedDeviceData);

        // postDeviceDetail은 조건부로 실행 (deviceData가 있어야 함)
        if (currentDeviceData) {
          const tableNumber = currentDeviceData.tableNumber ?? null;
          if (tableNumber && currentShopData?.shopCode) {
            // TODO: 베터리, 와이파이 외 다른 값들도 업데이트 필요
            await postDeviceDetail({
              tableNumber,
              shopCode: currentShopData.shopCode,
              deviceType: currentDeviceData.deviceType ?? 'MENU',
              orderPosNumber: currentDeviceData.orderPosNumber ?? null,
              androidId: currentDeviceData.androidId ?? '',
              battery: newBattery ?? currentDeviceData.battery ?? 0,
              wifiSignal: String(newWifi ?? currentDeviceData.wifiSignal ?? ''),
              ipAddress: currentDeviceData.ipAddress ?? '',
              version: currentDeviceData.version ?? '',
              buildNumber: currentDeviceData.buildNumber ?? '',
            });
          }
        }
      }
    };

    // 리스너 등록 (앱 시작 시 즉시 등록)
    SystemControl.initListeners(handleStatusUpdate);
  }, [setDataAsync, postDeviceDetail]);
};
