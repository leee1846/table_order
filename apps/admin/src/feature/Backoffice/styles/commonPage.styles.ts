import styled from '@emotion/styled';
import { theme } from '@repo/ui';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  min-height: 0;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.grey[900]};
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.5;

  & > div {
    width: 1px;
    height: 12px;
    background-color: ${theme.colors.grey[300]};
  }

  & > span {
    font-size: 14px;
    color: ${theme.colors.grey[500]};
    font-weight: 400;
    letter-spacing: -0.005em;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const SearchInputWrapper = styled.div`
  flex: 1;
  max-width: 320px;
`;

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${theme.colors.grey[200]};
  border-radius: 8px;
  background: ${theme.colors.white};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0 0 0;
`;
