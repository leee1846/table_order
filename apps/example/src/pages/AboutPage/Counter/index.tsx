import * as S from '@/pages/AboutPage/Counter/Counter.styles';

/**
 * Counter 컴포넌트
 * Zustand를 사용한 전역 상태 관리 예제
 */
export const Counter = () => {
  // Zustand store에서 상태와 액션 가져오기

  return (
    <S.Container>
      <S.Title>Zustand Counter Example</S.Title>

      <S.CountDisplay>
        <S.CountLabel>현재 카운트:</S.CountLabel>
      </S.CountDisplay>
    </S.Container>
  );
};
