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

export const ImageSection = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 1rem;
  background-color: ${theme.colors.primary[100]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  overflow: hidden;

  p {
    color: ${theme.colors.grey[700]};
    ${TYPOGRAPHY.BD_1}
  }

  span {
    ${TYPOGRAPHY.CT_2}
    color: ${theme.colors.grey[500]};
  }
`;

export const ImagePreview = styled.img`
  width: 200px;
  height: 100%;
  object-fit: contain;
  background-color: ${theme.colors.primary[100]};
`;

export const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 6px;
`;
