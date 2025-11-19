import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  background-color: ${theme.colors.white};
  width: 27.5rem;
  padding: 24px;
  border-radius: 1rem;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
`;

export const Title = styled.p`
  ${TYPOGRAPHY.MT_1}
  color: ${theme.colors.grey[800]};
  text-align: center;
  margin: 20px 0 40px;
`;

export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 0 40px;
  margin-bottom: 60px;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 2rem;

  & > p {
    color: ${theme.colors.primary[500]};
    white-space: nowrap;
    ${TYPOGRAPHY.MT_4};
  }

  & > div {
    display: flex;
    align-items: center;

    & > input {
      width: 3rem;
      height: 100%;
      border-bottom: 1px solid ${theme.colors.grey[300]};
      text-align: center;
      color: ${theme.colors.grey[800]};
      ${TYPOGRAPHY.MT_5};

      &::placeholder {
        color: ${theme.colors.grey[400]};
      }
    }

    & > span {
      color: ${theme.colors.grey[800]};
      white-space: nowrap;
      ${TYPOGRAPHY.MT_5};
    }
  }
`;
