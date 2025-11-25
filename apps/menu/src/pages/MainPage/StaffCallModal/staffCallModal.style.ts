import styled from '@emotion/styled';
import { baseTheme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  width: 60rem;
  max-width: calc(100vw - 2rem);
  height: 40rem;
  display: flex;
  border-radius: 1.25rem;
  overflow: hidden;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const LeftContainer = styled.div`
  width: 75%;
  background-color: ${({ theme }) => theme.mode.grey[50]};
  padding: 24px;

  display: flex;
  flex-direction: column;
  gap: 40px;

  & > p {
    ${TYPOGRAPHY.MT_1}
    color: ${({ theme }) =>
      theme.themeMode === 'dark' ? theme.colors.white : theme.colors.black};
  }
`;

export const MenuList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 12px;
  grid-row-gap: 16px;
  overflow-y: auto;

  & > li > button {
    width: 100%;
    min-height: 9.625rem;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.mode.grey[200]};
    border-radius: 0.75rem;
    padding: 16px 13px;

    & > p {
      ${TYPOGRAPHY.MT_4}
      color: ${({ theme }) => theme.mode.grey[600]};
      text-align: left;
      word-wrap: break-word;
      word-break: break-word;
    }

    & > div {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
`;

export const RightContainer = styled.div`
  width: 35%;
  background-color: ${({ theme }) =>
    theme.themeMode === 'dark'
      ? baseTheme.darkModeColors.background[100]
      : baseTheme.colors.white};
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;

  & > p {
    color: ${({ theme }) => theme.mode.grey[800]};
    ${TYPOGRAPHY.MT_1}
    flex-shrink: 0;
    margin-bottom: 24px;
  }
`;

export const ChosenMenuList = styled.ul`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  margin: 0;
  padding: 0;
`;

export const ChosenMenuItem = styled.li`
  display: flex;

  & > p {
    color: ${({ theme }) => theme.mode.grey[500]};
    ${TYPOGRAPHY.ST_4}

    & > span {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-left: 1.25px solid ${({ theme }) => theme.mode.grey[500]};
      border-bottom: 1.25px solid ${({ theme }) => theme.mode.grey[500]};
      margin: 0 4px 4px 0;
    }
  }
`;

export const noContent = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  color: ${({ theme }) => theme.mode.grey[500]};
  ${TYPOGRAPHY.ST_4}
`;

export const OrderButton = styled.div`
  width: 100%;
  padding-top: 10px;

  & > button {
    width: 100%;
  }
`;
