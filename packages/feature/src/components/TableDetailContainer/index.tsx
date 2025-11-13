'use client';

import * as S from './tableDetailContainer.styles';
import { OrderPanel } from './orderSection/OrderPanel';
import { ActionGrid } from './actionSection/ActionGrid';
import type { Order } from './orderSection/types';

export const TableDetailContainer = () => {
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
            onPress={(id) => console.log('action:', id)}
            onProceed={() => console.log('다음단계')}
          />
        </S.Right>
      </S.Layout>
    </S.TableDetailContainer>
  );
};

export default TableDetailContainer;
