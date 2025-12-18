'use client';

import { useState, useMemo } from 'react';
import * as S from './tableDetailContainer.styles';
import { OrderPanel } from './orderSection/OrderPanel';
import { ActionGrid } from './actionSection/ActionGrid';
import {
  AddMenuDialog,
  type SelectedMenuWithOptions,
} from './actionSection/dialogs/AddMenuDialog';
import { SelectCancelDialog } from './actionSection/dialogs/SelectCancelDialog';
import { AmountChangeDialog } from './actionSection/dialogs/AmountChangeDialog';
import { AllDiscountDialog } from './actionSection/dialogs/AllDiscountDialog';
import { ServiceAmountDialog } from './orderSection/dialogs/ServiceAmountDialog';
import { CardPaymentDialog } from './orderSection/dialogs/CardPaymentDialog';
import { ArbitraryPaymentConfirmDialog } from './orderSection/dialogs/ArbitraryPaymentConfirmDialog';
import { CashPaymentDialog } from './orderSection/dialogs/CashPaymentDialog';
import { CashReceiptDialog } from './orderSection/dialogs/CashReceiptDialog';
import {
  SplitPaymentDialog,
  type SplitPayment,
} from './orderSection/dialogs/SplitPaymentDialog';
import { openDualActionDialog, toast } from '@repo/feature/utils';
import {
  useGetTableOrderHistories,
  usePutCancelOrderAll,
} from '@repo/api/queries';
import type {
  ICategoryWithMenus,
  IGetTableOrderHistories,
} from '@repo/api/types';
import { FullscreenLoadingSpinner } from '@repo/ui/components';
import type { Order, OrderItem } from './orderSection/types';

export type { SelectedMenuWithOptions };
export interface TableDetailContainerProps {
  shopCode: string;
  tableNumber: number;
  numberOfPeople?: number;
  useCustomerCount?: boolean;
  onAddMenu?: (selectedItems: SelectedMenuWithOptions[]) => void;
  menuboardCategories?: ICategoryWithMenus[];
  isMenuboardLoading?: boolean;
}

