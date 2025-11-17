import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { BasicButton } from '@repo/ui/components';

export type PaymentActionsProps = {
  onPayCard?: () => void;
  onPayCash?: () => void;
  onSplitPay?: () => void;
};

export function PaymentActions({
  onPayCard,
  onPayCash,
  onSplitPay,
}: PaymentActionsProps) {
  return (
    <Wrap>
      <BasicButton
        variant="Solid_Navy_2XL"
        onClick={onPayCard}
        customStyle={css`
          height: 120px;
        `}
      >
        카드결제
      </BasicButton>
      <BasicButton
        variant="Solid_Navy_2XL"
        customStyle={css`
          height: 120px;
        `}
        onClick={onPayCash}
      >
        현금결제
      </BasicButton>
      <BasicButton
        variant="Solid_Sky_Blue_2XL"
        customStyle={css`
          height: 120px;
        `}
        onClick={onSplitPay}
      >
        분할결제
      </BasicButton>
    </Wrap>
  );
}

const Wrap = styled.div`
  padding: 10px 12px 12px 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;
