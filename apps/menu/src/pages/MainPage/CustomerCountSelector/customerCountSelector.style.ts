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
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: max-content;
  min-width: 100%;
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
`;

export const TitleContainer = styled.div`
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  & > h1 {
    text-align: center;
    font-size: 3rem;
    font-style: normal;
    font-weight: 600;
    line-height: 3.75rem; /* 125% */
    letter-spacing: -0.075rem;
    color: ${({ theme }) => theme.mode.grey[800]};
  }

  & > p {
    ${TYPOGRAPHY.MT_3}
    color: ${({ theme }) => theme.mode.grey[500]};
  }
`;

export const CountsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 140px;
  margin-bottom: 208px;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 40px;

    & > h2 {
      ${TYPOGRAPHY.MT_5}
      color: ${({ theme }) => theme.mode.grey[600]};
    }

    & > div {
      display: flex;
      align-items: center;
      gap: 12px;

      & > button {
        width: 5.5rem;
        height: 5.5rem;
        border-radius: 1rem;
        background-color: ${({ theme }) => theme.mode.grey[50]};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid ${({ theme }) => theme.mode.grey[400]};
      }

      & > input {
        font-size: 4rem;
        font-style: normal;
        font-weight: 500;
        line-height: 5rem; /* 125% */
        letter-spacing: -0.1rem;
        color: ${({ theme }) => theme.mode.grey[900]};
        width: 13rem;
        text-align: center;
      }
    }
  }
`;

export const CountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
  margin-bottom: 138px;
`;

export const Count = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  & > button {
    width: 5.5rem;
    height: 5.5rem;
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.mode.grey[50]};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.mode.grey[400]};
  }

  & > input {
    font-size: 7.5rem;
    font-style: normal;
    font-weight: 500;
    line-height: 8.75rem; /* 116.667% */
    letter-spacing: -0.1875rem;
    color: ${({ theme }) => theme.mode.grey[900]};
    width: 20rem;
    text-align: center;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;

  & > button {
    width: 5.97917rem;
    height: 3.75rem;
    background-color: ${({ theme }) => theme.mode.grey[50]};
    border-radius: 1rem;
    cursor: pointer;
    ${TYPOGRAPHY.MT_6}
    color: ${({ theme }) => theme.mode.grey[700]};
  }
`;

export const ButtonContainer = styled.div`
  width: 35rem;

  & > button {
    width: 100%;
  }
`;
