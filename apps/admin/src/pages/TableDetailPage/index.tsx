import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import * as S from './tableDetailPage.style';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useAuth } from '@/hooks/useAuth';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const { data: customerCountData } = useCustomerCountStore();
  const { shopCode } = useAuth();

  const parsedTableNumber = useMemo(() => {
    if (!tableNum) {
      return null;
    }
    const parsed = Number(tableNum);
    return Number.isNaN(parsed) ? null : parsed;
  }, [tableNum]);

  const customerCount = parsedTableNumber
    ? customerCountData[parsedTableNumber]
    : null;

  const numberOfPeople = useMemo(() => {
    if (!customerCount) {
      return 0;
    }
    return (customerCount.adultCount || 0) + (customerCount.childCount || 0);
  }, [customerCount]);

  if (!shopCode || !parsedTableNumber) {
    return null;
  }

  return (
    <S.Container>
      <TableDetailContainer
        shopCode={shopCode}
        tableNumber={parsedTableNumber}
        numberOfPeople={numberOfPeople}
      />
    </S.Container>
  );
};
