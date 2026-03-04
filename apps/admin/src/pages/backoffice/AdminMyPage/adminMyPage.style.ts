import styled from '@emotion/styled';
import { theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin-bottom: 4px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.grey[900]};
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.5;

  & > div {
    width: 1px;
    height: 12px;
    background-color: ${theme.colors.grey[300]};
  }

  & > span {
    font-size: 14px;
    color: ${theme.colors.grey[500]};
    font-weight: 400;
    letter-spacing: -0.005em;
  }
`;

export const TokenInfoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${theme.colors.grey[200]};
  border-radius: 6px;
  background: ${theme.colors.white};
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02);
`;

export const TokenInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
`;

export const TokenInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const TokenInfoKey = styled.div`
  font-size: 13px;
  color: ${theme.colors.grey[500]};
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  line-height: 1.4;
`;

export const TokenInfoValue = styled.div`
  font-size: 15px;
  color: ${theme.colors.grey[900]};
  font-weight: 500;
  word-break: break-word;
  letter-spacing: -0.005em;
  line-height: 1.5;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid ${theme.colors.grey[200]};
  border-radius: 6px;
  background: ${theme.colors.white};
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02);
`;

export const SectionTitle = styled.h2`
  font-size: 15px;
  color: ${theme.colors.grey[900]};
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid ${theme.colors.grey[200]};
  letter-spacing: -0.005em;
  line-height: 1.5;
`;

export const PasswordForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  color: ${theme.colors.grey[700]};
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.4;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
  padding-top: 16px;
  border-top: 1px solid ${theme.colors.grey[200]};
`;
