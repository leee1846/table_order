import { t } from '@/config/i18n';
import { bestOnIcon } from '@repo/ui/icons';
import { formatCurrency } from '@repo/util/string';
import * as S from '@/pages/settings/SalesMenuPage/Summary/summary.style';
import { theme } from '@repo/ui';
import type { IMenuSalesSummary, IMenuSalesSummaryItem } from '@repo/api/types';

interface Props {
  summary?: IMenuSalesSummary;
  isLoading?: boolean;
}

const getBestMenu = (menuSalesList: IMenuSalesSummaryItem[] | undefined) => {
  if (!menuSalesList || menuSalesList.length === 0) {
    return null;
  }

  return menuSalesList.reduce<IMenuSalesSummaryItem | null>((best, current) => {
    if (!best) {
      return current;
    }

    if (current.quantity > best.quantity) {
      return current;
    }

    if (
      current.quantity === best.quantity &&
      current.totalPrice > best.totalPrice
    ) {
      return current;
    }

    return best;
  }, null);
};

export const Summary = ({ summary }: Props) => {
  const totalMenuItemsSold = summary?.totalMenuItemsSold ?? 0;
  const totalSalesAmount = summary?.totalSalesAmount ?? 0;
  const bestMenu = getBestMenu(summary?.menuSalesList);

  return (
    <S.Container>
      <S.BestMenu>
        <div>
          <img src={bestOnIcon} alt={t('베스트')} />
        </div>
        <S.BestMenuTitle>{t('판매 1위 메뉴')}</S.BestMenuTitle>
        <S.BestMenuInfo>
          <p>{bestMenu?.menuName ?? t('데이터가 없습니다.')}</p>
          <p>
            {bestMenu
              ? `${formatCurrency(bestMenu.totalPrice)}원 / ${formatCurrency(bestMenu.quantity)}건`
              : '-'}
          </p>
        </S.BestMenuInfo>
      </S.BestMenu>

      <S.TotalMenu>
        <S.TotalMenuInfo>
          <p>{t('총 판매 메뉴')}</p>
          <S.TotalMenuPrice color={theme.colors.grey[600]}>
            {`${formatCurrency(totalMenuItemsSold)}건`}
          </S.TotalMenuPrice>
        </S.TotalMenuInfo>
        <S.TotalMenuInfo>
          <p>{t('총 판매 금액')}</p>
          <S.TotalMenuPrice color={theme.colors.grey[800]}>
            {`${formatCurrency(totalSalesAmount)}원`}
          </S.TotalMenuPrice>
        </S.TotalMenuInfo>
      </S.TotalMenu>
    </S.Container>
  );
};
