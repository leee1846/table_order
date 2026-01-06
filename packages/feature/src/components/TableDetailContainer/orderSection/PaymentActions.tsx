import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { BasicButton } from '@repo/ui/components';
import { useTranslation } from 'react-i18next';
import type { i18n as I18nInstance } from 'i18next';

export type PaymentActionsProps = {
  // onPayCard?: () => void;
  // onPayCash?: () => void;
  // onSplitPay?: () => void;
  onLeaveTable?: () => void;
  i18nInstance?: I18nInstance;
};

export function PaymentActions({
  // onPayCard,
  // onPayCash,
  // onSplitPay,
  onLeaveTable,
  i18nInstance,
}: PaymentActionsProps) {
  const { t } = useTranslation('admin', { i18n: i18nInstance });

  return (
    <Wrap>
      {/* <BasicButton
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
      </BasicButton> */}

      <BasicButton
        variant="Solid_Navy_2XL"
        customStyle={css`
          height: 100px;
          font-size: 25px;
        `}
        onClick={onLeaveTable}
        fullWidth={true}
      >
        {t('테이블 나가기')}
      </BasicButton>
    </Wrap>
  );
}

const Wrap = styled.div`
  // padding: 10px 12px 12px 12px;
  // display: grid;
  // grid-template-columns: repeat(3, 1fr);
  // gap: 10px;
  width: 100%;
`;
