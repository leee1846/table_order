import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;

  & > p {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_6}
  }
`;

export const Modes = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  & > button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
`;

export const ModePreview = styled.div`
  width: 100%;
  height: 12.70833rem;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid ${theme.colors.grey[200]};
`;

export const PreviewContent = styled.div<{ light?: boolean; dark?: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${({ light, dark }) =>
    light ? theme.colors.grey[50] : dark ? theme.colors.grey[800] : theme.colors.grey[50]};
  position: relative;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PreviewBlock = styled.div`
  width: 100%;
  height: 40px;
  background-color: ${theme.colors.grey[300]};
  border-radius: 4px;
`;

export const PreviewScrollBar = styled.div`
  position: absolute;
  right: 4px;
  top: 12px;
  bottom: 12px;
  width: 8px;
  background-color: ${theme.colors.primary[400]};
  border-radius: 4px;
`;

