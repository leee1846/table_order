import { useEffect, useMemo, useState } from 'react';
import {
  ModalBackground,
  Pagination,
  BasicButton,
  CheckButton,
} from '@repo/ui/components';
import { CloseIcon /* , FullBatteryIcon */ } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import {
  useGetDeviceListWithPagination,
  usePostDeviceControl,
} from '@repo/api/queries';
import type {
  IDeviceControlItem,
  TDeviceControlType,
  TDeviceType,
} from '@repo/api/types';
import { toast } from '@repo/feature/utils';
import { getDeviceTypeLabel } from '@repo/util/device';
import { useAdminTranslation } from '@/config/i18n';
import { PAZE_SIZE } from '@/constants/keys';
import * as S from './deviceListDialog.style';

const { colors } = theme;

export type DeviceItem = {
  androidId: string | null;
  id: string;
  table: string;
  battery: number | null;
  wifiSignal: string | number | null;
  ip: string;
  version: string;
  buildNumber: string;
  deviceType: TDeviceType;
};

export type DeviceListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  shopCode?: string;
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
  shopCode,
}: DeviceListDialogProps) => {
  const { t } = useAdminTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(
    new Set()
  );

  const DEVICE_CONTROL_MESSAGES: Record<TDeviceControlType, string> = {
    DEVICE_APP_UPDATE: t('기기 업데이트 요청을 보냈어요.'),
    DEVICE_SCREEN_ON: t('화면 켜기 요청을 보냈어요.'),
    DEVICE_SCREEN_OFF: t('화면 끄기 요청을 보냈어요.'),
    DEVICE_OFF: t('기기 종료 요청을 보냈어요.'),
    DEVICE_RESTART: t('재부팅 요청을 보냈어요.'),
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(1);
      setSelectedDevices(new Set());
    }
  }, [isOpen, shopCode, PAZE_SIZE]);

  const {
    data: deviceListResponse,
    isFetching,
    refetch,
  } = useGetDeviceListWithPagination({
    shopCode: shopCode ?? '',
    pageNumber: currentPage - 1,
    pageSize: PAZE_SIZE,
  });

  const { mutateAsync: postDeviceControl, isPending: isDeviceControlLoading } =
    usePostDeviceControl();

  useEffect(() => {
    if (!isOpen || !shopCode) {
      return;
    }

    refetch();
  }, [isOpen, shopCode, currentPage, PAZE_SIZE, refetch]);

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
      androidId: device.androidId ?? null,
      deviceType: device.deviceType,
      id:
        device.androidId ??
        (device.deviceSeq !== undefined && device.deviceSeq !== null
          ? String(device.deviceSeq)
          : `device-${index}`),
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

  // 기기 제어 요청
  const handleDeviceControl = async (controlType: TDeviceControlType) => {
    if (isDeviceControlLoading) {
      return;
    }

    if (!shopCode) {
      toast(t('매장 정보를 불러오지 못했어요. 다시 시도해주세요.'));
      return;
    }

    const targetDevices: IDeviceControlItem[] = deviceItems
      .filter((device) => selectedDevices.has(device.id) && device.androidId)
      .map((device) => ({ androidId: device.androidId! }));

    if (targetDevices.length === 0) {
      const hasInvalidSelection = deviceItems.some(
        (device) => selectedDevices.has(device.id) && !device.androidId
      );

      toast(
        hasInvalidSelection
          ? t('선택한 기기에 안드로이드 ID가 없어 제어할 수 없어요.')
          : t('제어할 기기를 선택해주세요.')
      );
      return;
    }

    await postDeviceControl({
      shopCode,
      deviceControlType: controlType,
      deviceList: targetDevices,
    });
    toast(DEVICE_CONTROL_MESSAGES[controlType]);
    await refetch();
    setSelectedDevices(new Set());
  };

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose} aria-label={t('닫기')}>
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

        <S.Container>
          <S.Header>
            <S.Title>{t('기기관리')}</S.Title>
          </S.Header>

          <S.ButtonContainer>
            <S.LeftButtons>
              <BasicButton
                variant="Solid_Navy_XL"
                disabled={isDeviceControlLoading}
                onClick={() => handleDeviceControl('DEVICE_APP_UPDATE')}
              >
                {t('업데이트')}
              </BasicButton>
              <BasicButton
                variant="Solid_Sky_Blue_XL"
                disabled={isDeviceControlLoading}
                onClick={() => handleDeviceControl('DEVICE_SCREEN_ON')}
              >
                {t('화면 켜기')}
              </BasicButton>
              <BasicButton
                variant="Outline_Navy_XL"
                disabled={isDeviceControlLoading}
                onClick={() => handleDeviceControl('DEVICE_SCREEN_OFF')}
              >
                {t('화면 끄기')}
              </BasicButton>
            </S.LeftButtons>
            <S.RightButtons>
              <BasicButton
                variant="Outline_Grey_XL"
                disabled={isDeviceControlLoading}
                onClick={() => handleDeviceControl('DEVICE_OFF')}
              >
                {t('종료')}
              </BasicButton>
              <BasicButton
                variant="Outline_Grey_XL"
                disabled={isDeviceControlLoading}
                onClick={() => handleDeviceControl('DEVICE_RESTART')}
              >
                {t('재부팅')}
              </BasicButton>
            </S.RightButtons>
          </S.ButtonContainer>

          <S.TableContainer>
            <UIStyles.setting.Table>
              <UIStyles.setting.Thead>
                <tr>
                  <th>
                    <S.DeviceHeaderCell>
                      <span>{t('기기')}</span>
                    </S.DeviceHeaderCell>
                  </th>
                  <th>{t('테이블')}</th>
                  {/* <th>{t('배터리')}</th> */}
                  <th>{t('Wi-Fi 신호')}</th>
                  <th>{t('IP')}</th>
                  <th>{t('버전')}</th>
                  <th>{t('빌드번호')}</th>
                </tr>
              </UIStyles.setting.Thead>
              <S.Tbody
                pageSize={PAZE_SIZE}
                devicesLength={
                  !isInitialLoading && deviceItems.length > 0
                    ? deviceItems.length
                    : undefined
                }
              >
                {isInitialLoading ? (
                  <tr style={{ height: '100%' }}>
                    <td
                      colSpan={6}
                      style={{
                        padding: '24px',
                        textAlign: 'center',
                        color: colors.grey[600],
                      }}
                    >
                      {t('기기 목록을 불러오는 중입니다.')}
                    </td>
                  </tr>
                ) : deviceItems.length === 0 ? (
                  <tr style={{ height: '100%' }}>
                    <td
                      colSpan={6}
                      style={{
                        padding: '24px',
                        textAlign: 'center',
                        color: colors.grey[600],
                      }}
                    >
                      {t('표시할 기기가 없어요.')}
                    </td>
                  </tr>
                ) : (
                  deviceItems.map((device) => (
                    <tr key={device.id}>
                      <td>
                        <S.DeviceCell>
                          <S.DeviceTypeCell>
                            <CheckButton
                              checked={selectedDevices.has(device.id)}
                              onChange={() => handleSelectDevice(device.id)}
                            >
                              <span>
                                {t(getDeviceTypeLabel(device.deviceType))}
                              </span>
                            </CheckButton>
                          </S.DeviceTypeCell>
                        </S.DeviceCell>
                      </td>
                      <td>{device.table}</td>
                      {/* <td>
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
                      </td> */}
                      <td>{formatWifiSignal(device.wifiSignal)}</td>
                      <td>{device.ip}</td>
                      <td>
                        <S.VersionColumn>
                          <span>{device.version || '-'}</span>
                          {/* TODO : 최신 버전임을 알 값이 생길 때까지 보ㅓ류 */}
                          {/* {device.version && (
                            <ChipButton variant="darkgrey" size="S">
                              최신
                            </ChipButton>
                          )} */}
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

        <S.StyledFooter>
          <div />
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </S.StyledFooter>
      </S.DialogContainer>
    </ModalBackground>
  );
};
