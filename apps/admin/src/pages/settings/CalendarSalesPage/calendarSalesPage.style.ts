import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 40px 24px 24px 30px;
  flex: 1;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_1}

  & > div {
    width: 0.125rem;
    height: 1.25rem;
    background-color: ${theme.colors.grey[800]};
  }

  & > span {
    ${TYPOGRAPHY.ST_1}
    color: ${theme.colors.grey[600]};
  }
`;

export const CalendarCard = styled.div`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  border: 1px solid ${theme.colors.grey[200]};
  padding: 16px;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  ${TYPOGRAPHY.MT_5}
  color: ${theme.colors.grey[900]};
`;

export const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.grey[300]};
  background-color: ${theme.colors.white};
  cursor: pointer;
`;

export const CalendarDate = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.grey[700]};
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  flex: 1;
`;

export const Weekday = styled.div`
  ${TYPOGRAPHY.ST_3}
  color: ${theme.colors.grey[700]};
  text-align: center;
  padding: 6px 0;
`;

export const DayCell = styled.div<{ dimmed?: boolean }>`
  min-height: 90px;
  border: 1px solid ${theme.colors.grey[200]};
  border-radius: 8px;
  padding: 8px;
  background-color: ${({ dimmed }) =>
    dimmed ? theme.colors.grey[50] : theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DayNumber = styled.span<{ dimmed?: boolean }>`
  ${TYPOGRAPHY.ST_4}
  color: ${({ dimmed }) =>
    dimmed ? theme.colors.grey[400] : theme.colors.grey[800]};
`;

export const Event = styled.button`
  margin-top: 4px;
  padding: 8px 10px;
  border-radius: 10px;
  background-color: ${theme.colors.primary[500]};
  color: ${theme.colors.white};
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  ${TYPOGRAPHY.ST_3}
  width: fit-content;
  border: none;
  cursor: pointer;
  text-align: left;
`;

export const EmptyState = styled.div`
  width: 100%;
  padding: 24px 0;
  text-align: center;
  ${TYPOGRAPHY.ST_3}
  color: ${theme.colors.grey[500]};
`;

export const ModalCard = styled.div`
  background-color: ${theme.colors.white};
  border-radius: 18px;
  padding: 28px 28px 24px;
  min-width: 420px;
  max-width: 520px;
  box-shadow: 0px 8px 28px rgba(0, 0, 0, 0.16);
  border: 1px solid ${theme.colors.grey[200]};
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const ModalTitle = styled.h2`
  ${TYPOGRAPHY.MT_2}
  color: ${theme.colors.grey[800]};
  margin: 0;
`;

export const CloseButton = styled.button`
  cursor: pointer;
  position: absolute;
  top: -17px;
  right: -12px;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${theme.colors.grey[200]};
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 18px;
  column-gap: 24px;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
`;

export const StatLabel = styled.span`
  ${TYPOGRAPHY.ST_3}
  color: ${theme.colors.grey[600]};
`;

export const StatValue = styled.span`
  ${TYPOGRAPHY.MT_4}
  color: ${theme.colors.grey[800]};
`;

export const CancelValue = styled(StatValue)`
  color: ${theme.colors.semantic[500]};
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;
