import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';
import { BaseHeader, BaseTitle } from '@repo/feature/components';
import { css } from '@emotion/react';

const { colors } = theme;

export const DialogContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${colors.grey[100]};
  display: flex;
  flex-direction: column;
`;

export const Container = styled.div`
  padding: 40px 30px 0 30px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const CloseButton = styled.button`
  width: 40px;
  height: 40px;
`;

export const Header = styled(BaseHeader)`
  justify-content: space-between;
  margin-bottom: 44px;
`;

export const Title = styled(BaseTitle)``;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 26px;
`;

export const LeftButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const RightButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const DeviceGridWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 40px;
  scroll-behavior: smooth;
`;

export const EmptyState = styled.div`
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.grey[600]};
  font-size: 14px;
  text-align: center;
`;

export const DeviceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

export const DeviceCard = styled.div<{
  selected?: boolean;
  controlStatus?: boolean;
  controlText?: string;
}>`
  position: relative;
  background: ${colors.white};
  border-radius: 16px;
  border: 4px solid transparent;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.06);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;

  ${({ selected }) =>
    selected
      ? `
    border: solid 4px ${colors.primary[500]};
  `
      : ''}

  ${({ controlStatus, controlText }) =>
    controlStatus
      ? `
    pointer-events: none;

    & > * {
      opacity: 0.5;
      filter: grayscale(0.3);
    }

    &::after {
      content: '${controlText || ''}';
      position: absolute;
      top: 50%; 
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      font-weight: 600;
      color: ${colors.grey[900]};
      background-color: ${colors.white};
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid ${colors.grey[300]};
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1;
      white-space: nowrap;
    }
  `
      : ''}
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const DeviceTitle = styled.div`
  ${TYPOGRAPHY.MT_8}
  color: ${colors.grey[900]};
`;

export const DeviceCode = styled.div`
  ${TYPOGRAPHY.BD_2}
  color: ${colors.grey[600]};
`;

export const CardSection = styled.div`
  background: ${colors.grey[100]};
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
  align-items: start;
`;

export const SectionLabel = styled.div`
  color: ${colors.grey[500]};
  ${TYPOGRAPHY.CT_2}
`;

export const SectionValue = styled.div<{ tone?: 4 | 3 | 2 | 1 | 0 }>`
  ${TYPOGRAPHY.ST_3}
  color: ${({ tone }) => {
    if (tone === 4 || tone === 3) {
      return theme.colors.secondary[600];
    }
    if (tone === 2) {
      return theme.colors.primary[500];
    }
    if (tone === 1) {
      return theme.colors.semantic[400];
    }
    if (tone === 0) {
      return theme.colors.semantic[400];
    }
    return theme.colors.grey[800];
  }};
`;

export const CardSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FooterItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${TYPOGRAPHY.BD_2}
`;

export const FooterLabel = styled.span`
  color: ${colors.grey[500]};
`;

export const FooterValue = styled.span`
  color: ${colors.grey[600]};
`;

export const ScreenOnButton = css`
  background-color: ${colors.grey[800]};
  color: ${colors.grey[50]};
`;

export const ScreenOffButton = css`
  background-color: ${colors.grey[600]};
  color: ${colors.grey[50]};
`;

export const SelectAllButton = css`
  ${TYPOGRAPHY.ST_2}
  color: ${colors.grey[700]};
  margin-bottom: 20px;

  > div {
    width: 22px;
    height: 22px;
  }
`;
