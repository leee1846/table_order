import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.mode.undefined_palette[100]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;

  & > h1 {
    font-size: 3rem;
    font-style: normal;
    font-weight: 600;
    line-height: 3.75rem;
    letter-spacing: -0.075rem;
    color: ${({ theme }) => theme.mode.grey[800]};
    margin-bottom: 8px;
  }

  & > p {
    ${TYPOGRAPHY.MT_3}
    color: ${({ theme }) => theme.mode.grey[500]};
    margin-bottom: 60px;
  }
`;

export const Buttons = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 24px;

  & > li > button {
    width: calc(100vw - 24px);
    max-width: 18.75rem;
    height: 5.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border-radius: 62.4rem;
    border: 1px solid ${({ theme }) => theme.mode.grey[400]};
    box-shadow: 0 0 0.25rem 0 rgba(0, 0, 0, 0.08);
    background-color: ${({ theme }) => theme.mode.grey[50]};
    color: ${({ theme }) => theme.mode.grey[700]};
    ${TYPOGRAPHY.MT_5}

    & > img {
      width: 2rem;
    }
  }
`;

export const Button = styled.li`
  & > button {
    width: calc(100vw - 24px);
    max-width: 18.75rem;
    height: 5.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border-radius: 62.4rem;
    border: 1px solid ${({ theme }) => theme.mode.grey[400]};
    box-shadow: 0 0 0.25rem 0 rgba(0, 0, 0, 0.08);
    background-color: ${({ theme }) => theme.mode.grey[50]};
    color: ${({ theme }) => theme.mode.grey[700]};
    ${TYPOGRAPHY.MT_5}

    & > img {
      width: 2rem;
    }
  }
`;
