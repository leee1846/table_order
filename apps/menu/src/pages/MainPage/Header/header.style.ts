import styled from '@emotion/styled';
import { TYPOGRAPHY, baseTheme } from '@repo/ui';

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4.75rem;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background-color: ${({ theme }) => theme.mode.undefined_palette[200]};
  border-bottom: 1px solid ${({ theme }) => theme.mode.grey[200]};
  z-index: ${({ theme }) => theme.zIndex.base};
`;

export const LeftContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  & > button {
    width: 6.25rem;

    & > img {
      width: 100%;
    }
  }
`;

export const Divider = styled.span`
  width: 0.0625rem;
  height: 1rem;
  background-color: ${baseTheme.darkModeColors.grey[500]};
`;

export const ShopName = styled.p`
  ${TYPOGRAPHY.MT_6}
  color: ${({ theme }) => theme.mode.grey[900]};
`;

export const Description = styled.p`
  ${TYPOGRAPHY.ST_2}
  color: ${({ theme }) => theme.mode.semantic[400]};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const RightContent = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
`;

export const TableNumber = styled.p`
  ${TYPOGRAPHY.MT_6}
  color: ${({ theme }) => theme.mode.grey[700]};
`;

export const OrderHistoryButton = styled.button`
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.mode.primary[500]};
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.mode.primary[500]};
  ${TYPOGRAPHY.ST_3}
`;
