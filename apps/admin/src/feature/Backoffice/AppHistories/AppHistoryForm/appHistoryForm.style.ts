import styled from '@emotion/styled';
import { theme } from '@repo/ui';

export {
  Container,
  Section,
  FormContent,
  FieldGroup,
  Label,
  HorizontalLayout,
} from '@/feature/backoffice/styles/form.styles';

export const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  border-radius: 4px;
  background: transparent;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background-color: ${theme.colors.grey[100]};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const CalendarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.grey[300]};
  border-radius: 6px;
  background-color: ${theme.colors.white};
  cursor: pointer;
  transition: all 0.15s ease;
  box-sizing: border-box;

  &:hover {
    border-color: ${theme.colors.grey[400]};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }
`;

export const CalendarText = styled.span`
  color: ${theme.colors.grey[900]};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.01em;
`;

export const DateTimeContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  & > button {
    flex: 1;
  }

  & > div {
    flex: 1;
    width: 100%;
  }
`;

export const HourDropdownWrapper = styled.div`
  flex: 1;
  width: 100%;

  & > div {
    width: 100%;
  }

  button {
    width: 100%;
  }
`;

export const MinuteDropdownWrapper = styled.div`
  flex: 1;
  width: 100%;

  & > div {
    width: 100%;
  }

  button {
    width: 100%;
  }
`;

export const TextArea = styled.textarea<{ isDetail?: boolean }>`
  width: 100%;
  min-height: ${({ isDetail }) => (isDetail ? 'auto' : '200px')};
  height: ${({ isDetail }) => (isDetail ? 'auto' : 'auto')};
  padding: 8px 12px;
  border: 1px solid ${theme.colors.grey[300]};
  border-radius: 6px;
  color: ${theme.colors.grey[900]};
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.5;
  resize: none;
  font-family: inherit;
  background-color: ${theme.colors.white};
  overflow: ${({ isDetail }) => (isDetail ? 'hidden' : 'auto')};
  transition: all 0.15s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }

  &:disabled {
    background-color: ${theme.colors.grey[50]};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: ${theme.colors.grey[400]};
    font-size: 14px;
  }
`;

export const ApkUploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ApkFileNameGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

export const ApkFileName = styled.span`
  font-size: 14px;
  color: ${theme.colors.grey[600]};
  font-weight: 400;
  letter-spacing: -0.005em;
  line-height: 1.5;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ApkRemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${theme.colors.grey[100]};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const ApkHint = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: ${theme.colors.grey[500]};
  font-weight: 400;
  letter-spacing: -0.005em;
  line-height: 1.4;
`;

export const VersionEditHint = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: ${theme.colors.semantic[500]};
  font-weight: 400;
  letter-spacing: -0.005em;
  line-height: 1.4;
`;
