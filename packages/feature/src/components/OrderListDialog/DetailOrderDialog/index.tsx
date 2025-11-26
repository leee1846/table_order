import * as S from './detailOrderDialog.style';
import { CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { formatCurrency } from '@repo/util/string';
import { OrderItem as MenuItem } from 'src/components/TableDetailContainer/orderSection/types';
import { OrderItem as OrderInfo } from '../index';

const { colors } = theme;

export type DetailOrderDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  order?: OrderInfo;
  menuItems?: MenuItem[];
  numberOfPeople?: number;
};

const DetailOrderDialog = ({
  isOpen,
  onClose,
  order,
  menuItems = [],
  numberOfPeople = 0,
}: DetailOrderDialogProps) => {
  if (!isOpen) {
    return null;
  }

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  // 합계 계산
  const totalQuantity = menuItems.reduce((sum, item) => {
    const itemTotal =
      item.qty +
      (item.options?.reduce((optSum, opt) => optSum + opt.qty, 0) || 0);
    return sum + itemTotal;
  }, 0);

  const totalPrice = menuItems.reduce((sum, item) => {
    const itemPrice = item.unitPrice * item.qty;
    const optionsPrice =
      item.options?.reduce(
        (optSum, opt) => optSum + opt.unitPrice * opt.qty,
        0
      ) || 0;
    return sum + itemPrice + optionsPrice;
  }, 0);

  return (
    <S.DetailOrderDialog onClick={(e) => e.stopPropagation()}>
      <S.CloseButtonWrapper onClick={handleCloseClick}>
        <CloseIcon width={32} height={32} color={colors.grey[700]} />
      </S.CloseButtonWrapper>
      <S.Header>
        <S.Title>주문내역 상세</S.Title>
      </S.Header>
      <S.Content>
        <S.OrderInfo>
          <S.InfoRow>
            <S.InfoItem>
              <S.InfoLabel>테이블 번호</S.InfoLabel>
              <S.InfoValue>{order?.tableNumber || '-'}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>주문 일시</S.InfoLabel>
              <S.InfoValue>{order?.orderDateTime || '-'}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>주문 채널</S.InfoLabel>
              <S.InfoValue>{order?.orderChannel || '-'}</S.InfoValue>
            </S.InfoItem>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoItem>
              <S.InfoLabel>주문 번호</S.InfoLabel>
              <S.InfoValue>{order?.orderNumber || '-'}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>결제 수단</S.InfoLabel>
              <S.InfoValue>{order?.paymentMethod || '-'}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>객수</S.InfoLabel>
              <S.InfoValue>{numberOfPeople}명</S.InfoValue>
            </S.InfoItem>
          </S.InfoRow>
        </S.OrderInfo>
        <S.MenuList>
          {menuItems.map((item) => (
            <div key={item.id}>
              <S.MenuItem>
                <S.MenuName>{item.name}</S.MenuName>
                <S.MenuQty>{item.qty}</S.MenuQty>
                <S.MenuPrice>{formatCurrency(item.unitPrice)}</S.MenuPrice>
              </S.MenuItem>
              {item.options?.map((option) => (
                <S.OptionItem key={option.id} isOption>
                  <S.OptionName>ㄴ{option.name}</S.OptionName>
                  <S.OptionQty>{option.qty}</S.OptionQty>
                  <S.OptionPrice>
                    {formatCurrency(option.unitPrice)}
                  </S.OptionPrice>
                </S.OptionItem>
              ))}
            </div>
          ))}
        </S.MenuList>
      </S.Content>
      <S.Footer>
        <S.TotalLabel>합계 금액</S.TotalLabel>
        <S.TotalQty>{totalQuantity}</S.TotalQty>
        <S.TotalPrice>{formatCurrency(totalPrice)}원</S.TotalPrice>
      </S.Footer>
    </S.DetailOrderDialog>
  );
};

export default DetailOrderDialog;
