import { useEffect, useMemo, useState } from 'react';
import { ModalBackground, BasicButton, CheckButton } from '@repo/ui/components';
import { CloseIcon /* , FullBatteryIcon */ } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useGetDeviceList, usePostDeviceControl } from '@repo/api/queries';
import type { TDeviceControlType, IGetDeviceListItem } from '@repo/api/types';
import { toast } from '@repo/feature/utils';
import { getDeviceTypeLabel } from '@repo/util/constants';
import { useAdminTranslation } from '@/config/i18n';
import * as S from './deviceListDialog.style';

const { colors } = theme;

export type DeviceListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  shopCode?: string;
};

const formatWifiSignal = (
  signal: IGetDeviceListItem['wifiSignal'],
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
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const DEVICE_CONTROL_MESSAGES: Record<TDeviceControlType, string> = {
    DEVICE_APP_UPDATE: t('기기 업데이트 요청을 보냈어요.'),
    DEVICE_SCREEN_ON: t('화면 켜기 요청을 보냈어요.'),
    DEVICE_SCREEN_OFF: t('화면 끄기 요청을 보냈어요.'),
    APP_OFF: t('기기 종료 요청을 보냈어요.'),
    DEVICE_RESTART: t('재부팅 요청을 보냈어요.'),
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedDevices([]);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedDevices([]);
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

  const deviceItems = useMemo<IGetDeviceListItem[]>(() => {
    const deviceList = deviceListResponse?.data;

    if (!deviceList || !Array.isArray(deviceList)) {
      return [];
    }
    const items = deviceList.map((device) => ({
      androidId: device.androidId ?? null,
      deviceType: device.deviceType,
      tableNumber: device.tableNumber ?? '-',
      battery: device.battery ?? null,
      wifiSignal: device.wifiSignal ?? null,
      ipAddress: device.ipAddress ?? '-',
      version: device.version ?? '-',
      buildNumber: device.buildNumber ?? '-',
      tableName: device.tableName ?? '-',
      updateDate: device.updateDate ?? '-',
      deviceSeq: device.deviceSeq ?? null,
      shopSeq: device.shopSeq ?? null,
      orderPosNumber: device.orderPosNumber ?? null,
      updateStatus: device.updateStatus ?? null,
    }));

    // 테이블 번호로 정렬
    return items.sort((a, b) => {
      const tableA = a.tableNumber;
      const tableB = b.tableNumber;

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
    setSelectedDevices((prev) => {
      if (prev.includes(deviceId)) {
        // 이미 선택된 경우 해제
        return prev.filter((id) => id !== deviceId);
      }
      // 새로운 디바이스 추가
      return [...prev, deviceId];
    });
  };

  const getTargetDevices = () => {
    if (selectedDevices.length === 0) {
      return {
        validDevices: [],
        hasInvalidSelection: false,
        hasSelection: false,
      };
    }

    const targetDevices = selectedDevices
      .map((deviceId) =>
        deviceItems.find((device) => device.androidId === deviceId)
      )
      .filter((device): device is IGetDeviceListItem => device !== undefined);

    const validDevices = targetDevices
      .filter((device) => device.androidId)
      .map((device) => ({ androidId: device.androidId! }));

    const hasInvalidSelection = targetDevices.some(
      (device) => !device.androidId
    );

    return {
      validDevices,
      hasInvalidSelection,
      hasSelection: true,
    };
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

    const { validDevices, hasInvalidSelection, hasSelection } =
      getTargetDevices();

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
    setSelectedDevices([]);
  };

  const handleSelectAll = () => {
    const selectableDevices = deviceItems.filter(
      (device) =>
        device.deviceType !== 'POS_APP' && device.updateStatus !== 'IN_PROGRESS'
    );
    const allDeviceIds = selectableDevices.map((device) => device.androidId);

    // 이미 전체 선택된 상태면 해제, 아니면 전체 선택
    if (selectedDevices.length === allDeviceIds.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(allDeviceIds);
    }
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
                onClick={() => handleDeviceControl('APP_OFF')}
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
            <CheckButton
              checked={
                deviceItems.filter(
                  (device) =>
                    device.deviceType !== 'POS_APP' &&
                    device.updateStatus !== 'IN_PROGRESS'
                ).length > 0 &&
                selectedDevices.length ===
                  deviceItems.filter(
                    (device) =>
                      device.deviceType !== 'POS_APP' &&
                      device.updateStatus !== 'IN_PROGRESS'
                  ).length
              }
              onChange={() => handleSelectAll()}
              customStyle={S.SelectAllButton}
            >
              {t('전체 선택')}
            </CheckButton>
            {isInitialLoading ? (
              <S.EmptyState>{t('기기 목록을 불러오는 중입니다.')}</S.EmptyState>
            ) : deviceItems.filter((device) => device.deviceType !== 'POS_APP')
                .length === 0 ? (
              <S.EmptyState>{t('표시할 기기가 없어요.')}</S.EmptyState>
            ) : (
              <S.DeviceGrid>
                {deviceItems
                  .filter((device) => device.deviceType !== 'POS_APP')
                  .map((device) => {
                    const isSelected = selectedDevices.includes(
                      device.androidId
                    );
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
                        key={device.androidId}
                        onClick={() => handleSelectDevice(device.androidId)}
                        selected={isSelected}
                        updateStatus={device.updateStatus === 'IN_PROGRESS'}
                        updateText={t('업데이트 중...')}
                      >
                        <S.CardHeader>
                          <S.DeviceTitle>
                            {device.tableName ?? '-'}
                          </S.DeviceTitle>
                          <S.DeviceCode>
                            {t(getDeviceTypeLabel(device.deviceType))}
                          </S.DeviceCode>
                        </S.CardHeader>

                        <S.CardSectionWrapper>
                          <S.CardSection>
                            <S.SectionLabel>
                              {t('와이파이 신호')}
                            </S.SectionLabel>
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
                            <S.FooterValue>{device.ipAddress}</S.FooterValue>
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
