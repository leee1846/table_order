import { useEffect } from 'react';
import { useSSE } from '@repo/feature/hooks';
import type { ISseMessage, IDevice } from '@repo/api/types';
import { SSE_KEYS } from '@/constants/keys';
import { useTheftAlertStore } from '@/stores/useTheftAlertStore';
import { SystemControl } from '@repo/util/app';

/**
 * DEVICE_THEFT SSE 메시지를 감지하고 도난 알림을 처리하는 훅
 *
 * 이 훅을 사용하는 페이지에서는 자동으로:
 * - DEVICE_THEFT 메시지 감지
 * - 메뉴판 기기 도난 알림 팝업 표시
 * - 도난 알림음(siren) 재생
 */
export const useDeviceTheftDetector = () => {
  const { data } = useSSE.useSSEData<ISseMessage>(SSE_KEYS.MAIN_CONNECTION);
  const { openAlert } = useTheftAlertStore();

  useEffect(() => {
    if (data?.type === 'DEVICE_THEFT') {
      // data는 DeviceVo 객체
      if (
        data.data &&
        typeof data.data === 'object' &&
        !Array.isArray(data.data)
      ) {
        const deviceData = data.data as unknown as IDevice;

        // deviceType이 MENU인 경우만 처리
        if (deviceData?.deviceType === 'MENU') {
          // 도난 알림 팝업 열기
          openAlert(deviceData.tableNumber || '');
          // 도난 알림음 재생 (경고음)
          SystemControl.playSound({ type: 'siren' });
        }
      }
    }
  }, [data, openAlert]);
};
