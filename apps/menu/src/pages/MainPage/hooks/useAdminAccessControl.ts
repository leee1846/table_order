import { useState, useEffect, useRef } from 'react';
import type { AxiosError } from '@repo/api/axios';
import type { IDevice } from '@repo/api/types';
import { useTableGroupData } from '@/hooks/useTableGroupData';
import { toast } from '@repo/feature/utils';

interface DeviceDataResult {
  data: Partial<IDevice> | null;
  error: AxiosError | null;
  clearData: () => void;
  setDataAsync: (data: Partial<IDevice>) => void;
  refresh: () => Promise<IDevice | undefined>;
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

  // tableNumber 변경을 감지하기 위한 ref
  const prevTableNumberRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    // 선택한 테이블이 존재하지 않을 경우 모달 노출
    if (deviceDataError?.response?.status === 404) {
      clearDeviceData();
      setShowAdminAccessPasswordModal(true);
      prevTableNumberRef.current = null;
      return;
    }

    if (!deviceData) {
      return;
    }

    // tableNumber가 실제로 변경되었을 때만 로직 실행
    const currentTableNumber = deviceData.tableNumber ?? null;
    if (prevTableNumberRef.current === currentTableNumber) {
      return; // tableNumber가 변경되지 않았으면 아무것도 하지 않음
    }

    prevTableNumberRef.current = currentTableNumber;

    // tableNumber가 없으면 모달 표시
    if (!currentTableNumber) {
      setShowAdminAccessPasswordModal(true);
      return;
    }

    // 테이블이 삭제되었는지 확인
    if (
      !!tableGroupData &&
      !tableGroupData
        .map((tableGroup) => tableGroup.tableList)
        .flat()
        .some((table) => table?.tableNumber === currentTableNumber)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deviceData?.tableNumber,
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
