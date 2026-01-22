import { useEffect, useRef } from 'react';
import { SystemControl, type SystemStatus } from '@repo/util/app';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useShopData } from '@/hooks/useShopData';
import { usePostDeviceDetail } from '@repo/api/queries';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { getDeviceInfo } from '@/utils/deviceInfo';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';

/**
 * 시스템 상태(배터리, WiFi 신호) 모니터링 및 동기화를 담당하는 커스텀 훅
 *
 * @description
 * - Android 네이티브 브릿지를 통해 배터리 및 WiFi 신호를 실시간으로 모니터링합니다
 * - 상태 변경 시 로컬 Store와 서버에 자동으로 동기화합니다
 * - 디바이스 초기화가 완료된 후에만 서버 동기화를 수행합니다
 */
export const useSystemStatusMonitor = () => {
  const { t } = useAdminTranslation();
  const { data: deviceData, setDataAsync } = useDeviceData({
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

  // 리스너는 앱 시작 시 즉시 등록
  // SystemControl.startMonitoring이 호출되면 즉시 현재 상태를 1회 발송하고, 이후 변경 시마다 콜백 호출
  useEffect(() => {
    // 시스템 상태 업데이트 핸들러: 배터리 및 WiFi 신호 변경 시 호출됨
    const handleStatusUpdate = async (status: SystemStatus) => {
      // TODO 브릿지가 계속 pending상태임 체크 필요.
      const currentDeviceData = deviceDataRef.current;
      const currentShopData = shopDataRef.current;

      let shouldUpdateDeviceData = false;
      let newBattery: number | undefined;
      let newWifi: number | undefined;

      // 배터리 레벨이 제공된 경우
      if (status.battery !== undefined && status.battery !== null) {
        if (currentDeviceData) {
          // deviceData가 있으면 비교 후 변경된 경우에만 업데이트 (중복 업데이트 방지)
          const prevBattery = currentDeviceData.battery ?? 0;
          if (prevBattery !== status.battery) {
            shouldUpdateDeviceData = true;
            newBattery = status.battery;
          }
        } else {
          // deviceData가 null이면 항상 업데이트 (초기 설정)
          shouldUpdateDeviceData = true;
          newBattery = status.battery;
        }
      }

      // WiFi 신호 강도가 제공된 경우 (0~4 정규화된 값)
      if (status.wifi !== undefined && status.wifi !== null) {
        const newWifiSignal = String(status.wifi);
        if (currentDeviceData) {
          // deviceData가 있으면 비교 후 변경된 경우에만 업데이트 (중복 업데이트 방지)
          const prevWifiSignal = currentDeviceData.wifiSignal ?? '';
          if (prevWifiSignal !== newWifiSignal) {
            shouldUpdateDeviceData = true;
            newWifi = status.wifi;
          }
        } else {
          // deviceData가 null이면 항상 업데이트 (초기 설정)
          shouldUpdateDeviceData = true;
          newWifi = status.wifi;
        }
      }

      // 상태 값이 변경된 경우에만 업데이트 수행
      if (shouldUpdateDeviceData) {
        let deviceDataToUpdate = currentDeviceData;

        // 🔒 deviceData가 없거나 필수 정보가 없으면 새로 가져오기
        if (
          !deviceDataToUpdate ||
          !deviceDataToUpdate.androidId ||
          !deviceDataToUpdate.ipAddress
        ) {
          const freshDeviceInfo = await getDeviceInfo({ t });
          deviceDataToUpdate = {
            ...(deviceDataToUpdate || {}),
            androidId: freshDeviceInfo.androidId,
            ipAddress: freshDeviceInfo.ipAddress,
            version: freshDeviceInfo.appInfo.version,
            buildNumber: freshDeviceInfo.appInfo.build,
          };
        }

        // 기존 디바이스 데이터와 새로운 배터리/WiFi 값을 병합
        const updatedDeviceData = {
          ...deviceDataToUpdate,
          ...(newBattery !== undefined && { battery: newBattery }),
          ...(newWifi !== undefined && { wifiSignal: String(newWifi) }),
        };

        // 로컬 스토리지에 항상 업데이트 (변경된 값이 있을 때만 실행됨)
        setDataAsync(updatedDeviceData);

        // 서버 동기화는 조건부로 실행
        // 조건 1: deviceData가 존재해야 함
        // 조건 2: 초기화가 완료되어야 함 (GET 요청이 완료된 후에만 POST)
        // 조건 3: shopCode가 있어야 함
        if (
          currentDeviceData &&
          isInitializedRef.current &&
          currentShopData?.shopCode
        ) {
          const tableNumber = currentDeviceData.tableNumber ?? null;
          // 필수 디바이스 정보가 모두 있어야 서버에 전송
          if (
            currentDeviceData?.androidId &&
            currentDeviceData?.ipAddress &&
            currentDeviceData?.wifiSignal
          ) {
            // 서버에 디바이스 정보 동기화 (새로운 값이 있으면 사용, 없으면 기존 값 사용)
            const deviceType = currentDeviceData.deviceType ?? 'MENU';
            await postDeviceDetail({
              shopCode: currentShopData.shopCode,
              androidId: currentDeviceData.androidId,
              ipAddress: currentDeviceData.ipAddress,
              deviceType,
              wifiSignal:
                newWifi !== null && newWifi !== undefined
                  ? String(newWifi)
                  : (currentDeviceData?.wifiSignal ?? null),
              // deviceType에 따라 올바른 필드만 설정
              tableNumber: deviceType === 'ORDER_POS' ? null : tableNumber,
              battery: newBattery ?? currentDeviceData.battery ?? 0,
              orderPosNumber: deviceType === 'ORDER_POS' ? (currentDeviceData.orderPosNumber ?? null) : null,
              // TODO: 아래 2개의 data도 app에서 값을 가져와야함.
              version: currentDeviceData.version ?? '',
              buildNumber: currentDeviceData.buildNumber ?? '',
            });
          }
        }
      }
    };

    // 시스템 상태 모니터링 시작 (배터리, WiFi 신호 감지 리스너 등록)
    // 호출 즉시 현재 상태를 1회 발송하고, 이후 변경 시마다 handleStatusUpdate 호출
    SystemControl.startMonitoring(handleStatusUpdate);

    // cleanup: 컴포넌트 언마운트 시 모니터링 중지
    return () => {
      SystemControl.stopMonitoring();
    };
  }, [setDataAsync, postDeviceDetail, t]);
};
