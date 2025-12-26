import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  & > p {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_6}
  }
`;

export const ImageSection = styled.div`
  position: relative;
  width: 100%;
  height: 16.875rem;
  border-radius: 1rem;
  background-color: ${theme.colors.grey[100]};
`;

export const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 6px;
`;

