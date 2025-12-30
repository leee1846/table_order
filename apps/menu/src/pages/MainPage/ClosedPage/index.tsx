import * as S from '@/pages/MainPage/ClosedPage/closedPage.style';
import { closedIcon } from '@repo/ui/icons';

interface Props {
  message: string;
  startTime: string;
  endTime: string;
}

export const ClosedPage = ({ message, startTime, endTime }: Props) => {
  return (
    <S.Container role="alert" aria-live="assertive">
      <S.ContentWrapper>
        <img src={closedIcon} alt="" aria-hidden="true" />
        <S.Title as="h1">CLOSED</S.Title>
        <S.Time role="text">
          {startTime} - {endTime}
        </S.Time>
        <S.Description>{message}</S.Description>
      </S.ContentWrapper>
    </S.Container>
  );
};
