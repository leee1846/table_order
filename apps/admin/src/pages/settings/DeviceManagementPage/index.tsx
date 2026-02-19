import { useMemo } from 'react';
import { useGetDeviceList } from '@repo/api/queries';
import type { IGetDeviceListItem } from '@repo/api/types';
import { getDeviceTypeLabel } from '@repo/util/constants';
import { useAdminTranslation } from '@/config/i18n';
import { useAuth } from '@/hooks/useAuth';
import * as S from './deviceManagementPage.style';

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

export const DeviceManagementPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();

  const { data: deviceListResponse, isFetching } = useGetDeviceList({
    shopCode: shopCode ?? '',
    options: {
      enabled: !!shopCode,
    },
  });

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

  const isInitialLoading = isFetching && !deviceListResponse;

  return (
    <S.Container>
      <S.Header>
        <S.Title>{t('기기관리')}</S.Title>
      </S.Header>

      <S.DeviceGridWrapper>
        {isInitialLoading ? (
          <S.EmptyState>{t('기기 목록을 불러오는 중입니다.')}</S.EmptyState>
        ) : deviceItems.length === 0 ? (
          <S.EmptyState>{t('표시할 기기가 없어요.')}</S.EmptyState>
        ) : (
          <S.DeviceGrid>
            {deviceItems
              .filter((device) => device.deviceType !== 'POS_APP')
              .map((device) => {
                const numericSignal =
                  device.wifiSignal != null ? Number(device.wifiSignal) : 0;
                const wifiTone: 4 | 3 | 2 | 1 | 0 =
                  numericSignal >= 0 &&
                  numericSignal <= 4 &&
                  Number.isInteger(numericSignal)
                    ? (numericSignal as 4 | 3 | 2 | 1 | 0)
                    : 0;

                return (
                  <S.DeviceCard key={device.androidId}>
                    <S.CardHeader>
                      <S.DeviceTitle>{device.tableName ?? '-'}</S.DeviceTitle>
                      <S.DeviceCode>
                        {t(getDeviceTypeLabel(device.deviceType))}
                      </S.DeviceCode>
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
  );
};
