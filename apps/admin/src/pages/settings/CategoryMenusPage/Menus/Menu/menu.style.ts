import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div<{ isDragging?: boolean }>`
  width: 100%;
  padding: 24px;
  display: flex;
  background-color: ${theme.colors.white};
  border-radius: 1rem;
  opacity: ${({ isDragging }) => (isDragging ? 0.6 : 1)};
  transition: opacity 0.2s ease;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  width: 100%;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const TitleContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;

  & > span {
    color: ${theme.colors.grey[600]};
    ${TYPOGRAPHY.MT_5}
  }
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const PreviewButton = styled.button`
  ${TYPOGRAPHY.BD_2}
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex-shrink: 0;
  white-space: nowrap;
  color: ${theme.colors.grey[600]};
  border: 1px solid ${theme.colors.grey[300]};
  border-radius: 30px;
  padding: 4px 8px;
`;

export const IconContainer = styled.span`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Price = styled.p`
  ${TYPOGRAPHY.MT_5}
  color: ${theme.colors.grey[800]};
`;

export const DeleteButton = css`
  border: 1px solid ${theme.colors.grey[400]};
  color: ${theme.colors.grey[700]};

  &:disabled {
    color: ${theme.colors.grey[400]};
    border-color: ${theme.colors.grey[200]};
  }
`;

export const EditButton = css`
  color: ${theme.colors.white} !important;
  background-color: ${theme.colors.grey[600]} !important;
`;

export const Description = styled.p`
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[500]};
  min-width: 0;
  width: 100%;
  white-space: pre-line;
  overflow-wrap: anywhere;
`;

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-end;
  align-self: flex-end;

  & > div {
    display: flex;
    align-items: center;
    gap: 8px;

    & > span {
      ${TYPOGRAPHY.MT_9}
      color: ${theme.colors.grey[500]};
    }
  }
`;

export const PreviewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1300;
`;

export const PreviewModal = styled.div`
  position: relative;
  width: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const PreviewImage = styled.img`
  width: 100%;
  max-height: 20rem;
  object-fit: cover;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.35);
  touch-action: pan-x;
  user-select: none;
  -webkit-user-drag: none;
`;

export const CloseButton = styled.button`
  cursor: pointer;
  position: absolute;
  bottom: 100%;
  left: 100%;
`;

export const DotGroup = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  display: flex;
  gap: 8px;
`;

export const DotButton = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;

  &[data-active='true'] {
    background: ${theme.colors.white};
    opacity: 1;
  }

  &[data-active='false'] {
    background: rgba(248, 249, 250, 0.5);
  }
`;
