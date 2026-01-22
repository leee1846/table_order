import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  padding: 40px 24px 24px 24px;
  min-width: 400px;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.mode.undefined_palette[1000]};
`;

export const Title = styled.h2`
  ${TYPOGRAPHY.MT_1}
  color: ${({ theme }) => theme.mode.grey[800]};
  margin-bottom: 24px;
  white-space: pre-line;
`;

export const QRCodeWrapper = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Description = styled.div`
  ${TYPOGRAPHY.ST_2}
  color: ${({ theme }) => theme.mode.grey[600]};
  margin-bottom: 32px;
  text-align: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
