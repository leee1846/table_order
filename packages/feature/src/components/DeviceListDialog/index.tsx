import { useEffect, useMemo, useState } from 'react';
import {
  ModalBackground,
  Pagination,
  BasicButton,
  CheckButton,
  ChipButton,
} from '@repo/ui/components';
import { CloseIcon, FullBatteryIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { useGetDeviceListWithPagination } from '@repo/api/queries';
import type { IGetDeviceListItem, TDeviceType } from '@repo/api/types';
import * as S from './deviceListDialog.style';

const { colors } = theme;

export type DeviceItem = {
  id: string;
  device: string;
  table: string;
  battery: number | null;
  wifiSignal: string | number | null;
  ip: string;
  version: string;
  buildNumber: string;
};

export type DeviceListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  shopCode?: string;
  itemsPerPage?: number;
};

const DEVICE_TYPE_LABELS: Record<TDeviceType, string> = {
  ORDER_POS: '오더포스',
  POS_APP: '포스앱',
  MENU: '메뉴판',
};

const getDeviceLabel = (device: IGetDeviceListItem) => {
  const baseLabel = DEVICE_TYPE_LABELS[device.deviceType] ?? '기기';

  if (device.deviceType === 'MENU' && device.tableNumber) {
    return `${baseLabel} ${device.tableNumber}`;
  }

  if (
    device.deviceType === 'ORDER_POS' &&
    device.orderPosNumber !== null &&
    device.orderPosNumber !== undefined
  ) {
    return `${baseLabel} ${device.orderPosNumber}`;
  }

  return baseLabel;
};

const formatWifiSignal = (signal: DeviceItem['wifiSignal']) => {
  if (signal === null || signal === undefined || signal === '') {
    return '-';
  }

  const numericSignal = Number(signal);
  if (!Number.isNaN(numericSignal)) {
    return `${numericSignal}%`;
  }

  return String(signal);
};

export const DeviceListDialog = ({
  isOpen,
  onClose,
  itemsPerPage = 8,
  shopCode,
}: DeviceListDialogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(1);
      setSelectedDevices(new Set());
    }
  }, [isOpen, shopCode, itemsPerPage]);

  const {
    data: deviceListResponse,
    isFetching,
    refetch,
  } = useGetDeviceListWithPagination({
    shopCode: shopCode ?? '',
    pageNumber: currentPage - 1,
    pageSize: itemsPerPage,
    options: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!isOpen || !shopCode) {
      return;
    }

    refetch();
  }, [isOpen, shopCode, currentPage, itemsPerPage, refetch]);

  // API 응답이 배열로 오는 경우 처리
  const paginationData = useMemo(() => {
    const data = deviceListResponse?.data;
    return Array.isArray(data) ? data[0] : data;
  }, [deviceListResponse]);

  const currentPageFromApi = paginationData?.currentPageNumber;

  useEffect(() => {
    if (
      typeof currentPageFromApi === 'number' &&
      currentPageFromApi + 1 !== currentPage
    ) {
      setCurrentPage(currentPageFromApi + 1);
    }
  }, [currentPageFromApi, currentPage]);

  const deviceItems = useMemo<DeviceItem[]>(() => {
    const deviceList = paginationData?.deviceList;

    if (!deviceList || !Array.isArray(deviceList)) {
      return [];
    }

    return deviceList.map((device, index) => ({
      id:
        device.androidId ??
        (device.deviceSeq !== undefined && device.deviceSeq !== null
          ? String(device.deviceSeq)
          : `device-${index}`),
      device: getDeviceLabel(device),
      table: device.tableNumber ?? '-',
      battery: device.battery ?? null,
      wifiSignal: device.wifiSignal ?? null,
      ip: device.ipAddress ?? '-',
      version: device.version ?? '-',
      buildNumber: device.buildNumber ?? '-',
    }));
  }, [paginationData]);

  if (!isOpen) {
    return null;
  }

  const totalPages =
    paginationData?.totalPageNumber && paginationData.totalPageNumber > 0
      ? paginationData.totalPageNumber
      : 1;
  const isInitialLoading = isFetching && !deviceListResponse;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

        <S.Container>
          <S.Header>
            <S.Title>기기관리</S.Title>
          </S.Header>

          <S.ButtonContainer>
            <S.LeftButtons>
              <BasicButton variant="Solid_Navy_XL" onClick={() => {}}>
                업데이트
              </BasicButton>
              <BasicButton variant="Solid_Sky_Blue_XL" onClick={() => {}}>
                화면 켜기
              </BasicButton>
              <BasicButton variant="Outline_Navy_XL" onClick={() => {}}>
                화면 끄기
              </BasicButton>
            </S.LeftButtons>
            <S.RightButtons>
              <BasicButton variant="Outline_Grey_XL" onClick={() => {}}>
                종료
              </BasicButton>
              <BasicButton variant="Outline_Grey_XL" onClick={() => {}}>
                재부팅
              </BasicButton>
            </S.RightButtons>
          </S.ButtonContainer>

          <S.TableContainer>
            <UIStyles.setting.Table>
              <UIStyles.setting.Thead>
                <tr>
                  <th>
                    <S.DeviceHeaderCell>
                      <span>기기</span>
                    </S.DeviceHeaderCell>
                  </th>
                  <th>테이블</th>
                  <th>배터리</th>
                  <th>Wi-Fi 신호</th>
                  <th>IP</th>
                  <th>버전</th>
                  <th>빌드번호</th>
                </tr>
              </UIStyles.setting.Thead>
              <S.Tbody>
                {isInitialLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: '24px',
                        textAlign: 'center',
                        color: colors.grey[600],
                      }}
                    >
                      기기 목록을 불러오는 중입니다.
                    </td>
                  </tr>
                ) : deviceItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: '24px',
                        textAlign: 'center',
                        color: colors.grey[600],
                      }}
                    >
                      표시할 기기가 없어요.
                    </td>
                  </tr>
                ) : (
                  deviceItems.map((device) => (
                    <tr key={device.id}>
                      <td>
                        <S.DeviceCell>
                          <CheckButton
                            checked={selectedDevices.has(device.id)}
                            onChange={() => handleSelectDevice(device.id)}
                          >
                            <span>{device.device}</span>
                          </CheckButton>
                        </S.DeviceCell>
                      </td>
                      <td>{device.table}</td>
                      <td>
                        <S.BatteryColumn>
                          <FullBatteryIcon
                            width={24}
                            height={24}
                            color={colors.grey[800]}
                          />
                          <span>
                            {device.battery !== null
                              ? `${device.battery}%`
                              : '-'}
                          </span>
                        </S.BatteryColumn>
                      </td>
                      <td>{formatWifiSignal(device.wifiSignal)}</td>
                      <td style={{ color: colors.grey[500] }}>{device.ip}</td>
                      <td>
                        <S.VersionColumn>
                          <span>{device.version || '-'}</span>
                          {device.version && (
                            <ChipButton variant="darkgrey" size="S">
                              최신
                            </ChipButton>
                          )}
                        </S.VersionColumn>
                      </td>
                      <td style={{ color: colors.grey[400] }}>
                        {device.buildNumber || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </S.Tbody>
            </UIStyles.setting.Table>
          </S.TableContainer>
        </S.Container>

        <S.Footer>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </S.Footer>
      </S.DialogContainer>
    </ModalBackground>
  );
};
