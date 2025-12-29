import { useEffect, useMemo, useState } from 'react';
import {
  useGetCategoryExceptTableList,
  useGetTableGroupList,
} from '@repo/api/queries';
import type { ITableInfo } from '@repo/api/types';
import { useAuth } from '@/hooks/useAuth';
import * as S from './categoryTableAssignModal.style';
import {
  SidebarContainer,
  Logo,
  MenuList,
  MenuItem,
} from '@repo/ui/components';

interface Props {
  categoryName: string;
  categorySeq: number;
  onClose: () => void;
  initialSelectedTableNumbers?: string[];
  onSave?: (tableNumbers: string[]) => void | Promise<void>;
}

export const CategoryTableAssignModal = ({
  categorySeq,
  onClose,
  initialSelectedTableNumbers = [],
  onSave,
}: Props) => {
  const { shopCode } = useAuth();
  const { data: tableGroupResponse } = useGetTableGroupList(
    { shopCode: shopCode ?? '' },
    { enabled: !!shopCode }
  );

  const { data: categoryExceptTableResponse } = useGetCategoryExceptTableList(
    {
      shopCode: shopCode ?? '',
      categorySeq,
    },
    {
      enabled: !!shopCode,
    }
  );

  const tableGroups = tableGroupResponse?.data ?? [];

  const [selectedGroupSeq, setSelectedGroupSeq] = useState<number | null>(null);
  const [selectedTableNumbers, setSelectedTableNumbers] = useState<Set<string>>(
    new Set(initialSelectedTableNumbers)
  );

  // 외부에서 선택 값이 바뀌면 동기화
  useEffect(() => {
    if (categoryExceptTableResponse?.data) {
      setSelectedTableNumbers(
        new Set(categoryExceptTableResponse.data.map((item) => item.tableNumber))
      );
      return;
    }

    setSelectedTableNumbers(new Set(initialSelectedTableNumbers));
  }, [categoryExceptTableResponse?.data, initialSelectedTableNumbers]);

  // 테이블 그룹 조회 후 기본 선택 설정
  useEffect(() => {
    if (tableGroups.length === 0) {
      setSelectedGroupSeq(null);
      return;
    }

    if (selectedGroupSeq === null) {
      setSelectedGroupSeq(tableGroups[0]?.tableGroupSeq ?? null);
      return;
    }

    const exists = tableGroups.some(
      (group) => group.tableGroupSeq === selectedGroupSeq
    );
    if (!exists) {
      setSelectedGroupSeq(tableGroups[0]?.tableGroupSeq ?? null);
    }
  }, [selectedGroupSeq, tableGroups]);

  const allTables = useMemo<ITableInfo[]>(
    () => tableGroups.flatMap((group) => group.tableList ?? []),
    [tableGroups]
  );

  const selectedGroupTables = useMemo<ITableInfo[]>(() => {
    if (!selectedGroupSeq) {
      return [];
    }
    const group = tableGroups.find(
      (item) => item.tableGroupSeq === selectedGroupSeq
    );
    return group?.tableList ?? [];
  }, [selectedGroupSeq, tableGroups]);

  const handleToggleTable = (tableNumber: string) => {
    setSelectedTableNumbers((prev) => {
      const next = new Set(prev);
      if (next.has(tableNumber)) {
        next.delete(tableNumber);
      } else {
        next.add(tableNumber);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedTableNumbers(
      new Set(allTables.map((table) => table.tableNumber))
    );
  };

  const handleClearAll = () => {
    setSelectedTableNumbers(new Set());
  };

  const handleSave = async () => {
    const selectedList = Array.from(selectedTableNumbers);
    if (!onSave) {
      onClose();
      return;
    }

    try {
      await onSave(selectedList);
      onClose();
    } catch (error) {
      // 부모에서 에러 처리를 담당합니다.
    }
  };

  const renderTableGrid = () => {
    return (
      <S.TableGrid>
        {selectedGroupTables.map((table) => {
          const tableName = table.tableName || table.tableNumber;
          const isSelected = selectedTableNumbers.has(table.tableNumber);
          return (
            <S.TableCard
              key={table.tableSeq}
              type="button"
              selected={isSelected}
              onClick={() => handleToggleTable(table.tableNumber)}
            >
              <S.TableNumber>{tableName}</S.TableNumber>
              <S.TableStatus>{isSelected ? '선택됨' : ''}</S.TableStatus>
            </S.TableCard>
          );
        })}
      </S.TableGrid>
    );
  };

  return (
    <S.Container>
      {/* <S.Header>
        <S.Title>[{categoryName}] 테이블 지정</S.Title>
        <S.CountBadge>
          {selectedTableNumbers.size}개 선택됨 · 총 {allTables.length}개
        </S.CountBadge>
      </S.Header> */}

      <S.Layout>
        <S.TableArea>{renderTableGrid()}</S.TableArea>

        <S.ActionBar>
          <button type="button" onClick={handleSelectAll}>
            전체선택
          </button>
          <button type="button" onClick={handleClearAll}>
            전체해제
          </button>
          <button type="button" onClick={handleSave}>
            저장하기
          </button>
          <button type="button" onClick={onClose}>
            나가기
          </button>
        </S.ActionBar>
      </S.Layout>

      <SidebarContainer>
        <Logo>
          {/* <img
          src={logoImage}
          alt="캡스 스마트오더 로고"
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        /> */}
          캡스 스마트오더
        </Logo>

        <MenuList>
          {tableGroups.map((group) => (
            <MenuItem
              key={group.tableGroupSeq}
              isSelected={selectedGroupSeq === group.tableGroupSeq}
              onClick={() => setSelectedGroupSeq(group.tableGroupSeq)}
            >
              {group.tableGroupName}
            </MenuItem>
          ))}
        </MenuList>
      </SidebarContainer>
    </S.Container>
  );
};
