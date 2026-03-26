import { useThemeMode } from '@repo/ui';
import { Trans } from 'react-i18next';
import * as S from './idleTimerMessage.style';

interface Props {
  remainingSeconds: number;
}

export const IdleTimerMessage = ({ remainingSeconds }: Props) => {
  const { theme } = useThemeMode();

  return (
    <S.Container textColor={theme.mode.grey[600]}>
      <Trans
        i18nKey="closes_in" // JSON 번역 파일의 키 값
        values={{ seconds: remainingSeconds }} // {{seconds}}에 들어갈 실제 숫자
        components={[
          // 번역 파일의 <0></0> 태그가 아래 span으로 교체되며 색상이 적용됩니다.
          <S.Highlight
            key="timer-highlight"
            highlightColor={theme.mode.primary[500]}
          >
            {remainingSeconds}
          </S.Highlight>,
        ]}
      />
    </S.Container>
  );
};
