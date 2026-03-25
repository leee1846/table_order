import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  width: 60rem;
  max-width: calc(100vw - 2rem);
  height: 40rem;
  max-height: calc(100vh - 2rem);
  display: flex;
  background-color: ${({ theme }) => theme.mode.undefined_palette[100]};
  border-radius: 1.25rem;
  overflow: hidden;
`;

export const CountdownBadge = styled.p`
  position: absolute;
  top: 12px;
  right: 14px;
  ${TYPOGRAPHY.ST_4}
  color: ${({ theme }) => theme.mode.grey[800]};
  pointer-events: none;
  z-index: 1;
`;

export const LeftContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.mode.grey[50]};

  & > img {
    width: 12.5rem;
    height: 12.5rem;
    margin-bottom: 12px;
  }

  & > h2 {
    font-size: 2.25rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2.875rem; /* 127.778% */
    letter-spacing: -0.05625rem;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.mode.undefined_palette[300]};
  }

  & > p {
    ${TYPOGRAPHY.ST_2}
    color: ${({ theme }) => theme.mode.grey[600]};
  }
`;

export const RightContainer = styled.div`
  width: 50%;
  height: 100%;
  padding: 15.63px 12.5px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.mode.undefined_palette[100]};
  min-height: 0;
`;

export const Title = styled.p`
  ${TYPOGRAPHY.MT_4}
  color: ${({ theme }) => theme.mode.undefined_palette[400]};
  margin-bottom: 12px;
`;

export const Date = styled.p`
  text-align: right;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.625rem; /* 144.444% */
  letter-spacing: -0.028125rem;
  color: ${({ theme }) => theme.mode.grey[600]};
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.mode.grey[200]};
  margin-bottom: 16px;
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

  & > h3 {
    ${TYPOGRAPHY.MT_7}
    color: ${({ theme }) => theme.mode.grey[800]};
    width: 50%;
    text-align: left;
    word-wrap: break-word;
    word-break: break-word;
  }

  & > p:nth-of-type(2) {
    width: 10%;
  }

  & > p:last-of-type {
    flex: 1;
    min-width: 0;
    text-align: right;
    word-break: break-all;
    overflow-wrap: break-word;
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
      width: 75%;
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
      justify-content: flex-end;
      gap: 20px;

      & > p:last-of-type {
        text-align: right;
        min-width: 3rem;
      }
    }
  }
`;

export const TotalContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid ${({ theme }) => theme.mode.grey[200]};
    padding: 28px 8px 0;

    & > h3 {
      ${TYPOGRAPHY.MT_7}
      color: ${({ theme }) => theme.mode.grey[700]};
    }
    & > p:last-of-type {
      ${TYPOGRAPHY.MT_2}
      color: ${({ theme }) => theme.mode.primary[500]};
    }
  }
`;
