import * as S from '@/pages/MainPage/ClosedPage/closedPage.style';
import { closedIcon } from '@repo/ui/icons';

export const ClosedPage = () => {
  return (
    <S.Container>
      <S.ContentWrapper>
        <img src={closedIcon} alt="closed" />
        <S.Title>CLOSED</S.Title>
        <S.Time>22:00 - 06:00</S.Time>
        <p>We are closed for maintenance.</p>
      </S.ContentWrapper>
    </S.Container>
  );
};
