import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

interface IImageWrapper {
  hasImage: boolean;
  width?: string;
}

export const ImageWrapper = styled.div<IImageWrapper>`
  position: relative;
  width: ${({ width }) => width};
  aspect-ratio: 336 / 240;
  flex-shrink: 0;
  background-color: ${({ theme, hasImage }) =>
    hasImage ? 'transparent' : theme.mode.grey[200]};
  border-radius: 0.5rem;
  overflow: hidden;

  & > img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
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

export const LeftBadges = styled.div`
  position: absolute;
  top: 0;
  left: 12px;
  display: flex;
`;

export const BestIcon = styled.img`
  position: absolute;
  top: 0;
  left: 20px;
`;

export const ChiliIcons = styled.div`
  position: absolute;
  bottom: 10px;
  right: 12px;
  display: flex;
  align-items: center;
  width: 83px;

  & > img {
    width: 100%;
  }
`;

export const NoImagePlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  z-index: ${({ theme }) => theme.zIndex.base};
  background-color: ${({ theme }) => theme.mode.grey[100]};
  color: ${({ theme }) => theme.mode.grey[600]};
  ${TYPOGRAPHY.ST_4}
`;
