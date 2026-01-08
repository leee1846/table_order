import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { usePostDeviceDetail } from '@repo/api/queries';
import type { IDeviceBase } from '@repo/api/types';
import {
  AndroidInfo,
  CapacitorApp,
  SystemControl,
  type SystemStatus,
} from '@repo/util/app';

export const useSystemStatusMonitor = () => {
  const { shopCode } = useAuth();
  const { mutateAsync: postDeviceDetail } = usePostDeviceDetail();

  const deviceStateRef = useRef<IDeviceBase>({
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

  const isMonitoringRef = useRef(false);
  const shopCodeRef = useRef<string | null>(shopCode ?? null);

  useEffect(() => {
    shopCodeRef.current = shopCode ?? null;
  }, [shopCode]);

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

  const handleStatusUpdate = useCallback(
    async (status: SystemStatus) => {
      const currentState = deviceStateRef.current;
      let shouldPost = false;

      const updatedState: IDeviceBase = {
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

  const startMonitoringStatus = useCallback(() => {
    if (isMonitoringRef.current) {
      return;
    }

    try {
      SystemControl.startMonitoring(handleStatusUpdate);
      isMonitoringRef.current = true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('시스템 상태 모니터링 시작 실패:', error);
    }
  }, [handleStatusUpdate]);

  const stopMonitoringStatus = useCallback(() => {
    if (!isMonitoringRef.current) {
      return;
    }

    try {
      SystemControl.stopMonitoring();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('시스템 상태 모니터링 종료 실패:', error);
    } finally {
      isMonitoringRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!shopCode) {
      return;
    }

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
