// 테이블 목록 페이지: 상세 복귀 시 그룹 seq·탭 스크롤 복원용 sessionStorage

export const TABLES_LIST_TABLE_GROUP_SEQ_SESSION_KEY =
  'selectedTableGroupSeq' as const;

export const TABLES_LIST_TABLE_GROUP_DETAIL_RETURN_SESSION_KEY =
  'tableGroupDetailReturn' as const;

export type TablesListTableGroupMountState = {
  selectedTableGroupSeq: number | null;
  alignTabStripOnce: boolean; // true면 TableGroupTabStrip에서 선택 탭 가로 스크롤 한 번
};

const isBrowser = (): boolean => typeof sessionStorage !== 'undefined';

// 첫 렌더 전 동기 읽기(상세 복귀 플래그면 seq·스크롤 플래그, 아니면 잔여 seq 제거)
export const readTablesListTableGroupMountState =
  (): TablesListTableGroupMountState => {
    if (!isBrowser()) {
      return { selectedTableGroupSeq: null, alignTabStripOnce: false };
    }
    if (
      sessionStorage.getItem(TABLES_LIST_TABLE_GROUP_DETAIL_RETURN_SESSION_KEY) !==
      '1'
    ) {
      sessionStorage.removeItem(TABLES_LIST_TABLE_GROUP_SEQ_SESSION_KEY);
      return { selectedTableGroupSeq: null, alignTabStripOnce: false };
    }
    const raw = sessionStorage.getItem(TABLES_LIST_TABLE_GROUP_SEQ_SESSION_KEY);
    return {
      selectedTableGroupSeq: raw ? Number(raw) : null,
      alignTabStripOnce: true,
    };
  };

// 테이블 상세로 가기 직전 호출(돌아왔을 때 동일 그룹·탭 스크롤 유지)
export const markTablesListTableGroupForRestoreAfterTableDetailNav = (
  tableGroupSeq: number | null
): void => {
  if (!isBrowser() || tableGroupSeq === null) {
    return;
  }
  sessionStorage.setItem(TABLES_LIST_TABLE_GROUP_DETAIL_RETURN_SESSION_KEY, '1');
  sessionStorage.setItem(
    TABLES_LIST_TABLE_GROUP_SEQ_SESSION_KEY,
    String(tableGroupSeq)
  );
};

// 목록 마운트 직후 세션 키 제거(초기 state는 read에서 이미 반영됨)
export const consumeTablesListTableGroupSessionAfterMount = (): void => {
  if (!isBrowser()) {
    return;
  }
  if (
    sessionStorage.getItem(TABLES_LIST_TABLE_GROUP_DETAIL_RETURN_SESSION_KEY) ===
    '1'
  ) {
    sessionStorage.removeItem(TABLES_LIST_TABLE_GROUP_DETAIL_RETURN_SESSION_KEY);
    sessionStorage.removeItem(TABLES_LIST_TABLE_GROUP_SEQ_SESSION_KEY);
  } else {
    sessionStorage.removeItem(TABLES_LIST_TABLE_GROUP_SEQ_SESSION_KEY);
  }
};
