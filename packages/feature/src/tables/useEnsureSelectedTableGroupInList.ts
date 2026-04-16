import {
  useEffect,
  useLayoutEffect,
  useRef,
  type RefObject,
  type SetStateAction,
} from 'react';

export type TableGroupTabStripScrollRef = RefObject<{
  scrollSelectedToListStart: () => void;
} | null>;

type GroupRow = { readonly tableGroupSeq: number };

// 목록에 선택 그룹이 없으면 첫 그룹으로 맞추고, 사라진 그룹에 포커스돼 있었을 때만 탭 가로 스크롤
export const useEnsureSelectedTableGroupInList = (args: {
  groups: readonly GroupRow[] | null | undefined;
  selectedTableGroupSeq: number | null;
  setSelectedTableGroupSeq: (value: SetStateAction<number | null>) => void;
  tabStripRef: TableGroupTabStripScrollRef;
}): void => {
  const {
    groups,
    selectedTableGroupSeq,
    setSelectedTableGroupSeq,
    tabStripRef,
  } = args;
  const alignTabStripAfterRemovedGroupRef = useRef(false);

  useEffect(() => {
    if (!groups?.length) {
      return;
    }
    const exists = groups.some(
      (g) => g.tableGroupSeq === selectedTableGroupSeq
    );
    if (exists) {
      return;
    }
    if (selectedTableGroupSeq != null) {
      alignTabStripAfterRemovedGroupRef.current = true;
    }
    setSelectedTableGroupSeq(groups[0]?.tableGroupSeq ?? null);
  }, [groups, selectedTableGroupSeq, setSelectedTableGroupSeq]);

  useLayoutEffect(() => {
    if (!alignTabStripAfterRemovedGroupRef.current) {
      return;
    }
    alignTabStripAfterRemovedGroupRef.current = false;
    requestAnimationFrame(() => {
      tabStripRef.current?.scrollSelectedToListStart();
    });
  }, [selectedTableGroupSeq, groups, tabStripRef]);
};
