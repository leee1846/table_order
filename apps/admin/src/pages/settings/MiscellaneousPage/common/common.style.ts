import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.section`
  background-color: ${theme.colors.white};
  padding: 17px 16px 17px 24px;
  border-radius: 0.75rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 24px;
  border-bottom: 1px solid ${theme.colors.grey[400]};
`;

export const Title = styled.p`
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_6}
`;

export const ContentsLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  gap: 12px;
  padding-top: 12px;
`;

export const ContentLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  height: 3rem;

  & > p {
    color: ${theme.colors.grey[600]};
    ${TYPOGRAPHY.ST_2}
  }

  & > input {
    width: 6.6875rem;
    height: 1.625rem;
    border-bottom: 1px solid ${theme.colors.grey[400]};
    text-align: right;
    ${TYPOGRAPHY.ST_2}
    color: ${theme.colors.grey[800]};
  }
`;

export const TimeRangeInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8rem;
  height: 1.625rem;
  border-bottom: 1px solid ${theme.colors.grey[400]};
  text-align: right;
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[800]};

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    ${TYPOGRAPHY.ST_2}
    color: ${theme.colors.grey[800]};
  }

  & > input {
    text-align: center;
    width: 20%;
    ${TYPOGRAPHY.ST_2}
    color: ${theme.colors.grey[800]};

    &::placeholder {
      ${TYPOGRAPHY.ST_2}
      color: ${theme.colors.grey[800]};
    }
  }
`;

export const SingleTimeInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 1.625rem;
  border-bottom: 1px solid ${theme.colors.grey[400]};
  text-align: right;
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[800]};

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    ${TYPOGRAPHY.ST_2}
    color: ${theme.colors.grey[800]};
  }

  & > input {
    text-align: center;
    width: 40%;
    ${TYPOGRAPHY.ST_2}
    color: ${theme.colors.grey[800]};

    &::placeholder {
      ${TYPOGRAPHY.ST_2}
      color: ${theme.colors.grey[800]};
    }
  }
`;
