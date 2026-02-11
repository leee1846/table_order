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
import type { i18n as I18nInstance } from 'i18next';
import { useTranslation } from 'react-i18next';

const { colors } = theme;

export type SelectCancelDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onCancelSuccess?: () => void;
  i18nInstance?: I18nInstance;
};

export const SelectCancelDialog = ({
  isOpen,
  onClose,
  items,
  onCancelSuccess,
  i18nInstance,
}: SelectCancelDialogProps) => {
  const { t } = useTranslation('admin', { i18n: i18nInstance });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());
  const { mutateAsync: cancelOrderMenu, isPending } = usePutCancelOrderMenu();

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => new Set(prev).add(itemId));

      // 수량 초기화는 별도로 처리
      const item = items.find((it) => it.id === itemId);
      if (item) {
        setQuantities((prev) => {
          if (!prev.has(itemId)) {
            const newMap = new Map(prev);
            newMap.set(itemId, item.qty);
            return newMap;
          }
          return prev;
        });
      }
    } else {
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities((prev) => {
      const newMap = new Map(prev);
      const item = items.find((it) => it.id === itemId);
      const maxQty = item?.qty || 1;
      newMap.set(itemId, Math.min(quantity, maxQty));
      return newMap;
    });
  };

  const handleCancel = async () => {
    if (isPending) {
      return;
    }

    if (selectedItems.size === 0) {
      toast(t('삭제할 메뉴를 선택해주세요.'));
      return;
    }

    const hasZeroQuantity = Array.from(selectedItems).some(
      (itemId) => (quantities.get(itemId) ?? 0) === 0
    );

    if (hasZeroQuantity) {
      toast(t('수량을 한 개 이상 입력해주세요.'));
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
      toast(t('삭제할 수 있는 메뉴가 없어요.'));
      return;
    }

    try {
      await cancelOrderMenu(cancelItems);
      toast(t('선택한 메뉴를 삭제했어요.'));

      onCancelSuccess?.();
      handleClose();
    } catch {
      toast(t('메뉴 삭제 중 오류가 발생했어요. 다시 시도해주세요.'));
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
        <S.CloseButton onClick={handleClose} aria-label={t('닫기')}>
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

        <S.ContentWrapper>
          <S.Header>
            <S.Title>{t('선택 삭제')}</S.Title>
          </S.Header>

          <S.ItemsList>
            {items.map((item, index) => {
              const isChecked = selectedItems.has(item.id);
              const quantity = quantities.get(item.id) ?? item.qty;

              return (
                <S.ItemRow key={`${item.id}-${index + 1}`}>
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
                      min={0}
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
              {t('선택 삭제')}
            </BasicButton>
          </S.Footer>
        </S.ContentWrapper>
      </S.DialogContainer>
    </ModalBackground>
  );
};
