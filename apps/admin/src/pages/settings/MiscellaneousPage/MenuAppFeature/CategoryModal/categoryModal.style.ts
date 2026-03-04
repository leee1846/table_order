import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  width: 25rem;
  height: 30rem;
  background-color: ${theme.colors.white};
  border-radius: 1rem;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0.25rem;

  & > h3 {
    ${TYPOGRAPHY.MT_1}
    color: ${theme.colors.grey[800]};
    margin-top: 20px;
    margin-bottom: 40px;
  }

  & > button {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 20rem;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

export const CategoryItem = styled.div`
  display: flex;
  align-items: center;

  & label {
    ${TYPOGRAPHY.MT_7}
    color: ${theme.colors.grey[800]};
  }
`;

export const CheckButtonCustomStyle = css`
  & > div {
    width: 28px;
    height: 28px;
  }
  & > input {
    display: none;
  }
`;

export const Footer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 10rem;
  color: ${theme.colors.grey[500]};
  ${TYPOGRAPHY.ST_4}
`;

export const LoadingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.grey[600]};
  ${TYPOGRAPHY.ST_4}
  min-height: 6rem;
`;
