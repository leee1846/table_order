import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { TableDetailContainer } from '@repo/feature/components';
import * as S from './tableDetailPage.style';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useAuth } from '@/hooks/useAuth';
import { useShopDetailData } from '@/hooks/useShopDetailData';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const { data: customerCountData } = useCustomerCountStore();
  const { shopCode } = useAuth();
  const { data: shopDetailData } = useShopDetailData();

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

  const useCustomerCount = useMemo(() => {
    // undefined 면 false 반환, 옵셔널 체이닝 처리
    return !!shopDetailData?.shopSetting?.useCustomerCount;
  }, [shopDetailData]);

  if (!shopCode || !parsedTableNumber) {
    return null;
  }

  return (
    <S.Container>
      <TableDetailContainer
        shopCode={shopCode}
        tableNumber={parsedTableNumber}
        numberOfPeople={numberOfPeople}
        useCustomerCount={useCustomerCount}
      />
    </S.Container>
  );
};
