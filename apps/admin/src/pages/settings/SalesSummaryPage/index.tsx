import { t } from '@/config/i18n';
import { useMemo, type Ref } from 'react';
import { InfoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { formatCurrency } from '@repo/util/string';
import { useGetSalesSummary } from '@repo/api/queries';
import { useAuth } from '@/hooks/useAuth';
import { useTooltip } from '@/hooks/useTooltip';
import { Tooltip } from '@/components/Tooltip';
import * as S from '@/pages/settings/SalesSummaryPage/salesSummaryPage.style';

const formatDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
};

export const SalesSummaryPage = () => {
  const { shopCode } = useAuth();
  const averagePriceTooltip = useTooltip();
  const paidCustomerTooltip = useTooltip();

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
        {t('매출 관리')}
        <div /> <span>{t('매출 요약')}</span>
      </S.Title>
      <S.List>
        <S.Item>
          <S.SubTitle>{t('매출(결제완료)')}</S.SubTitle>
          <S.Price>₩{formatCurrency(paidSales)}</S.Price>
          <S.Description>
            <S.IconWrapper
              ref={averagePriceTooltip.anchorRef as Ref<HTMLDivElement>}
              onClick={averagePriceTooltip.toggle}
              onTouchEnd={(e) => {
                e.preventDefault();
                averagePriceTooltip.toggle();
              }}
            >
              <InfoIcon width={16} height={16} color={theme.colors.grey[400]} />
              {averagePriceTooltip.isVisible && (
                <Tooltip tooltipRef={averagePriceTooltip.tooltipRef}>
                  {t('매출/객수(*객수 미사용 시, 매출/테이블 수)')}
                </Tooltip>
              )}
            </S.IconWrapper>
            {t('객단가')}₩{formatCurrency(averagePricePerCustomer)}
          </S.Description>
        </S.Item>
        <S.Item>
          <S.SubTitle>{t('매출(결제 전)')}</S.SubTitle>
          <S.Price>₩{formatCurrency(unpaidSales)}</S.Price>
        </S.Item>
        <S.Item>
          <S.SubTitle>{t('테이블 수(결제완료)')}</S.SubTitle>
          <S.Price>
            {formatCurrency(paidTableCount)}
            <span>{t('개')}</span>
          </S.Price>
          <S.Description>
            <S.IconWrapper
              ref={paidCustomerTooltip.anchorRef as Ref<HTMLDivElement>}
              onClick={paidCustomerTooltip.toggle}
              onTouchEnd={(e) => {
                e.preventDefault();
                paidCustomerTooltip.toggle();
              }}
            >
              <InfoIcon width={16} height={16} color={theme.colors.grey[400]} />
              {paidCustomerTooltip.isVisible && (
                <Tooltip tooltipRef={paidCustomerTooltip.tooltipRef}>
                  {t('당일 객수 기능 미사용 시 0으로 계산')}
                </Tooltip>
              )}
            </S.IconWrapper>
            {t('결제 완료 객수')}
            {formatCurrency(paidCustomerCount)}
            {t('명')}
          </S.Description>
        </S.Item>
      </S.List>
    </S.Container>
  );
};
