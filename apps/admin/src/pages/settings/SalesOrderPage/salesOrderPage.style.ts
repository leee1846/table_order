import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px 24px 40px 30px;
`;

export const Title = styled.p`
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${({ theme }) => theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_1}

  & > span:first-child {
    width: 0.125rem;
    height: 1.25rem;
    background-color: ${({ theme }) => theme.colors.grey[800]};
  }

  & > span:last-child {
    ${TYPOGRAPHY.ST_1}
    color: ${({ theme }) => theme.colors.grey[600]};
  }
`;

export const Filters = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

export const CalendarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

export const CalendarText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 12px;
  border: 0.5px solid ${({ theme }) => theme.colors.grey[400]};
  ${TYPOGRAPHY.BD_2}
  color: ${({ theme }) => theme.colors.grey[900]};
`;
