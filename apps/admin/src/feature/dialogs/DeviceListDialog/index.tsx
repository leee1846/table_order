import { useEffect, useMemo, useState } from 'react';
import { ModalBackground, BasicButton } from '@repo/ui/components';
import { CloseIcon /* , FullBatteryIcon */ } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useGetDeviceList, usePostDeviceControl } from '@repo/api/queries';
import type {
  IDeviceControlItem,
  TDeviceControlType,
  TDeviceType,
} from '@repo/api/types';
import { toast } from '@repo/feature/utils';
import { getDeviceTypeLabel } from '@repo/util/constants';
import { useAdminTranslation } from '@/config/i18n';
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

const formatWifiSignal = (
  signal: DeviceItem['wifiSignal'],
  t: (key: string) => string
) => {
  if (signal === null || signal === undefined || signal === '') {
    return t('없음');
  }

  const numericSignal = Number(signal);
  if (Number.isNaN(numericSignal)) {
    return String(signal);
  }

  if (numericSignal === 4) {
    return t('최상');
  }
  if (numericSignal === 3) {
    return t('좋음');
  }
  if (numericSignal === 2) {
    return t('양호');
  }
  if (numericSignal === 1) {
    return t('낮음');
  }
  if (numericSignal === 0) {
    return t('없음');
  }
  return t('없음');
};

