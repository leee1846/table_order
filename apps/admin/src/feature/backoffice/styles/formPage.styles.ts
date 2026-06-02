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
  gap: 16px;
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin-bottom: 4px;
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

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;
