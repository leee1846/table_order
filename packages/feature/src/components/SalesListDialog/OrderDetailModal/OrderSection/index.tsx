import { BasicButton } from '@repo/ui/components';
import { formatCurrency } from '@repo/util';
import * as S from './orderSection.style';

const MENUS = [
  {
    id: 1,
    name: '뉴메뉴메뉴메뉴1',
    qty: 1,
    price: 10000,
  },
  {
    id: 2,
    name: '뉴메뉴메뉴메뉴2',
    qty: 2,
    price: 20000,
    options: [
      {
        id: 1,
        name: '옵션1',
        qty: 1,
        price: 1000,
      },
    ],
  },
  {
    id: 3,
    name: '뉴메뉴메뉴메뉴3',
    qty: 3,
    price: 30000,
    options: [
      {
        id: 1,
        name: '옵션1',
        qty: 1,
        price: 1000,
      },
      {
        id: 2,
        name: '옵션2',
        qty: 1,
        price: 1000,
      },
    ],
  },
];

export const OrderSection = () => {
  return (
    <div>
      <S.TitleContainer>
        <p>테이블 번호:101</p>
        <div>
          <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
            재결제
          </BasicButton>
          <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
            재판매
          </BasicButton>
        </div>
      </S.TitleContainer>

      <S.OrderInfoContainer>
        <div>
          <p>
            멤버십<span>-</span>
          </p>
          <p>
            결제 수단<span>일반</span>
          </p>
          <p />
        </div>
        <div>
          <p>
            주문번호<span>123213</span>
          </p>
          <p>
            주문 일시<span>2025-01-01 12:00:00</span>
          </p>
          <p>
            객수<span>2</span>
          </p>
        </div>
      </S.OrderInfoContainer>

      <S.OrderList>
        <ul>
          {MENUS.map((menu) => (
            <li key={menu.id}>
              <S.MenuItem>
                <p>{menu.name}</p>
                <p>{menu.qty}</p>
                <p>{formatCurrency(menu.price)}</p>
              </S.MenuItem>
              {menu.options && menu.options.length > 0 && (
                <ul>
                  {menu.options.map((option) => (
                    <S.OptionItem key={option.id}>
                      <p>
                        <span /> {option.name}
                      </p>
                      <p>{option.qty}</p>
                      <p>{formatCurrency(option.price)}</p>
                    </S.OptionItem>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </S.OrderList>

      <S.Total>
        <p>합계 금액</p>
        <p>6</p>
        <p>{formatCurrency(100000)}</p>
      </S.Total>
    </div>
  );
};
