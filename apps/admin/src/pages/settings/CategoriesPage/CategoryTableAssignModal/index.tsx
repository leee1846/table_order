import { t } from '@/config/i18n';
import { useEffect, useMemo, useState } from 'react';
import { useGetTableGroupList, useGetShopThemePage } from '@repo/api/queries';
import type {
  ITableInfo,
  TGetCategoryExceptTableResponse,
} from '@repo/api/types';
import { useAuth } from '@/hooks/useAuth';
import { capsSmartOrderWhiteLogo } from '@repo/ui/icons';
import * as S from './categoryTableAssignModal.style';

interface Props {
  categorySeq: number;
  onClose: () => void;
  initialSelectedTableNumbers?: string[];
  onSave?: (tableNumbers: string[]) => void | Promise<void>;
  categoryExceptTableResponse: TGetCategoryExceptTableResponse | undefined;
  isCategoryExceptTableLoading: boolean;
}

export const CategoryTableAssignModal = ({
  onClose,
  initialSelectedTableNumbers = [],
  onSave,
  categoryExceptTableResponse,
  isCategoryExceptTableLoading,
}: Props) => {
  const { shopCode } = useAuth();
  const { data: tableGroupResponse } = useGetTableGroupList(
    { shopCode: shopCode ?? '' },
    { enabled: !!shopCode }
  );

  const { data: shopThemePageResponse } = useGetShopThemePage(shopCode ?? '', {
    enabled: !!shopCode,
  });

  const initLightImage = useMemo(() => {
    const shopPageDetailList = shopThemePageResponse?.data?.shopPageDetailList;
    if (!shopPageDetailList) return null;
    const initLightItem = shopPageDetailList.find(
      (item) => item.pageDetailType === 'INIT_LIGHT'
    );
    return initLightItem?.pageDetailImagePath || null;
  }, [shopThemePageResponse?.data?.shopPageDetailList]);

  const tableGroups = tableGroupResponse?.data ?? [];

  const [selectedGroupSeq, setSelectedGroupSeq] = useState<number | null>(null);
  const [selectedTableNumbers, setSelectedTableNumbers] = useState<Set<string>>(
    new Set(initialSelectedTableNumbers)
  );

  // 외부에서 선택 값이 바뀌면 동기화
  useEffect(() => {
    // 로딩 중이면 아무것도 하지 않음
    if (isCategoryExceptTableLoading) {
      return;
    }

    if (categoryExceptTableResponse?.data) {
      setSelectedTableNumbers(
        new Set(categoryExceptTableResponse.data.map((item) => String(item)))
      );
      return;
    }
  }, [categoryExceptTableResponse?.data]);

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

    await onSave(selectedList);
    onClose();
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
              <S.TableStatus>{isSelected ? t('미선택 상태') : t('선택됨')}</S.TableStatus>
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
          <button type="button" onClick={handleClearAll}>
            {t('전체선택')}
          </button>
          <button type="button" onClick={handleSelectAll}>
            {t('전체해제')}
          </button>
          <button type="button" onClick={handleSave}>
            {t('저장하기')}
          </button>
          <button type="button" onClick={onClose}>
            {t('나가기')}
          </button>
        </S.ActionBar>
      </S.Layout>

      <S.SidebarContainer>
        <S.Logo>
          <img
            src={initLightImage ?? capsSmartOrderWhiteLogo}
            alt={t('매장 로고')}
            style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
          />
        </S.Logo>

        <S.MenuList>
          {tableGroups.map((group) => (
            <S.MenuItem
              key={group.tableGroupSeq}
              isSelected={selectedGroupSeq === group.tableGroupSeq}
              onClick={() => setSelectedGroupSeq(group.tableGroupSeq)}
            >
              {group.tableGroupName}
            </S.MenuItem>
          ))}
        </S.MenuList> 
      </S.SidebarContainer>
    </S.Container>
  );
};
