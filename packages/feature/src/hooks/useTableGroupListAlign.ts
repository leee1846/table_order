import { useCallback, useRef } from 'react';

const GROUP_SEQ_DATA_ATTR = 'data-table-group-seq' as const;

const DEFAULT_SIDEBAR_WIDTH_PX = 140; // SidebarContainer 너비와 동일

// 탭 루트에 붙여 querySelector로 선택 그룹 DOM 찾기
export const tableGroupDomSeqProps = (tableGroupSeq: number) =>
  ({ [GROUP_SEQ_DATA_ATTR]: tableGroupSeq }) as const;

export type AlignTableGroupListOptions = {
  sidebarWidthPx?: number;
};

// scrollLeft가 스크롤 가능 범위를 넘지 않게 자름
const clampScrollLeft = (list: HTMLElement, nextLeft: number): number => {
  const max = Math.max(0, list.scrollWidth - list.clientWidth);
  return Math.max(0, Math.min(nextLeft, max));
};

// 가로 스크롤 기준 X: 리스트 왼쪽과 사이드바 오른쪽(너비) 중 더 오른쪽
const alignTargetViewportX = (
  listRect: DOMRect,
  sidebarWidthPx: number
): number => Math.max(listRect.left, sidebarWidthPx);

// 선택 탭이 보이도록 scrollLeft만 즉시 조정(애니메이션 없음)
export const scrollTableGroupListToSelected = (
  list: HTMLElement | null,
  selectedSeq: number | null,
  options?: AlignTableGroupListOptions
): void => {
  if (!list || selectedSeq === null) {
    return;
  }
  const item = list.querySelector<HTMLElement>(
    `[${GROUP_SEQ_DATA_ATTR}="${String(selectedSeq)}"]`
  );
  if (!item) {
    return;
  }

  const sidebar = options?.sidebarWidthPx ?? DEFAULT_SIDEBAR_WIDTH_PX;
  const listRect = list.getBoundingClientRect();
  const delta =
    item.getBoundingClientRect().left - alignTargetViewportX(listRect, sidebar);
  list.scrollLeft = clampScrollLeft(list, list.scrollLeft + delta);
};

// 가로 탭 리스트 ref + 외부에서 호출할 스크롤 함수(SSE·모달 닫힘 등)
export const useTableGroupListAlign = (
  selectedSeq: number | null,
  alignOptions?: AlignTableGroupListOptions
): {
  tableGroupListRef: (node: HTMLElement | null) => void;
  scrollSelectedToListStart: () => void;
} => {
  const listRef = useRef<HTMLElement | null>(null);
  const selectedSeqRef = useRef(selectedSeq);
  const alignOptionsRef = useRef(alignOptions);
  selectedSeqRef.current = selectedSeq; // scrollSelectedToListStart가 최신 seq 사용
  alignOptionsRef.current = alignOptions;

  const tableGroupListRef = useCallback((node: HTMLElement | null) => {
    listRef.current = node;
  }, []);

  const scrollSelectedToListStart = useCallback(() => {
    scrollTableGroupListToSelected(
      listRef.current,
      selectedSeqRef.current,
      alignOptionsRef.current
    );
  }, []);

  return { tableGroupListRef, scrollSelectedToListStart };
};
