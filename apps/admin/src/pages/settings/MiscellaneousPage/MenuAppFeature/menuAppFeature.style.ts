import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const TextAreaContainer = styled.div`
  width: 100%;
  height: 6.25rem;
  padding: 0 12px;
  margin-top: 12px;

  & > textarea {
    width: 100%;
    height: 100%;
    border: 1px solid ${theme.colors.grey[400]};
    border-radius: 0.75rem;
    padding: 16px 12px;
    resize: none;
    color: ${theme.colors.grey[700]};
    ${TYPOGRAPHY.ST_4}
  }
`;

export const InnerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 20px;
  background-color: ${theme.colors.grey[50]};
  border-radius: 0.75rem;
`;

export const InnerSectionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;

  & > p {
    ${TYPOGRAPHY.ST_4}
    color: ${theme.colors.grey[600]};
  }

  input::placeholder {
    color: ${theme.colors.grey[400]};
  }
`;

export const TextAreasContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 12px;

    & > p {
      ${TYPOGRAPHY.BD_3}
      color: ${theme.colors.grey[500]};
    }

    & > textarea {
      width: 100%;
      height: 4.25rem;
      padding: 16px 12px;
      border: 1px solid ${theme.colors.grey[400]};
      border-radius: 0.75rem;
      color: ${theme.colors.grey[700]};
      ${TYPOGRAPHY.ST_4}
      resize: none;
    }
  }
`;

export const BreakTimeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  & > p {
    ${TYPOGRAPHY.ST_4}
    color: ${theme.colors.grey[600]};
  }
`;

export const BreakTimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;

  &:last-child {
    border-bottom: none;
  }
`;

export const CheckButtonCustomStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0;
  white-space: nowrap;
  ${TYPOGRAPHY.BD_3}
  color: ${theme.colors.grey[600]};
  > input {
    display: none;
  }

  > div {
    width: 22px;
    height: 22px;
  }
`;

export const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  & > span {
    ${TYPOGRAPHY.BD_2}
    color: ${theme.colors.grey[600]};
  }
`;

export const TimeSelectWrapper = styled.div`
  width: 120px;
`;

export const TimeDropdownStyle = css`
  width: 100%;
  > button {
    width: 100%;
  }
`;

export const DayCheckboxes = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  gap: 8px;
  flex: 1;

  > * {
    white-space: nowrap;
    ${TYPOGRAPHY.BD_3}
    color: ${theme.colors.grey[600]};
    display: flex;
    flex-directio: row;
    gap: 5px;
    ${TYPOGRAPHY.ST_4}

    > input {
      display: none;
    }

    > div {
      width: 22px;
      height: 22px;
    }
  }
`;

export const DeleteButtonCustomStyle = css`
  width: 40px;
  height: 40px;
  padding: 0;
`;

export const DayCheckboxStyle = css`
  > div {
    border: 2px solid ${theme.colors.grey[400]};
  }
`;

export const DisabledDayCheckboxStyle = css`
  > div {
    background-color: ${theme.colors.grey[200]};
    border: 2px solid ${theme.colors.grey[400]};
  }
`;

export const ClickableText = styled.div`
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[800]};
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid ${theme.colors.grey[400]};
    padding: none;
    margin-right: 4px;
    transform: translateY(1px);

    > input {
      width: 40px;
      text-align: center;
      ${TYPOGRAPHY.ST_2}
      color: ${theme.colors.grey[800]};
    }

    > span {
      border-bottom: 1px solid transparent;
    }
  }
`;

export const getNativeToggleButtonStyle = (isOn: boolean) => css`
  background-color: ${isOn
    ? theme.colors.primary[400]
    : theme.colors.grey[300]} !important;
`;
