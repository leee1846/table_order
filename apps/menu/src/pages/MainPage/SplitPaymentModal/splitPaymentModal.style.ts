import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  width: 71.25rem;
  max-width: calc(100vw - 2rem);
  height: 43.75rem;
  max-height: calc(100vh - 2rem);
  display: flex;
  background-color: ${({ theme }) => theme.mode.undefined_palette[100]};
  border-radius: 1.25rem;
  overflow: hidden;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
`;

export const LeftContainer = styled.div`
  width: 55%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.mode.grey[50]};
  padding: 30px;

  & > p {
    ${TYPOGRAPHY.MT_1}
    color: ${({ theme }) => theme.mode.undefined_palette[400]};
  }
`;

export const ToggleButtonContainer = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 62.4rem;
  background-color: ${({ theme }) => theme.mode.grey[200]};
  margin: 24px 0 40px;
`;

export const ToggleButton = styled.button<{ isActive: boolean }>`
  width: 10.21875rem;
  height: 3.125rem;
  ${TYPOGRAPHY.ST_1}
  border-radius: 62.4rem;
  color: ${({ isActive, theme }) =>
    isActive ? theme.mode.undefined_palette[100] : theme.mode.grey[700]};
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.mode.primary[500] : theme.mode.grey[200]};
`;

export const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const SelectorTotalContainer = styled.div`
  flex-shrink: 0;
  margin: 20px 8px 0;
  border-top: 1px solid ${({ theme }) => theme.mode.grey[200]};
  padding-top: 12px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
  }
`;

export const TotalInfo = styled.div`
  & > p:first-of-type {
    ${TYPOGRAPHY.ST_2}
    color: ${({ theme }) => theme.mode.grey[600]};
  }
  & > p:last-of-type {
    ${TYPOGRAPHY.MT_6}
    color: ${({ theme }) => theme.mode.grey[700]};
  }
`;

export const RemainingAmount = styled.div`
  & > p:first-of-type {
    ${TYPOGRAPHY.MT_4}
    color: ${({ theme }) => theme.mode.grey[900]};
  }
  & > p:last-of-type {
    ${TYPOGRAPHY.MT_4}
    color: ${({ theme }) => theme.mode.primary[500]};
  }
`;

export const RightContainer = styled.div`
  width: 45%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.mode.undefined_palette[100]};
  padding: 40px 24px 24px;

  & > p {
    ${TYPOGRAPHY.MT_4}
    color: ${({ theme }) => theme.mode.grey[900]};
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.mode.grey[200]};
  }
`;

export const OrderList = styled.ul`
  flex: 1;
  overflow-y: auto;
  min-height: 0;

  & > li {
    padding: 8px;
  }
`;

export const MenuInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;

  & > p {
    ${TYPOGRAPHY.MT_7}
    color: ${({ theme }) => theme.mode.grey[800]};
  }
  & > p:first-of-type {
    width: 50%;
    text-align: left;
    word-wrap: break-word;
    word-break: break-word;
  }

  & > p:nth-of-type(2) {
    width: 10%;
    text-align: right;
  }

  & > p:last-of-type {
    flex: 1;
    text-align: right;
  }
`;

export const OptionList = styled.ul`
  padding: 0 2px 0 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > li {
    display: flex;
    gap: 8px;

    & > div > p {
      ${TYPOGRAPHY.ST_4}
      color: ${({ theme }) => theme.mode.grey[500]};
    }

    & > div:first-of-type {
      width: 80%;
      display: flex;
      align-items: flex-start;
      gap: 4px;

      & > span {
        flex-shrink: 0;
        display: inline-block;
        width: 6px;
        height: 6px;
        border-left: 1.25px solid ${({ theme }) => theme.mode.grey[500]};
        border-bottom: 1.25px solid ${({ theme }) => theme.mode.grey[500]};
        margin-top: 6px;
      }
    }

    & > div:last-of-type {
      flex: 1;
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }
  }
`;

export const TotalContainer = styled.div`
  flex-shrink: 0;
  width: 100%;
  padding-top: 16px;

  & > button {
    width: 100%;
  }
`;
