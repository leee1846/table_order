import { bestOnIcon } from '@repo/ui/icons';
import { formatCurrency } from '@repo/util/string';
import * as S from '@/pages/settings/SalesMenuPage/Summary/summary.style';
import { theme } from '@repo/ui';
import type {
  IMenuSalesSummary,
  IMenuSalesSummaryItem,
  TShopLanguage,
} from '@repo/api/types';
import { useAdminTranslation } from '@/config/i18n';

interface Props {
  summary?: IMenuSalesSummary;
  isLoading?: boolean;
  currentLanguage: TShopLanguage;
}

const getBestMenu = (menuSalesList: IMenuSalesSummaryItem[] | undefined) => {
  if (!menuSalesList || menuSalesList.length === 0) {
    return null;
  }

  return menuSalesList.reduce<IMenuSalesSummaryItem | null>((best, current) => {
    if (!best) {
      return current;
    }
    // 개수 비교
    if (current.quantity > best.quantity) {
      return current;
    }

    //개수가 같다면 금액 비교
    if (
      current.quantity === best.quantity &&
      current.totalPrice > best.totalPrice
    ) {
      return current;
    }

    return best;
  }, null);
};

export const Summary = ({ summary, currentLanguage }: Props) => {
  const { t } = useAdminTranslation();
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
          <p>
            {bestMenu?.localeMenuName?.[currentLanguage] ??
              t('데이터가 없습니다.')}
          </p>
          <p>
            {bestMenu
              ? t('₩{{totalPrice}} / {{quantity}}건', {
                  totalPrice: formatCurrency(bestMenu.totalPrice),
                  quantity: formatCurrency(bestMenu.quantity),
                })
              : '-'}
          </p>
        </S.BestMenuInfo>
      </S.BestMenu>

      <S.TotalMenu>
        <S.TotalMenuInfo>
          <p>{t('총 판매 메뉴')}</p>
          <S.TotalMenuPrice color={theme.colors.grey[600]}>
            {t('{{total}} 건', {
              total: formatCurrency(totalMenuItemsSold),
            })}
          </S.TotalMenuPrice>
        </S.TotalMenuInfo>
        <S.TotalMenuInfo>
          <p>{t('총 판매 금액')}</p>
          <S.TotalMenuPrice color={theme.colors.grey[800]}>
            ₩{formatCurrency(totalSalesAmount)}
          </S.TotalMenuPrice>
        </S.TotalMenuInfo>
      </S.TotalMenu>
    </S.Container>
  );
};
