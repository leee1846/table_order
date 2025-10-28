import { useCounterStore } from '@/stores/counterStore';
import { ButtonExample } from '@repo/ui';
import * as S from '@/pages/AboutPage/Counter/Counter.styles';

/**
 * Counter 컴포넌트
 * Zustand를 사용한 전역 상태 관리 예제
 */
export const Counter = () => {
  // Zustand store에서 상태와 액션 가져오기
  const { count, increment, decrement, incrementByAmount } = useCounterStore();

  return (
    <S.Container>
      <S.Title>Zustand Counter Example</S.Title>

      <S.CountDisplay>
        <S.CountLabel>현재 카운트:</S.CountLabel>
        <S.CountValue>{count}</S.CountValue>
      </S.CountDisplay>

      <S.ButtonGroup>
        <ButtonExample onClick={decrement} variant="secondary" size="sm">
          - 빼기
        </ButtonExample>

        <ButtonExample onClick={increment} variant="primary" size="sm">
          + 더하기
        </ButtonExample>
      </S.ButtonGroup>

      <S.ButtonGroup>
        <ButtonExample
          onClick={() => incrementByAmount(5)}
          variant="outline"
          size="sm"
        >
          +5 추가
        </ButtonExample>

        <ButtonExample
          onClick={() => incrementByAmount(10)}
          variant="outline"
          size="sm"
        >
          +10 추가
        </ButtonExample>
      </S.ButtonGroup>
    </S.Container>
  );
};
