import { t } from '@/config/i18n';
import { useMemo } from 'react';
import { AntTooltip } from '@/feature/backoffice/components';
import { formatCurrency } from '@repo/util/string';
import { useGetSalesSummary } from '@repo/api/queries';
import { useAuth } from '@/hooks/useAuth';
import * as S from '@/pages/settings/SalesSummaryPage/salesSummaryPage.style';

const formatDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
};

export const SalesSummaryPage = () => {
  const { shopCode } = useAuth();

  const defaultDateRange = useMemo(() => {
    const today = new Date();
    return {
      startDate: formatDateToYYYYMMDD(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
      ),
      endDate: formatDateToYYYYMMDD(today),
    };
  }, []);

  const { data: salesSummaryResponse } = useGetSalesSummary(
    {
      shopCode: shopCode ?? '',
      startDate: defaultDateRange.startDate,
      endDate: defaultDateRange.endDate,
    },
    {
      enabled: !!shopCode,
    }
  );

  const salesSummary = salesSummaryResponse?.data;

  const paidSales = salesSummary?.paidSales ?? 0;
  const unpaidSales = salesSummary?.unpaidSales ?? 0;
  const averagePricePerCustomer = salesSummary?.averagePricePerCustomer ?? 0;
  const paidTableCount = salesSummary?.paidTableCount ?? 0;
  const paidCustomerCount = salesSummary?.paidCustomerCount ?? 0;

  return (
    <S.Container data-container>
      <S.Title>
        {t('매출 현황')}
        <div />
        <div>
          <span>{t('매출 요약')}</span>
          <AntTooltip title={t('최근 7일 실적 기준 지표')} />
        </div>
      </S.Title>
      <S.List>
        <S.Item>
          <S.SubTitleWrapper>
            <AntTooltip
              title={t('취소금액 및 할인이 반영된 금액')}
              placement="top"
            />
            <S.SubTitle>{t('매출(결제완료)')}</S.SubTitle>
          </S.SubTitleWrapper>
          <S.Price>₩{formatCurrency(paidSales)}</S.Price>
          <S.Description>
            <AntTooltip
              title={t('매출/객수(*객수 미사용 시, 매출/테이블 수)')}
            />
            {t('실 객단가')} ₩{formatCurrency(averagePricePerCustomer)}
          </S.Description>
        </S.Item>
        <S.Item>
          <S.SubTitle>{t('매출(결제 전)')}</S.SubTitle>
          <S.Price>₩{formatCurrency(unpaidSales)}</S.Price>
        </S.Item>
        <S.Item>
          <S.SubTitle>{t('테이블 수(결제완료)')}</S.SubTitle>
          <S.Price>
            {t('{{value}}개', { value: formatCurrency(paidTableCount) })}
          </S.Price>
          <S.Description>
            <AntTooltip title={t('당일 객수 기능 미사용 시 0으로 계산')} />
            {t('결제 완료 객수')}{' '}
            {t('{{value}}명', { value: formatCurrency(paidCustomerCount) })}
          </S.Description>
        </S.Item>
      </S.List>
    </S.Container>
  );
};
