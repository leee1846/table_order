import { create } from '@repo/feature/zustand';

interface IMainPageRerenderStore {
  /** MainPage 리렌더링을 트리거하는 키 값 */
  rerenderKey: number;
  /** MainPage를 강제로 리렌더링 */
  triggerRerender: () => void;
}

/**
 * MainPage 컴포넌트 및 훅들의 리렌더링을 제어하는 스토어
 * - 모든 훅을 재실행하기 위해 사용
 */
export const useMainPageRerenderStore = create<IMainPageRerenderStore>(
  (set) => ({
    rerenderKey: 0,
    triggerRerender: () => {
      set((state) => ({ rerenderKey: state.rerenderKey + 1 }));
    },
  })
);
