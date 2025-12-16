import * as S from '@/pages/MainPage/ClosedPage/closedPage.style';
import { closedIcon } from '@repo/ui/icons';

interface Props {
  message: string;
  startTime: string;
  endTime: string;
}

export const ClosedPage = ({ message, startTime, endTime }: Props) => {
  return (
    <S.Container>
      <S.ContentWrapper>
        <img src={closedIcon} alt="closed" />
        <S.Title>CLOSED</S.Title>
        <S.Time>
          {startTime} - {endTime}
        </S.Time>
        <S.Description>{message}</S.Description>
      </S.ContentWrapper>
    </S.Container>
  );
};
