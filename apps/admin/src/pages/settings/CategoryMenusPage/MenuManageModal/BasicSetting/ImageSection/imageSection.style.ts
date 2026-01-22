import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
`;

export const MainImageTitle = styled.p`
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[800]};
`;

export const Thumbnail = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 15.4375rem;
  background-color: ${theme.colors.grey[100]};
  border: 1px dashed ${theme.colors.grey[400]};
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  margin-bottom: 24px;
`;

export const BadgesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 20px;
  display: flex;
  z-index: 1;

  & > img {
    width: 50%;
    height: 100%;
    object-fit: cover;
    border: 1px solid red;
  }
`;

export const ThumbnailActionButtons = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 4px;
  z-index: 1;
`;

export const ThumbnailActionButton = css``;

export const Text = styled.p`
  ${TYPOGRAPHY.BD_1}
  color: ${theme.colors.grey[700]};
`;

export const SubText = styled.span`
  ${TYPOGRAPHY.CT_2}
  color: ${theme.colors.grey[500]};
`;

export const ImagesContainer = styled.div`
  position: relative;
  height: 6.25rem;
`;

export const AdditionalImagesTitle = styled.p`
  ${TYPOGRAPHY.ST_4}
  color: ${theme.colors.grey[800]};
`;

export const ScrollableContent = styled.div`
  display: flex;
  gap: 8px;
  height: 100%;
  overflow-x: auto;
  & > ul {
    display: flex;
    gap: 8px;
    padding-right: 10px;

    & > li {
      position: relative;
      width: 8.75rem;
      border-radius: 1rem;
      overflow: hidden;
      flex-shrink: 0;

      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      & > button {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        background-color: ${theme.colors.primary[600]};
        border-radius: 0 0.75rem 0 0.75rem;
        cursor: pointer;
      }
    }
  }
`;

export const Gradient = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 6.25rem;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    ${theme.colors.grey[50]} 90%
  );
  z-index: ${theme.zIndex.dropdown};
  pointer-events: none;
`;

export const ImageAddButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 8.75rem;
  width: 100%;
  height: 6.25rem;
  background-color: ${theme.colors.grey[100]};
  border-radius: 1rem;
  cursor: pointer;
  border: 1px dashed ${theme.colors.grey[400]};

  & > span {
    ${TYPOGRAPHY.CT_2}
    color: ${theme.colors.grey[500]};
  }
`;

export const SpiceLevelIndicator = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  position: absolute;
  bottom: 12px;
  right: 12px;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  z-index: 1;
`;

export const SpiceIconWrapper = styled.div`
  display: flex;
  width: 90px;
  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
