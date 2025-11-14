'use client';

import { useState } from 'react';
import * as S from './tableDetailContainer.styles';
import { OrderPanel } from './orderSection/OrderPanel';
import { ActionGrid } from './actionSection/ActionGrid';
import { AddMenuDialog } from './actionSection/dialogs/AddMenuDialog';
import type { Order } from './orderSection/types';

export const TableDetailContainer = () => {
  const [isAddMenuDialogOpen, setIsAddMenuDialogOpen] = useState(false);

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
        qty: 99999,
        unitPrice: 300000000,
      },
    ],
    totalCount: 2,
    totalPrice: 74000,
    orderTime: '24:59',
  };

  const handleActionPress = (id: string) => {
    if (id === 'add-menu') {
      setIsAddMenuDialogOpen(true);
    } else {
      console.log('action:', id);
    }
  };

  const handleAddMenu = (selectedItems: unknown) => {
    console.log('추가된 메뉴:', selectedItems);
    // TODO: 실제 메뉴 추가 로직 구현
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
    </S.TableDetailContainer>
  );
};

export default TableDetailContainer;
