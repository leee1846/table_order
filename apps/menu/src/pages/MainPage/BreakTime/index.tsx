import { clockIcon } from '@repo/ui/icons';
import * as S from '@/pages/MainPage/BreakTime/breakTime.style';

interface Props {
  message: string;
  startTime: string;
  endTime: string;
}
export const BreakTime = ({ message, startTime, endTime }: Props) => {
  return (
    <S.Container role="alert" aria-live="assertive">
      <S.ContentWrapper>
        <S.Icon src={clockIcon} alt="" aria-hidden="true" />
        <S.Title as="h1">BREAK TIME</S.Title>
        <S.Time role="text">
          {startTime} - {endTime}
        </S.Time>
        <S.Description>{message}</S.Description>
      </S.ContentWrapper>
    </S.Container>
  );
};
