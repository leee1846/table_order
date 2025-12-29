import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  TableDetailContainer,
  type SelectedMenuWithOptions,
} from '@repo/feature/components';
import { useQueryClient } from '@repo/api/tanstack-query';
import * as S from './tableDetailPage.style';
import { useAuth } from '@/hooks/useAuth';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import {
  queryKeys,
  useGetCategoriesWithMenus,
  usePostTableOrder,
} from '@repo/api/queries';
import { toast } from '@repo/feature/utils';
import { calculateTotalAmount } from '@repo/util/calculation';

export const TableDetailPage = () => {
  const { tableNum } = useParams();
  const { shopCode } = useAuth();
  const { data: shopDetailData } = useShopDetailData();
  const queryClient = useQueryClient();
  const { mutateAsync: createTableOrder } = usePostTableOrder();

  const { data: menuboardResponse, isLoading: isMenuboardLoading } =
    useGetCategoriesWithMenus(
      {
        shopCode: shopCode ?? '',
        tableNumber: tableNum ?? '',
      },
      {
        enabled: !!shopCode && !!tableNum,
      }
    );

  // TODO: 서버에서 오는 데이터로 대체
  const numberOfPeople = 0;
  const adultCount = 1;
  const childCount = 0;

  const useCustomerCount = useMemo(() => {
    // undefined 면 false 반환, 옵셔널 체이닝 처리
    return !!shopDetailData?.shopSetting?.useCustomerCount;
  }, [shopDetailData]);

  const menuboardCategories = useMemo(() => {
    return menuboardResponse?.data ?? [];
  }, [menuboardResponse]);

  const handleAddMenu = async (selectedItems: SelectedMenuWithOptions[]) => {
    if (!shopCode || !tableNum || selectedItems.length < 1) {
      return;
    }

    const orders = selectedItems.map(({ menu, quantity, selectedOptions }) => ({
      menuSeq: menu.menuSeq,
      menuName: menu.menuName,
      menuPrice: menu.menuPrice,
      quantity,
      selectedOptions: selectedOptions.map((option) => ({
        optionSeq: option.optionSeq,
        optionGroupSeq: option.optionGroupSeq,
        optionName: option.optionName,
        optionPrice: option.optionPrice,
        quantity: option.selectedQuantity * quantity,
      })),
    }));

    const totalAmount = calculateTotalAmount(selectedItems);

    try {
      await createTableOrder({
        shopCode,
        tableNumber: tableNum,
        orderType: 'ORDER_POS',
        customerCount: adultCount || numberOfPeople,
        kidsCustomerCount: childCount,
        totalAmount,
        orders,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.orders.tableOrderHistories(shopCode, tableNum),
      });
      toast('메뉴를 추가했어요.');
    } catch (error) {
      //TODO 토스트를 지우던지 ignore 하던지
      console.error(error);
      toast('메뉴 추가에 실패했어요. 다시 시도해주세요.');
    }
  };

  if (!shopCode || !tableNum) {
    return null;
  }

  return (
    <S.Container>
      <TableDetailContainer
        shopCode={shopCode}
        tableNumber={tableNum}
        numberOfPeople={numberOfPeople}
        useCustomerCount={useCustomerCount}
        onAddMenu={handleAddMenu}
        menuboardCategories={menuboardCategories}
        isMenuboardLoading={isMenuboardLoading}
      />
    </S.Container>
  );
};
