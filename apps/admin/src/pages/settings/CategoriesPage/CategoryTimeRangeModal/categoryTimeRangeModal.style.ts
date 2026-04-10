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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 12px;
  width: 100%;
  min-height: 2rem;

  & > p {
    flex: 1 1 0;
    min-width: 0;
    color: ${theme.colors.primary[500]};
    overflow-wrap: break-word;
    word-break: break-word;
    ${TYPOGRAPHY.MT_4};
  }

  & > div {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    height: 2rem;

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
