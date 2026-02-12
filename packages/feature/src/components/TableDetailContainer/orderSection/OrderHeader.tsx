import { useEffect, useState } from 'react';
import type { i18n as I18nInstance } from 'i18next';
import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { useTranslation } from 'react-i18next';
import { IPayment } from '@repo/api/types';
import { toast } from '@repo/feature/utils';

const { colors } = theme;

const parseOrderTimeToDate = (orderTime: string) => {
  const parsed = new Date(orderTime);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const hhmmMatch = orderTime.match(/^(\d{1,2}):(\d{2})$/);

  if (!hhmmMatch) {
    return null;
  }

  const [, hour, minute] = hhmmMatch;
  const now = new Date();
  const parsedToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    Number(hour),
    Number(minute),
    0,
    0
  );

  if (parsedToday.getTime() > now.getTime()) {
    parsedToday.setDate(parsedToday.getDate() - 1);
  }

  return parsedToday;
};

export type OrderHeaderProps = {
  title: string;
  numberOfPeople: number;
  orderTime: string;
  useCustomerCount?: boolean;
  useTableOccupancyTime?: boolean;
  i18nInstance?: I18nInstance;
  paymentList: IPayment[];
  refetchOrderHistories?: () => void;
  onPress?: (id: string) => void;
};

export function OrderHeader({
  title,
  numberOfPeople,
  orderTime,
  useCustomerCount = false,
  useTableOccupancyTime = false,
  i18nInstance,
  paymentList,
  refetchOrderHistories,
  onPress,
}: OrderHeaderProps) {
  const { t } = useTranslation('admin', { i18n: i18nInstance });
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const handleSelectCancel = async () => {
    await refetchOrderHistories?.();

    if (paymentList.length > 0) {
      toast(t('일부 결제 내역이 있어 취소할 수 없습니다.'));
      return;
    }

    onPress?.('select-cancel');
  };

  const handleAllCancel = async () => {
    await refetchOrderHistories?.();

    if (paymentList.length > 0) {
      toast(t('일부 결제 내역이 있어 취소할 수 없습니다.'));
      return;
    }
    onPress?.('all-cancel');
  };

  useEffect(() => {
    if (!orderTime) {
      setElapsedMinutes(0);
      return;
    }

    const parsedOrderTime = parseOrderTimeToDate(orderTime);

    if (!parsedOrderTime) {
      setElapsedMinutes(0);
      return;
    }

    const updateElapsedSeconds = () => {
      const minutesFromOrder =
        (Date.now() - parsedOrderTime.getTime()) / 1000 / 60;
      setElapsedMinutes(Math.max(0, Math.floor(minutesFromOrder)));
    };

    updateElapsedSeconds();
    const timer = setInterval(updateElapsedSeconds, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [orderTime]);

  const formattedElapsedTime = `${String(
    Math.floor(elapsedMinutes / 60)
  ).padStart(2, '0')}:${String(elapsedMinutes % 60).padStart(2, '0')}`;

  return (
    <Header>
      <LeftBox>
        <Title>{title}</Title>
        {useCustomerCount && <GuestCount>인원: {numberOfPeople}</GuestCount>}
      </LeftBox>
      <RightBox>
        {useTableOccupancyTime ? (
          <OrderTime>
            <p>{orderTime}</p>
            <p>{orderTime ? `(${formattedElapsedTime})` : '(-)'}</p>
          </OrderTime>
        ) : (
          <OrderTime>
            <p>{orderTime}</p>
            <p> (-)</p>
          </OrderTime>
        )}
        <ButtonBox>
          <button type="button" onClick={handleSelectCancel}>
            {t('선택 삭제')}
          </button>
          <button type="button" onClick={handleAllCancel}>
            {t('전체 삭제')}
          </button>
        </ButtonBox>
      </RightBox>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${colors.grey[200]};
`;

const RightBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & > button {
    width: 79px;
    height: 40px;
    border-radius: 12px;
    ${TYPOGRAPHY.BD_2}
  }

  & > button:first-of-type {
    background-color: ${colors.grey[300]};
    color: ${colors.grey[700]};
  }

  & > button:last-of-type {
    background-color: ${colors.semantic[400]};
    color: ${colors.white};
  }
`;

const Title = styled.h1`
  font-size: 31.998px;
  font-style: normal;
  font-weight: 700;
  line-height: 41.998px; /* 131.25% */
  letter-spacing: -0.8px;
`;

const GuestCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  background-color: ${colors.grey[100]};
  border-radius: 8px;
  border: 1px solid ${colors.grey[300]};
  ${TYPOGRAPHY.CT_1}
  color: ${colors.grey[600]};
  white-space: nowrap;
`;

const LeftBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const OrderTime = styled.div`
  display: flex;
  ${TYPOGRAPHY.ST_2}

  > p:nth-of-type(1) {
    margin-right: 3px;
    color: ${colors.grey[600]};
  }

  > p:nth-of-type(2) {
    color: ${colors.grey[500]};
  }
`;
