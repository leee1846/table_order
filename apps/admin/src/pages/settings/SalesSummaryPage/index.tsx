import { InfoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { formatCurrency } from '@repo/util/string';
import * as S from '@/pages/settings/SalesSummaryPage/salesSummaryPage.style';

export const SalesSummaryPage = () => {
  return (
    <S.Container>
      <S.Title>
        매출 관리 <div /> <span>매출 요약</span>
      </S.Title>
      <S.List>
        <S.Item>
          <S.SubTitle>매출(결제완료)</S.SubTitle>
          <S.Price>
            {formatCurrency(999999999)}
            <span>원</span>
          </S.Price>
          <S.Description>
            <InfoIcon width={16} height={16} color={theme.colors.grey[400]} />
            객단가 {formatCurrency(1000000)}원
          </S.Description>
        </S.Item>
        <S.Item>
          <S.SubTitle>매출(결제 전)</S.SubTitle>
          <S.Price>
            {formatCurrency(999999999)}
            <span>원</span>
          </S.Price>
        </S.Item>
        <S.Item>
          <S.SubTitle>테이블 수(결제완료)</S.SubTitle>
          <S.Price>
            {formatCurrency(999999999)}
            <span>개</span>
          </S.Price>
          <S.Description>
            <InfoIcon width={16} height={16} color={theme.colors.grey[400]} />
            결제 완료 객수 {formatCurrency(1212121)}명
          </S.Description>
        </S.Item>
      </S.List>
    </S.Container>
  );
};
