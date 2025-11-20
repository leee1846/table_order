'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import * as S from './tablesPage.styles';
import { tableGroups } from '@/constants/mock';
import { TableCard } from './TableCard';
import { BottomActions } from './BottomActions';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { CreateTableDialog } from './dialogs/CreateTableDialog';

export const TablesPage = () => {
  const [selectedTableGroupId, setSelectedTableGroupId] = useState<number>(1);
  const [isCreateTableDialogOpen, setIsCreateTableDialogOpen] = useState(false);
  const navigate = useNavigate();
  const selectedGroup = tableGroups.find(
    (group) => group.id === selectedTableGroupId
  );

  const handleExit = () => {
    // TODO: 나가기 처리 로직 구현
    navigate(ROUTES.SETTINGS.NOTICES.generate());
  };

  const handleAddTable = () => {
    // TODO: 테이블 추가 처리 로직 구현
    setIsCreateTableDialogOpen(true);
  };

  return (
    <S.TablePageContainer>
      <S.TableGridContainer>
        <S.GridContainer>
          {selectedGroup?.tables.map((table) => (
            <TableCard key={table.id} table={table} />
          ))}
        </S.GridContainer>
        <BottomActions onExit={handleExit} onAddTable={handleAddTable} />
      </S.TableGridContainer>
      <Sidebar
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
