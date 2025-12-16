import * as S from '@/pages/MainPage/LastOrder/lastOrder.style';
import { dishWashIcon } from '@repo/ui/icons';

export const LastOrder = () => {
  return (
    <S.Container>
      <S.ContentWrapper>
        <S.Icon src={dishWashIcon} alt="Last Order" />
        <S.Title>LAST ORDER</S.Title>
        <S.Time>-분 후 주문 마감</S.Time>
        <S.ClosureTime>??시 ??분에 주문이 마감됩니다.</S.ClosureTime>
        <S.Description>???????????????</S.Description>
      </S.ContentWrapper>
    </S.Container>
  );
};