export const DeviceListDialog = ({
  isOpen,
  onClose,
  shopCode,
}: DeviceListDialogProps) => {
  const { t } = useAdminTranslation();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const DEVICE_CONTROL_MESSAGES: Record<TDeviceControlType, string> = {
    DEVICE_APP_UPDATE: t('기기 업데이트 요청을 보냈어요.'),
    DEVICE_SCREEN_ON: t('화면 켜기 요청을 보냈어요.'),
    DEVICE_SCREEN_OFF: t('화면 끄기 요청을 보냈어요.'),
    DEVICE_OFF: t('기기 종료 요청을 보냈어요.'),
    DEVICE_RESTART: t('재부팅 요청을 보냈어요.'),
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedDevice(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedDevice(null);
  }, [shopCode]);

  const {
    data: deviceListResponse,
    isFetching,
    refetch,
  } = useGetDeviceList({
    shopCode: shopCode ?? '',
    options: {
      enabled: isOpen && !!shopCode,
    },
  });

  const { mutateAsync: postDeviceControl, isPending: isDeviceControlLoading } =
    usePostDeviceControl();

  const deviceItems = useMemo<DeviceItem[]>(() => {
    const deviceList = deviceListResponse?.data;

    if (!deviceList || !Array.isArray(deviceList)) {
      return [];
    }
    const items = deviceList.map((device, index) => ({
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

    // 테이블 번호로 정렬
    return items.sort((a, b) => {
      const tableA = a.table;
      const tableB = b.table;

      // '-'는 맨 뒤로
      if (tableA === '-' && tableB !== '-') {
        return 1;
      }
      if (tableA !== '-' && tableB === '-') {
        return -1;
      }
      if (tableA === '-' && tableB === '-') {
        return 0;
      }

      // 숫자로 변환 가능한 경우 숫자로 비교
      const numA = Number(tableA);
      const numB = Number(tableB);

      if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
        return numA - numB;
      }

      // 그 외는 문자열로 비교
      return String(tableA).localeCompare(String(tableB));
    });
  }, [deviceListResponse]);

  if (!isOpen) {
    return null;
  }

  const isInitialLoading = isFetching && !deviceListResponse;

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevice((prev) => {
      if (prev === deviceId) {
        return null; // 이미 선택된 경우 해제
      }
      return deviceId; // 새로운 디바이스 선택
    });
  };

  const getTargetDevices = (targetId?: string) => {
    const targetDeviceId = targetId ?? selectedDevice;
    if (!targetDeviceId) {
      return {
        validDevices: [],
        hasInvalidSelection: false,
        hasSelection: false,
      };
    }

    const targetDevice = deviceItems.find(
      (device) => device.id === targetDeviceId
    );
    if (!targetDevice) {
      return {
        validDevices: [],
        hasInvalidSelection: false,
        hasSelection: false,
      };
    }

    const hasInvalidSelection = !targetDevice.androidId;
    const validDevices: IDeviceControlItem[] = targetDevice.androidId
      ? [{ androidId: targetDevice.androidId }]
      : [];

    return {
      validDevices,
      hasInvalidSelection,
      hasSelection: true,
    };
  };

  // 기기 제어 요청
  const handleDeviceControl = async (
    controlType: TDeviceControlType,
    targetId?: string
  ) => {
    if (isDeviceControlLoading) {
      return;
    }

    if (!shopCode) {
      toast(t('매장 정보를 불러오지 못했어요. 다시 시도해주세요.'));
      return;
    }

    const { validDevices, hasInvalidSelection, hasSelection } =
      getTargetDevices(targetId);

    if (!hasSelection || validDevices.length === 0) {
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
      deviceList: validDevices,
    });
    toast(DEVICE_CONTROL_MESSAGES[controlType]);
    await refetch();
    setSelectedDevice(null);
  };

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.Container>
          <S.Header>
            <S.Title>{t('기기관리')}</S.Title>
            <S.CloseButton onClick={onClose} aria-label={t('닫기')}>
              <CloseIcon width={32} height={32} color={colors.grey[700]} />
            </S.CloseButton>
          </S.Header>

          <S.ButtonContainer>
            <S.LeftButtons>
              <BasicButton
                variant="Outline_Grey_L"
                disabled={isDeviceControlLoading}
                onClick={() => handleDeviceControl('DEVICE_SCREEN_ON')}
                customStyle={S.ScreenOnButton}
              >
                {t('화면 ON')}
              </BasicButton>
              <BasicButton
                variant="Outline_Grey_L"
                disabled={isDeviceControlLoading}
                onClick={() => handleDeviceControl('DEVICE_SCREEN_OFF')}
                customStyle={S.ScreenOffButton}
              >
                {t('화면 OFF')}
              </BasicButton>
            </S.LeftButtons>
            <S.RightButtons>
              <BasicButton
                variant="Solid_Sky_Blue_L"
                disabled={isDeviceControlLoading}
                onClick={() => handleDeviceControl('DEVICE_APP_UPDATE')}
              >
                {t('업데이트')}
              </BasicButton>
              <BasicButton
                variant="Outline_Grey_L"
                disabled={isDeviceControlLoading}
                onClick={() => handleDeviceControl('DEVICE_OFF')}
              >
                {t('종료')}
              </BasicButton>
              <BasicButton
                variant="Outline_Grey_L"
                disabled={isDeviceControlLoading}
                onClick={() => handleDeviceControl('DEVICE_RESTART')}
              >
                {t('재부팅')}
              </BasicButton>
            </S.RightButtons>
          </S.ButtonContainer>

          <S.DeviceGridWrapper>
            {isInitialLoading ? (
              <S.EmptyState>{t('기기 목록을 불러오는 중입니다.')}</S.EmptyState>
            ) : deviceItems.length === 0 ? (
              <S.EmptyState>{t('표시할 기기가 없어요.')}</S.EmptyState>
            ) : (
              <S.DeviceGrid>
                {deviceItems.map((device) => {
                  const isSelected = selectedDevice === device.id;
                  const numericSignal =
                    device.wifiSignal != null ? Number(device.wifiSignal) : 0;
                  const wifiTone: 4 | 3 | 2 | 1 | 0 =
                    numericSignal >= 0 &&
                    numericSignal <= 4 &&
                    Number.isInteger(numericSignal)
                      ? (numericSignal as 4 | 3 | 2 | 1 | 0)
                      : 0;

                  return (
                    <S.DeviceCard
                      key={device.id}
                      onClick={() => handleSelectDevice(device.id)}
                      selected={isSelected}
                    >
                      <S.CardHeader>
                        <S.DeviceTitle>
                          {t(getDeviceTypeLabel(device.deviceType))}
                        </S.DeviceTitle>
                        <S.DeviceCode>{device.id}</S.DeviceCode>
                      </S.CardHeader>

                      <S.CardSectionWrapper>
                        <S.CardSection>
                          <S.SectionLabel>{t('와이파이 신호')}</S.SectionLabel>
                          <S.SectionValue tone={wifiTone}>
                            {formatWifiSignal(device.wifiSignal, t)}
                          </S.SectionValue>
                        </S.CardSection>

                        <S.CardSection>
                          <S.SectionLabel>{t('기기 버전')}</S.SectionLabel>
                          <S.SectionValue>
                            {device.version ? `v.${device.version}` : '-'}
                          </S.SectionValue>
                        </S.CardSection>
                      </S.CardSectionWrapper>
                      <S.CardFooter>
                        <S.FooterItem>
                          <S.FooterLabel>{t('IP주소')}</S.FooterLabel>
                          <S.FooterValue>{device.ip}</S.FooterValue>
                        </S.FooterItem>
                        <S.FooterItem>
                          <S.FooterLabel>{t('빌드 번호')}</S.FooterLabel>
                          <S.FooterValue>
                            {device.buildNumber || '-'}
                          </S.FooterValue>
                        </S.FooterItem>
                      </S.CardFooter>
                    </S.DeviceCard>
                  );
                })}
              </S.DeviceGrid>
            )}
          </S.DeviceGridWrapper>
        </S.Container>
      </S.DialogContainer>
    </ModalBackground>
  );
};
