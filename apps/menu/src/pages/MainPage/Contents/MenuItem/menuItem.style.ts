import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

const IMAGE_SIZE = {
  1: {
    width: '20.9375rem',
  },
  2: {
    width: '22.5rem',
  },
  3: {
    width: '17.25rem',
  },
} as const;

interface IContainer {
  layout: 1 | 2 | 3;
}

interface IImageWrapper extends IContainer {
  hasImage: boolean;
}
export const Container = styled.button<IContainer>`
  width: 100%;
  max-width: ${({ layout }) => {
    switch (layout) {
      case 2:
        return IMAGE_SIZE[2].width;
      case 3:
        return IMAGE_SIZE[3].width;
      default:
        return '100%';
    }
  }};
  height: fit-content;
  overflow: hidden;
  display: flex;
  flex-direction: ${({ layout }) => (layout === 1 ? 'row' : 'column')};
  gap: ${({ layout }) => (layout === 1 ? '16px' : '14px')};
`;

export const ImageWrapper = styled.div<IImageWrapper>`
  position: relative;
  width: ${({ layout }) => (layout === 1 ? IMAGE_SIZE[1].width : '100%')};
  flex-shrink: 0;
  background-color: ${({ theme, hasImage }) =>
    hasImage ? 'transparent' : theme.mode.grey[400]};
  border-radius: 0.5rem;
  overflow: hidden;
  ${({ hasImage }) => !hasImage && 'min-height: 200px;'}

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

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
`;

export const MenuName = styled.p`
  text-align: left;
  ${TYPOGRAPHY.MT_7}
  color: ${({ theme }) => theme.mode.grey[700]};
  margin-bottom: 6px;
  min-width: 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MenuPrice = styled.p`
  display: flex;
  align-items: center;
  gap: 2px;
  color: ${({ theme }) => theme.mode.grey[800]};
  ${TYPOGRAPHY.MT_4}
  min-width: 0;
  width: 100%;

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
`;

export const Description = styled.p`
  margin-top: 16px;
  color: ${({ theme }) => theme.mode.grey[500]};
  ${TYPOGRAPHY.ST_2}
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  overflow: hidden;
  text-overflow: ellipsis;
`;
