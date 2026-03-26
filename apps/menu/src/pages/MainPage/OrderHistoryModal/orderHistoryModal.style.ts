import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Background = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndex.notification};
`;

export const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 25.9376rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.mode.undefined_palette[200]};
  border-radius: 1.5rem 0 0 1.5rem;
  padding: 30px 24px;
  overflow: hidden;
`;

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.mode.grey[200]};

  & > div > h2 {
    ${TYPOGRAPHY.MT_4}
    color: ${({ theme }) => theme.mode.grey[900]};
  }
  & > p {
    ${TYPOGRAPHY.ST_2}
    color: ${({ theme }) => theme.mode.grey[600]};
    text-align: right;
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
      width: 70%;
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
      gap: 12.5px;

      & > p:last-of-type {
        text-align: right;
      }
    }
  }
`;

export const TotalContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding-top: 24px;

  & > div {
    border-top: 1px solid ${({ theme }) => theme.mode.grey[200]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 8px 4px;

    & > h3 {
      ${TYPOGRAPHY.MT_7}
      color: ${({ theme }) => theme.mode.grey[700]};
    }
    & > p {
      ${TYPOGRAPHY.MT_2}
      color: ${({ theme }) => theme.mode.primary[500]};
    }
  }
`;
