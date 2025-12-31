import { useMainPageRerenderStore } from '@/stores/useMainPageRerenderStore';
import { MainPage } from '@/pages/MainPage';

/**
 * MainPage를 감싸는 래퍼 컴포넌트
 * - rerenderKey가 변경되면 MainPage를 완전히 리마운트하여 모든 훅을 재실행
 * - window.location.reload() 대신 사용
 */
export const MainPageWrapper = () => {
  const rerenderKey = useMainPageRerenderStore((state) => state.rerenderKey);

  return <MainPage key={rerenderKey} />;
};

