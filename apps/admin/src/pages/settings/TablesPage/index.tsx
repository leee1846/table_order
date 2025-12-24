'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@repo/api/tanstack-query';
import { Sidebar } from './Sidebar';
import * as S from './tablesPage.styles';
import { TableCard } from './TableCard';
import { BottomActions } from './BottomActions';
import { CreateTableDialog } from './dialogs/CreateTableDialog';
import {
  useGetTableGroupList,
  usePostCreateTable,
  queryKeys,
} from '@repo/api/queries';
import type { ITableInfo } from '@repo/api/types';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import { toast } from '@repo/feature/utils';
import { useAuth } from '@/hooks/useAuth';

export const TablesPage = () => {
  const queryClient = useQueryClient();
  const [selectedTableGroupId, setSelectedTableGroupId] = useState<
    number | null
  >(null);
  const [isCreateTableDialogOpen, setIsCreateTableDialogOpen] = useState(false);

  // shopCode 가져오기
  const { shopCode } = useAuth();

  // 테이블 그룹 리스트 조회
  const {
    data: tableGroupListResponse,
    isLoading,
    error,
  } = useGetTableGroupList(
    { shopCode: shopCode ?? '' },
    { enabled: !!shopCode } // shopCode가 있을 때만 쿼리 실행
  );

  const tableGroups = tableGroupListResponse?.data || [];

  // 테이블 생성 mutation
  const { mutateAsync: createTable } = usePostCreateTable();

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

  // 테이블 추가 다이얼로그 열기
  const handleAddTable = () => {
    if (!selectedTableGroupId) {
      toast('테이블 그룹을 선택해주세요.');
      return;
    }
    setIsCreateTableDialogOpen(true);
  };

  // 테이블 생성 처리
  const handleCreateTable = async (tableName: string) => {
    if (!selectedTableGroupId || !selectedGroup) {
      toast('테이블 그룹을 선택해주세요.');
      return;
    }

    try {
      // 선택된 그룹의 다음 테이블 번호 계산
      const existingTables = selectedGroup.tableList || [];
      const maxTableNumber = existingTables.reduce((max, table) => {
        const tableNum = parseInt(table.tableNumber, 10) || 0;
        return Math.max(max, tableNum);
      }, 0);
      const nextTableNumber = String(maxTableNumber + 1);

      await createTable({
        shopSeq: selectedGroup.shopSeq,
        tableNumber: nextTableNumber,
        tableGroupSeq: selectedTableGroupId,
        tableName: tableName || undefined,
      });

      toast('테이블이 추가되었습니다.');
      queryClient.invalidateQueries({
        queryKey: queryKeys.table.groupList(shopCode ?? ''),
      });
    } catch (error) {
      toast('테이블 추가 중 오류가 발생했습니다.');
      console.error('테이블 생성 오류:', error);
    }
  };

  // 로딩 중이거나 shopCode가 없을 때
  if (isLoading || !shopCode) {
    return <FullscreenLoadingSpinner />;
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
            <TableCard key={table.tableSeq} table={table} shopCode={shopCode} />
          ))}
        </S.GridContainer>
        <BottomActions onAddTable={handleAddTable} />
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
          onSubmit={handleCreateTable}
        />
      )}
    </S.TablePageContainer>
  );
};
