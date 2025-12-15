import { useState } from 'react';
import styled from '@emotion/styled';
import { PersonIcon, PickupIcon } from '@repo/ui/icons';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { PickupNotificationDialog } from './dialogs/PickupNotificationDialog';

const { colors } = theme;

export type OrderHeaderProps = {
  title: string;
  numberOfPeople: number;
  orderTime: string;
  useCustomerCount?: boolean;
};

export function OrderHeader({
  title,
  numberOfPeople,
  orderTime,
  useCustomerCount = false,
}: OrderHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePickupClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Header>
        <RightBox>
          <Title>{title}</Title>
          {useCustomerCount && (
            <GuestCount>
              <div>
                <PersonIcon width={20} height={20} color={colors.grey[700]} />
              </div>

              <NumberOfPeople>{numberOfPeople}</NumberOfPeople>
            </GuestCount>
          )}
        </RightBox>
        <LeftBox>
          <BasicButton
            variant="Outline_Navy_L"
            onClick={handlePickupClick}
            icon={<PickupIcon width={30} height={30} />}
          >
            픽업알림
          </BasicButton>
          <OrderTime>
            <p>{orderTime}</p>
            <p>(-)</p>
          </OrderTime>
        </LeftBox>
      </Header>
      <PickupNotificationDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      />
    </>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 29px;
  border-bottom: 1px solid ${colors.grey[200]};
`;

const RightBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 12px;
`;

const Title = styled.h1`
  ${TYPOGRAPHY.MT_1}
  font-size : 32px;
  line-height: 42px;
  letter-spacing: -0.1rem;
`;

const GuestCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  > div:nth-of-type(1) {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NumberOfPeople = styled.div`
  ${TYPOGRAPHY.MT_7}
  color: ${colors.grey[700]};
`;

const LeftBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 14px;
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
