import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

interface IImageWrapper {
  hasImage: boolean;
  width?: string;
}

export const ImageWrapper = styled.div<IImageWrapper>`
  position: relative;
  width: ${({ width }) => width};
  aspect-ratio: 7 / 5;
  flex-shrink: 0;
  background-color: ${({ theme, hasImage }) =>
    hasImage ? 'transparent' : theme.mode.grey[200]};
  border-radius: 0.5rem;
  overflow: hidden;

  &::before {
    content: ${({ hasImage }) => (hasImage ? '' : 'none')};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.16) 0%,
      rgba(0, 0, 0, 0) 50%
    );
    z-index: ${({ theme }) => theme.zIndex.base + 1};
  }

  & > img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    position: relative;
    z-index: ${({ theme }) => theme.zIndex.base};
  }
`;

export const OutOfStock = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  ${TYPOGRAPHY.MT_1}
  color: ${({ theme }) => theme.mode.white};
  z-index: ${({ theme }) => theme.zIndex.base + 2};
`;

export const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
`;

export const LeftBadges = styled.div`
  position: absolute;
  top: 0;
  left: 20px;
  display: flex;
  gap: 4px;
`;

export const BestIcon = styled.img`
  position: absolute;
  top: 0;
  left: 20px;
`;

export const ChiliIcons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
`;
