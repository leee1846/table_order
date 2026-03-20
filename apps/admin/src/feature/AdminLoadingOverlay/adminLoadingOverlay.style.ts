import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.mode.undefined_palette[100]};
  border-radius: 1rem;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  text-align: center;
`;

export const IconWrapper = styled.div`
  width: 140px;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  & > h1 {
    ${TYPOGRAPHY.MT_8}
    color: ${({ theme }) => theme.mode.grey[800]};
  }

  & > p {
    ${TYPOGRAPHY.ST_4}
    color: ${({ theme }) => theme.mode.grey[600]};
  }
`;
