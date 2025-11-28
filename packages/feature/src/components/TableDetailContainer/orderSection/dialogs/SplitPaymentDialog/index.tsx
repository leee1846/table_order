import { useState, useMemo, Fragment } from 'react';
import { BasicButton, ModalBackground, Keypad } from '@repo/ui/components';
import { CloseIcon, ArrowBackIcon, OrderListIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './splitPaymentDialog.styles';
import { formatCurrency } from '@repo/util/string';
import { calculateTotalAmount } from '@repo/util/calculation';
import type { OrderItem } from '../../types';

const { colors } = theme;

export type SplitPayment = {
  id: string;
  method: 'cash' | 'card';
  amount: number;
  timestamp: number;
};

export type SplitPaymentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[]; // 주문 메뉴 목록
  payments?: SplitPayment[]; // 결제 내역
  onPayCash: (amount: number) => void;
  onPayCard: (amount: number) => void;
};

export const SplitPaymentDialog = ({
  isOpen,
  onClose,
  items,
  payments = [],
  onPayCash,
  onPayCard,
}: SplitPaymentDialogProps) => {
  // 각 메뉴별 선택된 수량을 추적 (itemId -> selectedQuantity)
  const [selectedQuantities, setSelectedQuantities] = useState<
    Map<string, number> //key : itemId , value : 선택된 수량
  >(new Map());

  // 직접 입력한 금액
  const [inputAmount, setInputAmount] = useState<string>('0');

  // 선택된 메뉴들의 총 금액 계산
  const selectedAmount = useMemo(() => {
    // 선택된 수량이 있는 메뉴만 필터링
    const itemsWithSelection = items.filter((item) => {
      const selectedQty = selectedQuantities.get(item.id) || 0;

      return selectedQty > 0;
    });

    const selectedItems = itemsWithSelection.map((item) => {
      const selectedQty = selectedQuantities.get(item.id) || 0;
      return {
        ...item,
        qty: selectedQty, // 원래 수량 대신 선택된 수량 사용
      };
    });

    const menuItemsForCalculation = selectedItems.map((item) => ({
      menu: { menuPrice: item.unitPrice },
      selectedOptions:
        item.options?.map((opt) => ({
          optionPrice: opt.unitPrice,
          selectedQuantity: opt.qty,
        })) || [],
      quantity: item.qty,
    }));

    return calculateTotalAmount(menuItemsForCalculation);
  }, [items, selectedQuantities]);

  // 전체 주문 금액 계산
  const totalOrderAmount = useMemo(() => {
    return calculateTotalAmount(
      items.map((item) => ({
        menu: { menuPrice: item.unitPrice },
        selectedOptions:
          item.options?.map((opt) => ({
            optionPrice: opt.unitPrice,
            selectedQuantity: opt.qty,
          })) || [],
        quantity: item.qty,
      }))
    );
  }, [items]);

  // 결제된 총 금액 계산
  const totalPaidAmount = useMemo(() => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  }, [payments]);

  // 잔여 결제 금액
  const remainingAmount = totalOrderAmount - totalPaidAmount;

  // 메뉴 아이템 클릭 핸들러 (수량 증가)
  const handleItemClick = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) {
      return;
    }

    setSelectedQuantities((prev) => {
      const newMap = new Map(prev);
      const currentQty = newMap.get(itemId) || 0;
      const nextQty = currentQty >= item.qty ? 0 : currentQty + 1;

      if (nextQty === 0) {
        newMap.delete(itemId);
      } else {
        newMap.set(itemId, nextQty);
      }
      return newMap;
    });
  };

  // 숫자 입력 핸들러
  const handleNumberPress = (number: number) => {
    if (inputAmount === '0') {
      setInputAmount(number.toString());
    } else {
      setInputAmount((prev) => `${prev}${number.toString()}`);
    }
  };

  // 00 입력 핸들러
  const handleDoubleZero = () => {
    if (inputAmount === '0') {
      setInputAmount('0');
    } else {
      setInputAmount((prev) => `${prev}00`);
    }
  };

  // 백스페이스 핸들러
  const handleBackspace = () => {
    if (inputAmount.length === 1) {
      setInputAmount('0');
    } else {
      setInputAmount((prev) => prev.slice(0, -1));
    }
  };

  // 선택된 메뉴가 있는지 확인하는 헬퍼 함수
  const hasSelectedItems = () => {
    const quantities = Array.from(selectedQuantities.values());
    return quantities.some((qty) => qty > 0);
  };

  // 현금 결제 핸들러
  const handleCashPayment = () => {
    const hasSelection = hasSelectedItems();
    const amount = hasSelection
      ? selectedAmount
      : parseInt(inputAmount, 10) || 0;
    if (amount > 0) {
      onPayCash(amount);
      // 선택 초기화 및 입력 초기화
      setSelectedQuantities(new Map());
      setInputAmount('0');
    }
  };

  // 카드 결제 핸들러
  const handleCardPayment = () => {
    const hasSelection = hasSelectedItems();
    const amount = hasSelection
      ? selectedAmount
      : parseInt(inputAmount, 10) || 0;
    if (amount > 0) {
      onPayCard(amount);
      // 선택 초기화 및 입력 초기화
      setSelectedQuantities(new Map());
      setInputAmount('0');
    }
  };

  // 완료 버튼 핸들러
  const handleComplete = () => {
    if (remainingAmount === 0) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.ContentWrapper>
          <S.LeftSection>
            <S.SectionTitle>분할결제</S.SectionTitle>
            <S.OrderSheetSection>
              <S.OrderSheetHeader>
                <OrderListIcon
                  width={24}
                  height={24}
                  color={colors.primary[500]}
                />
                <S.OrderSheetLabel>주문서</S.OrderSheetLabel>
              </S.OrderSheetHeader>
              <S.OrderItemsList>
                {items.map((item) => {
                  const selectedQty = selectedQuantities.get(item.id) || 0;
                  const itemTotal = item.qty * item.unitPrice;
                  const optionsTotal =
                    item.options?.reduce(
                      (optTotal, opt) => optTotal + opt.qty * opt.unitPrice,
                      0
                    ) || 0;
                  const totalPrice = itemTotal + optionsTotal;
                  const isSelected = selectedQty > 0;
                  return (
                    <Fragment key={item.id}>
                      <S.OrderItemRow
                        $isSelected={isSelected}
                        onClick={() => handleItemClick(item.id)}
                      >
                        <div>
                          <S.ItemName>{item.name}</S.ItemName>
                          <S.ItemQty>
                            {selectedQty}/{item.qty}
                          </S.ItemQty>
                          <S.ItemPrice>
                            {formatCurrency(totalPrice)}
                          </S.ItemPrice>
                        </div>
                        {item.options?.map((option) => (
                          <S.OptionRow key={option.id}>
                            <div>
                              <p>⌞</p>
                              <S.OptionName>{option.name}</S.OptionName>
                            </div>

                            <div>
                              <S.OptionQty>{option.qty}</S.OptionQty>
                              <S.OptionPrice>
                                {formatCurrency(option.unitPrice)}
                              </S.OptionPrice>
                            </div>
                          </S.OptionRow>
                        ))}
                      </S.OrderItemRow>
                    </Fragment>
                  );
                })}
                {payments.map((payment) => (
                  <S.PaymentRow key={payment.id}>
                    <S.PaymentMethod>
                      {payment.method === 'cash' ? '현금결제' : '카드결제'}
                    </S.PaymentMethod>
                    <S.PaymentQty>-</S.PaymentQty>
                    <S.PaymentAmount $isNegative>
                      -{formatCurrency(payment.amount)}
                    </S.PaymentAmount>
                  </S.PaymentRow>
                ))}
              </S.OrderItemsList>
            </S.OrderSheetSection>
            <S.RemainingAmountSection>
              <S.RemainingLabel>잔여 결제 금액</S.RemainingLabel>
              <S.RemainingAmount>
                {formatCurrency(remainingAmount)}
              </S.RemainingAmount>
            </S.RemainingAmountSection>
          </S.LeftSection>

          <S.RightSection>
            <S.CloseButton onClick={onClose} aria-label="닫기">
              <CloseIcon width={32} height={32} color={colors.grey[700]} />
            </S.CloseButton>

            <S.TopSection>
              {hasSelectedItems() ? (
                <S.AmountDisplay>
                  {formatCurrency(selectedAmount)}원
                </S.AmountDisplay>
              ) : (
                <S.AmountDisplay $isPlaceholder={inputAmount === '0'}>
                  {inputAmount === '0'
                    ? '결제할 금액을 입력하세요'
                    : `${formatCurrency(parseInt(inputAmount, 10))}원`}
                </S.AmountDisplay>
              )}
            </S.TopSection>
            <S.KeypadWrapper>
              <Keypad
                onNumberPress={handleNumberPress}
                bottomLeftLabel="00"
                bottomLeftAction={handleDoubleZero}
                bottomRightAction={handleBackspace}
                bottomRightIcon={<ArrowBackIcon width={24} height={24} />}
              />
            </S.KeypadWrapper>
            <S.Footer>
              {remainingAmount === 0 ? (
                <BasicButton
                  variant="Solid_Navy_2XL"
                  onClick={handleComplete}
                  fullWidth
                >
                  완료
                </BasicButton>
              ) : (
                <>
                  <BasicButton
                    variant="Solid_Navy_2XL"
                    onClick={handleCashPayment}
                    customStyle={S.PaymentButtonStyle}
                  >
                    현금결제
                  </BasicButton>
                  <BasicButton
                    variant="Solid_Navy_2XL"
                    onClick={handleCardPayment}
                    customStyle={S.PaymentButtonStyle}
                  >
                    카드결제
                  </BasicButton>
                </>
              )}
            </S.Footer>
          </S.RightSection>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
