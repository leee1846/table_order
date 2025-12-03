'use client';

import { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import * as S from './tablesPage.styles';
import { TableCard } from './TableCard';
import { BottomActions } from './BottomActions';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { CreateTableDialog } from './dialogs/CreateTableDialog';
import { useGetTableGroupList } from '@repo/api/queries';
import type { ITableInfo } from '@repo/api/types';

export const TablesPage = () => {
  const [selectedTableGroupId, setSelectedTableGroupId] = useState<
    number | null
  >(null);
  const [isCreateTableDialogOpen, setIsCreateTableDialogOpen] = useState(false);
  const navigate = useNavigate();

  // shopCode 가져오기
  const shopCode = 'NEXA000001';

  // 테이블 그룹 리스트 조회
  const {
    data: tableGroupListResponse,
    isLoading,
    error,
  } = useGetTableGroupList(
    { shopCode: shopCode },
    { enabled: !!shopCode } // shopCode가 있을 때만 쿼리 실행
  );

  const tableGroups = tableGroupListResponse?.data || [];

  // 첫 번째 테이블 그룹을 기본 선택
  useEffect(() => {
    if (tableGroups.length > 0 && selectedTableGroupId === null) {
      const firstGroup = tableGroups[0];
      if (firstGroup) {
        setSelectedTableGroupId(firstGroup.tableGroupSeq);
      }
    }
  }, [tableGroups, selectedTableGroupId]);

  // 선택된 테이블 그룹 찾기
  const selectedGroup = useMemo(() => {
    if (!selectedTableGroupId) return null;
    return tableGroups.find(
      (group) => group.tableGroupSeq === selectedTableGroupId
    );
  }, [tableGroups, selectedTableGroupId]);

  const handleExit = () => {
    // TODO: 나가기 처리 로직 구현
    navigate(ROUTES.SETTINGS.NOTICES.generate());
  };

  const handleAddTable = () => {
    // TODO: 테이블 추가 처리 로직 구현
    setIsCreateTableDialogOpen(true);
  };

  // 로딩 중이거나 shopCode가 없을 때
  if (isLoading || !shopCode) {
    return (
      <S.TablePageContainer>
        <div>로딩 중...</div>
      </S.TablePageContainer>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <S.TablePageContainer>
        <div>테이블 그룹을 불러오는 중 오류가 발생했습니다.</div>
      </S.TablePageContainer>
    );
  }

  return (
    <S.TablePageContainer>
      <S.TableGridContainer>
        <S.GridContainer>
          {selectedGroup?.tableList?.map((table: ITableInfo) => (
            <TableCard
              key={table.tableSeq}
              table={{
                id: table.tableSeq,
                tableNumber: Number(table.tableNumber),
                tableName: table.tableName || table.tableNumber,
              }}
            />
          ))}
        </S.GridContainer>
        <BottomActions onExit={handleExit} onAddTable={handleAddTable} />
      </S.TableGridContainer>
      <Sidebar
        tableGroups={tableGroups}
        selectedTableGroupId={selectedTableGroupId}
        onTableGroupSelect={setSelectedTableGroupId}
      />
      {isCreateTableDialogOpen && (
        <CreateTableDialog
          isOpen={isCreateTableDialogOpen}
          onClose={() => setIsCreateTableDialogOpen(false)}
          onSubmit={handleAddTable}
        />
      )}
    </S.TablePageContainer>
  );
};
