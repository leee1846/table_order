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
  min-height: 16.875rem;
  border-radius: 1rem;
  background-color: ${theme.colors.grey[100]};
`;

export const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 16.875rem;
  padding: 20px;
  border: 2px dashed ${theme.colors.grey[300]};
  border-radius: 1rem;
  background-color: ${theme.colors.grey[50]};
`;

export const UploadIcon = styled.div`
  color: ${theme.colors.grey[400]};
  margin-bottom: 12px;
`;

export const UploadText = styled.p`
  color: ${theme.colors.grey[600]};
  ${TYPOGRAPHY.MT_6}
  text-align: center;
  line-height: 1.5;
`;

export const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 6px;
`;

