import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

const { colors } = theme;

export const CardContainer = styled.div`
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

  border-radius: 12px;

  &:active {
    color: ${colors.white};
    background: ${colors.primary[500]};

    & h1,
    & span,
    & div {
      color: ${colors.white} !important;
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  min-width: 0;

  > div {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
`;

export const TableNumber = styled.h1<{ isEmpty?: boolean }>`
  ${TYPOGRAPHY.ST_3}
  color: ${({ isEmpty }) => (isEmpty ? colors.grey[400] : colors.grey[800])};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const OrderTime = styled.span`
  ${TYPOGRAPHY.CT_3}
  color: ${colors.grey[600]};
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  height: 100%;
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
  white-space: nowrap;
  width: 90%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const CardFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const CardFooterSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;

  &:last-of-type {
    flex: 1 1 0;
    overflow: hidden;
    justify-content: flex-end;
  }
`;

export const TotalAmount = styled.div<{ isEmpty?: boolean }>`
  ${TYPOGRAPHY.ST_3}
  color: ${({ isEmpty }) => (isEmpty ? colors.grey[400] : colors.grey[800])};
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StatusText = styled.div`
  ${TYPOGRAPHY.ST_3}
  color: ${colors.grey[400]};
`;

export const WifiSignal = styled.div`
  ${TYPOGRAPHY.CT_5}
  color: ${colors.primary[500]};
  background: ${colors.primary[200]};
  padding: 3px 6px;
  border-radius: 10px;
  letter-spacing: 0.5px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.08);
  white-space: nowrap;
`;
