import {
  useCallback,
  useLayoutEffect,
  useState,
  type SetStateAction,
} from 'react';
import {
  consumeTablesListTableGroupSessionAfterMount,
  readTablesListTableGroupMountState,
} from './tableGroupSession';

// admin·menu 테이블 목록: 그룹 선택 state + 상세 복귀 시 탭 한 번 스크롤 플래그 + 마운트 시 세션 정리
export const useTablesListTableGroupState = (): {
  selectedTableGroupSeq: number | null;
  setSelectedTableGroupSeq: (value: SetStateAction<number | null>) => void;
  alignTabStripOnce: boolean;
} => {
  const [state, setState] = useState(readTablesListTableGroupMountState); // 첫 페인트에 세션 반영

  const setSelectedTableGroupSeq = useCallback(
    (value: SetStateAction<number | null>) => {
      setState((prev) => ({
        ...prev,
        selectedTableGroupSeq:
          typeof value === 'function'
            ? (value as (p: number | null) => number | null)(
                prev.selectedTableGroupSeq
              )
            : value,
      }));
    },
    []
  );

  useLayoutEffect(() => {
    consumeTablesListTableGroupSessionAfterMount(); // 읽은 뒤 sessionStorage 정리
  }, []);

  return {
    selectedTableGroupSeq: state.selectedTableGroupSeq,
    setSelectedTableGroupSeq,
    alignTabStripOnce: state.alignTabStripOnce,
  };
};
