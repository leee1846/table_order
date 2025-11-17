'use client';

import { useState } from 'react';
import * as S from './tableDetailContainer.styles';
import { OrderPanel } from './orderSection/OrderPanel';
import { ActionGrid } from './actionSection/ActionGrid';
import { AddMenuDialog } from './actionSection/dialogs/AddMenuDialog';
import { SelectCancelDialog } from './actionSection/dialogs/SelectCancelDialog';
import { AmountChangeDialog } from './actionSection/dialogs/AmountChangeDialog';
import { AllDiscountDialog } from './actionSection/dialogs/AllDiscountDialog';
import { ServiceAmountDialog } from './orderSection/dialogs/ServiceAmountDialog';
import type { Order, OrderItem } from './orderSection/types';
import { openDualActionDialog } from '@repo/feature/utils';
import { toast } from '@repo/ui/components';

export const TableDetailContainer = () => {
  const [isAddMenuDialogOpen, setIsAddMenuDialogOpen] = useState(false);
  const [isSelectCancelDialogOpen, setIsSelectCancelDialogOpen] =
    useState(false);
  const [isAmountChangeDialogOpen, setIsAmountChangeDialogOpen] =
    useState(false);
  const [isAllDiscountDialogOpen, setIsAllDiscountDialogOpen] = useState(false);
  const [isServiceAmountDialogOpen, setIsServiceAmountDialogOpen] =
    useState(false);
  const [selectedItemForService, setSelectedItemForService] =
    useState<OrderItem | null>(null);

  const order: Order = {
    tableName: '2번 테이블',
    numberOfPeople: 3,
    items: [
      {
        id: '1',
        name: '김치찌개김치찌개김치찌개김치찌개',
        qty: 1,
        unitPrice: 9000,
        options: [
          { id: '1-1', name: '옵션1', qty: 2, unitPrice: 2000 },
          { id: '1-2', name: '옵션 2', qty: 1, unitPrice: 1000 },
        ],
      },
      {
        id: '2',
        name: '삼겹살',
        qty: 999,
        unitPrice: 300000000,
      },
    ],
    totalCount: 2,
    totalPrice: 74000,
    orderTime: '24:59',
  };

  const handleActionPress = (id: string) => {
    const actionHandlers: Record<string, () => void> = {
      'add-menu': () => setIsAddMenuDialogOpen(true),
      'select-cancel': () => setIsSelectCancelDialogOpen(true),
      'amount-change': () => setIsAmountChangeDialogOpen(true),
      'all-discount': () => setIsAllDiscountDialogOpen(true),
      'all-cancel': () => {
        openDualActionDialog({
          title: `전체 메뉴를\n취소하시겠어요?`,
          primaryText: '네',
          secondaryText: '아니오',
          onConfirm: () => {
            console.log('전체 취소');
            toast('전체 메뉴를 취소했어요.');
          },
          onCancel: () => {
            console.log('전체 취소 취소');
          },
        });
      },
    };

    actionHandlers[id]?.();
  };

  const handleAddMenu = (selectedItems: unknown) => {
    console.log('추가된 메뉴:', selectedItems);
    // TODO: 실제 메뉴 추가 로직 구현
  };

  const handleSelectCancel = (
    selectedItems: { itemId: string; quantity: number }[]
  ) => {
    console.log('취소할 메뉴:', selectedItems);
    // TODO: 실제 선택 취소 로직 구현
  };

  const handleAmountChange = (amount: number) => {
    console.log('변경된 금액:', amount);
    // TODO: 실제 금액 변경 로직 구현
  };

  const handleAllDiscount = (discount: number) => {
    console.log('적용된 할인:', discount);
    // TODO: 실제 할인 적용 로직 구현
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
            onPayCard={() => console.log('카드결제')}
            onPayCash={() => console.log('현금결제')}
            onSplitPay={() => console.log('분할결제')}
            onItemClick={handleItemClick}
          />
        </S.Left>
        <S.Right>
          <ActionGrid
            onPress={handleActionPress}
            onProceed={() => console.log('다음단계')}
          />
        </S.Right>
      </S.Layout>
      <AddMenuDialog
        isOpen={isAddMenuDialogOpen}
        onClose={() => setIsAddMenuDialogOpen(false)}
        tableName={order.tableName}
        onAdd={handleAddMenu}
      />
      <SelectCancelDialog
        isOpen={isSelectCancelDialogOpen}
        onClose={() => setIsSelectCancelDialogOpen(false)}
        items={order.items}
        onCancel={handleSelectCancel}
      />
      <AmountChangeDialog
        isOpen={isAmountChangeDialogOpen}
        onClose={() => setIsAmountChangeDialogOpen(false)}
        onApply={handleAmountChange}
      />
      <AllDiscountDialog
        isOpen={isAllDiscountDialogOpen}
        onClose={() => setIsAllDiscountDialogOpen(false)}
        onApply={handleAllDiscount}
      />
      <ServiceAmountDialog
        isOpen={isServiceAmountDialogOpen}
        onClose={() => {
          setIsServiceAmountDialogOpen(false);
          setSelectedItemForService(null);
        }}
        onApply={handleServiceAmountApply}
      />
    </S.TableDetailContainer>
  );
};

export default TableDetailContainer;
