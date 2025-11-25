import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndex.modalBackdrop};
  cursor: default;
`;

export const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 26rem;
  background-color: ${({ theme }) => theme.mode.grey[50]};
  border-radius: 1rem 0 0 1rem;
  padding: 24px 24px 180px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Title = styled.p`
  ${TYPOGRAPHY.MT_4}
  color: ${({ theme }) => theme.mode.grey[900]};
  margin-bottom: 24px;
  text-align: left;
`;

export const TotalContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 4px 24px 40px;
  border-top: 1px solid ${({ theme }) => theme.mode.grey[200]};
`;

export const TotalInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;

  & > p:first-of-type {
    color: ${({ theme }) => theme.mode.grey[600]};
    ${TYPOGRAPHY.MT_7}
  }
  & > p:last-of-type {
    color: ${({ theme }) => theme.mode.primary[500]};
    ${TYPOGRAPHY.MT_2}
  }
`;

export const NoContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  & > p {
    ${TYPOGRAPHY.MT_7}
    color: ${({ theme }) => theme.mode.grey[500]};
  }
`;

export const OrderList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

export const OrderItem = styled.li`
  display: flex;
  flex-direction: column;
`;

export const OrderMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;

  & > p:first-of-type {
    color: ${({ theme }) => theme.mode.grey[600]};
    ${TYPOGRAPHY.MT_7}
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & > p:last-of-type {
    color: ${({ theme }) => theme.mode.grey[800]};
    ${TYPOGRAPHY.MT_6}
  }
`;

export const Options = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding-left: 8px;

  & > li {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > p:first-of-type {
      color: ${({ theme }) => theme.mode.grey[500]};
      ${TYPOGRAPHY.ST_4}

      & > span {
        display: inline-block;
        width: 7px;
        height: 7px;
        border-left: 1.25px solid ${({ theme }) => theme.mode.grey[500]};
        border-bottom: 1.25px solid ${({ theme }) => theme.mode.grey[500]};
        margin: 0 4px 4px 0;
      }
    }
  }

  & > div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 6px;

    & > button {
      width: fit-content;
      padding: 8px 12px;
      border-radius: 0.5rem;
      background-color: ${({ theme }) => theme.mode.grey[700]};
      color: ${({ theme }) => theme.mode.grey[200]};
      ${TYPOGRAPHY.BD_1}
    }
  }
`;

export const OptionItem = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;

  & > p:first-of-type {
    color: ${({ theme }) => theme.mode.grey[500]};
    ${TYPOGRAPHY.ST_4}
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    & > span {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-left: 1.25px solid ${({ theme }) => theme.mode.grey[500]};
      border-bottom: 1.25px solid ${({ theme }) => theme.mode.grey[500]};
      margin: 0 4px 4px 0;
    }
  }

  & > div {
    display: flex;
    align-items: center;
    gap: 24px;

    & > p {
      color: ${({ theme }) => theme.mode.grey[500]};
      ${TYPOGRAPHY.ST_4}
    }
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin: 18px 0;
`;

export const DeleteButton = styled.button`
  width: 52px;
  height: 52px;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.mode.grey[100]};
  border: 1px solid
    ${({ theme }) =>
      theme.themeMode === 'dark'
        ? theme.darkModeColors.grey[300]
        : theme.colors.grey[300]};
`;
