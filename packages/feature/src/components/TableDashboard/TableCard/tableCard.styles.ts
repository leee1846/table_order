import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { TYPOGRAPHY, theme } from '@repo/ui';

const { colors } = theme;

export const CardContainer = styled.div<{ onClick?: () => void }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${colors.grey[100]};
  border-radius: 12px;
  padding: 16px;
  min-height: 120px;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  ${({ onClick }) =>
    onClick &&
    css`
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    `}
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const TableNumber = styled.div`
  ${TYPOGRAPHY.MT_4}
  color: ${colors.black};
`;

export const StatusIcon = styled.div`
  width: 24px;
  height: 16px;
  background: ${colors.grey[400]};
  border-radius: 4px;
`;

export const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const StatusText = styled.div`
  ${TYPOGRAPHY.BD_3}
  color: ${colors.grey[800]};
`;
