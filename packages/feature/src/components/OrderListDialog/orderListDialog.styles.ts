import styled from '@emotion/styled';
import {
  BaseDialogContainer,
  BaseCloseButton,
  BaseHeader,
  BaseTitle,
} from '../shared/dialogStyles';
import * as UIStyles from '@repo/ui/styles';

export const DialogContainer = styled(BaseDialogContainer)`
  width: 90vw;
  height: 90vh;
  padding: 0;
`;

export const Container = styled.div`
  padding: 24px 24px 0 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const CloseButton = styled(BaseCloseButton)``;

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
  min-height: 0;
`;

export const Table = styled.table`
  width: 100%;
`;

export const Thead = styled.thead`
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const Tbody = styled(UIStyles.setting.Tbody)`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;

  & > tr {
    align-items: center;
    height: calc((100% - 60px) / 6.5);
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 24px 40px;
`;