export const TableDetailContainer = ({
  shopCode,
  tableNumber,
  numberOfPeople = 0,
  useCustomerCount = false,
  onAddMenu,
  menuboardCategories = [],
  isMenuboardLoading = false,
}: TableDetailContainerProps) => {
  //메뉴 추가 모달
  const [isAddMenuDialogOpen, setIsAddMenuDialogOpen] = useState(false);
  //선택 취소 모달
  const [isSelectCancelDialogOpen, setIsSelectCancelDialogOpen] =
    useState(false);
  //금액 변경 모달
  const [isAmountChangeDialogOpen, setIsAmountChangeDialogOpen] =
    useState(false);
  // 전체 할인 모달
  const [isAllDiscountDialogOpen, setIsAllDiscountDialogOpen] = useState(false);
  //서비스 금액 변경 모달
  const [isServiceAmountDialogOpen, setIsServiceAmountDialogOpen] =
    useState(false);
  //서비스 금액 변경 모달 선택 메뉴
  const [selectedItemForService, setSelectedItemForService] =
    useState<OrderItem | null>(null);
  //카드 결제 모달
  const [isCardPaymentDialogOpen, setIsCardPaymentDialogOpen] = useState(false);
  //임의 결제 확인 모달
  const [
    isArbitraryPaymentConfirmDialogOpen,
    setIsArbitraryPaymentConfirmDialogOpen,
  ] = useState(false);
  //현금 결제 모달
  const [isCashPaymentDialogOpen, setIsCashPaymentDialogOpen] = useState(false);
  //현금영수증 모달
  const [isCashReceiptDialogOpen, setIsCashReceiptDialogOpen] = useState(false);
  const [cashReceivedAmount, setCashReceivedAmount] = useState<number>(0);
  //분할 결제 모달
  const [isSplitPaymentDialogOpen, setIsSplitPaymentDialogOpen] =
    useState(false);
  //분할 결제에서 열린 결제 모달인지 여부
  const [isPaymentFromSplit, setIsPaymentFromSplit] = useState(false);
  //분할 결제 금액(선택한 메뉴)
  const [splitPaymentAmount, setSplitPaymentAmount] = useState<number>(0);
  //분할 결제 내역
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([]);

  // API 데이터 가져오기
  const {
    data: orderHistoriesResponse,
    isLoading,
    refetch,
  } = useGetTableOrderHistories(
    {
      shopCode,
      tableNumber,
    },
    {
      enabled: !!shopCode && !!tableNumber,
    }
  );
  const { mutateAsync: cancelOrderAll, isPending: isCancelAllPending } =
    usePutCancelOrderAll();

  // API 응답을 Order 타입으로 변환
  const order: Order | null = useMemo(() => {
    if (!orderHistoriesResponse?.data) {
      return {
        tableName: `${tableNumber}번 테이블`,
        numberOfPeople,
        items: [],
        totalCount: 0,
        totalPrice: 0,
        orderTime: '',
      };
    }

    const data: IGetTableOrderHistories = orderHistoriesResponse.data;

    // orderDetailMenuList를 OrderItem[]로 변환
    const items =
      data.orderDetailMenuList?.map((menu) => {
        const options =
          menu.optionList && menu.optionList.length > 0
            ? menu.optionList.map((option) => ({
                id: `${menu.orderDetailMenuSeq}-${option.orderDetailOptionSeq}`,
                name: option.optionName,
                qty: option.optionQuantity,
                unitPrice: option.optionPrice,
              }))
            : undefined;

        return {
          id: String(menu.orderDetailMenuSeq),
          menuSeq: menu.orderDetailMenuSeq,
          name: menu.menuName,
          qty: menu.menuQuantity,
          unitPrice: menu.menuPrice,
          options,
        };
      }) || [];

    // updateDate에서 시간만 추출 (HH:mm 형식)
    const orderTime = data.updateDate
      ? new Date(data.updateDate).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : '';

    return {
      tableName: `${tableNumber}번 테이블`,
      numberOfPeople,
      items,
      totalCount: items.length,
      totalPrice: data.totalAmount || 0,
      orderTime,
    };
  }, [orderHistoriesResponse, tableNumber, numberOfPeople]);

  // 로딩 중일 때
  if (isLoading) {
    return <FullscreenLoadingSpinner />;
  }

  // 데이터가 없을 때
  if (!order) {
    return null;
  }

  const handleAllCancel = () => {
    if (order.items.length === 0) {
      toast('취소할 메뉴가 없어요.');
      return;
    }

    openDualActionDialog({
      title: `전체 메뉴를\n취소하시겠어요?`,
      primaryText: '네',
      secondaryText: '아니오',
      onConfirm: async () => {
        //중복 요청 방지
        if (isCancelAllPending) {
          return;
        }

        try {
          await cancelOrderAll({ shopCode, tableNumber });
          toast('전체 메뉴를 취소했어요.');
          await refetch();
        } catch (error) {
          toast('전체 메뉴 취소 중 오류가 발생했어요. 다시 시도해주세요.');
        }
      },
    });
  };

  const handleActionPress = (id: string) => {
    const actionHandlers: Record<string, () => void> = {
      'add-menu': () => setIsAddMenuDialogOpen(true),
      'select-cancel': () => setIsSelectCancelDialogOpen(true),
      'amount-change': () => setIsAmountChangeDialogOpen(true),
      'all-discount': () => setIsAllDiscountDialogOpen(true),
      'all-cancel': handleAllCancel,
    };

    actionHandlers[id]?.();
  };

  //OrderType 때문에 추가 메뉴 함수는 prop으로 받음
  const handleAddMenu = (selectedItems: SelectedMenuWithOptions[]) => {
    if (!onAddMenu) {
      return;
    }

    onAddMenu(selectedItems);
  };

  const handleItemClick = (item: OrderItem) => {
    setSelectedItemForService(item);
    setIsServiceAmountDialogOpen(true);
  };

  const handleServiceAmountApply = (amount: number) => {
    if (selectedItemForService) {
      console.log('서비스 금액 적용:', {
        itemId: selectedItemForService.id,
        itemName: selectedItemForService.name,
        serviceAmount: amount,
      });
      // TODO: 실제 서비스 금액 적용 로직 구현
    }
  };

  return (
    <S.TableDetailContainer>
      <S.Layout>
        <S.Left>
          <OrderPanel
            order={order}
            selectedItemId=""
            onPayCard={() => setIsCardPaymentDialogOpen(true)}
            onPayCash={() => setIsCashPaymentDialogOpen(true)}
            onSplitPay={() => setIsSplitPaymentDialogOpen(true)}
            onItemClick={handleItemClick}
            useCustomerCount={useCustomerCount}
          />
        </S.Left>
        <S.Right>
          <ActionGrid
            onPress={handleActionPress}
            onProceed={() => console.log('다음단계')}
          />
        </S.Right>
      </S.Layout>
      {/* 메뉴 추가 모달 */}
      <AddMenuDialog
        isOpen={isAddMenuDialogOpen}
        onClose={() => setIsAddMenuDialogOpen(false)}
        tableName={order.tableName}
        onAdd={handleAddMenu}
        categories={menuboardCategories}
        isCategoriesLoading={isMenuboardLoading}
      />
      {/* 선택 취소 모달 */}
      <SelectCancelDialog
        isOpen={isSelectCancelDialogOpen}
        onClose={() => setIsSelectCancelDialogOpen(false)}
        items={order.items}
        onCancelSuccess={() => refetch()}
      />
      {/* 금액 변경 모달 */}
      <AmountChangeDialog
        isOpen={isAmountChangeDialogOpen}
        onClose={() => setIsAmountChangeDialogOpen(false)}
        orderGroupUuid={
          orderHistoriesResponse?.data?.orderDetailMenuList?.[0]
            ?.orderGroupUuid as string
        }
        onApplySuccess={() => refetch()}
      />
      {/* 전체 할인 모달 */}
      <AllDiscountDialog
        isOpen={isAllDiscountDialogOpen}
        onClose={() => setIsAllDiscountDialogOpen(false)}
        orderGroupUuid={
          orderHistoriesResponse?.data?.orderDetailMenuList?.[0]
            ?.orderGroupUuid as string
        }
        onApplySuccess={() => refetch()}
      />
      {/* 서비스 금액 변경 모달 */}
      <ServiceAmountDialog
        isOpen={isServiceAmountDialogOpen}
        onClose={() => {
          setIsServiceAmountDialogOpen(false);
          setSelectedItemForService(null);
        }}
        onApply={handleServiceAmountApply}
      />
      {/* 카드 결제 모달 */}
      <CardPaymentDialog
        isOpen={isCardPaymentDialogOpen}
        onClose={() => {
          setIsCardPaymentDialogOpen(false);
          if (isPaymentFromSplit) {
            setIsPaymentFromSplit(false);
            setIsSplitPaymentDialogOpen(true);
          }
        }}
        paymentAmount={
          isPaymentFromSplit ? splitPaymentAmount : order.totalPrice
        }
        billingAmount={
          isPaymentFromSplit ? splitPaymentAmount : order.totalPrice
        }
        onArbitraryPayment={() => {
          setIsArbitraryPaymentConfirmDialogOpen(true);
        }}
        onConfirmPayment={() => {
          console.log('결제하기 클릭');
          if (isPaymentFromSplit) {
            // 분할 결제 내역 추가
            setSplitPayments((prev) => [
              ...prev,
              {
                id: `payment-${Date.now()}`,
                method: 'card',
                amount: splitPaymentAmount,
                timestamp: Date.now(),
              },
            ]);
            // 분할 결제에서 온 경우 결제 완료 후 분할 결제 다이얼로그로 돌아감
            setIsCardPaymentDialogOpen(false);
            setIsPaymentFromSplit(false);
            setIsSplitPaymentDialogOpen(true);
          }
          // TODO: 결제하기 모달 열기
        }}
      />
      {/* 임의 결제 확인 모달 */}
      <ArbitraryPaymentConfirmDialog
        isOpen={isArbitraryPaymentConfirmDialogOpen}
        onClose={() => setIsArbitraryPaymentConfirmDialogOpen(false)}
        onBack={() => {
          setIsArbitraryPaymentConfirmDialogOpen(false);
        }}
        onContinue={() => {
          console.log('임의 결제 계속 진행');
          setIsArbitraryPaymentConfirmDialogOpen(false);
          setIsCardPaymentDialogOpen(false);
          // TODO: 실제 임의 결제 로직 구현
        }}
      />
      {/* 현금 결제 모달 */}
      <CashPaymentDialog
        isOpen={isCashPaymentDialogOpen}
        onClose={() => {
          setIsCashPaymentDialogOpen(false);
          if (isPaymentFromSplit) {
            setIsPaymentFromSplit(false);
            setIsSplitPaymentDialogOpen(true);
          }
        }}
        paymentAmount={
          isPaymentFromSplit ? splitPaymentAmount : order.totalPrice
        }
        onNext={(receivedAmount) => {
          setCashReceivedAmount(receivedAmount);
          setIsCashPaymentDialogOpen(false);
          setIsCashReceiptDialogOpen(true);
        }}
      />
      {/* 현금영수증 모달 */}
      <CashReceiptDialog
        isOpen={isCashReceiptDialogOpen}
        onClose={() => setIsCashReceiptDialogOpen(false)}
        onComplete={(type, number) => {
          console.log('현금 결제 완료:', {
            receivedAmount: cashReceivedAmount,
            receiptType: type,
            receiptNumber: number,
          });
          setIsCashReceiptDialogOpen(false);
          if (isPaymentFromSplit) {
            // 분할 결제 내역 추가
            setSplitPayments((prev) => [
              ...prev,
              {
                id: `payment-${Date.now()}`,
                method: 'cash',
                amount: splitPaymentAmount,
                timestamp: Date.now(),
              },
            ]);
            // 분할 결제에서 온 경우 분할 결제 다이얼로그로 돌아감
            setIsPaymentFromSplit(false);
            setIsSplitPaymentDialogOpen(true);
          }
          // TODO: 실제 현금 결제 로직 구현
        }}
      />
      {/* 분할 결제 모달 */}
      <SplitPaymentDialog
        isOpen={isSplitPaymentDialogOpen}
        onClose={() => {
          setIsSplitPaymentDialogOpen(false);
          // 분할 결제 다이얼로그가 닫힐 때 결제 내역 초기화 (선택사항)
          // setSplitPayments([]);
        }}
        items={order.items}
        payments={splitPayments}
        onPayCash={(amount) => {
          setSplitPaymentAmount(amount);
          setIsPaymentFromSplit(true);
          setIsSplitPaymentDialogOpen(false);
          setIsCashPaymentDialogOpen(true);
        }}
        onPayCard={(amount) => {
          setSplitPaymentAmount(amount);
          setIsPaymentFromSplit(true);
          setIsSplitPaymentDialogOpen(false);
          setIsCardPaymentDialogOpen(true);
        }}
      />
    </S.TableDetailContainer>
  );
};

export default TableDetailContainer;
