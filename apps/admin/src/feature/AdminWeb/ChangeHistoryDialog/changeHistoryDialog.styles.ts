import styled from '@emotion/styled';
import {
  BaseDialogContainer,
  BaseHeader,
  BaseTitle,
} from '@repo/feature/components';

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

export const CloseButton = styled.button`
  cursor: pointer;
  text-align: right;
  transform: translate(-24px, 24px);
  background: none;
  border: none;
  padding: 0;
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
  min-height: 0;
`;
