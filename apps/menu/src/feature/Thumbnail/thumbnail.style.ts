import styled from '@emotion/styled';

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

  & > img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
  }
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
