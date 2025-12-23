import { useState } from 'react';
import {
  BasicButton,
  ModalBackground,
  CheckButton,
  NumberInput,
} from '@repo/ui/components';
import { CloseIcon } from '@repo/ui/icons';
import { theme, TYPOGRAPHY } from '@repo/ui';
import type { OrderItem } from '../../../orderSection/types';
import * as S from './selectCancelDialog.styles';
import { css } from '@emotion/react';
import { usePutCancelOrderMenu } from '@repo/api/queries';
import { toast } from '@repo/feature/utils';

const { colors } = theme;

export type SelectCancelDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onCancelSuccess?: () => void;
};

export const SelectCancelDialog = ({
  isOpen,
  onClose,
  items,
  onCancelSuccess,
}: SelectCancelDialogProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());
  const { mutateAsync: cancelOrderMenu, isPending } = usePutCancelOrderMenu();

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemId);
        // 체크박스가 활성화되면 현재 수량을 기본값으로 설정
        const item = items.find((it) => it.id === itemId);
        if (item && !quantities.has(itemId)) {
          setQuantities((prevQty) => {
            const newQty = new Map(prevQty);
            newQty.set(itemId, item.qty);
            return newQty;
          });
        }
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities((prev) => {
      const newMap = new Map(prev);
      if (quantity < 1) {
        newMap.delete(itemId);
        setSelectedItems((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.delete(itemId);
          return newSet;
        });
      } else {
        const item = items.find((it) => it.id === itemId);
        const maxQty = item?.qty || 1;
        newMap.set(itemId, Math.min(quantity, maxQty));
      }
      return newMap;
    });
  };

  const handleCancel = async () => {
    if (isPending) {
      return;
    }

    if (selectedItems.size === 0) {
      toast('취소할 메뉴를 선택해주세요.');
      return;
    }

    const cancelItems = Array.from(selectedItems)
      .map((itemId) => ({
        orderDetailMenuSeq: Number(itemId),
        canceledQuantity: quantities.get(itemId) || 1,
      }))
      .filter(
        ({ orderDetailMenuSeq, canceledQuantity }) =>
          !Number.isNaN(orderDetailMenuSeq) && canceledQuantity > 0
      );

    if (cancelItems.length === 0) {
      toast('취소할 수 있는 메뉴가 없어요.');
      return;
    }

    try {
      await cancelOrderMenu(cancelItems);
      toast('선택한 메뉴를 취소했어요.');

      onCancelSuccess?.();
      handleClose();
    } catch (error) {
      toast('메뉴 취소 중 오류가 발생했어요. 다시 시도해주세요.');
    }
  };

  const handleClose = () => {
    setSelectedItems(new Set());
    setQuantities(new Map());
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackground position="center" onClick={handleClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={handleClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

        <S.ContentWrapper>
          <S.Header>
            <S.Title>선택 취소</S.Title>
          </S.Header>

          <S.ItemsList>
            {items.map((item, index) => {
              const isChecked = selectedItems.has(item.id);
              const quantity = quantities.get(item.id) || item.qty;

              return (
                <S.ItemRow key={`${item.id}-${index}`}>
                  <CheckButton
                    variant="square"
                    checked={isChecked}
                    onChange={(checked) =>
                      handleCheckboxChange(item.id, checked)
                    }
                    customStyle={css`
                      & > div {
                        width: 1.5rem;
                        height: 1.5rem;
                      }
                    `}
                  >
                    <S.ItemName>{item.name}</S.ItemName>
                  </CheckButton>
                  <S.QuantityWrapper>
                    <NumberInput
                      variant="square"
                      value={quantity}
                      min={1}
                      max={item.qty}
                      disabled={!isChecked}
                      onChange={(value) => handleQuantityChange(item.id, value)}
                      customStyle={css`
                        ${TYPOGRAPHY.MT_6}
                        width: 8.75rem;
                      `}
                    />
                  </S.QuantityWrapper>
                </S.ItemRow>
              );
            })}
          </S.ItemsList>

          <S.Footer>
            <BasicButton
              variant="Solid_Navy_2XL"
              onClick={handleCancel}
              disabled={isPending}
              fullWidth
            >
              선택취소
            </BasicButton>
          </S.Footer>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
