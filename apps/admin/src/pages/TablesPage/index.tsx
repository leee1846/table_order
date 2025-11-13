import { TableGridContainer, type TableData } from '@repo/feature/components';
import { Sidebar } from './Sidebar';
import * as S from './tablesPage.style.ts';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.ts';
import { sampleTables } from '@/constants/mock.ts';

export const TablesPage = () => {
  const navigate = useNavigate();

  const handleTableClick = (_table: TableData) => {
    navigate(ROUTES.TABLE_DETAIL.generate(_table.tableNumber));
  };

  return (
    <S.Container>
      <TableGridContainer
        tables={sampleTables}
        onTableClick={handleTableClick}
      />
      <Sidebar />
    </S.Container>
  );
};
