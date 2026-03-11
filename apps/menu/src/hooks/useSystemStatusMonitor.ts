import { useEffect, useRef } from 'react';
import { SystemControl, type SystemStatus } from '@repo/util/app';
import { useDeviceData } from '@/hooks/useDeviceData';
import { usePostDeviceDetail } from '@repo/api/queries';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { getDeviceInfo } from '@/utils/deviceInfo';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useShopStore } from '@/stores/useShopStore';

/**
 * WiFi 신호 모니터링 및 서버 동기화를 담당하는 커스텀 훅
 *
 * @description
 * - Android 네이티브 브릿지를 통해 WiFi 신호를 실시간으로 모니터링합니다
 * - 로그인 여부와 상관없이 WiFi 변경 시 디바이스 정보(wifi, getDeviceInfo)를 요청하고 스토어에 저장합니다
 * - 로그인된 경우에만 POST API로 서버 동기화를 수행합니다
 * - 배터리 정보는 무시하고 처리하지 않습니다
 */
export const useSystemStatusMonitor = () => {
  const { t } = useAdminTranslation();
  const { data: deviceData, refresh: refreshDeviceData } = useDeviceData({
    skipInitialRequest: true,
  });
  const { data: shopData } = useShopStore();
  const { mutateAsync: postDeviceDetail } = usePostDeviceDetail();
  const { isInitialized, setDataAsync } = useDeviceStore();

  // 최신 값들을 참조하기 위한 ref (비동기 콜백에서 최신 값 참조용)
  const deviceDataRef = useRef(deviceData);
  const shopDataRef = useRef(shopData);
  const isInitializedRef = useRef(isInitialized);
  const setDataAsyncRef = useRef(setDataAsync);
  const tRef = useRef(t);
  const postDeviceDetailRef = useRef(postDeviceDetail);
  const refreshDeviceDataRef = useRef(refreshDeviceData);

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

  // effect는 []로 한 번만 실행되므로 handleStatusUpdate는 최신 t/postDeviceDetail 등을 쓸 수 있게 ref로만 갱신
  useEffect(() => {
    setDataAsyncRef.current = setDataAsync;
    tRef.current = t;
    postDeviceDetailRef.current = postDeviceDetail;
    refreshDeviceDataRef.current = refreshDeviceData;
  }, [setDataAsync, t, postDeviceDetail, refreshDeviceData]);

  // 모니터링은 마운트 시 한 번만 등록/해제
  useEffect(() => {
    const handleStatusUpdate = async (status: SystemStatus) => {
      // 1. WiFi 유효성 (배터리는 무시)
      if (status.wifi === undefined || status.wifi === null) {
        return;
      }

      const newWifiSignal = String(status.wifi);

      // 2. 현재 스토어 데이터
      const currentData = deviceDataRef.current;

      // 3. WiFi 변경 시에만 처리
      if (currentData?.wifiSignal === newWifiSignal) {
        return;
      }

      const setDataAsync = setDataAsyncRef.current;
      const t = tRef.current;
      const postDeviceDetail = postDeviceDetailRef.current;
      const refreshDeviceData = refreshDeviceDataRef.current;

      // 4. 디바이스 정보 요청 (wifi + getDeviceInfo) - 요청한 정보만 사용
      let androidId: string;
      let ipAddress: string;
      let version: string;
      let buildNumber: string;

      if (currentData?.androidId && currentData?.ipAddress) {
        androidId = currentData.androidId;
        ipAddress = currentData.ipAddress;
        version = currentData.version ?? '';
        buildNumber = currentData.buildNumber ?? '';
      } else {
        const freshInfo = await getDeviceInfo({ t });
        androidId = freshInfo.androidId;
        ipAddress = freshInfo.ipAddress;
        version = freshInfo.appInfo.version;
        buildNumber = freshInfo.appInfo.build;
      }

      // 5. 요청한 정보만 스토어에 저장 (wifi, getDeviceInfo 결과)
      setDataAsync({
        ...(currentData ?? {}),
        androidId,
        ipAddress,
        version,
        buildNumber,
        wifiSignal: newWifiSignal,
      });

      // 6. 로그인된 경우에만 POST API 호출
      const shopData = shopDataRef.current;
      const canSyncToServer = !!shopData?.shopCode && isInitializedRef.current;

      if (!canSyncToServer) {
        return;
      }

      const deviceType = currentData?.deviceType ?? 'MENU';
      let tableNumber = currentData?.tableNumber ?? null;

      // reload 직후 AppStorage hydration 전에 tableNumber가 null일 수 있으므로 서버에서 가져오기
      if (tableNumber === null && androidId && shopData?.shopCode) {
        const freshDeviceData = await refreshDeviceData();
        tableNumber = freshDeviceData?.tableNumber ?? null;
      }

      await postDeviceDetail({
        shopCode: shopData.shopCode,
        androidId,
        ipAddress,
        deviceType,
        wifiSignal: newWifiSignal,
        tableNumber: deviceType === 'ORDER_POS' ? null : tableNumber,
        battery: currentData?.battery ?? 0,
        orderPosNumber:
          deviceType === 'ORDER_POS'
            ? (currentData?.orderPosNumber ?? null)
            : null,
        version,
        buildNumber,
        controlStatus: null,
      });
    };

    SystemControl.startMonitoring(handleStatusUpdate);

    return () => {
      SystemControl.stopMonitoring();
    };
  }, []);
};
