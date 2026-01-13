import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px 24px 40px 30px;
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  color: ${theme.colors.grey[800]};

  ${TYPOGRAPHY.MT_1}

  & > div {
    width: 0.125rem;
    height: 1.25rem;
    background-color: ${theme.colors.grey[800]};
  }

  & > span {
    ${TYPOGRAPHY.ST_1}
    color: ${theme.colors.grey[600]};
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SectionTitle = styled.h2`
  ${TYPOGRAPHY.MT_3}
  color: ${theme.colors.grey[800]};
`;

export const PasswordForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[800]};
  margin-bottom: 8px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;
