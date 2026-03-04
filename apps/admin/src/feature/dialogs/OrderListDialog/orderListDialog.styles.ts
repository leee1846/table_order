import styled from '@emotion/styled';
import { theme } from '@repo/ui';
import {
  BaseDialogContainer,
  BaseHeader,
  BaseTitle,
} from '@repo/feature/components';
import * as UIStyles from '@repo/ui/styles';

export const DialogContainer = styled(BaseDialogContainer)`
  width: 90vw;
  height: 90vh;
  padding: 0;
`;

export const Container = styled.div`
  padding: 24px 24px 0 24px;
  height: 90%;
  display: flex;
  flex-direction: column;
`;

export const CloseButton = styled.button`
  cursor: pointer;
  text-align: right;
  transform: translate(-24px, 24px);
`;

export const Header = styled(BaseHeader)`
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const Title = BaseTitle;

export const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const Table = styled.table`
  width: 100%;
`;

export const Thead = styled.thead`
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const Tbody = styled(UIStyles.setting.Tbody)<{
  pageSize?: number;
  ordersLength?: number;
}>`
  height: 100%;
  & > tr {
    align-items: center;
    height: calc(100% / ${({ pageSize }) => pageSize});
  }

  ${({ pageSize, ordersLength }) =>
    pageSize && ordersLength && pageSize === ordersLength
      ? `
    & > tr:last-child {
      border-bottom: none;
    }
  `
      : ''}
`;

export const StyledFooter = styled(UIStyles.setting.Footer)`
  position: sticky;
  bottom: 0;
  padding: 16px 40px 24px;
  background-color: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  border-top: 1px solid ${theme.colors.grey[200]};
  height: 13%;
`;
