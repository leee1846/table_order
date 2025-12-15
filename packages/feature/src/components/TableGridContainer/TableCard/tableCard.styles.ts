import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { TYPOGRAPHY, theme } from '@repo/ui';

const { colors } = theme;

export const CardContainer = styled.div<{ onClick?: () => void }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${colors.grey[200]};
  width: 100%;
  height: 100%;
  cursor: pointer;
  // 탭 하이라이트 색상 제거
  -webkit-tap-highlight-color: transparent;

  ${({ onClick }) =>
    onClick &&
    css`
      &:active {
        color: ${colors.white};
        background: ${colors.primary[500]};

        & h1,
        & span,
        & div {
          color: ${colors.white} !important;
        }
      }
    `}
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const TableNumber = styled.h1<{ isEmpty?: boolean }>`
  ${TYPOGRAPHY.ST_3}
  color: ${({ isEmpty }) => (isEmpty ? colors.grey[400] : colors.grey[800])};
`;

export const OrderTime = styled.span`
  ${TYPOGRAPHY.CT_3}
  color: ${colors.grey[600]};
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MenuItemQuantity = styled.span`
  ${TYPOGRAPHY.BD_2}
  color: ${colors.grey[600]};
`;

export const MenuItemName = styled.span`
  ${TYPOGRAPHY.BD_2}
  color: ${colors.grey[600]};
`;

export const CardFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
`;

export const TotalAmount = styled.div`
  ${TYPOGRAPHY.ST_3}
  color: ${colors.grey[800]};
`;

export const StatusText = styled.div`
  ${TYPOGRAPHY.ST_3}
  color: ${colors.grey[400]};
`;
