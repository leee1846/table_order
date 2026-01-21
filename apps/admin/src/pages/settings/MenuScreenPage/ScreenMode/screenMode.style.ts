import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;

  & > p {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_6}
  }
`;

export const Modes = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  gap: 24px;

  & > button {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
`;

export const ModePreview = styled.div`
  border-radius: 0.75rem;
  overflow: hidden;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
