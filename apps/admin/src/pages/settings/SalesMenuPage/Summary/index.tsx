import { bestOnIcon } from '@repo/ui/icons';
import { formatCurrency } from '@repo/util/string';
import * as S from '@/pages/settings/SalesMenuPage/Summary/summary.style';
import { theme } from '@repo/ui';

export const Summary = () => {
  return (
    <S.Container>
      <S.BestMenu>
        <img src={bestOnIcon} alt="베스트" />
        <S.BestMenuTitle>판매 1위 메뉴</S.BestMenuTitle>
        <S.BestMenuInfo>
          <p>메뉴명</p>
          <p>??/??건</p>
        </S.BestMenuInfo>
      </S.BestMenu>

      <S.TotalMenu>
        <S.TotalMenuInfo>
          <p>총 판매 메뉴</p>
          <S.TotalMenuPrice color={theme.colors.grey[600]}>
            ??건
          </S.TotalMenuPrice>
        </S.TotalMenuInfo>
        <S.TotalMenuInfo>
          <p>총 판매 금액</p>
          <S.TotalMenuPrice color={theme.colors.grey[800]}>
            {formatCurrency(99999999)}원
          </S.TotalMenuPrice>
        </S.TotalMenuInfo>
      </S.TotalMenu>
    </S.Container>
  );
};
