import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  width: 60rem;
  max-width: calc(100vw - 2rem);
  height: 40rem;
  display: flex;
  flex-direction: column;
  border-radius: 1.25rem;
  overflow: hidden;
`;

export const TopHeaderActions = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
`;

export const LeftContainer = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  background-color: ${({ theme }) => theme.mode.undefined_palette[1000]};
  padding: 24px;

  display: flex;
  flex-direction: column;
  gap: 40px;
  overflow: hidden;

  & > h2 {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    ${TYPOGRAPHY.MT_1}
    color: ${({ theme }) => theme.mode.undefined_palette[400]};
    padding-top: 26px;
  }
`;

/** 메뉴 목록만 스크롤, 버튼은 하단 고정을 위한 래퍼 */
export const MenuListScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const MenuList = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 12px;
  grid-row-gap: 16px;
`;

export const menuButton = styled.div<{ isSelected: boolean }>`
  width: 100%;
  min-height: 9.625rem;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.mode.undefined_palette[100] : theme.mode.grey[200]};
  border-radius: 0.75rem;
  padding: 16px 13px;
  border: ${({ isSelected, theme }) =>
    isSelected
      ? `1px solid ${theme.mode.primary[500]}`
      : '1px solid transparent'};

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
  flex-shrink: 0;
  width: 100%;
  padding: 24px;
  background-color: ${({ theme }) => theme.mode.undefined_palette[1000]};

  & > button {
    width: 100%;
  }
`;

export const DeleteButton = styled.button`
  width: 44px;
  height: 44px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.mode.grey[100]};
  border: 1px solid ${({ theme }) => theme.mode.grey[300]};
`;
