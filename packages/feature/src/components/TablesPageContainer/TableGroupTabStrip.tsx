import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import * as S from './tablesPageContainer.styles';
import {
  useTableGroupListAlign,
  tableGroupDomSeqProps,
} from '../../hooks/useTableGroupListAlign';

export type TableGroupTabStripItem = {
  tableGroupSeq: number;
  tableGroupName: string;
};

export type TableGroupTabStripProps = {
  groups: readonly TableGroupTabStripItem[] | null | undefined;
  selectedSeq: number | null;
  onSelect: (tableGroupSeq: number) => void;
  alignTabStripOnce?: boolean; // true면 선택 탭 가로 스크롤 한 번(상세 복귀 등)
  sidebarWidthPx?: number; // 미지정 시 140px(사이드바) 기준 정렬
};

export type TableGroupTabStripHandle = {
  scrollSelectedToListStart: () => void; // 현재 선택 탭으로 가로 스크롤 맞춤
};

export const TableGroupTabStrip = forwardRef<
  TableGroupTabStripHandle,
  TableGroupTabStripProps
>((props, ref) => {
  const { groups, selectedSeq, onSelect, alignTabStripOnce, sidebarWidthPx } =
    props;
  const tabListPickRef = useRef(false); // 같은 페이지에서 탭 클릭 시 자동 스크롤 생략
  const detailScrollAppliedRef = useRef(false); // alignTabStripOnce 스크롤 한 번만

  const alignOpts = useMemo(
    () => (sidebarWidthPx === undefined ? undefined : { sidebarWidthPx }),
    [sidebarWidthPx]
  );

  const { tableGroupListRef, scrollSelectedToListStart } =
    useTableGroupListAlign(selectedSeq, alignOpts);

  const groupsKey = useMemo(
    () => groups?.map((g) => g.tableGroupSeq).join(',') ?? '',
    [groups] // 그룹 목록 바뀌면 스크롤 effect 재실행
  );

  const handleSelect = useCallback(
    (seq: number) => {
      tabListPickRef.current = true; // 사용자 탭 전환
      onSelect(seq);
    },
    [onSelect]
  );

  // 부모에서 ref로 동일 스크롤 호출
  useImperativeHandle(ref, () => ({ scrollSelectedToListStart }), [
    scrollSelectedToListStart,
  ]);

  // 상세 복귀 등: 선택 탭 가로 스크롤 한 번
  useLayoutEffect(() => {
    if (!alignTabStripOnce) {
      detailScrollAppliedRef.current = false;
      return;
    }
    if (
      !groups?.length ||
      selectedSeq === null ||
      tabListPickRef.current ||
      detailScrollAppliedRef.current
    ) {
      return;
    }
    scrollSelectedToListStart();
    detailScrollAppliedRef.current = true;
  }, [
    alignTabStripOnce,
    groups?.length,
    groupsKey,
    selectedSeq,
    scrollSelectedToListStart,
  ]);

  return (
    <S.TableGroupWrapper>
      <S.TableGroupList ref={tableGroupListRef}>
        {groups?.map((group) => (
          <S.TableGroup
            key={group.tableGroupSeq}
            {...tableGroupDomSeqProps(group.tableGroupSeq)}
          >
            <S.TableGroupButton
              isSelected={selectedSeq === group.tableGroupSeq}
              onClick={() => handleSelect(group.tableGroupSeq)}
            >
              {group.tableGroupName}
            </S.TableGroupButton>
          </S.TableGroup>
        ))}
      </S.TableGroupList>
    </S.TableGroupWrapper>
  );
});

TableGroupTabStrip.displayName = 'TableGroupTabStrip'; // React DevTools 표시명
