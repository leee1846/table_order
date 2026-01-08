import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 21.255rem;
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
  background-color: ${theme.colors.primary[100]};
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const BadgesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 20px;
  display: flex;
  gap: 4px;
  z-index: 1;

  & > img {
    width: 64px;
    height: 43px;
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
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #fff 90%);
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
