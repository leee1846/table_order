import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { usePostDeviceDetail } from '@repo/api/queries';
import type { IPostDeviceDetailRequestBase } from '@repo/api/types';
import {
  AndroidInfo,
  CapacitorApp,
  SystemControl,
  type SystemStatus,
} from '@repo/util/app';

export const useSystemStatusMonitor = () => {
  const { shopCode } = useAuth();
  const { mutateAsync: postDeviceDetail } = usePostDeviceDetail();

  const deviceStateRef = useRef<IPostDeviceDetailRequestBase>({
    androidId: '',
    deviceType: 'POS_APP',
    tableNumber: null,
    orderPosNumber: null,
    ipAddress: '',
    battery: null,
    wifiSignal: null,
    version: '',
    buildNumber: '',
  });

  //모니터링 true면 종료
  const isMonitoringRef = useRef(false);
  const shopCodeRef = useRef<string | null>(shopCode ?? null);

  // 컴포넌트 마운트, shopCode 변경 시 초기화
  useEffect(() => {
    shopCodeRef.current = shopCode ?? null;
  }, [shopCode]);

  //deviceDetail post 함수
  const tryPostDeviceDetail = useCallback(async () => {
    const currentShopCode = shopCodeRef.current;
    const { version, buildNumber } = deviceStateRef.current;

    if (!deviceStateRef.current.androidId) {
      const androidId = await AndroidInfo.getId();
      deviceStateRef.current.androidId = androidId ?? '';
    }

    if (!deviceStateRef.current.ipAddress) {
      const ipAddress = await AndroidInfo.getIp();
      deviceStateRef.current.ipAddress = ipAddress ?? '';
    }

    const { androidId, ipAddress, wifiSignal, battery } =
      deviceStateRef.current;

    if (
      !currentShopCode ||
      !androidId ||
      !ipAddress ||
      wifiSignal === null ||
      wifiSignal === undefined
    ) {
      return;
    }

    const batteryToSend = battery ?? null;

    try {
      await postDeviceDetail({
        shopCode: currentShopCode,
        androidId,
        ipAddress,
        deviceType: 'POS_APP',
        wifiSignal,
        battery: batteryToSend,
        tableNumber: null,
        orderPosNumber: null,
        version: version ?? '',
        buildNumber: buildNumber ?? '',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('디바이스 정보 전송 실패:', error);
    }
  }, [postDeviceDetail]);

  //deviceInfo 초기화 함수
  const hydrateDeviceInfo = useCallback(async () => {
    const [androidId, ipAddress, appInfo] = await Promise.all([
      AndroidInfo.getId(),
      AndroidInfo.getIp(),
      CapacitorApp.getInfo(),
    ]);

    deviceStateRef.current = {
      ...deviceStateRef.current,
      androidId: androidId ?? deviceStateRef.current.androidId,
      ipAddress: ipAddress ?? deviceStateRef.current.ipAddress,
      version: appInfo?.version ?? deviceStateRef.current.version,
      buildNumber: appInfo?.build ?? deviceStateRef.current.buildNumber,
    };

    await tryPostDeviceDetail();
  }, [tryPostDeviceDetail]);

  //상태 업데이트 함수
  const handleStatusUpdate = useCallback(
    async (status: SystemStatus) => {
      const currentState = deviceStateRef.current;
      let shouldPost = false;

      const updatedState: IPostDeviceDetailRequestBase = {
        ...currentState,
      };

      if (status.battery !== undefined && status.battery !== null) {
        if (currentState.battery !== status.battery) {
          updatedState.battery = status.battery;
          shouldPost = true;
        }
      }

      if (status.wifi !== undefined && status.wifi !== null) {
        const wifiSignal = String(status.wifi);
        if (currentState.wifiSignal !== wifiSignal) {
          updatedState.wifiSignal = wifiSignal;
          shouldPost = true;
        }
      }

      if (!shouldPost) {
        return;
      }

      deviceStateRef.current = updatedState;

      await tryPostDeviceDetail();
    },
    [tryPostDeviceDetail]
  );

  //모니터링 시작 함수
  const startMonitoringStatus = useCallback(() => {
    if (isMonitoringRef.current) {
      return;
    }

    try {
      //배터리, 와이파이 신호 감지 리스너 등록 네이티브에서 배터리랑 와이파이 값이 달라지면 handleStatusUpdate 함수 호출
      SystemControl.startMonitoring(handleStatusUpdate);
      isMonitoringRef.current = true;
    } catch (error) {
      console.error('시스템 상태 모니터링 시작 실패:', error);
    }
  }, [handleStatusUpdate]);

  //모니터링 종료 함수
  const stopMonitoringStatus = useCallback(() => {
    if (!isMonitoringRef.current) {
      return;
    }

    try {
      SystemControl.stopMonitoring();
    } catch (error) {
      console.error('시스템 상태 모니터링 종료 실패:', error);
    }
    isMonitoringRef.current = false;
  }, []);

  //shopCode가 변경될 때마다 초기화, 모니터링 시작, deviceDetail 전송
  useEffect(() => {
    //shopCode가 없으면 종료
    if (!shopCode) {
      return;
    }

    //deviceInfo 초기화, 모니터링 시작, deviceDetail 전송
    const setupDeviceStatus = async () => {
      await hydrateDeviceInfo();
      startMonitoringStatus();
      await tryPostDeviceDetail();
    };

    setupDeviceStatus();

    return () => {
      stopMonitoringStatus();
    };
  }, [
    shopCode,
    hydrateDeviceInfo,
    startMonitoringStatus,
    tryPostDeviceDetail,
    stopMonitoringStatus,
  ]);
};
