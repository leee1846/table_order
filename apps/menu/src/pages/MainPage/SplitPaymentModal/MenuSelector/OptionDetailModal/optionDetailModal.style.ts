import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 1.25rem;
  width: 27.5rem;
  max-width: calc(100vw - 2rem);
  background-color: ${({ theme }) => theme.mode.undefined_palette[200]};
  border: 1px solid ${({ theme }) => theme.mode.grey[100]};

  & > h1 {
    ${TYPOGRAPHY.MT_1}
    color: ${({ theme }) => theme.mode.grey[800]};
    text-align: center;
    margin-bottom: 24px;
  }
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
`;

export const MenuInfo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;

  & > p {
    ${TYPOGRAPHY.MT_7}
    color: ${({ theme }) => theme.mode.grey[800]};
  }
  & > p:first-of-type {
    word-wrap: break-word;
    word-break: break-word;
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
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.mode.grey[200]};
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TotalInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;

  & > p:first-of-type {
    ${TYPOGRAPHY.MT_7}
    color: ${({ theme }) => theme.mode.grey[600]};
  }
  & > p:last-of-type {
    ${TYPOGRAPHY.MT_4}
    color: ${({ theme }) => theme.mode.primary[500]};
  }
`;
