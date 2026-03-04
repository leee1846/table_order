import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  height: 100%;
  padding: 40px 24px 40px 30px;
  background-color: ${theme.colors.grey[50]};
  overflow-y: auto;

  & > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 39px;

    & > div {
      display: flex;
      align-items: center;
      gap: 4px;

      & > h1 {
        color: ${theme.colors.grey[800]};
        ${TYPOGRAPHY.MT_1}
      }
    }
  }
`;

export const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
