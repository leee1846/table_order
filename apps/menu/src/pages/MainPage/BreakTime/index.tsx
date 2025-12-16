import { clockIcon } from '@repo/ui/icons';
import * as S from '@/pages/MainPage/BreakTime/breakTime.style';

interface Props {
  message: string;
  startTime: string;
  endTime: string;
}
export const BreakTime = ({ message, startTime, endTime }: Props) => {
  return (
    <S.Container>
      <S.ContentWrapper>
        <S.Icon src={clockIcon} alt="Break Time" />
        <S.Title>BREAK TIME</S.Title>
        <S.Time>
          {startTime} - {endTime}
        </S.Time>
        <S.Description>{message}</S.Description>
      </S.ContentWrapper>
    </S.Container>
  );
};
