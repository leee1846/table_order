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
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;

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

export const DescriptionContainer = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  position: relative;
`;

export const DescriptionWrapper = styled.div<{ $isOverflowing?: boolean }>`
  display: inline-flex;
  white-space: nowrap;
  ${({ $isOverflowing }) =>
    $isOverflowing
      ? `
    animation: scroll-text 20s linear infinite;
    will-change: transform;
  `
      : ''}

  @keyframes scroll-text {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-50% - 1rem));
    }
  }
`;

export const Description = styled.span`
  ${TYPOGRAPHY.ST_2}
  color: ${({ theme }) => theme.mode.semantic[400]};
  white-space: nowrap;
  display: inline-block;
`;

export const DescriptionSpacer = styled.span`
  display: inline-block;
  width: 2rem;
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
