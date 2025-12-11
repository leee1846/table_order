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
      {parsedTableNumber && customerCount && (
        <S.CustomerCountBar>
          <span>테이블 {parsedTableNumber}번</span>
          <strong>
            성인 {customerCount.adultCount}명 · 아동 {customerCount.childCount}명
          </strong>
        </S.CustomerCountBar>
      )}
      <TableDetailContainer
        shopCode={shopCode}
        tableNumber={parsedTableNumber}
        numberOfPeople={numberOfPeople}
      />
    </S.Container>
  );
};
