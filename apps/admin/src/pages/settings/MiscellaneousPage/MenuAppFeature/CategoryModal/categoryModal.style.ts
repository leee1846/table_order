import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  width: 28rem;
  background-color: ${theme.colors.white};
  border-radius: 1rem;
  padding: 1.25rem 1.5rem 1.5rem;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0.25rem;

  & > h3 {
    ${TYPOGRAPHY.MT_5}
    color: ${theme.colors.grey[900]};
  }

  & > button {
    position: absolute;
    right: 0;
    top: 0.25rem;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 20rem;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

export const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.75rem;
  border: 1px solid ${theme.colors.grey[200]};
  border-radius: 0.75rem;
  background-color: ${theme.colors.grey[50]};

  & label {
    ${TYPOGRAPHY.ST_3}
    color: ${theme.colors.grey[800]};
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
