import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${({ theme }) => theme.zIndex.popover};
  display: flex;
`;

export const LeftContainer = styled.div`
  width: 50%;
  height: 100%;
  background-color: ${({ theme }) => theme.mode.grey[50]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > img {
    width: 15.75rem;
    margin-bottom: 40px;
  }
  & > h1 {
    font-size: 2.25rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2.875rem; /* 127.778% */
    letter-spacing: -0.05625rem;
    color: ${({ theme }) => theme.mode.undefined_palette[400]};
    margin-bottom: 16px;
  }
  & > p {
    ${TYPOGRAPHY.MT_7}
    color: ${({ theme }) => theme.mode.grey[600]};
  }
`;

export const RightContainer = styled.div`
  width: 50%;
  height: 100%;
  background-color: ${({ theme }) => theme.mode.undefined_palette[100]};
  padding: 30px 24px;
`;

export const TableName = styled.p`
  ${TYPOGRAPHY.MT_4}
  color: ${({ theme }) => theme.mode.grey[900]};
  margin-bottom: 16px;
`;

export const Date = styled.p`
  ${TYPOGRAPHY.ST_2}
  color: ${({ theme }) => theme.mode.grey[600]};
  text-align: right;
  margin-bottom: 24px;
`;

export const PaymentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.mode.grey[200]};

  & > p {
    ${TYPOGRAPHY.MT_2}
    color: ${({ theme }) => theme.mode.grey[900]};
  }

  & > p:last-child {
    ${TYPOGRAPHY.MT_2}
    color: ${({ theme }) => theme.mode.undefined_palette[1500]};
  }
`;
