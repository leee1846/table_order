import { useState, useEffect } from 'react';
import type { AxiosError } from '@repo/api/axios';
import type { IDevice } from '@repo/api/types';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { toast } from '@repo/feature/utils';

interface DeviceDataResult {
  data: Partial<IDevice> | null;
  error: AxiosError | null;
  clearData: () => void;
  setDataAsync: (data: Partial<IDevice>) => void;
  refresh: () => Promise<void>;
}

interface UseAdminAccessControlReturn {
  showAdminAccessPasswordModal: boolean;
  setShowAdminAccessPasswordModal: (show: boolean) => void;
}

/**
 * 관리자 접근 제어를 관리함
 * - 테이블이 없거나 유효하지 않을 경우 관리자 비밀번호 모달 표시
 *
 * @param deviceDataResult - 디바이스 데이터 결과
 * @returns 관리자 접근 비밀번호 모달 노출 여부 및 제어 함수
 */
export const useAdminAccessControl = (
  deviceDataResult: DeviceDataResult
): UseAdminAccessControlReturn => {
  const { data: tableGroupData } = useTableGroupData();

  const [showAdminAccessPasswordModal, setShowAdminAccessPasswordModal] =
    useState(false);

  const {
    data: deviceData,
    error: deviceDataError,
    clearData: clearDeviceData,
    setDataAsync: setDeviceDataAsync,
  } = deviceDataResult;

  useEffect(() => {
    // 선택한 테이블이 존재하지 않을 경우 모달 노출
    if (deviceDataError?.response?.status === 404) {
      clearDeviceData();
      setShowAdminAccessPasswordModal(true);
      return;
    }

    if (!deviceData) {
      return;
    }

    if (deviceData && !deviceData?.tableNumber) {
      setShowAdminAccessPasswordModal(true);
      return;
    }

    if (
      !!tableGroupData &&
      !tableGroupData
        .map((tableGroup) => tableGroup.tableList)
        .flat()
        .some((table) => table?.tableNumber === deviceData?.tableNumber)
    ) {
      toast('테이블이 삭제되었습니다.', {
        position: 'center-center',
        duration: 1500,
      });
      setDeviceDataAsync({
        ...deviceData,
        tableNumber: null,
      });
      setShowAdminAccessPasswordModal(true);
      return;
    }

    setShowAdminAccessPasswordModal(false);
  }, [
    deviceData,
    deviceDataError,
    clearDeviceData,
    tableGroupData,
    setDeviceDataAsync,
  ]);

  return {
    showAdminAccessPasswordModal,
    setShowAdminAccessPasswordModal,
  };
};
