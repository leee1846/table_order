import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import {
  BaseDialogContainer,
  BaseCloseButton,
  BaseHeader,
  BaseTitle,
} from '../shared/dialogStyles';

const { colors } = theme;

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
  display: flex;
  flex-direction: column;
  min-height: 0;

  & > table {
    height: 100%;
  }

  td:nth-of-type(1),
  td:nth-of-type(2),
  td:nth-of-type(3),
  td:nth-of-type(4),
  td:nth-of-type(6) {
    ${TYPOGRAPHY.ST_4}
    color: ${colors.grey[700]};
  }
  td:nth-of-type(5) {
    ${TYPOGRAPHY.ST_5}
    color: ${colors.grey[500]};
  }
  td:nth-of-type(7) {
    ${TYPOGRAPHY.BD_3}
    color: ${colors.grey[400]};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const LeftButtons = styled.div`
  display: flex;
  gap: 12px;
`;

export const RightButtons = styled.div`
  display: flex;
  gap: 12px;
`;

export const DeviceHeaderCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const DeviceCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const BatteryColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

export const VersionColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const Tbody = styled(UIStyles.setting.Tbody)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: visible;
  height: 100%;

  & > tr {
    align-items: center;
    height: calc((100% - 60px) / 7);
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 24px 40px;
`;
